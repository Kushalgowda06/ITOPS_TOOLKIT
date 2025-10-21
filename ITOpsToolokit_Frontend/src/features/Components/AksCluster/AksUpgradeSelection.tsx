
import React, { useState } from 'react';
import CategoryCard from '../Analytics AI/CardWrapper';
import { capitalizeFirstLetter } from '../../Utilities/capitalise';
import kuberneteslogo from "../../../assets/Kubernetes.png";
import { Toast } from 'react-bootstrap';

const AksUpgradeSelection = ({ selectedClusters, onConfirmAndUpgrade, versions }) => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [version,setVersion] = useState("")
    const handleVersionChange = (e) => {
        setVersion(e.target.value);
    };

    const handleConfirmAndUpgradeClick = () => {
        if (!version) {
            setToastMessage("Please select a version to proceed.");
            setShowToast(true);
        } else {
            onConfirmAndUpgrade();
        }
    };

    console.log(version,"version")
    return (
        <>
            <div className="aks_modal-top">
                <h2 className="aks_cluster-heading">Selected Clusters</h2>
                {selectedClusters.length > 0 && (
                    <div className="aks_cluster-grid">
                        {selectedClusters.map((item, index) => (
                            <CategoryCard
                                key={index}
                                title={capitalizeFirstLetter(item.Name)}
                                descriptionItems={item}
                                version={item.KubernetesVersion}
                                imageSrc={kuberneteslogo}
                                index={index}
                                paddingClass="pt-2 ps-2"
                                checked={false}
                                onCheckboxChange={() => {}}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="aks_modal-bottom">
                <div className="aks_upgrade-controls">
                    <label htmlFor="version-select">Compatible Upgrade Version</label>
                    <select id="version-select " value={version} onChange={handleVersionChange}>
                        <option value="" disabled selected>Select</option>
                        {versions.map((version) => (
                            <option key={version} value={version}>
                                {version}
                            </option>
                        ))}
                    </select>
                </div>
                <button className="aks_confirm-button" onClick={handleConfirmAndUpgradeClick}>
                    Confirm & Upgrade
                </button>
            </div>
                  <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={4000}
        autohide
        style={{
          position: "fixed",
          top: 0,
          right: 20,
          minWidth: "200px",
          backgroundColor: "rgba(255, 17, 0, 0.79)",
          color: "#fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 1050,
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
        </>
    );
};

export default AksUpgradeSelection;
