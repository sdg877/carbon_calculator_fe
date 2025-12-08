"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, children }) {
  const [modalRoot, setModalRoot] = useState(null);

  useEffect(() => {
    const root = document.getElementById("modal-root");
    setModalRoot(root);
  }, []);

  if (!isOpen || !modalRoot) {
    return null;
  }
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
