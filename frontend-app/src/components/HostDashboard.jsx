import React, { useState, useEffect } from "react";
import axios from "axios";
import LocationPicker from "./LocationPicker";
import "../styles/HostDashboard.css";
import { useLanguage } from "./LanguageContext";

const backendURL = "http://localhost:5000/api/slots";
const uploadURL = "http://localhost:5000/api/upload";

export default function HostDashboard({ userName }) {
  const { language } = useLanguage();

  const texts = {
    en: {
      hostDashboard: "Host Dashboard",
      welcome: "Welcome",
      addSlot: "Add Parking Slot",
      addressPlaceholder: "Address",
      totalSlotsPlaceholder: "Total Slots",
      pricePlaceholder: "Price per Slot",
      selectLocation: "Select Location on Map",
      uploadImages: "Upload Images",
      uploadQRCode: "Upload QR Code",
      uploadingFile: "Uploading file...",
      imageUploadFailed: "Image upload failed",
      qrUploadFailed: "QR code upload failed",
      addSlotBtn: "Add Slot",
      slotAdded: "Parking slot added successfully!",
      slotDeleteConfirm: "Are you sure you want to delete this slot?",
      slotDeleted: "Slot deleted successfully!",
      slotDeleteFailed: "Failed to delete slot",
      slotUpdateSuccess: "Slot updated successfully!",
      slotUpdateFailed: "Update failed",
      noSlots: "No slots added yet.",
      yourParkingSlots: "Your Parking Slots",
      totalSlotsLabel: "Total Slots:",
      availableSlotsLabel: "Available Slots:",
      pricePerSlotLabel: "Price per Slot:",
      editBtn: "Edit",
      deleteBtn: "Delete",
      editSlotTitle: "Edit Slot",
      activeLabel: "Active:",
      qrCodeOptional: "QR Code (optional)",
      saveBtn: "Save",
      cancelBtn: "Cancel",
      invalidLocation: "Please select a valid location on the map.",
      invalidTotalSlots: "Please enter a valid positive number for total slots.",
      invalidPrice: "Please enter a valid positive price.",
      addressEmpty: "Address cannot be empty.",
      failedAddSlot: "Failed to add slot. Please try again.",
      uploading: "Uploading file...",
      errorTextClass: "error-text",
      successTextClass: "success-text",
    },
    hi: {
      hostDashboard: "मेज़बान डैशबोर्ड",
      welcome: "स्वागत है",
      addSlot: "पार्किंग स्लॉट जोड़ें",
      addressPlaceholder: "पता",
      totalSlotsPlaceholder: "संपूर्ण स्लॉट",
      pricePlaceholder: "प्रति स्लॉट कीमत",
      selectLocation: "मैप पर स्थान चुनें",
      uploadImages: "छवियां अपलोड करें",
      uploadQRCode: "क्यूआर कोड अपलोड करें",
      uploadingFile: "फ़ाइल अपलोड हो रही है...",
      imageUploadFailed: "छवि अपलोड विफल",
      qrUploadFailed: "क्यूआर कोड अपलोड विफल",
      addSlotBtn: "स्लॉट जोड़ें",
      slotAdded: "पार्किंग स्लॉट सफलतापूर्वक जोड़ा गया!",
      slotDeleteConfirm: "क्या आप सुनिश्चित हैं कि आप इस स्लॉट को हटाना चाहते हैं?",
      slotDeleted: "स्लॉट सफलतापूर्वक हटा दिया गया!",
      slotDeleteFailed: "स्लॉट हटाना विफल रहा",
      slotUpdateSuccess: "स्लॉट सफलतापूर्वक अपडेट किया गया!",
      slotUpdateFailed: "अपडेट विफल रहा",
      noSlots: "कोई स्लॉट अभी तक नहीं जोड़ा गया है।",
      yourParkingSlots: "आपके पार्किंग स्लॉट",
      totalSlotsLabel: "संपूर्ण स्लॉट:",
      availableSlotsLabel: "उपलब्ध स्लॉट:",
      pricePerSlotLabel: "प्रति स्लॉट कीमत:",
      editBtn: "संपादित करें",
      deleteBtn: "हटाएं",
      editSlotTitle: "स्लॉट संपादित करें",
      activeLabel: "सक्रिय:",
      qrCodeOptional: "क्यूआर कोड (वैकल्पिक)",
      saveBtn: "सहेजें",
      cancelBtn: "रद्द करें",
      invalidLocation: "कृपया मान्य स्थान चुने।",
      invalidTotalSlots: "कृपया सकारात्मक संख्या दर्ज करें।",
      invalidPrice: "कृपया सकारात्मक कीमत दर्ज करें।",
      addressEmpty: "पता खाली नहीं हो सकता।",
      failedAddSlot: "स्लॉट जोड़ना विफल रहा। कृपया पुनः प्रयास करें।",
      uploading: "फ़ाइल अपलोड हो रही है...",
      errorTextClass: "error-text",
      successTextClass: "success-text",
    },
  };

  const t = texts[language];

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
        const mySlots = res.data.filter((slot) => slot.host && slot.host.name === userName);
        setSlots(mySlots);
      } catch (err) {
        console.error("Fetch slots error:", err.response || err);
      }
    }
    fetchSlots();
  }, [userName, token]);

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
      setUploadError(t.imageUploadFailed);
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
      setUploadError(t.qrUploadFailed);
    } finally {
      setUploading(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !location ||
      !location.coordinates ||
      !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 ||
      location.coordinates.some((coord) => typeof coord !== "number" || isNaN(coord))
    ) {
      setMessage(t.invalidLocation);
      return;
    }

    const totalSlotsNum = Number(formData.totalSlots);
    if (!totalSlotsNum || totalSlotsNum <= 0) {
      setMessage(t.invalidTotalSlots);
      return;
    }

    const priceNum = Number(formData.price);
    if (!priceNum || priceNum <= 0) {
      setMessage(t.invalidPrice);
      return;
    }

    if (!formData.address.trim()) {
      setMessage(t.addressEmpty);
      return;
    }

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
      setFormData({
        address: "",
        totalSlots: "",
        price: "",
        images: [],
        qrCode: "",
      });
      setLocation(null);
      setMessage(t.slotAdded);
    } catch (err) {
      console.error("Slot creation error:", err.response || err);
      setMessage(err.response?.data?.error || t.failedAddSlot);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.slotDeleteConfirm)) return;
    try {
      await axios.delete(`${backendURL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots((prev) => prev.filter((slot) => slot._id !== id));
      setMessage(t.slotDeleted);
    } catch (err) {
      console.error(err.response || err);
      setMessage(err.response?.data.error || t.slotDeleteFailed);
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
      setMessage(t.slotUpdateSuccess);
      setEditingSlotId(null);
    } catch (err) {
      console.error(err.response || err);
      setMessage(err.response?.data.error || t.slotUpdateFailed);
    }
  };

  return (
    <div className="host-dashboard">
      <h2>{t.hostDashboard}</h2>
      <p>
        {t.welcome}, {userName}
      </p>

      {/* Add Slot Form */}
      <h3 className="section-title">{t.addSlot}</h3>
      <form onSubmit={handleAddSlot} className="slot-form">
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder={t.addressPlaceholder}
          required
          className="form-input"
        />
        <input
          type="number"
          name="totalSlots"
          value={formData.totalSlots}
          onChange={handleChange}
          placeholder={t.totalSlotsPlaceholder}
          required
          className="form-input"
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder={t.pricePlaceholder}
          required
          className="form-input"
        />

        <label>{t.selectLocation}</label>
        <LocationPicker onLocationChange={setLocation} />

        {/* Upload Section */}
        <div className="upload-section">
          <label className="form-label upload-label">{t.uploadImages}</label>
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
          <label className="form-label upload-label">{t.uploadQRCode}</label>
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

        {uploading && <p>{t.uploadingFile}</p>}
        {uploadError && <p className={t.errorTextClass}>{uploadError}</p>}

        <button type="submit" className="submit-btn">
          {t.addSlotBtn}
        </button>
      </form>

      {message && (
        <p className={message.includes("Failed") ? t.errorTextClass : t.successTextClass}>
          {message}
        </p>
      )}

      {/* Slot List */}
      <h3 className="section-title">{t.yourParkingSlots}</h3>
      {slots.length === 0 ? (
        <p>{t.noSlots}</p>
      ) : (
        <ul className="slot-list">
          {slots.map((slot) => (
            <li key={slot._id} className="slot-item">
              <h4>{slot.address}</h4>
              <p>
                {t.totalSlotsLabel} {slot.totalSlots}
              </p>
              <p>
                {t.availableSlotsLabel} {slot.availableSlots}
              </p>
              <p>
                {t.pricePerSlotLabel} ₹{slot.price}
              </p>

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
                {t.editBtn}
              </button>
              <button onClick={() => handleDelete(slot._id)} className="delete-btn">
                {t.deleteBtn}
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
              placeholder={t.addressPlaceholder}
            />
            <input
              name="totalSlots"
              type="number"
              value={editForm.totalSlots}
              onChange={handleEditChange}
              placeholder={t.totalSlotsPlaceholder}
            />
            <input
              name="availableSlots"
              type="number"
              value={editForm.availableSlots}
              onChange={handleEditChange}
              placeholder={t.availableSlotsLabel}
            />
            <input
              name="price"
              type="number"
              value={editForm.price}
              onChange={handleEditChange}
              placeholder={t.pricePlaceholder}
            />
            <label>
              {t.activeLabel}
              <input
                name="active"
                type="checkbox"
                checked={editForm.active}
                onChange={handleEditChange}
              />
            </label>

            <label>{t.qrCodeOptional}</label>
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

            <button type="submit">{t.saveBtn}</button>
            <button type="button" onClick={() => setEditingSlotId(null)}>
              {t.cancelBtn}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
