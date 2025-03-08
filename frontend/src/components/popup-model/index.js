import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import "./modal.css";

export default function ModalDialog({ children, show, onClose, popupTitle }) {
  useEffect(() => {
    const onKeyUp = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        {popupTitle && <h4 className="modal-title">{popupTitle}</h4>}
        <button className="modal-close" onClick={onClose} title="Close">
          <RxCross2 />
        </button>
        <div className="horizontal-line-lite mt-10"></div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
