
import React, { useRef } from 'react';

export default function ProblemPopUpModal({ show, onClose, onSave, reason, setReason, saveButtonName ,title}) {

   const modalRef = useRef(null);

const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  if (!show) return null;
  return (
    <div className="prb_modal-overlay d-flex justify-content-center align-items-center" onClick={handleOverlayClick}>
      <div className="prb_custom-modal p-3"  ref={modalRef}>
         <div className="d-flex justify-content-start">
    <span className="text-white mb-2 prb_incident-number">{title}</span>
  </div>
        <textarea
          className=" prb_modal-textarea p-3 mb-2"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          
        />
        <div className="d-flex justify-content-between">
          <button className="prb_action-btn " onClick={onClose}>Cancel</button>
          <button className="prb_action-btn" onClick={onSave}>{saveButtonName}</button>
        </div>
      </div>
    </div>
  );
}
