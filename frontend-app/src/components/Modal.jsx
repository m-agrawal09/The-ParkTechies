export default function Modal({ message, onClose, children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <p>{message}</p>
        {children ? (
          <div>{children}</div>
        ) : (
          <button className="modal-btn" onClick={onClose}>OK</button>
        )}
      </div>
    </div>
  );
}
