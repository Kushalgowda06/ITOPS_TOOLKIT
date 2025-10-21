import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import SuccessPopup from "./SuccessPopup";
import NotCompatiblePopup from "./NotCompatiblePopup";

const AksUpgradeReport = ({
  reportData,
  onDownloadReport,
  onApproveAndProceed,
}) => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCompatible, setShowCompatible] = useState(false);

  const handleApproveAndProceed = () => {
    setShowSuccessPopup(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    setShowCompatible(false);
    onApproveAndProceed();
  };
  const handleNotCompatibleReport = () => {
    setShowCompatible(true);
  };
  return (
    <>
      <div className="aks_modal-top">
        <h2 className="aks_cluster-heading">Compatibility Report Review</h2>
        <div
          className="bg-white rounded w-100 overflow-auto"
          style={{ maxHeight: "360px" }}
        >
          <pre className="text-secondary p-2">
            {JSON.stringify(reportData, null, 2)}
          </pre>
        </div>
      </div>
      <div className="aks_modal-bottom">
        <button
          className="aks_confirm-button"
          onClick={handleNotCompatibleReport}
        >
          Not compatible
        </button>
        <div>
          <FontAwesomeIcon
            icon={faDownload}
            className="aks_icon_color"
            onClick={onDownloadReport}
          />
          <button
            className="aks_confirm-button ms-2"
            onClick={handleApproveAndProceed}
          >
            Approve & Proceed
          </button>
        </div>
      </div>
      <SuccessPopup
        show={showSuccessPopup}
        onClose={handleSuccessClose}
        message={
          <>
            AKS Cluster Upgrade <br />
            Ticket has been created successfully! <br />
            Ticket no. 1224332352
          </>
        }
      />
      <NotCompatiblePopup
        show={showCompatible}
        onClose={handleSuccessClose}
        message={<>Notify for manual upgrade of add-ons?</>}
      />
    </>
  );
};

export default AksUpgradeReport;
