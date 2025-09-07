import "../styles/SlotList.css";

export default function SlotList({ slots, onSelect }) {
  return (
    <ul className="slot-list">
      {slots.map((slot) => (
        <li
          key={slot._id}
          className="slot-item"
          onClick={() => onSelect(slot)}
          title="Click for details"
        >
          <div className="slot-content">
            {/* Slot Thumbnail */}
            <div className="slot-thumbnail">
              {slot.images && slot.images.length > 0 ? (
                <img
                  src={`http://localhost:5000${slot.images[0]}`}
                  alt={`Parking slot at ${slot.address}`}
                  className="slot-image"
                />
              ) : (
                <div className="slot-placeholder">No Image</div>
              )}
            </div>

            {/* Slot Info */}
            <div className="slot-info">
              <h4 className="slot-address">{slot.address}</h4>
              <p>Available Slots: {slot.availableSlots}</p>
              <p>Price: ₹{slot.price}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
