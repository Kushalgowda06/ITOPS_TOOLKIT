import React, { useState, useEffect } from "react";
import { KubernetesPopupWrapper } from "../KubernetesPopUp/KubernetesPopupWrapper";
import { useLocation, useNavigate } from "react-router-dom";
import SnakeBarAlert from "../../Utilities/SnakeBarAlert";
import VersionPopupData from "../VersionPopupData/VersionPopupData";
import kubimg from "../../../assets/azure-kubernetes 2.png";
import azureIcon from "../../../assets/azureIcon.png";
import awsIcon from "../../../assets/awsIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";
import NodePopupData from "../NodePopupData/NodePopupData";
import Resize from "../ResizeVmData/Resize";
import WindowData from "../Windows/WindowData"
import IngressEgress from "../IngressEgress/ingressEgress";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { PopUpModal } from "../../Utilities/PopUpModal";
import KubernetesContainerDeployment from "../KubernetesContainerDeployment/KubernetesContainerDeployment";
import { Loader } from "../../Utilities/Loader";
import LinuxData from "../Linux/LinuxData";

const PopupWrapper = (props) => {
  const location = useLocation();
  const pathname = location.pathname;
  const [versionData, setVersionData] = useState<string[]>([""]);
  const [selectedVersion, setSelectedVersion] = useState("UPGRADE");
  const [selectedSize, setSelectedSize] = useState("");
  const [formData, setFormData] = useState([]);

  const [selectedData, setSelectedData] = useState([props.popupData]);
  const [visible, setvisible] = useState(props.openPopup);
  const [showModal, setShowModal] = useState(false);
  const [showMod, setShowMod] = useState(true);
  const [cloudIcon, setCloudIcon] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showStateAlert, setStateAlert] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [showStatusData, setStatusData] = useState<string>("");
  const [RG, setRG] = useState<string>("");
  const [RId, setRId] = useState<string>("");
  const [SubscriptionID, setSubscriptionID] = useState<string>("");
  const [Region, setRegion] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [gatewayvalue, setGatewayValue] = React.useState<string>("");
  const [cidrvalue, setCIDRValue] = React.useState<string>("");
  const [acrListData, setAcrListData] = useState([])
  const [selectedContainerReg, setSelectedContainerReg] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(false)
  const [errorMsg, seterrorMsg] = useState("")

  //  let ports = props.ports;
  let nodeupdate;

  const navigate = useNavigate();

  const handleVersionChange = (version) => {
    setSelectedVersion(version);
    setShowAlert(false);
  };
  const handleChangeContainerReg = (containerReg) => {
    setSelectedContainerReg(containerReg);
    setShowAlert(false);
  };
  const handleSizeChange = (selectedItem) => {
    if (selectedItem.length !== 0) {
      setShowAlert(false);
    }
    setSelectedSize(selectedItem);
  };

  useEffect(() => {
    setvisible(props.openPopup);
    setSelectedData([props?.popupData]);
    if (props?.popupData?.Cloud === "AWS") {
      setCloudIcon(
        <img src={awsIcon} alt="AWS Logo" className="pt-2 cloudPing-size" width={"50px"} />
      );
      setRId(props.popupData.ResourceId);
      setRG("NA");
      setRegion(props.popupData.Region);
      setSubscriptionID("361568250748");
    } else if (props?.popupData?.Cloud === "GCP") {
      setCloudIcon(
        <img src={gcpIcon} alt="GCP Logo" className="pb-1" width={"50px"} />
      );
      setRId(props.popupData.Name);
      setRG("NA");
      setRegion(props.popupData.Zone);
      setSubscriptionID("cis-icmp-engineering-v");
    } else if (props?.popupData?.Cloud === "Azure") {
      setCloudIcon(
        <img src={azureIcon} alt="Azure Logo" className="pb-1" width={"50px"} />
      );
      setRId(props.popupData.Name);
      setRG(props.popupData.ResourceGroup);
      setRegion(props.popupData.Region);
      setSubscriptionID("aab65732-30e7-48a6-93c9-1acc5c8e4413");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.popupData, props]);

  const regex = /\/resourcegroups\/([^\/]+)\/providers/;
  const regex1 = /\/subscriptions\/(.*?)\/resourcegroups/; //test

  const match = props?.popupData?.Id?.match(regex);
  const match1 = props?.popupData?.Id?.match(regex1); // test
  const resourceGroupName = props?.popupData?.Name;

  var url;
  if (match && resourceGroupName) {
    url = `https://cluster-list.azurewebsites.net/api/Upgrade_versionList?resourceGroupName=${match[1]}&resourceName=${resourceGroupName}&code=ciNUbLi0CjTPVQQVYEUdQgBe6S0b-gvbw7r0LVz_mSlmAzFuTSisFg==`;
  }
  // to get the list of versions
  useEffect(() => {
    if (
      resourceGroupName !== undefined &&
      (pathname.includes("version-upgrade") ||
      pathname.includes("container-deployment"))
    ) {
      const customData = () => {
        try {
          Api.getCall(url).then((response: any) => {
            setVersionData(response?.data?.data?.AvailableUpgradeVersions);
          });
          Api.getCall(testapi.acrList).then((response: any) => {
         
            setAcrListData(response?.data?.data);
          });
        } catch (error) {}
      };

      customData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // to post the response for version upgrade.
  const handleUpdatedData = () => {
    try {
      setIsLoading(true)
      if (selectedVersion !== "UPGRADE") {
        Api.postData(testapi.versionupgrade, {
          data: [
            {
              ClusterName: props.popupData.Name,
              VersionToBeUpgraded: selectedVersion,
              Cloud: props.popupData.Cloud,
              SubscriptionID: SubscriptionID,
            },
          ],
        })
        .then((data: any) => {
          setTicketId(data?.data.data.result.number);
          if (data?.status === 200) {
            setIsLoading(false)
            setShowModal(true);
          }
        }).catch((error)=>{
          if (error.code === "ERR_NETWORK") {
            setIsLoading(false)
            setErrMsg(true);
            seterrorMsg( "Internal Server Error")
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // add node
  // Assuming this code is inside your functional component
  if (formData.length !== 0) {
    nodeupdate = formData?.map((node: any) => ({
      ...node,
      ClusterName: props.popupData.Name,
      KubernetesVersion: props.popupData.KubernetesVersion,
      Cloud: "Azure",
      SubscriptionID: "aab65732-30e7-48a6-93c9-1acc5c8e4413",
    }));
  }
  const handleAddNodeData = () => {
    if (selectedData) {
      try {
        Api.postData(testapi.addnode, {
          data: nodeupdate,
        })
        .then((data: any) => {
          setTicketId(data?.data.data.result.number);
          if (data?.status === 200) {
            setShowModal(true);
          }
        })
      } catch (error) {
        console.error(error);
      }
    }
  };

  // to post resize data  for Azure
  const ResizeData = () => {
    if (pathname.includes("Resize-vm") && selectedSize) {
      setIsLoading(true)
      try {
        Api.postData(testapi.resizevm, {
          data: [
            {
              ResourceID: RId,
              ResourceGroup: RG,
              Region: Region,
              NewSize: selectedSize,
              OperationName: "Resize",
              Cloud: props?.popupData?.Cloud,
              SubscriptionID: SubscriptionID,
            },
          ],
        }).then((data: any) => {
          setTicketId(data?.data.data.result.number);
          if (data?.status === 200) {
            setIsLoading(false)
            setShowModal(true);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };
  //ingress
  const handleIngressData = () => {
    if (gatewayvalue) {
      try {
        Api.postData(testapi.addingress, {
          data: [
            {
              ResourceGroup: match[1],
              ClusterName: props?.popupData?.Name,
              IngressPortRule: port,
              ApplicationGateway: gatewayvalue,
              Cloud: props?.popupData?.Cloud,
              SubscriptionID: match1[1],
            },
          ],
        }).then((data: any) => {
          setTicketId(data?.data.data.result.number);
          if (data?.status === 200) {
            setShowModal(true);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };
  //egress
  const handleEgressData = () => {
    if (cidrvalue) {
      try {
        Api.postData(testapi.addegress, {
          data: [
            {
              ResourceGroup: match[1],
              ClusterName: props?.popupData?.Name,
              CIDR: cidrvalue,
              EgressPort: port,
              Cloud: props?.popupData?.Cloud,
              SubscriptionID: match1[1],
            },
          ],
        }).then((data: any) => {
          setTicketId(data?.data.data.result.number);
          if (data?.status === 200) {
            setShowModal(true);
          }
        });
      } catch (error) {
        console.error(error);
       }
    }
  };
  // container deployment
  const handleContainerDeployment = () => {
    if(selectedContainerReg){
      setIsLoading(true)
      try {
        Api.postData(testapi.containerDeployment, {
          data: [
            {
              "ResourceGroup": match[1],
              "ClusterName": props.popupData.Name,
              "ContainerRegistry": selectedContainerReg,
              "Cloud": "Azure",
              "SubscriptionID": match1[1]
            }
          ],
        }).then((data: any) => {
          setTicketId(data?.data.data.result.number);
          if (data?.status === 200) {
            setIsLoading(false)
            setShowModal(true);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // added validation for version popup
  const handleSave = async () => {
    if (pathname.includes("version-upgrade")) {
      handleUpdatedData();
      if (selectedVersion === "UPGRADE") {
        setShowAlert(true);
        setShowMod(true); // added validation for version popup
        return; // Prevent further execution
      }
    }
    if (pathname.includes("container-deployment")) {
      if(!selectedContainerReg){
        setShowAlert(true);
        setShowMod(true); // added validation for version popup
        return;
      }else{
        handleContainerDeployment();
      }
    }
    if (pathname.includes("ingress-egress")) {
      if (cidrvalue.length > 0) {
        handleEgressData();
        if (!cidrvalue || !port) {
          setShowAlert(true); // added validation for version popup
          return; // Prevent further execution
        }
      } else {
        handleIngressData();
        if (!gatewayvalue || !port) {
          setShowAlert(true); // added validation for version popup
          return; // Prevent further execution
        }
      }

      setShowAlert(false);
      setShowMod(true);
      setGatewayValue("");
      setCIDRValue("");
      setPort("");
    }
    if (pathname.includes("node-manager")) {
      handleAddNodeData();
      setFormData([]);
    }
    if (pathname.includes("Resize-vm")) {
      ResizeData();
      if (selectedSize.length === 0) {
        setShowAlert(true); // added validation for resize popup
        return; // Prevent further execution
      }
    }

    // setvisible(false);
    setSelectedVersion("UPGRADE");
    setSelectedSize("");
  }
   

  const handleClose = () => {
    setvisible(false);
    props.onClose();
    setSelectedVersion("UPGRADE");
    setSelectedSize("");
    setShowAlert(false);
    setStateAlert(false);
    setFormData([]);
    setPort("");
    setGatewayValue("");
  };

  const onModalClose = () => {
    // Api.setPopUpData(false)
    setShowModal(false);
      setTimeout(() => {
        navigate({
          pathname: "/Cloud-operations",
        });
      }, 900);
  
  };

  // passing image as a prop
  const imageTag = (
    <img
      src={kubimg}
      className="pe-5 position-absolute margin_right end-0"
      width={"100px"}
      alt="Azure"
    />
  );
  //passing cloud icon as prop

  return (
    <div>
      {visible ? (
        <KubernetesPopupWrapper
          title={props.popupData.Name || props.popupData.os }
          errMsg={errMsg}
          setvisible={setvisible}
          setErrMsg={setErrMsg}
          handleSave={handleSave}
          errorMsg={errorMsg}
          handleClose={handleClose}
          showMod={showMod}
          setShowMod={setShowMod}
          ticketId={ticketId}
          cloudIcon={cloudIcon}
          height={'450px'}
          width={'1050px'}
          cancelpadding= {""}
          savepadding={""}
          imageTag={
            pathname.includes("Vm-status-manager") ||
            pathname.includes("Resize-vm")
              ? null
              : imageTag
          }
          showAlert={showAlert}
          showStateAlert={showStateAlert}
          showStatusData={showStatusData}
        >
          {pathname.includes("Vm-status-manager") ||
          pathname.includes("Resize-vm") ? (
            <Resize
              selectedData={selectedData}
              load={props.load}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              pathname={pathname}
              cloud={props.popupData.Cloud}
              handleSizeChange={handleSizeChange}
              handleClose={handleClose}
              setStateAlert={setStateAlert}
              showMod={showMod}
              setShowMod={setShowMod}
              setTicketId={setTicketId}
              setStatusData={setStatusData}
              navigate={navigate}
            />
          ) : pathname.includes("node-manager") ? (
            <NodePopupData
              selectedData={selectedData}
              handleClose={handleClose}
              setFormData={setFormData}
              match={match}
              resourceGroupName={resourceGroupName}
            />
          ) : pathname.includes("ingress-egress") ? (
            <IngressEgress
              selectedData={selectedData}
              port={port}
              setPort={setPort}
              gatewayvalue={gatewayvalue}
              setGatewayValue={setGatewayValue}
              cidrvalue={cidrvalue}
              setCIDRValue={setCIDRValue}
              handleClose={handleClose}
              getport={props.ports}
            />
          ) : pathname.includes("container-deployment") ? (
            <KubernetesContainerDeployment
              isLoading={isLoading}
              load={props.load}
              selectedData={selectedData}
              selectedContainerReg={selectedContainerReg}
              handleChangeContainerReg={handleChangeContainerReg}
              acrListData={acrListData}
            />
          ) : pathname.includes("Windows") ? (
            <WindowData
            selectedData={selectedData}
            />
          ) : pathname.includes("Linux") ? (
            <LinuxData
            selectedData={selectedData}
            />
          ) : (
            <VersionPopupData
              selectedData={selectedData}
              load={props.load}
              selectedVersion={selectedVersion}
              isLoading={isLoading}
              handleVersionChange={handleVersionChange}
              versionData={versionData}
            />
          )}
        </KubernetesPopupWrapper>
      ) : null}

      <PopUpModal
        show={showModal}
        modalMessage= {`Request has been submitted successfully <br> Request Number : <span class="text-primary"> ${ticketId}</span> `}
        onHide={onModalClose}
      />
    </div>
  );
};

export default PopupWrapper;
