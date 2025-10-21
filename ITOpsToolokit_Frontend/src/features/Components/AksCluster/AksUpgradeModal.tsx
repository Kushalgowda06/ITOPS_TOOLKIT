import React, { useState } from "react";
import AksUpgradeSelection from "./AksUpgradeSelection";
import AksUpgradeReport from "./AksUpgradeReport";
import "./AksUpgradeModal.css";

const AksUpgradeModal = ({
  show,
  onClose,
  selectedClusters,
  view,
  setView,
}) => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmAndUpgrade = async () => {
    setIsLoading(true);
    try {
      const mockApiResponse = {
        compatibilityStatus: "Issues Found",
        clusters: selectedClusters.map((c) => ({
          ...c,
          compatible: Math.random() > 0.5,
        })),
        summary:
          "2 out of 3 clusters have compatibility issues with the selected version.",
      };

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setReportData(mockApiResponse);
      setView("report");
    } catch (error) {
      console.error("Failed to get compatibility report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!reportData) return;

    const jsonString = JSON.stringify(reportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "compatibility-report.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleApproveAndProceed = () => {
    // // Handle the logic for approving and proceeding with the upgrade
    // console.log("Upgrade approved and proceeding...");
    onClose()
  };

  const versions = ["1.2.3", "1.2.4", "1.2.5"]; // Example versions
 if (!show) {
        return null;
    }
  return (
    
   <div className="aks_modal-overlay" onClick={onClose}>
            <div className="aks_modal-content" onClick={(e) => e.stopPropagation()}>
        {isLoading ? (
                    <div className="aks_loader">Loading...</div>
                ) :
       view === "selection" ? (
        <AksUpgradeSelection
          selectedClusters={selectedClusters}
          onConfirmAndUpgrade={handleConfirmAndUpgrade}
          versions={versions}
        />
      ) : (
        <AksUpgradeReport
          reportData={reportData}
          onDownloadReport={handleDownloadReport}
          onApproveAndProceed={handleApproveAndProceed}
        />
      )}
    
    </div>
    </div>
  );
};

export default AksUpgradeModal;
