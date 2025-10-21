
import React from 'react';

const SuccessPopup = ({ show, onClose, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="aks_popup-overlay">
            <div className="aks_popup-content ">
                <button className="aks_close-icon text-white" onClick={onClose}>&times;</button>
                <div className='text-white p-3' >{message}</div>
                <button className="aks_confirm-button px-5" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default SuccessPopup;
