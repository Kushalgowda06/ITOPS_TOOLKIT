import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Modal, Button } from "react-bootstrap";
import Forms from "../Forms/Forms";
import { useLocation, useParams } from "react-router-dom";
import { Loader } from "../../Utilities/Loader";
import { PopUpModal } from "../../Utilities/PopUpModal";
import testapi from '../../../api/testapi.json'

const DynamicForms = (props) => {
  const params = useParams();
  const [key, setKey] = useState("stackDetails");
  const [param, setParam] = useState(params);
  const [showModal, setShowModal] = useState(false);
  const [showValidation, setShowValidation] = useState<any>(false);
  const [modalMessage, setModalMessage] = useState("");
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const pathname = location.pathname;
  const [showSharedResources, setShowSharedResources] = useState(false);
  const [formData, setFormData] = useState({
    stackDetails: [],
    stackTags: [],
  });
  let modifiedStackArray;
  let finalExport;
  let tempCloudsStore: any = [];
  let tempCloudStoreResult: any = {};
  let currentLaunchStack: any = params.launchStack;
  let apiStore: any = [...props?.apiData];
  useEffect(() => {
    setParam(params);
    setKey("stackDetails");
  }, [params]);

  apiStore.forEach((curr: any) => {
    if (!tempCloudsStore.includes(curr.Cloud)) {
      tempCloudsStore.push(curr.Cloud);
      tempCloudStoreResult[curr.Cloud.toLowerCase()] = {
        launchStack: curr.LaunchStacks,
      };
    }
  });
  let stackarray: any = [];
  tempCloudStoreResult[params.Cloud.toLowerCase()].launchStack.forEach(
    (curr: any) => {
      if (curr[currentLaunchStack]) {
        stackarray.push(curr[currentLaunchStack][0]);
      }
    }
  );
  modifiedStackArray = {
    details: stackarray[0],
    tags: {
      Application: "",
      CostCenter: "",
      Environment: "",
      Support: "",
      AvailabilityTime: "",
      Owner: "",
      BU: "",
      SharedCost: "",
    },
  };

  finalExport = {
    details: [],
    tags: [],
  };
  if (pathname.includes("launch-stack/Azure")) {
    Object.keys(modifiedStackArray).forEach((current: any, index: number) => {
      Object.keys(modifiedStackArray[current]).forEach(
        (key: any, index: number) => {
          let inputType;
          if (
            key === "ResourceGroup" ||
            key === "Container" ||
            key === "Location" ||
            key === "Virtual_Network" ||
            key === "Subnet" ||
            key === "Public_ip" ||
            key === "Network_Security_Group" ||
            key === "Network_Interface" ||
            key === "Size" ||
            key === "Publisher" ||
            key === "Offer" ||
            key === "Sku" ||
            key === "Dns" ||
            key === "Kubernetes_version" ||
            key === "BU" ||
            key === "Owner" ||
            key === "Environment" ||
            key === "CostCenter" ||
            key === "Application" ||
            key === "SubscriptionID" ||
            key === "AvailabilityZone" ||
            key === "AvailabilityTime"
          ) {
            inputType = "dropdown";
            finalExport[current].push({
              inputType,
              name: key,
              source:
                key === "Environment"
                  ? [
                      "Sandbox",
                      "Development",
                      "QA",
                      "Production",
                      "Demo",
                      "Lab",
                    ]
                  : key === "AvailabilityTime"
                  ? [
                      "Work Days",
                      "Business Hours - 9 to 6",
                      "24 Hours",
                      " 10 hours - 9 to 9",
                    ]
                  : [],
              value: "",
              description: "",
            });
          } else if (key === "Password") {
            inputType = "password";
            finalExport[current].push({
              inputType,
              name: key,
              value: "",
              description: "",
            });
          } else {
            inputType = "text";
            finalExport[current].push({
              inputType,
              name: key,
              value:
                key === "Virtual_Machine_Name"
                  ? ""
                  : modifiedStackArray[current][key],
              errordescription: "",
              description: "",
            });
          }
        }
      );
    });
  } else if (pathname.includes("/launch-stack/AWS/")) {
    Object.keys(modifiedStackArray).forEach((current: any, index: number) => {
      Object?.keys(modifiedStackArray[current])?.forEach(
        (key: any, index: number) => {
          let inputType;
          if (
            key === "ami" ||
            key === "AMI" ||
            key === "instance_type" ||
            key === "InstanceType" ||
            key === "subnet_id" ||
            key === "Subnet" ||
            key === "key_name" ||
            key === "KeyName" ||
            key === "volume_type" ||
            key === "VolumeType" ||
            key === "vpc_id" ||
            key === "VPC_ID" ||
            key === "region" ||
            key === "Region" ||
            key === "Engine" ||
            key === "Engine_Version" ||
            key === "Instance_Class" ||
            key === "Storage_Type" ||
            key === "DB_Subnet_Group" ||
            key === "Availability_Zone1" ||
            key==="AvailabilityZone" ||
            key === "Availability_Zone2" ||
            key === "Size" ||
            key === "BU" ||
            key === "Owner" ||
            key === "Environment" ||
            key === "CostCenter" ||
            key === "Application" ||
            key === "SubscriptionID" ||
            key === "AvailabilityTime" || key==="launch_type" 
          ) {
            inputType = "dropdown";
            finalExport[current].push({
              inputType,
              name: key,
              source:
                key === "Environment"
                  ? [
                      "Sandbox",
                      "Development",
                      "QA",
                      "Production",
                      "Demo",
                      "Lab",
                    ]
                  : key === "AvailabilityTime"
                  ? [
                      "Work Days",
                      "Business Hours - 9 to 6",
                      "24 Hours",
                      " 10 hours - 9 to 9",
                    ]
                  : key==="launch_type"? ["test", "cutover","finalize","archive","delete"]:[],
              value: "",
              description: "",
            });
          } else if (key === "Password") {
            inputType = "password";
            finalExport[current].push({
              inputType,
              name: key,
              value: "",
              description: "",
            });
          } 
          else if (key === "server_list") {
            inputType = "multiselectdropdown";
            finalExport[current].push({
              inputType,
              name: key,
              source: [],
              value: "",
              description: "",
            });
          } 
          else {
            inputType = "text";
            finalExport[current].push({
              inputType,
              name: key,
              value: modifiedStackArray[current][key],
              errordescription: "",
              description: "",
            });
          }
        }
      );
    });
  } else if (pathname.includes("/launch-stack/GCP/")) {
    Object.keys(modifiedStackArray).forEach((current: any, index: number) => {
      Object.keys(modifiedStackArray[current]).forEach(
        (key: any, index: number) => {
          let inputType;
          if (
            key === "Region" ||
            key ==="region" ||
            key === "Zone" ||
            key ==="zone" ||
            key === "Image" ||
            // key === "SubnetworkName" ||
            // key === "RouterName" ||
            key === "NATName" ||
            // key === "NATIPName" ||
            // key === "Node_Pool" ||
            key === "MachineType" ||
            key === "NodeConfigMachineType" ||
            key === "NATGKEAddressType" ||
            key === "NATGKENetworkTier" ||
            // key === "DB_Version" ||
            key === "DBTier" ||
            key === "DiskType" ||
            key === "Owner" ||
            key === "Environment" ||
            key === "CostCenter" ||
            key === "Application" ||
            key === "SubscriptionID" ||
            key === "BU" ||
            key === "AvailabilityTime"
          ) {
            inputType = "dropdown";
            finalExport[current].push({
              inputType,
              name: key,
              source:
                key === "Environment"
                  ? [
                      "Sandbox",
                      "Development",
                      "QA",
                      "Production",
                      "Demo",
                      "Lab",
                    ]
                  : key === "AvailabilityTime"
                  ? [
                      "Work Days",
                      "Business Hours - 9 to 6",
                      "24 Hours",
                      " 10 hours - 9 to 9",
                    ]
                  : [],
              value: "",
              description: "",
            });
          } else if (key === "Password") {
            inputType = "password";
            finalExport[current].push({
              inputType,
              name: key,
              value: "",
              description: "",
            });
          } else if (
            key === "cluster_node_count" ||
            key === "min_replicas" ||
            key === "max_replicas" ||
            key === "port" ||
            key === "cloudsql_private_address_prefix_length" ||
            key === "app_server_target_size" ||
            key === "app_server_named_port_number" ||
            key === "web_server_target_size" ||
            key === "web_server_named_port_number"
          ) {
            inputType = "number";
            finalExport[current].push({
              inputType,
              name: key,
              value: 0,
              description: "",
            });
          } else if (
            key === "create_vmware_engine_network" ||
            key === "subnet_private_access" ||
            key === "subnet_flow_logs" ||
            key === "auto_create_subnetworks" ||
            key === "app_subnet_private_access" ||
            key === "app_subnet_enable_log_config" ||
            key === "web_subnet_private_access" ||
            key === "web_subnet_enable_log_config" ||
            key === "cloudsql_instance_deletion_protection" ||
            key === "cloudsql_instance_ipv4_enabled" ||
            key === "web_server_auto_delete" ||
            key === "app_server_auto_delete"
          ) {
            inputType = "radio";
            finalExport[current].push({
              inputType,
              name: key,
              value: true,
              source: ["true", "false"],
              description: "",
            });
          } else {
            inputType = "text";
            finalExport[current].push({
              inputType,
              name: key,
              value:
                key === "VirtualMachineName" ||
                key === "DBInstanceName" ||
                key === "ClusterName" ||
                key === "NetworkName" ||
                key === "SubnetworkName" ||
                key === "RouterName" ||
                key === "NATIPName"
                  ? ""
                  : modifiedStackArray[current][key],
              errordescription: "",

              description: "",
            });
          }
        }
      );
    });
  } else {
    Object.keys(modifiedStackArray).forEach((current: any, index: number) => {
      Object.keys(modifiedStackArray[current]).forEach(
        (key: any, index: number) => {
          finalExport[current].push({
            inputType:
              key === "Password"
                ? "password"
                : key === "Environment" ||
                  key === "Owner" ||
                  key === "CostCenter" ||
                  key === "SubscriptionID" ||
                  key === "BU" ||
                  key === "Application" ||
                  key === "AvailabilityTime"
                ? "dropdown"
                : "text",
            name: key,
            value: modifiedStackArray[current][key],
            description: "",
            source:
              key === "Environment"
                ? ["Sandbox", "Development", "QA", "Production", "Demo", "Lab"]
                : key === "AvailabilityTime"
                ? [
                    "Work Days",
                    "Business Hours - 9 to 6",
                    "24 Hours",
                    " 10 hours - 9 to 9",
                  ]
                : "",
          });
        }
      );
    });
  }
  const handleFormData = (key, currentData) => {
    let tempFormData = { ...formData };
    tempFormData[key] = currentData;
    setFormData(tempFormData);
  };
  const submitData = async () => {
    const apiPostBody = [...formData.stackDetails, ...formData.stackTags];
    let tempApiData: any = {};
    apiPostBody.forEach((curr: any, index: number) => {
      if (curr.name==="server_list"){
        tempApiData[curr.name] = `${curr.value.join(',')}`;
      }
      else{
        tempApiData[curr.name] = curr.value;
      }
  
     
    });

    tempApiData["Cloud"] = param.Cloud;
    tempApiData["Stack_Name"] = param.launchStack;

    let requestBody: any = { data: [{ ...tempApiData }] };
    const allowedEmptyKeys = ["SharedCost","OrganizationId", "SecurityAccountId", "IamRoleStack"];
    const hasEmptyValues = Object.values(tempApiData).some(
      (value, index) =>
        !allowedEmptyKeys.includes(Object.keys(tempApiData)[index]) &&
        value === ""
    );
    const isSharedResourceValid = showSharedResources
      ? !Object.values(tempApiData).includes("")
      : true;
    setShowValidation(true);
    setIsLoading(true);
    if (
      !hasEmptyValues &&
      formData.stackTags.length &&
      (!showSharedResources || isSharedResourceValid)
    ) {
      try {
        const response = await axios.post(
         `${testapi.baseURL}/launch_stacks_post_data/`,
          requestBody
        );
        setIsLoading(false);
        param.launchStack === "BasicLandingZone"
          ? //  || param.launchStack ==="MarklogicDBCluster" || param.launchStack ==="WAMPServer"
            setModalMessage("Stack submitted successfully!!")
          : setModalMessage(
              `${requestBody.data[0].Stack_Name} stack submitted successfully!! <br> Request Number : <span class="text-primary text-bold"> ${response.data.data.result.request_number}</span>`
            );
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setModalMessage(error || "500 Error");
      }
    } else {
      setIsLoading(false);
      setModalMessage("Please fill all the fields");
    }
    setShowModal(true);
  };
  const handleTabChange = (key: any) => {
    setKey(key);
  };
  const handleModalClose = () => setShowModal(false);
  return (
    <div className="launchStack px-3">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-0 fw-bolder fs-6"
      >
        <Tab
          eventKey="stackDetails"
          title="Stack Details"
          className="launchstack-border "
        >
          <Forms
            activeKey={key}
            showValidation={showValidation}
            handleTabChange={handleTabChange}
            submitFormData={submitData}
            handleFormData={handleFormData}
            feilds={finalExport.details}
            col_width={6}
            setModalMessage={setModalMessage}
            setShowModal={setShowModal}
            showSharedResources={showSharedResources}
            setShowSharedResources={setShowSharedResources}
          />
        </Tab>
        <Tab
          eventKey="stackTags"
          title="Stack Tags"
          className="launchstack-border"
        >
          <Forms
            activeKey={key}
            showValidation={showValidation}
            handleTabChange={handleTabChange}
            submitFormData={submitData}
            handleFormData={handleFormData}
            feilds={finalExport.tags}
            col_width={6}
            showSharedResources={showSharedResources}
            setShowSharedResources={setShowSharedResources}
          />
        </Tab>
      </Tabs>
      <Loader isLoading={isLoading} load={props.load} />
      <PopUpModal
        show={showModal}
        modalMessage={modalMessage}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
};
export default DynamicForms;
