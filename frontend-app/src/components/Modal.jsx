export default function Modal({ message, onClose }) {
    return (
      <div
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            backgroundColor: "white", padding: 20, borderRadius: 8,
            maxWidth: 400, textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          <p>{message}</p>
          <button
            onClick={onClose}
            style={{
              marginTop: 15, padding: "8px 16px", cursor: "pointer",
              borderRadius: 6, border: "none", backgroundColor: "#007bff", color: "white",
            }}
          >
            OK
          </button>
        </div>
      </div>
    );
  }
  