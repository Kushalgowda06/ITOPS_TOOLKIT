import { DialogActions } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Modal, Toast } from "react-bootstrap";
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import getLaunchStacks from "../../../api/LaunchStack";
import axios from "axios";
import useApi from "../../../customhooks/useApi";
import { VscCloudDownload, VscCloudUpload } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../Utilities/Loader";
import { wrapIcon } from "../../Utilities/WrapIcons";


const AzureUpload = () => {
  const VscCloudDownloadIcon = wrapIcon(VscCloudDownload);
  const VscCloudUploadIcon = wrapIcon(VscCloudUpload);


  const apiData = useAppSelector(selectCommonConfig);
  const getLaunchStackData: any = useApi(getLaunchStacks.getLaunchStacks);
  const [uploadModal, setUploadModal] = useState(false);
  const [files, setFiles] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [uploadResults, setUploadResults] = useState<string[]>([]);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('error');


  const handleExcelUpload = async () => {
    if (selectedFiles.length === 0) {
      setToastVariant('error');
      setToastMessage("Please select one or more Excel files.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    setUploadResults([]);

    const uploadPromises = selectedFiles.map(file => {
      const formData = new FormData();
      formData.append("excel_files", file);
      return axios.post(
        "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migration_chatbot/upload-excel/",
        formData,
      ).then(response => ({
        fileName: file.name,
        status: 'success',
        data: response.data
      }));
    });

    const results = await Promise.allSettled(uploadPromises);

    const resultMessages = results.map((result, index) => {
      const fileName = selectedFiles[index]?.name || `File ${index + 1}`;
      if (result.status === 'fulfilled') {
        console.log(`Upload successful for ${fileName}:`, result.value.data);
        return `${fileName}: Upload successful!`;
      } else {
        // result.reason is the error
        const error = result.reason;
        let errorMessage = "Upload failed.";
        if (axios.isAxiosError(error) && error.response) {
          const serverError = error.response.data?.detail || JSON.stringify(error.response.data);
          errorMessage = `Upload failed: ${error.response.statusText} (Status ${error.response.status}). ${serverError}`;
        } else if (error instanceof Error) {
          errorMessage = `An error occurred: ${error.message}`;
        }
        console.error(`Upload failed for ${fileName}:`, error);
        return `${fileName}: ${errorMessage}`;
      }
    });

    setUploadResults(resultMessages);
    setToastVariant('success');
    setToastMessage("All uploads processed. See results below.");
    setShowToast(true);
    setSelectedFiles([]); // Clear selection after upload
    setIsLoading(false);
  };
  return (
    <div className="m-2 bg_color onboarding-page-h">
      <div className="p-2 ">
        <div className="d-flex  justify-content-between">
          <p className="pb-5  fw-bolder k8title ">Azure Migration Upload


          </p>
          {/* <button
            type="button"
            className="p-1 bg-white gradient-border  gradient-background text-primary h-25"
            
             onClick={ handleClick}
          >  <div className="d-flex justify-content-center align-items-center ">
      
          <span className="px-1 fw-bold stack_p">Create New </span>
        </div></button> */}
        </div>
        <div className="px-4 stack_p">
          <p>
            Upload your customized Files here
          </p>
        </div>
        <div className="d-flex justify-content-center">
          <input
            type="file"
            accept=".xls,.xlsx"
            multiple
            onChange={(e) => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
          />
          <button
            type="button"
            className="p-2 bg-white gradient-border  gradient-background text-primary"
          // onClick={exportData}
          >
            <div className="d-flex justify-content-center align-items-center " onClick={handleExcelUpload}>
              <VscCloudDownloadIcon className="stack_icon" />{" "}
              <span className="px-3 fw-bold stack_p">Upload File</span>
            </div>
          </button>
        </div>

        {uploadResults.length > 0 && (
          <div className="mt-3 text-center px-4 stack_p">
            <h6>Upload Results:</h6>
            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', display: 'inline-block' }}>
              {uploadResults.map((result, index) => (
                <li key={index} style={{ color: result.includes('failed') || result.includes('error') ? '#dc3545' : '#28a745' }}>{result}</li>
              ))}
            </ul>
          </div>
        )}
        {/* <div className="d-flex py-5 justify-content-center">
          <div className="w-50 d-flex flex-column align-items-center">
            <button
              type="button"
              className="p-2 w-75 bg-white gradient-border gradient-background text-primary "
              onClick={() => {
                setUploadModal(true);
              }}
            >
              <div className="d-flex justify-content-center align-items-center">
                <VscCloudUpload className="stack_icon" />
                <span className="px-3 fw-bold text-uppercase stack_p">Upload</span>
              </div>
            </button>
            <p>{files ? `${files[Object.keys(files)[0]].name}` : ""}</p>
          </div>
        </div> */}
        {/* <div className="d-flex justify-content-center">
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
        </div> */}
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
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={4000}
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          minWidth: "400px",
          backgroundColor: "#f44336",
          color: "#fff",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 1050,
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
      <Loader isLoading={isLoading} load={null} />
    </div>
  );
};

export default AzureUpload;
