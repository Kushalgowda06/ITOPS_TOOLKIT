import React, { useRef } from "react";
import { MdNotifications } from "react-icons/md";
import { wrapIcon } from "../../Utilities/WrapIcons";

export default function TrainPopupModal({ show, onClose, onSave, id }) {
  const modalRef = useRef(null);

    const MdNotificationsIcon = wrapIcon(MdNotifications);
  
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  if (!show) return null;
  return (
    <div
      className="prb_modal-overlay d-flex justify-content-center align-items-center"
      onClick={handleOverlayClick}
    >
      <div className="prb_custom-modal p-3" ref={modalRef}>
        <div className="d-flex justify-content-start">
          <span className="text-white mb-2 fw-bold knowledge_card_title ">
            Quiz Successfully Generated
          </span>
        </div>
        <hr className="m-0"></hr>
        <div className="mb-2 knowledge_card_p">
        
            Quiz Number: <span className="knowledge_card_title">{id}</span>
         
        </div>
        <div className="d-flex align-items-center mb-3">
          <MdNotificationsIcon className="me-2 text-warning" size={16} />
          <span className="card_p">
            It is advised to note the quiz ID, once started test can only be
            later resumed using the quiz ID
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <button className="btn create_ticket_btn_gradient" onClick={onClose}>
            Resume Later
          </button>
          <button className="btn create_ticket_btn_gradient" onClick={onSave}>
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
