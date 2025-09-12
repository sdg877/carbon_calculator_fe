function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}
