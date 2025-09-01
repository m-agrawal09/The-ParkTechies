import React, { useState, useEffect } from "react";
import axios from "axios";
import LocationPicker from "./LocationPicker";

const backendURL = "http://localhost:5000/api/slots";
const uploadURL = "http://localhost:5000/api/upload";

export default function HostDashboard({ userName }) {
  const [slots, setSlots] = useState([]);
  const [formData, setFormData] = useState({
    address: "",
    totalSlots: "",
    price: "",
    images: [],
  });
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    async function fetchSlots() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(backendURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mySlots = res.data.filter((slot) => slot.host && slot.host.name === userName);
        setSlots(mySlots);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSlots();
  }, [userName]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);
      setUploadError("");
      const token = localStorage.getItem("token");
      const res = await axios.post(uploadURL, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, res.data.imageUrl],
      }));
    } catch (err) {
      console.error("Upload failed", err);
      setUploadError("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const slotData = {
        address: formData.address,
        totalSlots: Number(formData.totalSlots),
        price: Number(formData.price),
        images: formData.images,
        location: location || { type: "Point", coordinates: [0, 0] },
      };

      const res = await axios.post(backendURL, slotData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Parking slot added!");
      setSlots((prev) => [...prev, res.data.slot]);
      setFormData({
        address: "",
        totalSlots: "",
        price: "",
        images: [],
      });
      setLocation(null);
    } catch (err) {
      setMessage(err.response?.data.error || "Failed to add slot");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendURL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots((prev) => prev.filter((slot) => slot._id !== id));
    } catch (err) {
      setMessage("Failed to delete slot");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>Host Dashboard</h2>
      <p>Welcome, {userName}</p>

      <h3>Add Parking Slot</h3>
      <form onSubmit={handleAddSlot} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="number"
          name="totalSlots"
          value={formData.totalSlots}
          onChange={handleChange}
          placeholder="Total Slots"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price per Slot"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />

        <label style={{ marginBottom: 8, display: "block" }}>Select Location on Map</label>
        <LocationPicker onLocationChange={setLocation} />

        <label style={{ display: "block", marginTop: 12, marginBottom: 8 }}>Upload Images</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && <p>Uploading image...</p>}
        {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {formData.images.map((imgUrl, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img
                src={`http://localhost:5000${imgUrl}`}
                alt={`uploaded ${idx}`}
                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }}
              />
              <button
                type="button"
                onClick={() => removeImage(imgUrl)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "rgba(220,53,69,0.8)",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "0 6px 0 6px",
                  padding: "0 6px",
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          style={{
            marginTop: 15,
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Add Slot
        </button>
      </form>

      {message && <p style={{ color: "green" }}>{message}</p>}

      <h3>Your Parking Slots</h3>
      {slots.length === 0 ? (
        <p>No slots added yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {slots.map((slot) => (
            <li
              key={slot._id}
              style={{ border: "1px solid #ccc", borderRadius: 6, padding: 15, marginBottom: 15 }}
            >
              <h4>{slot.address}</h4>
              <p>Total Slots: {slot.totalSlots}</p>
              <p>Available Slots: {slot.availableSlots}</p>
              <p>Price per Slot: ₹{slot.price}</p>
              {slot.images?.length > 0 && (
                <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
                  {slot.images.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000${img}`}
                      alt={`Slot ${i}`}
                      style={{ height: 100, borderRadius: 6 }}
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => handleDelete(slot._id)}
                style={{
                  marginTop: 10,
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
