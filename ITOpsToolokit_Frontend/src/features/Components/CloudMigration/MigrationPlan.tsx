import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import HeaderBar from "./AksCluster/TitleHeader";
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import HeaderBar from "../AksCluster/TitleHeader";
import { Api } from "../../Utilities/api";
import { Tabs, Tab } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { PopUpModal } from "../../Utilities/PopUpModal";
import { Loader } from "../../Utilities/Loader";
import axios from "axios";
import React from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

// import { Api } from "../Utilities/api";

// const initialData = {
//   "Migration Strategies(6R)": [
//     {
//       "Migration Strategies": "",
//       Description: "",
//     },
//     {
//       "Migration Strategies": "",
//       Description: "",
//     },
//   ],
//   "Migration Artifacts": [
//     {
//       Environment: "All Environments",
//       "Artifact Name": "Application Intake form",
//       Description: "Application Intake form",
//       Link: "",
//     },
//     {
//       Environment: "All Environments",
//       "Artifact Name": "DMA assessment",
//       Description: "DB assessment report",
//       Link: "",
//     },
//     {
//       Environment: "All Environments",
//       "Artifact Name": "Application Assessment",
//       Description: "Azure Migrate Assessment",
//       Link: "",
//     },
//   ],
//   "Systems, Networks and Platforms": [
//     {
//       "IT System(s)": "",
//       "Hosting Network(s)/Platform(s) name": "",
//       "IaaS/PaaS/SaaS": "",
//       "Enterprise Critical Application(yes/no)": "",
//       "Status (new /existing)": "",
//       "Solution Context": "",
//     },
//   ],
//   "Cloud PaaS": [
//     {
//       "IaaS Name": "",
//       "New/Existing Subscription Name": "",
//       "Instance dedicated to this solution (Y/N)": "",
//       "Endpoints / IP Address": "",
//       "Allocated CPU": "",
//       "Allocated Memory": "",
//       "Allocated Storage": "",
//       Database: "",
//       "Additional Information": "",
//     },
//   ],

//   "Target (or To-be) Architecture": [
//     {
//       Description: "",
//       Diagram: "",
//       Diagram1: "",
//     },
//   ],
//   "Non prod Architecture Diagram": [
//     {
//       Description: "",
//       Diagram: "",
//     },
//   ],
//   "Prod Architecture Diagram": [
//     {
//       "Diagram Name": "",
//       "Diagram Image ": "",
//     },
//   ],
//   "Application Interfaces (Non-Prod)": [
//     {
//       "Interface ID": "",
//       Source: "",
//       Destination: "",
//       "Destination Internet Exposed": "",
//       "Destination Service/Private VPC Endpoint": "",
//       "Carriage Network": "",
//       "Data Traversing": "",
//       "Brief Description": "",
//       Authentication: "",
//       Authorisation: "",
//     },
//     {
//       "Interface ID": "",
//       Source: "",
//       Destination: "",
//       "Destination Internet Exposed": "",
//       "Destination Service/Private VPC Endpoint": "",
//       "Carriage Network": "",
//       "Data Traversing": "",
//       "Brief Description": "",
//       Authentication: "",
//       Authorisation: "",
//     },
//   ],
//   "Application Interfaces (Prod)": [
//     {
//       "Interface ID": "",
//       "Source IP": "",
//       "Destination IP": "",
//       // "Destination Internet Exposed": "",
//       // "Destination Service/Private VPC Endpoint": "",
//       // "Carriage Network": "",
//       // "Data Traversing": "",
//       // "Brief Description": "",
//       // Authentication: "",
//       // Authorisation: "",
//       "Port Number": "",
//       "Protocol": "",
//     },
//     {
//       "Interface ID": "",
//       Source: "",
//       Destination: "",
//       "Destination Internet Exposed": "",
//       "Destination Service/Private VPC Endpoint": "",
//       "Carriage Network": "",
//       "Data Traversing": "",
//       "Brief Description": "",
//       Authentication: "",
//       Authorisation: "",
//     },
//   ],

//   "Architectural Decisions": [
//     {
//       "SN no": "1",
//       Topic: "VM",
//       "Topic Description": "",
//       "Architectural Decision": "",
//       "Intended Solution End-State": "",
//       Recommendations: "",
//       "Approved By/Date": "",
//     },
//     {
//       "SN no": "2",
//       Topic: "Database",
//       "Topic Description": "",
//       "Architectural Decision": "",
//       "Intended Solution End-State": "",
//       Recommendations: "",
//       "Approved By/Date": "",
//     },
//     {
//       "SN no": "3",
//       Topic: "Storage",
//       "Topic Description": "",
//       "Architectural Decision": "",
//       "Intended Solution End-State": "",
//       Recommendations: "",
//       "Approved By/Date": "",
//     },
//     {
//       "SN no": "4",
//       Topic: "Network",
//       "Topic Description": "",
//       "Architectural Decision": "",
//       "Intended Solution End-State": "",
//       Recommendations: "",
//       "Approved By/Date": "",
//     },
//   ],

//   "Target Server Specifications": [
//     {
//       "App Name": "",
//       "App ID": "",
//       SUBSCRIPTION: "",
//       "RESOURCE GROUP": "",
//       "Env Class": "",
//       "Env Name": "",
//       "Server Role": "",
//       "Server FQDN": "",
//       "Server Name": "",
//       "OPERATING SYSTEM": "",
//       SIZE: "",
//       "PRIVATE IP ADDRESS": "",
//       "DISKS(OS+Data)": "",
//     },
//   ],
//   "Target Storage Specifications": [
//     {
//       Environment: "",
//       "Azure VM Name": "",
//       "Server Role": "",
//       Disk: "",
//       "Drive Letter": "",
//       "Size GB": "",
//       SKU: "",
//     },
//   ],

//   "Non-Prod VMs Network Specifications": [
//     {
//       "Azure Subscription Name": "",
//       "Azure Resource Group": "",
//       "Azure VNET": "",
//       "Target Server Name": "",
//       "Subnet Name": "",
//       "Subnet Mask": "",
//       "Network Interface Name": "",
//       "IP Address": "",
//       "Behind Load Balancer": "",
//       "Accelerated Networking": "",
//     },
//   ],
//   "Prod VMs Network Specifications": [
//     {
//       "Azure Subscription Name": "",
//       "Azure Resource Group": "",
//       "Azure VNET": "",
//       "Target Server Name": "",
//       "Subnet Name": "",
//       "Subnet Mask": "",
//       "Network Interface Name": "",
//       "IP Address": "",
//       "Behind Load Balancer": "",
//       "Accelerated Networking": "",
//     },
//   ],
//   "Non-Prod Network Load Balancer Configuration": [
//     {
//       "Target Server": "",
//       "LB Name": "",
//       "LB Front End": "",
//       "Backend Pool": "",
//       "LB Frontend IP": "",
//       "Health Probe (HB)": "",
//       "HB Protocol": "",
//       "HB Port": "",
//       "LB Rule Port": "",
//       "LB Rule Backend Port": "",
//     },
//   ],
//   "Prod Network Load Balancer Configuration": [
//     {
//       "Target Server": "",
//       "LB Name": "",
//       "LB Front End": "",
//       "Backend Pool": "",
//       "LB Frontend IP": "",
//       "Health Probe (HB)": "",
//       "HB Protocol": "",
//       "HB Port": "",
//       "LB Rule Port": "",
//       "LB Rule Backend Port": "",
//     },
//   ],
//   "NSG Rules": [
//     {
//       Direction: "",
//       Priority: "",
//       Source: "",
//       "Source CIDR/IP range": "",
//       Destination: "",
//       "Destination CIDR/IP range": "",
//       Protocol: "",
//       Port: "",
//       Action: "",
//       Rational: "",
//     },
//     {
//       Direction: "",
//       Priority: "",
//       Source: "",
//       "Source CIDR/IP range": "",
//       Destination: "",
//       "Destination CIDR/IP range": "",
//       Protocol: "",
//       Port: "",
//       Action: "",
//       Rational: "",
//     },
//   ],
//   "Application Gateway Details": [
//     {
//       "Target Server Name": "",
//       "Application Gateway Name": "",
//       "Front End Name": "",
//       "Backend Pool": "",
//       "Front end IP": "",
//     },
//     {
//       "Target Server Name": "",
//       "Application Gateway Name": "",
//       "Front End Name": "",
//       "Backend Pool": "",
//       "Front end IP": "",
//     },
//   ],
//   "Health Probe": [
//     {
//       "Application Gateway Name": "",
//       "Health Probe Name": "",
//       Host: "",
//       "HB Protocol": "",
//       "HB Path": "",
//     },
//   ],
//   "Routing Rule": [
//     {
//       "Application Gateway Name": "",
//       "Application Gateway Rule Name": "",
//       Listener: "",
//       "Backend Pool Name": "",
//       "Http Settings": "",
//     },
//   ],
//   "Backend HTTP Setting": [
//     {
//       "Backend HTTP Name": "",
//       Protocol: "",
//       Port: "",
//       "Cookie Based Affinity": "",
//     },
//   ],
//   "DNS Updates": [
//     {
//       Environment: "",
//       "Current DNS Record": "",
//       "Alias/CNAME": "",
//       "Current Value(on-premises)": "",
//       "New DNS Record (Azure)": "",
//       "New Value (Azure)": "",
//       "Record type": "",
//       Comments: "",
//     },
//     {
//       Environment: "",
//       "Current DNS Record": "",
//       "Alias/CNAME": "",
//       "Current Value(on-premises)": "",
//       "New DNS Record (Azure)": "",
//       "New Value (Azure)": "",
//       "Record type": "",
//       Comments: "",
//     },
//   ],
//   TAGS: [
//     { "Azure Tags": "Application ID", "Tag Value": "" },
//     { "Azure Tags": "Cost Centre", "Tag Value": "" },
//     { "Azure Tags": "Created By", "Tag Value": "" },
//     { "Azure Tags": "Created On", "Tag Value": "" },
//     { "Azure Tags": "Data Classification", "Tag Value": "" },
//     { "Azure Tags": "Data Region", "Tag Value": "" },
//     { "Azure Tags": "Environment Class", "Tag Value": "" },
//     { "Azure Tags": "Environment Use", "Tag Value": "" },
//     { "Azure Tags": "Internet Facing", "Tag Value": "" },
//     { "Azure Tags": "Internet Facing", "Tag Value": "" },
//   ],
//   "Boot & Diagnostics Storage": [
//     {
//       Environment: "",
//       "Storage Account Name": "",
//     },
//     {
//       Environment: "",
//       "Storage Account Name": "",
//     },
//   ],
//   "Non-Prod: Monitoring Infrastructure": [
//     {
//       "Monitoring Infrastructure": "",
//       "Log Analytics Workspace Name": "",
//       Location: "",
//       Description: "",
//     },
//     {
//       "Monitoring Infrastructure": "",
//       "Log Analytics Workspace Name": "",
//       Location: "",
//       Description: "",
//     },
//   ],
//   "Application Monitoring Alerts": [
//     {
//       "Monitoring Alerts": "High CPU",
//       "Threshold level": "",
//       "Action Groups": "Critical",
//       Description: "",
//     },
//     {
//       "Monitoring Alerts": "High CPU",
//       "Threshold level": "",
//       "Action Groups": "Warning",
//       Description: "",
//     },
//     {
//       "Monitoring Alerts": "High Memory",
//       "Threshold level": "",
//       "Action Groups": "Critical",
//       Description: "",
//     },
//     {
//       "Monitoring Alerts": "High Memory",
//       "Threshold level": "",
//       "Action Groups": "Warning",
//       Description: "",
//     },
//     {
//       "Monitoring Alerts": "Disk Drive",
//       "Threshold level": "",
//       "Action Groups": "Critical",
//       Description: "",
//     },
//     {
//       "Monitoring Alerts": "Disk Drive",
//       "Threshold level": "",
//       "Action Groups": "Warning",
//       Description: "",
//     },
//   ],
//   "Production Monitoring Infrastructure": [
//     {
//       "Monitoring Infrastructure (Ex: New Relic/Splunk)": "",
//       "Log Analytics Workspace Name": "",
//       Location: "",
//       Description: "To log the infrastructure & application logs",
//     },
//     {
//       "Monitoring Infrastructure (Ex: New Relic/Splunk)": "",
//       "Log Analytics Workspace Name": "",
//       Location: "",
//       Description:
//         "For Application logs, System logs, Security logs, Network log data, Audit logs, and Database log data",
//     },
//   ],
//   Backup: [
//     {
//       Environment: "Non prod",
//       "Target Backup Solution": "Azure Backup",
//       "Backup Vault": "",
//       "Backup Policy": "",
//       "Backup Policy Type": "",
//       "Backup Frequency": "",
//     },
//     {
//       Environment: "Prod",
//       "Target Backup Solution": "Azure Backup",
//       "Backup Vault": "",
//       "Backup Policy": "",
//       "Backup Policy Type": "",
//       "Backup Frequency": "",
//     },
//   ],
//   "Cost Estimation": [
//     {
//       Environment: "Non prod",
//       "Estimated Azure Cloud Consumption Cost per Month": "",
//     },
//     {
//       Environment: "Prod",
//       "Estimated Azure Cloud Consumption Cost per Month": "",
//     },
//   ],
// };

const MigrationPlan = () => {
  const [formData, setFormData] = useState<any>(null);
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [activeTab, setActiveTab] = useState<string>("Migartion Plan Document");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [isDownloadEnabled, setIsDownloadEnabled] = useState(false);
  const [getID, setID] = useState("");
  const [getOrderData, setOrderData] = useState<any>();
  const location = useLocation() as any;
  const orderId = String(location?.state?.orderId) ?? null;
  const inputRefs = useRef({});
  console.log("MigrationPlan orderId:", orderId);
  const tabs = [
    "Cloud D & A Report",
    "Application Intake Form Report",
    "Migartion Plan Document",
    "Cloud Migration",
  ];

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: string
  ): void => {
    setActiveTab(newValue);
    const routeMap: Record<string, string> = {
      "Cloud D & A Report": "/AssessmentReport",
      "Application Intake Form Report": "/CloudAssessmentReport",
      "Migartion Plan Document": "/MigrationPlan",
      "Cloud Migration": "/MigrationPlan",
    };
    const target = routeMap[newValue];
    if (target) navigate(target);
  };

  // const validateForm = () => {
  //   if (!formData) return false;
  //   const newErrors: any = {};
  //   let isValid = true;
  //   for (const section in formData) {
  //     newErrors[section] = [];
  //     for (let i = 0; i < formData[section].length; i++) {
  //       const item = formData[section][i];
  //       const itemErrors: any = {};
  //       for (const key in item) {
  //         if (item[key] === "") {
  //           itemErrors[key] = "This field is required";
  //           isValid = false;
  //         } else {
  //           itemErrors[key] = "";
  //         }
  //       }
  //       newErrors[section][i] = itemErrors;
  //     }
  //   }
  //   setErrors(newErrors);
  //   return isValid;
  // };

  const validateForm = () => {
    if (!formData) return { isValid: false, firstErrorLocation: null };

    const newErrors = {};
    let isValid = true;
    let firstErrorLocation = null;

    for (const section in formData) {
      newErrors[section] = [];

      formData[section].forEach((item, index) => {
        const itemErrors = {};

        for (const key in item) {
          const isEmpty = item[key] === "";
          itemErrors[key] = isEmpty ? "This field is required" : "";

          if (isEmpty && !firstErrorLocation) {
            firstErrorLocation = { section, index, key };
            isValid = false;
          }
        }

        newErrors[section][index] = itemErrors;
      });
    }

    setErrors(newErrors);
    return { isValid, firstErrorLocation };
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setIsLoading(true);
    // Step 1: Upload the Excel file
    const formDataUpload = new FormData();
    //  formDataUpload.append("file", file);
    formDataUpload.append("excel_files", file);
    try {
      await Api.postCall(
        "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_3rd_bot_details/upload-excel/",
        formDataUpload
      );
      setShowModal(true);
      setModalMessage("Excel file uploaded successfully.");
    } catch (error) {
      console.error("Error uploading file:", error);
      setShowModal(true);
      setModalMessage(`Error uploading file: ${error}`);
      setIsLoading(false);
      return; // Stop if upload fails
    }
    // step 2 : check the order id data ion the json
    const apiUrl =
      "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_3rd_bot_details/all";
    const postBody = {};

    try {
      const response = await Api.postCall(apiUrl, postBody);
      const orders = response?.data?.data;
      console.log(orders, "orderfrom all");
      console.log(String(orderId), "id order");
      const matchedOrder = orders?.find(
        (order) => order?.OrderID === String(orderId)
      );
      setOrderData(matchedOrder);
      setID(matchedOrder?.id);
      console.log(matchedOrder, "order");
      if (matchedOrder?.Data?.length === 0) {
        console.log("again api call for dummy data");
        try {
          const response = await Api.getCall(
            "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_3rd_bot_details/get-json-data"
          );
          const data = response?.data;

          if (data) {
            setFetchedData(data); // Store data temporarily
          } else {
            console.warn("No data received");
          }

          setErrors({});
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log(matchedOrder?.Data, "fromapi ");
        setInitialFormData(matchedOrder?.Data[0]);
        setFormData(matchedOrder?.Data[0]);
        setErrors({});
        setIsLoading(false);
      }
      // return matchedOrder.id;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
    // Step 3: Fetch the JSON data to populate the form
  };

  useEffect(() => {
    if (fetchedData) {
      setInitialFormData(fetchedData);
      setFormData(fetchedData);
      setErrors({});
    }
  }, [fetchedData]);

  const handleInputChange = (
    section: string,
    index: number,
    key: string,
    value: string
  ) => {
    const updatedData = JSON.parse(JSON.stringify(formData));
    updatedData[section][index][key] = value;
    setFormData(updatedData);
    if (errors[section]?.[index]?.[key]) {
      const newErrors = JSON.parse(JSON.stringify(errors));
      newErrors[section][index][key] = "";
      setErrors(newErrors);
    }
  };
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    section: string,
    index: number,
    key: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name;
    const sasToken =
      "?sp=racwl&st=2025-08-19T15:26:54Z&se=2025-12-30T23:41:54Z&sv=2024-11-04&sr=c&sig=ZdJFYq9w%2FpvxgOsZx19%2Bu4wjrxQ3Z6M4NeBGQHNAAQo%3D";
    const uploadUrl = `https://azureautomationstr.blob.core.windows.net/azuremigrateppt/${fileName}${sasToken}`;
    const finalUrl = `https://azureautomationstr.blob.core.windows.net/azuremigrateppt/${fileName}`;

    const config = {
      method: "put",
      url: uploadUrl,
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      data: file,
    };

    setIsLoading(true);
    try {
      await axios.request(config);
      handleInputChange(section, index, key, finalUrl);
      setShowModal(true);
      setModalMessage("Image uploaded successfully.");
    } catch (error) {
      console.error("Error uploading image:", error);
      setShowModal(true);
      setModalMessage(`Error uploading image: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getPutOrderID = async () => {
    const apiUrl =
      "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_3rd_bot_details/all";
    const postBody = {};

    try {
      const response = await Api.postCall(apiUrl, postBody);
      const orders = response.data.data;
      const matchedOrder = orders.find((order) => order.OrderID === orderId);
      return matchedOrder.id;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };
  console.log(formData, "formData");

  const handleSubmit = async () => {
    // const id = await getPutOrderID();
    const { isValid, firstErrorLocation } = validateForm();

    if (isValid)
      // if (validateForm())

      {
      setIsLoading(true);

      const postBody = {
        ApplicationName: getOrderData?.ApplicationName,
        Cloud: getOrderData?.Cloud,
        OrderID: String(orderId),
        Project: getOrderData?.Project,
        Data: [formData],
      };
      if (getID) {
        try {
          const response = Api.putData(
            "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_3rd_bot_details/",
            postBody,
            getID
          );

          setShowModal(true);
          setModalMessage("Data submitted Successfully");
          setIsDownloadEnabled(true);
          setIsLoading(false);
        } catch (error) {
          setShowModal(true);
          setModalMessage(
            ` ${error} An error occurred while submitting the form.`
          );
          setIsLoading(false);
        }
      }
      console.log(formData);
      // alert("Form data submitted! Check the console.");
    } else {
      if (firstErrorLocation) {
        const { section, index, key } = firstErrorLocation;
        const ref = inputRefs.current?.[section]?.[index]?.[key];
        if (ref && ref.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
          ref.current.focus();
        }
      }
      setShowModal(true);
      setModalMessage("Please fill all the required fields.");
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    // const id = await getPutOrderID();
    const postBody = {
      ApplicationName: getOrderData?.ApplicationName,
      Cloud: getOrderData?.Cloud,
      OrderID: String(orderId),
      Project: getOrderData?.Project,
      Data: [formData],
    };
    if (getID) {
      try {
        const response = Api.putData(
          "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_3rd_bot_details/",
          postBody,
          getID
        );

        setShowModal(true);
        setModalMessage("Form Data Saved Successfully");
        setIsLoading(false);
      } catch (error) {
        setShowModal(true);
        setModalMessage(
          ` ${error} An error occurred while submitting the form.`
        );
        setIsLoading(false);
      }
    }
    console.log(formData);
  };
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const handleDownload = async () => {
    const downloadUrl =
      "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_3rd_bot_details/document-download";
    const postBody = {
      OrderID: String(orderId),
    };
    setIsLoading(true);
    setDownloadProgress(0);
    try {
      const response = await axios.post(downloadUrl, postBody, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadProgress(percent);
          }
        }
      });
      console.log(response, "downloadurl");
      const blobLink = response.data.blob_links;

      if (blobLink) {
        const link = document.createElement("a");
        link.href = blobLink;

        const filename = blobLink.substring(blobLink.lastIndexOf("/") + 1);
        link.setAttribute("download", filename);

        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        console.log(blobLink, "blobLink");
      } else {
        throw new Error("No download link found in response.");
      }
    } catch (error) {
      setDownloadProgress(null);
      console.error("Error downloading file:", error);
      setShowModal(true);
      setModalMessage(`Error downloading file: ${error}`);
      setIsLoading(false);
    } finally {
      setDownloadProgress(null);
      setIsLoading(false);
    }
  };

  // Helper to get an empty item for a section
  const getEmptyItem = (section: string) => {
    if (!initialFormData || !initialFormData[section] || initialFormData[section].length === 0)
      return {};
    const keys = Object.keys(initialFormData[section][0]);
    const empty: any = {};
    keys.forEach((k) => (empty[k] = ""));
    return empty;
  };

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 40 }}>
          <span style={{ fontWeight: 500 }}>{`${Math.round(props.value)}%`}</span>
        </Box>
      </Box>
    );
  }

  return (
    <div className="bg_color h-100">
      <HeaderBar content="Migration Plan Document" position="center" />
      <div className="container pt-3 pb-2">
        <div className="d-flex align-items-center justify-content-center px-1 py-1 rounded-top migrationplan_header_color  istm_header_height box-shadow text-primary">
          <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold">
            Complete the form to generate document
          </div>
        </div>
        <div className="bg-white">
          <div className="mb-3 pt-2 d-flex justify-content-between p-3">
            <div className="mig_gradient-border">
              <label
                htmlFor="uploadExcel"
                className="btn btn-sm  mig_gradient-text fw-bold"
              >
                Upload Intake Form{" "}
                <FontAwesomeIcon
                  icon={faUpload}
                  className="migration_upload_icon-color"
                />
              </label>
              <input
                type="file"
                className="form-control d-none"
                accept=".xlsx, .xls"
                id="uploadExcel"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div
            style={{
              maxHeight: "calc(100vh - 300px)",
              overflowY: "auto",
              padding: "0 24px 24px",
            }}
          >
            {formData && initialFormData && (
              <div className="p-3">
                {Object.keys(formData).map((section) => (
                  <div key={section} className="mb-4" style={{ border: "2px solid #2d2d8f", borderRadius: "16px", background: "#f7f8fa", boxShadow: "0 2px 8px rgba(44,44,44,0.08)", padding: "24px" }}>
                    <h5 className="text-primary" style={{ fontWeight: 600, marginBottom: 24 }}>{section}</h5>
                    {formData[section].map((item: any, index: number) => (
                      <div key={index} className="mb-3" style={{ border: "1px solid #d1d5db", borderRadius: "12px", background: "#fff", padding: "18px", marginBottom: "18px", position: "relative" }}>
                        <div className="row">
                          {Object.keys(item).map((key) => {
                            inputRefs.current[section] ??= {};
                            inputRefs.current[section][index] ??= {};
                            inputRefs.current[section][index][key] ??= React.createRef();
                            const ref = inputRefs.current[section][index][key];
                            const value = formData[section][index][key];
                            const error = errors?.[section]?.[index]?.[key];
                            const isDisabled = initialFormData[section][index] && initialFormData[section][index][key] !== "";
                            return (
                              <div className="col-md-6" key={key}>
                                <div className="mb-2">
                                  <label className="form-label d-flex justify-content-start ps-1 fs-6">{key}</label>
                                  <input
                                    ref={ref}
                                    type="text"
                                    className={`form-control ${error ? "is-invalid" : ""}`}
                                    value={value}
                                    disabled={isDisabled}
                                    onChange={e => handleInputChange(section, index, key, e.target.value)}
                                  />
                                  {error && <div className="invalid-feedback d-block">{error}</div>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {/* Show delete button only for user-added forms (index >= initialFormData[section].length) */}
                        {index >= initialFormData[section].length && (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                            <button type="button" onClick={() => {
                              const updated = [...formData[section]];
                              updated.splice(index, 1);
                              setFormData({ ...formData, [section]: updated });
                            }} style={{ background: '#e53e3e', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 20, cursor: 'pointer' }}>–</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Plus button only after the last form in the section */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '-8px' }}>
                      <button type="button" onClick={() => {
                        const updated = [...formData[section], getEmptyItem(section)];
                        setFormData({ ...formData, [section]: updated });
                      }} style={{ background: '#2d2d8f', color: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-end p-2">
                  <button
                    className="btn btn-primary mig_button_color me-3"
                    onClick={handleSubmit}
                  >
                    Generate Migration Plan
                  </button>
                  <button
                    className="btn btn-primary mig_button_color"
                    onClick={handleDownload}
                    disabled={!isDownloadEnabled || downloadProgress !== null}
                    style={{ position: 'relative', minWidth: 220 }}
                  >
                    {downloadProgress !== null ? (
                      <LinearProgressWithLabel value={downloadProgress} />
                    ) : (
                      <>Migration Plan Document</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <button
          className="btn btn-primary mig_button_color  d-flex justify-content-start m-2 "
          onClick={handleSaveDraft}
        >
          Save Draft
        </button>
      </div>
      <PopUpModal
        show={showModal}
        modalMessage={modalMessage}
        onHide={() => setShowModal(false)}
      />
      <Loader isLoading={isLoading} load={null} />

      {/* Bottom tabs bar to match CloudAssessmentReport/AssessmentReport */}
      <div className="">
        <div className="row align-items-center">
          <div className="col-12 d-flex Analytics_Ai justify-content-center">
            <div className="genai-tabs  py-2">
              <Tabs
                sx={{ minHeight: "32px" }}
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
                className="genai-tabs-wrapper tab_bg text-primary"
              >
                {tabs.map((label, index) => (
                  <Tab key={index} label={label} value={label} />
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      {downloadProgress !== null && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={downloadProgress} />
          <div style={{ textAlign: 'center', marginTop: 8, fontWeight: 500 }}>
            {downloadProgress}% Downloaded
          </div>
        </Box>
      )}
    </div>
  );
};

export default MigrationPlan;
