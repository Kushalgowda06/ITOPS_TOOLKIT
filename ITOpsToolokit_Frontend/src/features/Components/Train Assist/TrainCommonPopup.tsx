import React, { useRef } from 'react';
import { MdNotifications } from 'react-icons/md';

export default function TrainCommonPopup({ showcommonPopup, onSave, titleMessage,titleBody }) {
  const modalRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onSave();
    }
  };
  if (!showcommonPopup) return null;
  return (
    <div className="prb_modal-overlay d-flex justify-content-center align-items-center" onClick={handleOverlayClick}>
      <div className="prb_custom-modal p-3" ref={modalRef}>
        <div className="d-flex justify-content-start">
          <span className="text-white mb-2 fw-bold fs-4 ">{titleMessage}</span>
        </div>
        <hr className='m-0'></hr>
        <div className="mb-2">
          <span className=" fw-bold fs-5">{titleBody}</span>
        </div>
       
        <div className="d-flex justify-content-center">
          <button className="btn create_ticket_btn_gradient" onClick={onSave}>Okay</button>
        </div>
      </div>
    </div>
  );
}
