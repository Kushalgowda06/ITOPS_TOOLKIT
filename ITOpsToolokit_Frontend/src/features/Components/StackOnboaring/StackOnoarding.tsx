import { DialogActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import getLaunchStacks from "../../../api/LaunchStack";
import axios from "axios";
import useApi from "../../../customhooks/useApi";
import { VscCloudDownload,VscCloudUpload } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { wrapIcon } from "../../Utilities/WrapIcons";


const StackOnoarding = () => {
    const VscCloudDownloadIcon = wrapIcon(VscCloudDownload);
    const VscCloudUploadIcon = wrapIcon(VscCloudUpload);
  
  const apiData = useAppSelector(selectCommonConfig);
  const getLaunchStackData: any = useApi(getLaunchStacks.getLaunchStacks);
  const [uploadModal, setUploadModal] = useState(false);
  const [files, setFiles] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getLaunchStackData.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const exportData = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(apiData.launchStackData[0].LaunchStacks[0])
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "launchStacks.json";
    link.click();
  };

  const readJsonFile = (file: Blob) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        if (event.target) {
          resolve(JSON.parse(event.target.result as string));
        }
      };

      fileReader.onerror = (error) => reject(error);
      fileReader.readAsText(file);
    });

  const onsubmit = async () => {
    var currentLaunchStackData: any[] = [];
    currentLaunchStackData = await getLaunchStackData.request();
    if (files[Object.keys(files)[0]]) {
      const parsedData = await readJsonFile(files[Object.keys(files)[0]]);
      var tempApiData = [...getLaunchStackData?.data?.data];
      var cloudKey = null;
      Object.values(getLaunchStackData?.data?.data).forEach(
        (curr: any, index: number) => {
          if (curr.Cloud === Object.keys(files)[0]) {
            cloudKey = index;
            let currentIndexTempStore = { ...tempApiData[index] };
            currentIndexTempStore.LaunchStacks = [
              ...tempApiData[index].LaunchStacks,
              parsedData,
            ];
            tempApiData[index] = currentIndexTempStore;
          }
        }
      );
    }

    try {
      axios.put(
        `https://demoapi.intelligentservicedeliveryplatform.com/launch_stacks/${tempApiData[cloudKey].id}`,
        tempApiData[cloudKey]);
      setModalMessage("Submited Successfully");
    } catch (error) {
      setModalMessage("Please try again ");
    }
    setShowModal(true);
  };
// for create new stackonboarding form 
const handleClick = () => {
  navigate({
    pathname: "/stack",
  })
};

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiles({ [event.target.name]: event.target.files[0] });
    setUploadModal(false);
  };

  const handleModalClose = () => setShowModal(false);

  return (
    <div className="m-2 bg_color onboarding-page-h">
      <div className="p-2 ">
        <div className="d-flex  justify-content-between">
        <p className="pb-5  fw-bolder k8title ">Stack On-Boarding 
        
        
        </p> 
        <button
            type="button"
            className="p-1 bg-white gradient-border  gradient-background text-primary h-25"
            
             onClick={ handleClick}
          >  <div className="d-flex justify-content-center align-items-center ">
      
          <span className="px-1 fw-bold stack_p">Create New </span>
        </div></button>
        </div>
        <div className="px-4 stack_p">
          <p>
            A stack is known as a resource or a group of resources. A Stack
            Onboarding form is to upload a JSON form to gether essential
            information from an individual or team who wanted to create a
            resource in any Environment. It serves as a resource structured
            questionnaire designed to ensure a smooth integration.
          </p>
        </div>
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="p-2 bg-white gradient-border  gradient-background text-primary"
            onClick={exportData}
          >
            <div className="d-flex justify-content-center align-items-center ">
              <VscCloudDownloadIcon className="stack_icon" />{" "}
              <span className="px-3 fw-bold stack_p">Download Sample</span>
            </div>
          </button>
        </div>
        <div className="d-flex py-5 justify-content-center">
          <div className="w-50 d-flex flex-column align-items-center">
            <button
              type="button"
              className="p-2 w-75 bg-white gradient-border gradient-background text-primary "
              onClick={() => {
                setUploadModal(true);
              }}
            >
              <div className="d-flex justify-content-center align-items-center">
                <VscCloudUploadIcon className="stack_icon" />
                <span className="px-3 fw-bold text-uppercase stack_p">Upload</span>
              </div>
            </button>
            <p>{files ? `${files[Object.keys(files)[0]].name}` : ""}</p>
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="col-8 m-4">
            {" "}
            <DialogActions>
              <div className="d-grid col-5 mx-auto px-2 ">
                <button
                  type="button"
                  className="btn btn-outline-danger stack_btn_width"
                  onClick={() => {
                    setFiles(null);
                  }}
                >
                  {" "}
                  Cancel{" "}
                </button>
              </div>
              <div className="d-grid col-5 mx-auto px-2 py-3">
                <button
                  type="button"
                  className="btn btn-outline-success stack_btn_width"
                  onClick={onsubmit}
                >
                  {" "}
                  Submit{" "}
                </button>
              </div>
            </DialogActions>
          </div>
        </div>
      </div>
      <Modal show={uploadModal} centered onHide={() => setUploadModal(false)}>
        <Modal.Body>
          <div className="d-flex py-5 justify-content-around stack-popup">
            <div className="stack-popup-cloud-icon">
              <label htmlFor="aws-file-input">
                <img
                  src={awsIcon}
                  alt="awsIcon"
                  className="cursor-pointer"
                  style={{ width: "100px", height: "100px" }}
                />
              </label>
              <input
                id="aws-file-input"
                accept=".json,application/json"
                type="file"
                name="AWS"
                onChange={onChange}
              />
            </div>
            <div className="stack-popup-cloud-icon">
              <label htmlFor="azure-file-input">
                <img
                  src={azureIcon}
                  alt="azureIcon"
                  className="cursor-pointer"
                  style={{ width: "100px", height: "100px" }}
                />
              </label>
              <input
                id="azure-file-input"
                accept=".json,application/json"
                type="file"
                name="Azure"
                onChange={onChange}
              />
            </div>
            <div className="stack-popup-cloud-icon">
              <label htmlFor="gcp-file-input">
                <img
                  src={gcpIcon}
                  alt="gcpIcon"
                  className="cursor-pointer"
                  style={{ width: "100px", height: "100px" }}
                />
              </label>
              <input
                id="gcp-file-input"
                accept=".json,application/json"
                type="file"
                name="GCP"
                onChange={onChange}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showModal} centered onHide={handleModalClose}>
        <Modal.Body>
          <div className="d-flex p-2 justify-content-center">
            <p>{modalMessage}</p>
          </div>
          <div className="d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleModalClose}
            >
              {" "}
              Done{" "}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StackOnoarding;
