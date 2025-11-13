import React, { useRef } from "react";

export default function ProblemPopUpModal({
  show,
  onClose,
  onSave,
  reason,
  setReason,
  saveButtonName,
  title,
  quizListData,
  setSelectedQuizId,
}) {
  const [activeItem, setActiveItem] = React.useState(null);
  const modalRef = useRef(null);
  const handleClick = (id) => {
    setSelectedQuizId(id);
  };
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  if (!show) return null;
        {console.log(quizListData , "quizListData")}
  return (
    <div
      className="prb_modal-overlay d-flex justify-content-center align-items-center"
      onClick={handleOverlayClick}
    >
      <div
        className={`p-3  ${
          quizListData?.length > 0 ? "quiz_custom_modal" : "prb_custom-modal"
        }`}
        ref={modalRef}
      >
        <div className="d-flex justify-content-start">
          <span className="text-white mb-2 prb_incident-number">{title}</span>
        </div>
  
        <div className="d-flex flex-wrap">
          {quizListData?.length > 0 ? (
            quizListData?.map((item, index) => {
              const isActive = activeItem === item;
              const parts = item?.ids.split("_");

              return (
                <div
                  key={index}
                  className={`prb_incident-card prb_card_hover p-3 m-2 d-flex align-items-center justify-content-start cursor-pointer flex-row ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => {
                    setActiveItem(item);
                    handleClick(item?.ids);
                  }}
                >
                  <div
                    className="prb_incident-number text-truncate"
                    title={item}
                  >
                    {parts.join(", ")}
                  </div>
                </div>
              );
            })
          ) : (
            <textarea
              className="prb_modal-textarea p-3 mb-2"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          )}
        </div>

        <div className="d-flex justify-content-between">
          <button className="prb_action-btn " onClick={onClose}>
            Cancel
          </button>
          <button className="prb_action-btn" onClick={onSave}>
            {saveButtonName}
          </button>
        </div>
      </div>
    </div>
  );
}
