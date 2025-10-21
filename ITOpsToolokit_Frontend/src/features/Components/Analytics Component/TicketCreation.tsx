import { useState } from "react";
import { Api } from "../../Utilities/api";
import { PopUpModal } from "../../Utilities/PopUpModal";
import { setTicketDetailsData } from "../CommonConfig/commonConfigSlice";

const TicketCreation = async ({
  data,
  title,
  setModalMessage,
  setShowModal,
  setIsLoading,
  dispatch,
}) => {
  console.log(data, title, "ticket");
  // console.log(data?.hasOwnProperty("status"),"check")
  let url = "";
  let postbody = {};

  if (data?.hasOwnProperty("permissions")) {
    url = `http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/unix_file_permission_analysis_cr_creation/`;
    postbody = {
      path: `${data?.path}`,
      server_name: `${data?.server_name}`,
      permissions: `${data?.permissions}`,
      corrective_action: `${data?.corrective_action}`,
    };
  } else if (data?.hasOwnProperty("Errors")) {
    url =
      "http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/log_analysis_error_detection_cr_creation/";
    postbody = {
      JVMName: `${data?.JVMName}`,
      HostName: `${data?.HostName}`,
      IPAddress: ` ${data?.IPAddress}`,
      ErrorType: `${data?.ErrorType}`,
      Occurrences: `${data?.Occurrences}`,
      AIRecommendedAction: `${data?.AIRecommendedAction}`,
    };
  } else if (data?.hasOwnProperty("status")) {
    console.log("testing ticket creation");
    url = `http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/database_configuration_compliance_cr_creation/`;
    postbody = {
      server_name: `${data?.server_name}`,
      current_setting: `${data?.current_setting}`,
      expected_setting: `${data?.expected_setting}`,
      example_sql_command: `${data?.example_sql_command}`,
    };
  }
  try {
    setIsLoading(true);
    const response = await customData(url, postbody);
    console.log(response, "Ticket Resposne");
    setModalMessage(`${response?.TicketNumber}  Created Successfully`);
    setShowModal(true);
  } catch (error) {
    console.error("Unhandled Error:", error);
    setModalMessage("Unexpected error occurred");
    setShowModal(true);
  } finally {
    setIsLoading(false); // Hide loader
  }
};

export default TicketCreation;

const customData = async (url, postbody) => {
  try {
    const response = await Api.postCall(url, postbody);
    console.log(response.data, "/testing resosne");
    return response?.data?.data;
  } catch (error) {
    console.error("Error:", error);
    return "API Error";
  }
};
