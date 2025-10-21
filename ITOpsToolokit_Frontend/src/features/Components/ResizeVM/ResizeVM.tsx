import React, {useEffect } from "react";
import VmDeatilsWrapperCard from "../CloudOperationsPage/VmDeatilsWrapperCard";
import { useLocation } from "react-router-dom";
import { faComputer, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import ResizeVMIcon from "../../../assets/ResizeVM.png";
import VMStatusManagemer from "../../../assets/VMStatusManagemer.png";
import testjson from "../../../api/testapi.json"
import { Api } from "../../Utilities/api";
import { useAppSelector,useAppDispatch } from "../../../app/hooks";
import { selectCommonConfig, setAllVmData, setAwsVmData, setAzureVmData, setGcpVmData} from '../CommonConfig/commonConfigSlice'


export const ResizeVM = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;

  var data = [];

  if (cloudData.awsVmData) {
    data = [...cloudData.awsVmData];
  }
  if (cloudData.azureVmData) {
    data = [...data, ...cloudData.azureVmData];
  }
  if (cloudData.gcpVmData) {
    data = [...data, ...cloudData.gcpVmData];
  }

  useEffect(() => {
    if(data){
      dispatch(setAllVmData(data))
    }else{
      try {
        Api.getCall(testjson.awsvmdetails).then((response: any) => {
          // setAwsVmDetailsData(response?.data)
          dispatch(setAwsVmData(response?.data))
          });
        Api.getCall(testjson.azurevmdetail).then((response: any) => {
          dispatch(setAzureVmData(response?.data?.data))
          });
        Api.getCall(testjson.gcpvmdetail).then((response: any) => {
          dispatch(setGcpVmData(response?.data))
          });
      } catch (error) {
        console.error(error)
      }
    }
  },[])

return (
    <>
      {pathname.includes("Resize-vm") ? (
        <VmDeatilsWrapperCard
          title="Resize VM"
          data={data}
          icon={faComputer}
          logo={ResizeVMIcon}
          styles={{
            filter: "drop-shadow(2px 1px 2px black)",
            width: "46px",
            height: "40px",
          }}
        />
      ) : (
        <VmDeatilsWrapperCard
          title="VM Status manager"
          data={data}
          logo={VMStatusManagemer}
          icon={faPowerOff}
          styles={{
            filter: "drop-shadow(2px 1px 2px black)",
            width: "46px",
            height: "40px",
          }}
        />
      )}
    </>
  );
  
  
};
