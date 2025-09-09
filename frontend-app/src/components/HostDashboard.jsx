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
    qrCode: "",
  });
  const [location, setLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editForm, setEditForm] = useState({
    address: "",
    totalSlots: "",
    availableSlots: "",
    price: "",
    images: [],
    qrCode: "",
    active: true,
  });

  const token = localStorage.getItem("token");

  // Fetch host's slots
  useEffect(() => {
    async function fetchSlots() {
      try {
        const res = await axios.get(backendURL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mySlots = res.data.filter(
          (slot) => slot.host && slot.host.name === userName
        );
        setSlots(mySlots);
      } catch (err) {
        console.error("Fetch slots error:", err.response || err);
      }
    }
    fetchSlots();
  }, [userName, token]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);
      setUploadError("");
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
      console.error("Upload failed", err.response || err);
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

  // QR code upload
  const handleQRCodeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      setUploading(true);
      setUploadError("");
      const res = await axios.post(uploadURL, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData((prev) => ({
        ...prev,
        qrCode: res.data.imageUrl,
      }));
    } catch (err) {
      console.error("QR upload failed", err.response || err);
      setUploadError("QR code upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Updated handleAddSlot with validation and error handling
  const handleAddSlot = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate location presence and coordinates
    if (
      !location ||
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      location.coordinates.some(
        (coord) => typeof coord !== "number" || isNaN(coord)
      )
    ) {
      setMessage("Please select a valid location on the map.");
      return;
    }

    // Validate totalSlots as positive number
    const totalSlotsNum = Number(formData.totalSlots);
    if (!totalSlotsNum || totalSlotsNum <= 0) {
      setMessage("Please enter a valid positive number for total slots.");
      return;
    }

    // Validate price as positive number
    const priceNum = Number(formData.price);
    if (!priceNum || priceNum <= 0) {
      setMessage("Please enter a valid positive price.");
      return;
    }

    // Trim address to avoid blank spaces
    if (!formData.address.trim()) {
      setMessage("Address cannot be empty.");
      return;
    }

    // Prepare the slotData for backend
    const slotData = {
      address: formData.address.trim(),
      totalSlots: totalSlotsNum,
      price: priceNum,
      images: formData.images,
      qrCode: formData.qrCode,
      location: {
        type: "Point",
        coordinates: [location.coordinates[0], location.coordinates[1]], // [lng, lat]
      },
    };

    try {
      const res = await axios.post(backendURL, slotData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots((prev) => [...prev, res.data.slot]);

      // Reset form and location
      setFormData({
        address: "",
        totalSlots: "",
        price: "",
        images: [],
        qrCode: "",
      });
      setLocation(null);

      setMessage("Parking slot added successfully!");
    } catch (err) {
      console.error("Slot creation error:", err.response || err);
      setMessage(err.response?.data?.error || "Failed to add slot. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await axios.delete(`${backendURL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots((prev) => prev.filter((slot) => slot._id !== id));
      setMessage("Slot deleted successfully!");
    } catch (err) {
      console.error(err.response || err);
      setMessage(err.response?.data.error || "Failed to delete slot");
    }
  };

  const handleEditClick = (slot) => {
    setEditingSlotId(slot._id);
    setEditForm({
      address: slot.address,
      totalSlots: slot.totalSlots,
      availableSlots: slot.availableSlots,
      price: slot.price,
      images: slot.images,
      qrCode: slot.qrCode || "",
      active: slot.active,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const payload = {
        ...editForm,
        totalSlots: Number(editForm.totalSlots),
        availableSlots: Number(editForm.availableSlots),
        price: Number(editForm.price),
      };
      const res = await axios.put(`${backendURL}/${editingSlotId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots((prev) =>
        prev.map((s) => (s._id === res.data.slot._id ? res.data.slot : s))
      );
      setMessage("Slot updated successfully!");
      setEditingSlotId(null);
    } catch (err) {
      console.error(err.response || err);
      setMessage(err.response?.data.error || "Update failed");
    }
  };

  return (
    <div className="host-dashboard">
      <h2>Host Dashboard</h2>
      <p>Welcome, {userName}</p>

      {/* Add Slot Form */}
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

        <label>Select Location on Map</label>
        <LocationPicker onLocationChange={setLocation} />

        {/* Upload Section */}
        <div className="upload-section">
          <label className="form-label upload-label">Upload Images</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
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
        </div>

        <div className="upload-section">
          <label className="form-label upload-label">Upload QR Code</label>
          <input type="file" accept="image/*" onChange={handleQRCodeUpload} />
          {formData.qrCode && (
            <div className="uploaded-qrcode">
              <img
                src={`http://localhost:5000${formData.qrCode}`}
                alt="QR Code"
                className="qr-preview"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, qrCode: "" })}
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {uploading && <p>Uploading file...</p>}
        {uploadError && <p className="error-text">{uploadError}</p>}

        <button type="submit" className="submit-btn">
          Add Slot
        </button>
      </form>

      {message && (
        <p className={message.includes("Failed") ? "error-text" : "success-text"}>
          {message}
        </p>
      )}

      {/* Slot List */}
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

              <button onClick={() => handleEditClick(slot)} className="edit-btn">
                Edit
              </button>
              <button onClick={() => handleDelete(slot._id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Edit Modal */}
      {editingSlotId && (
        <div className="modal">
          <form onSubmit={handleEditSubmit} className="edit-form">
            <input
              name="address"
              value={editForm.address}
              onChange={handleEditChange}
              placeholder="Address"
            />
            <input
              name="totalSlots"
              type="number"
              value={editForm.totalSlots}
              onChange={handleEditChange}
              placeholder="Total Slots"
            />
            <input
              name="availableSlots"
              type="number"
              value={editForm.availableSlots}
              onChange={handleEditChange}
              placeholder="Available Slots"
            />
            <input
              name="price"
              type="number"
              value={editForm.price}
              onChange={handleEditChange}
              placeholder="Price"
            />
            <label>
              Active:
              <input
                name="active"
                type="checkbox"
                checked={editForm.active}
                onChange={handleEditChange}
              />
            </label>

            <label>QR Code (optional)</label>
            {editForm.qrCode && (
              <div className="uploaded-qrcode">
                <img
                  src={`http://localhost:5000${editForm.qrCode}`}
                  alt="QR Code"
                  className="qr-preview"
                />
                <button
                  type="button"
                  onClick={() => setEditForm({ ...editForm, qrCode: "" })}
                >
                  Remove
                </button>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleQRCodeUpload} />

            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingSlotId(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
