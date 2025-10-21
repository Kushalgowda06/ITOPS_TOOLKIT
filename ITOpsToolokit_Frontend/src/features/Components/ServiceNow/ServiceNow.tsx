import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import ServiceNowData from "./ServiceNowData";
import { Api } from "../../Utilities/api";

const Servicenowwidget = (props) => {
  const [Data, setData] = useState([]);
  const location = useLocation();
  const pathname = location.pathname;
  const data = useAppSelector(selectCommonConfig);
  let dynamicParam: any;
  var url: any;
  if(data.filteredOrphanData.length > 0 || data.filteredTaggingData.length > 0 || data.filteredAdvisoryData.length > 0 || data.filteredComplainceData.length > 0){
  if (pathname.includes("/orphan-objects")) {
    dynamicParam = data?.filteredOrphanData.map(
      (currElem: any) => currElem?.SRTicketNumber
    );
  } else if (pathname.includes("/tagging-policy")) {
    dynamicParam = data?.filteredTaggingData.map(
      (currElem: any) => currElem?.SRTicketNumber
    );
  } else if (pathname.includes("/cloud-advisory")) {
    dynamicParam = data.filteredAdvisoryData.map(
      (currElem: any) => currElem?.SRTicketNumber
    );
  }
  else if (pathname.includes("/complaince-policy")) {
    dynamicParam = data?.filteredComplainceData.map(
      (currElem: any) => currElem?.SRTicketNumber
    );
  }
}

  const filterdynamicParam = dynamicParam?.filter((value) => {
    return !value.includes("NA") && value.trim() !== "";
  });

  const finalArray: string[] = [...new Set(filterdynamicParam as string[])].slice(0, 600);

  const middleurl =
    finalArray.map((element) => element + "%2C").join("") +
    finalArray[finalArray.length - 1];


  if (middleurl !== undefined) {
    url = `https://cisicmpengineering1.service-now.com/api/now/table/sc_request?sysparm_query=numberIN${middleurl}&sysparm_fields=number%2Cstate%2Csys_created_on%2Cassigned_to%2Cdescription%2Cshort_description%2Ccmdb_ci%2Csys_id%2Crequested_for&sysparm_limit=1000`;
  }
  const username = "ServicenowAPI";
  const password = "Qwerty@123";
  useEffect(() => {
    if (middleurl !== undefined) {
      const customData =  () => {
        const options = {
          auth: {
            username: username,
            password: password,
          },
        };

        try {
          Api.getCallOptions(url, options).then((response: any) => {
            setData(response.data.result);
          })
         
        } catch (error) {
          console.error("Error:", error);
        }
      };

      customData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const Items = Data.map((item) => {
    let newstate;
    if (item.state === "1") {
      newstate = "Open";
    } else if (item.state === "2") {
      newstate = "Work in Progress";
    } else if (item.state === "3") {
      newstate = "Close Complete";
    } else if (item.state === "4") {
      newstate = "Close Incomplete";
    } else if (item.state === "7") {
      newstate = "Closed Skipped";
    } else if (item.state === "-5") {
      newstate = "Pending";
    } else if (item.state === "0") {
      newstate = "0";
    } else {
      newstate = "";
    }

    return { ...item, state: newstate };
  });

  return (
    <>
      <ServiceNowData Items={Items} finalArray={finalArray}  />
    </>
  );
};
export default Servicenowwidget;
