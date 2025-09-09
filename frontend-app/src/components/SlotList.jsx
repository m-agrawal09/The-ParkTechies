import React from "react";
import "../styles/SlotList.css";
import { useLanguage } from "./LanguageContext";

export default function SlotList({ slots, onSelect }) {
  const { language } = useLanguage();

  const texts = {
    en: {
      clickForDetails: "Click for details",
      availableSlots: "Available Slots:",
      price: "Price:",
      noImage: "No Image",
    },
    hi: {
      clickForDetails: "विस्तार के लिए क्लिक करें",
      availableSlots: "उपलब्ध स्लॉट:",
      price: "कीमत:",
      noImage: "कोई छवि नहीं",
    },
  };

  const t = texts[language];

  return (
    <ul className="slot-list">
      {slots.map((slot) => (
        <li
          key={slot._id}
          className="slot-item"
          onClick={() => onSelect(slot)}
          title={t.clickForDetails}
        >
          <div className="slot-content">
            {/* Slot Thumbnail */}
            <div className="slot-thumbnail">
              {slot.images && slot.images.length > 0 ? (
                <img
                  src={`http://localhost:5000${slot.images[0]}`}
                  alt={`${t.availableSlots} ${slot.address}`}
                  className="slot-image"
                />
              ) : (
                <div className="slot-placeholder">{t.noImage}</div>
              )}
            </div>

            {/* Slot Info */}
            <div className="slot-info">
              <h4 className="slot-address">{slot.address}</h4>
              <p>
                {t.availableSlots} {slot.availableSlots}
              </p>
              <p>
                {t.price} ₹{slot.price}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
