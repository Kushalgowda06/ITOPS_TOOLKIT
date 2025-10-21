import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Autocomplete,
  TextField,
  Popper,
} from "@mui/material";
import { Toast, Modal } from "react-bootstrap";
import SkeletonGrid from "../../Utilities/SkeletonGrid";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
const NodePopupData = ({
  selectedData,
  handleClose,
  setFormData,
  match,
  resourceGroupName,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [getAzureSize,setAzureSize] = useState([]);
  const [showToast, setShowToast] = useState(false); // alert popUp
  const [showToastMessage, setShowToastMessage] = useState(""); // alert popUp Message
  const [toastColor, setToastColor] = useState(""); // alert popUp Color
  const [deleteData, setDeleteData] = useState([]);
  const [removeNode, setRemoveNode] = useState("");
  const [Node, setNodeName] = useState("");

  const CustomPopper = (props) => {
    return (
      <Popper
        {...props}
        style={{
          maxHeight: 100,
          maxWidth: 180,
          overflowX: "auto",
          placement: "bottom-start",
        }}
      />
    );
  };

  useEffect(() => {
    Api.getCall(testapi.azuresizetypes).then((response: any) => {
      setAzureSize(response?.data);
     });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [data, setData] = useState({});

  const handleInputChange = (index, innerindex, target) => {
    const updatedData = { ...data };
    updatedData[index][innerindex].value = target;
    setData(updatedData);
  };

  const formFields = [
    { label: "Node Name" },
    { label: "VmSize" },
    { label: "Count" },
    {
      label: "Mode",
    },
    {
      label: "OsType",
    },
  ];

  const handleAddField = () => {
    const newIndex = Object.values(data).length; // Generate a unique index based on the current row count
    var updatedData = {
      ...data,
      [newIndex]: [
        { label: "Node Name", name: "NodeToBeAdded", type: "text", value: "" },
        { label: "VmSize", name: "VMSize", type: "text", value: "" },
        {
          label: "Count",
          name: "NodePoolCount",
          type: "number",
          value: "",
          min: "1",
        },
        {
          label: "Mode",
          name: "Mode",
          type: "select",
          options: ["System", "User"],
          value: "",
        },
        {
          label: "OsType",
          name: "OsType",
          type: "select",
          options: ["Linux", "Windows"],
          value: "",
        },
      ],
    };
    setData(updatedData);
  };
  const handleRemoveField = (index) => {
    let updatedData = { ...data };
    delete updatedData[index];
    const keys = Object.keys(updatedData);
    const maxIndex = Math.max(...keys.map(Number));

    if (index - 1 === maxIndex && index > 0) {
      setData(updatedData);
    } else {
      for (let i = index; i < maxIndex; i++) {
        updatedData[i] = updatedData[i + 1];
      }
      delete updatedData[maxIndex];
      setData(updatedData);
    }
  };

  useEffect(() => {
    const transformdata = [];
    for (const key in data) {
      transformdata[key] = {};
      data[key].forEach((item) => {
        transformdata[key][item.name] = item.value;
      });
    }
    setFormData(transformdata);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // for getting data of for delete node
  useEffect(() => {
    const customData = () => {
      const url = `https://nodedetailsk8.azurewebsites.net/api/nodedetails?ResourceGroupName=${match[1]}&ResourceName=${resourceGroupName}&Location=${selectedData[0].Location}&code=IAivO57uCjrAuYru3uMbsP1uIvw696sIKmd1eUQKqunOAzFuJ91aHg==`;
      try {
        Api.getCall(url).then((response: any) => {
          setDeleteData(
            response.data.AKSNodeData.map((node) => node.ComputerName)
          );
        })
        
      } catch (error) {
      }
    };
    customData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //logic to compare to get computername
  const handleRemoveNode = (nodepoolname, nodecount) => {
    if (nodecount > 0) {
      setNodeName(nodepoolname);
      if (deleteData) {
        const matchingNames = deleteData.filter(
          (name) => name.split("-")[1] === nodepoolname
        );
        setRemoveNode(matchingNames.toString());
      }
      setShowModal(true);
    } else {
      setShowToast(true); // show the toast
      setShowToastMessage("No Node Found"); // set Toast Message
      setToastColor("gradient-background-toast");
    }
  };

  //post method for delete node.
  const confirmDelete = () => {
    try {
      Api.postData(testapi.removenode, {
        data: [
          {
            ClusterName: selectedData[0].Name,
            ResourceGroup: match[1],
            NodeToBeRemoved: removeNode,
            NodePoolName: Node,
            Cloud: "Azure",
            SubscriptionID: "123",
          },
        ],
      })
    } catch (error) {
      console.error(error);
    }
    setShowModal(false); // hide the confirmation modal
    setTimeout(() => {
      handleClose();
    }, 800);
    setShowToast(true); // show the toast
    setShowToastMessage("Node deleted successfully!"); // set Toast Message
    setToastColor("gradient-background-toast"); // set the background color class
  };

  return getAzureSize ? (
    <>
    <div className="d-flex justify-content-center">
    <div className="px-3">
      <p className=" text-muted fw-bold mb-0 nav-font">Node Manager</p>
      <p className="ps-4 text-muted tab">
      Kubernetes runs your workload by placing containers into Pods to run on Nodes.
       A node may be a virtual or physical machine, depending on the cluster. 
       Each node is managed by the control plane and contains the services 
       necessary to run Pods. You can addadd nodes to a Kubernetes cluster.
      </p>
    </div>
  </div>
    <div className="">
      <div className="container tab ">
        <div className="row pb-1 justify-content-center d-flex">
          {formFields.map((field, index) => (
            <div
              key={index}
              className={`col-md-2 ${
                field.label === "OsType" || field.label === "Mode" ? "p-0" : ""
              }`}
            >
              <label>{field.label}</label>
            </div>
          ))}
        </div>

        <div
          className="w-100"
          style={{ height: "150px", overflowX: "hidden", overflowY: "auto" }}
        >
          <div className="row pb-1 ">
            {selectedData.map((cluster, selindex) => (
              <div key={selindex}>
                {cluster.NodePoolInfo.map((nodePool, innerindex) => (
                  <div
                    key={innerindex}
                    className="d-flex justify-content-center text-center pb-1 "
                  >
                    <strong className="col-md-2 ps-4">
                      {nodePool.NodePoolNames}
                    </strong>
                    <strong className="col-md-2  ps-4 ">{nodePool.Size}</strong>
                    <strong className="col-md-2 ">{nodePool.Count}</strong>
                    <strong className="col-md-2 ">{nodePool.Mode}</strong>
                    <strong className="col-md-2 ">{nodePool.OsType}</strong>

                    {cluster.NodePoolInfo.length > 0 && (
                      <div
                        className={` ${
                          innerindex === cluster.NodePoolInfo.length - 1 &&
                          Object.values(data).length <= 0
                            ? "me-4 pe-1 "
                            : "pe-4 me-5"
                        }`}
                      >
                        <div className="input-group-text bg-white cursor-pointer " onClick={() =>
                              handleRemoveNode(
                                nodePool.NodePoolNames,
                                nodePool.Count
                              )
                            }>
                          <FontAwesomeIcon
                            className=" text-danger py-1 minus_plus_size "
                            icon={faMinus}
                            fontSize={"11px"}
                          />
                        </div>
                      </div>
                    )}
                    {innerindex === cluster.NodePoolInfo.length - 1 &&
                      Object.values(data).length <= 0 && ( // Check if it's the last item in the array
                        <div className="input-group-text bg-white cursor-pointer me-3" onClick={handleAddField}>
                          <FontAwesomeIcon
                            icon={faPlus}
                            fontSize={"11px"}
                            className=" py-1 text-success minus_plus_size "
                          />
                        </div>
                      )}
                 
                  </div>
                ))}
              </div>
            ))}
          </div>

          {Object.values(data).length > 0 &&
            Object.values(data).map((value: any, index) => (
              <div className="row ps-5 pb-1 tab ">
                {value.map((field, innerindex) => (
                  <div className="col-md-2 d-flex justify-content-center">
                    {field.type === "select" ? (
                      <select
                        className="form-select form-select-sm tab"
                        name={field.name}
                        value={field.value}
                        onChange={(e) =>
                          handleInputChange(index, innerindex, e.target.value)
                        }
                      >
                        <option value="" disabled selected>
                          {field.label}
                        </option>
                        {field.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : field.name === "VMSize" ? (
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={getAzureSize}
                        className="ps-4"
                        value={field.value}
                        onChange={(e, value1) =>
                          handleInputChange(index, innerindex, value1)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="VMSize"
                            sx={{ width: 170 }}
                          />
                        )}
                        PopperComponent={CustomPopper}
                      />
                    ) : (
                      <input
                        type={field.type}
                        className={`form-control form-control-sm tab ${
                          field.type === "number" ? "w-75 ms-4" : ""
                        }`}
                        name={field.name}
                        value={field.value}
                        onChange={(e) =>
                          handleInputChange(index, innerindex, e.target.value)
                        } // Pass the appropriate row index
                        min={field.min}
                      />
                    )}
                  </div>
                ))}

                <div className="col d-flex d-inline">
               
                <div>
                    <div className="input-group-text bg-white cursor-pointer  "  onClick={() => handleRemoveField(index)}>
                      <FontAwesomeIcon
                        className="py-1 text-danger minus_plus_size"
                        icon={faMinus}
                        // fontSize={"11px"}
                       
                      />
                    </div>
                    </div>

                    {index === Object.values(data).length - 1 && ( // only show the plus icon for the last input field
                    <div className="pe-1 cursor-pointer ms-2"   onClick={handleAddField}>
                      <span className="input-group-text bg-white ">
                        <FontAwesomeIcon
                          // fontSize={"11px"}
                          icon={faPlus}
                          className="py-1  text-success minus_plus_size"
                        
                        />
                      </span>
                    </div>
                  )}

                </div>

              </div>
            ))}
        </div>
      </div>

      {
        <>
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
            className={`position-absolute top-0 start-50 translate-middle custom-margin  ${toastColor}`}
          >
            <Toast.Body className="text-white">{showToastMessage}</Toast.Body>
          </Toast>

          <Modal
            show={showModal}
            onHide={() => setShowModal(false)}
            style={{ zIndex: 9999 }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fs-6">Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete this <strong>{Node}</strong>{" "}
                node ?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={confirmDelete}>YES</Button>
              <Button onClick={() => setShowModal(false)}>NO</Button>
            </Modal.Footer>
          </Modal>
        </>
      }
    </div>
  </>) : (
    <SkeletonGrid rows={1} columns={1} height="100vh" waveAnimation={true} variant="rectangular" widthPercentage="100%" />
  );
};

export default NodePopupData;
