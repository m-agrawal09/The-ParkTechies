export default function SlotList({ slots, onSelect }) {
    return (
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {slots.map(slot => (
          <li
            key={slot._id}
            onClick={() => onSelect(slot)}
            style={{
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: 15,
              marginBottom: 15,
              cursor: "pointer",
              userSelect: "none",
            }}
            title="Click for details"
          >
            <h4>{slot.address}</h4>
            <p>Available Slots: {slot.availableSlots}</p>
            <p>Price: ₹{slot.price}</p>
          </li>
        ))}
      </ul>
    );
  }
  