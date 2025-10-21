const NotCompatiblePopup = ({ show, onClose, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="aks_popup-overlay">
      <div className="aks_popup-content ">
        <h2 className="aks_cluster-heading text-white fw-semibold">
          Report Not Compatible
        </h2>
        <button className="aks_close-icon text-white" onClick={onClose}>
          &times;
        </button>
        <div className="text-white p-3">{message}</div>

        <div className="d-flex justify-content-between">
          <button className="aks_confirm-button px-5" onClick={onClose}>
            Notify
          </button>
          <button className="aks_confirm-button px-5" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotCompatiblePopup;
