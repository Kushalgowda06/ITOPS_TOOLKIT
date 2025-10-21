import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import CategoryCard from "../Analytics AI/CardWrapper";
import kuberneteslogo from "./../../../assets/Kubernetes.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import CustomSelect from "../ImplementationGroupForm/CustomSelect";
import AksUpgradeModal from "./AksUpgradeModal";
import AKSCardDetails from "./AKSCardDetails";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";

const AksClusterDashboard = () => {
  const [value, setValue] = useState("");
  const [dropdownvalue, setDropdownValue] = useState("");
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [checkable, setCheckable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setshowDetailModal] = useState(false);
  const [view, setView] = useState("selection");
  const [clusterdata, setClusterdata] = useState({});
  const [filteredDropdownOptions, setfilteredDropdownOptions] = useState([]);
  // const [data, setData] = useState([]);

  useEffect(() => {
    Api.getCall(`${testapi.baseURL}/mastersubscriptions/`)
      .then((response) => {
        const uniqueAzureCloudData = Array.from(
          new Map(
            response.data.data
              .filter((item) => item.Cloud === "Azure")
              .map((item) => [item.SubscriptionID, item])
          ).values()
        );
        setfilteredDropdownOptions(
          uniqueAzureCloudData.map((item: any) => item.SubscriptionID)
        );
        // setData(response.data.data.filter((item) => item.Cloud === "Azure"));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log(filteredDropdownOptions, "filterdropdown");
  const data = [
    {
      Name: "genaiclusterupgrade",
      KubernetesVersion: "2.1.1",
      Resource_Group: "GenAI_AKS_Upgrade",
      SubscriptionID: "aab65732-30e7-48a6-93c9-1acc5c8e4413",
    },
    {
      Name: "PromethusK8",
      KubernetesVersion: "2.1.4",
      Resource_Group: "prometheus-aks",
      SubscriptionID: "aab65732-30e7-48a6-93c9-1acc5c8e4413",
    },
    {
      Name: "devk8",
      KubernetesVersion: "2.3.23",
      Resource_Group: "resourcegroup-usha-test",
      SubscriptionID: "aab65732-30e7-48a6-93c9-1acc5c8e4413",
    },
    {
      Name: "clustertestv2",
      KubernetesVersion: "2.4.34",
      Resource_Group: "aksclusterconed1",
      SubscriptionID: "aab65732-30e7-48a6-93c9-1acc5c8e4413",
    },
    {
      Name: "akscluster",
      KubernetesVersion: "2.3.45",
      Resource_Group: "aksclusterconed1",
      SubscriptionID: "aab65732-30e7-48a6-93c9-1acc5c8e4413",
    },
  ];

  const onHandleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSelectChange = (id, value) => {
    
    setDropdownValue(value);
  };

  useEffect(() => {
     if (!dropdownvalue) return;
    try {
      const requestBody = {
        azure_subscription_id: dropdownvalue,
      };
      Api.postCall(
        `${testapi.baseURL}/gen_ai_aks_upgradation_list/`,
        requestBody
      ).then((response) => {
        console.log(response,"cluterdetails");
      });
      // await retryThreeTimes();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error fetching data : ${error.message}`);
    }
  }, [dropdownvalue]);

  const handleCheckboxChange = (index) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setCheckable(true);
      const allIndexes = data.map((_, index) => index);
      setSelectedIndexes(allIndexes);
    } else {
      setSelectedIndexes([]);
      setCheckable(false);
    }
  };

  const handleProceed = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setView("selection");
    setSelectedIndexes([]);
  };

  const handleCloseDetailModal = () => {
    setshowDetailModal(false);
  };

  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(value.toLowerCase())
  );

  const selectedClusters = selectedIndexes.map((index) => data[index]);

  const handleCardClick = (index, item) => {
    setshowDetailModal(true);
    setClusterdata(item);
  };

  return (
    <div className=" container-fluid overflow-scroll h-100 d-flex flex-column py-1 px-1 Analytics_Ai AksCluster  bg_color">
      <div className="position-relative bg-container  mt-1">
        <div className="d-flex justify-content-center align-items-center text-center">
          <h1 className="fw-semibold text-light display-5 pt-4">
            AKS Cluster Upgrade
          </h1>
        </div>

        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-n4 z-3 w-100">
          <div className="d-flex justify-content-center">
            <div className="input-group input-group-lg w-50 shadow rounded">
              <span className="input-group-text bg-white border-0">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
              </span>
              <input
                type="text"
                className="form-control border-0 search-input"
                placeholder="Search for the migration plans"
                value={value}
                onChange={onHandleChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" bottom-0 w-100 px-4 mt-5">
        <div className="d-flex justify-content-between">
          <div className="d-inline-block">
            <CustomSelect
              id="application"
              options={filteredDropdownOptions}
              value={dropdownvalue}
              onChange={handleSelectChange}
              placeholder="Select Subscription"
              error=""
            />
          </div>

          <div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="selectAll"
                checked={selectedIndexes.length === data.length}
                onChange={handleSelectAllChange}
              />

              <label className="form-check-label" htmlFor="selectAll">
                Select All
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-4 card_container_padding padding_height ">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bot_cursor"
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement;

                    if ("checked" in target) {
                      return;
                    }
                    handleCardClick(index, item);
                  }}
                >
                  <CategoryCard
                    title={capitalizeFirstLetter(item.Name)}
                    descriptionItems={item}
                    version={item.KubernetesVersion}
                    imageSrc={kuberneteslogo}
                    index={index}
                    paddingClass="pt-2 ps-2"
                    checked={selectedIndexes.includes(index)}
                    checkable={true}
                    onCheckboxChange={handleCheckboxChange}
                  />
                </div>
              );
            })
          ) : (
            <div className="text-muted text-center w-100 p-3">
              No tickets found.
            </div>
          )}
        </div>
        {selectedIndexes.length > 0 && (
          <div className="position-fixed bottom-0 end-0 p-3 m-5">
            <button
              className="btn btn-proceed px-3 py-1  text-white shadow-sm"
              onClick={handleProceed}
            >
              {"Proceed >>"}
            </button>
          </div>
        )}
      </div>
      <AksUpgradeModal
        show={showModal}
        onClose={handleCloseModal}
        selectedClusters={selectedClusters}
        view={view}
        setView={setView}
      />

      <AKSCardDetails
        imageSrc={kuberneteslogo}
        show={showDetailModal}
        onClose={handleCloseDetailModal}
        clusterdata={clusterdata}
      />
    </div>
  );
};
export default AksClusterDashboard;
