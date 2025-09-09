import React, { useState, useEffect } from "react";
import axios from "axios";
import LocationPicker from "./LocationPicker";
import "../styles/HostDashboard.css";

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
        const mySlots = res.data.filter(
          (slot) => slot.host && slot.host.name === userName
        );
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
      console.log("Deleting slot ID:", id);
      console.log("Using token:", token);
      await axios.delete(`${backendURL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots((prev) => prev.filter((slot) => slot._id !== id));
      setMessage("Slot deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("Failed to delete slot");
    }
  };

  return (
    <div className="host-dashboard">
      <h2>Host Dashboard</h2>
      <p>Welcome, {userName}</p>

      <h3 className="section-title">Add Parking Slot</h3>
      <form onSubmit={handleAddSlot} className="slot-form">
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
          className="form-input"
        />
        <input
          type="number"
          name="totalSlots"
          value={formData.totalSlots}
          onChange={handleChange}
          placeholder="Total Slots"
          required
          className="form-input"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price per Slot"
          required
          className="form-input"
        />

        <label className="form-label">Select Location on Map</label>
        <LocationPicker onLocationChange={setLocation} />

        <label className="form-label">Upload Images</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {uploading && <p>Uploading image...</p>}
        {uploadError && <p className="error-text">{uploadError}</p>}

        <div className="uploaded-images">
          {formData.images.map((imgUrl, idx) => (
            <div key={idx} className="uploaded-image-container">
              <img
                src={`http://localhost:5000${imgUrl}`}
                alt={`uploaded ${idx}`}
                className="uploaded-image"
              />
              <button
                type="button"
                onClick={() => removeImage(imgUrl)}
                className="remove-image-btn"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="submit-btn">
          Add Slot
        </button>
      </form>

      {message && (
        <p className={message.includes("Failed") ? "error-text" : "success-text"}>
          {message}
        </p>
      )}

      <h3 className="section-title">Your Parking Slots</h3>
      {slots.length === 0 ? (
        <p>No slots added yet.</p>
      ) : (
        <ul className="slot-list">
          {slots.map((slot) => (
            <li key={slot._id} className="slot-item">
              <h4>{slot.address}</h4>
              <p>Total Slots: {slot.totalSlots}</p>
              <p>Available Slots: {slot.availableSlots}</p>
              <p>Price per Slot: ₹{slot.price}</p>
              {slot.images?.length > 0 && (
                <div className="slot-images">
                  {slot.images.map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000${img}`}
                      alt={`Slot ${i}`}
                      className="slot-preview"
                    />
                  ))}
                </div>
              )}
              <button
                onClick={() => handleDelete(slot._id)}
                className="delete-btn"
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
