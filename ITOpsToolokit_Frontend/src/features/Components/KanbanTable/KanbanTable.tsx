import React, { useState, useEffect } from "react";
import Tableedit from "../Table/Tableedit";
import Tile from "../Tiles/Tile";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import testapi from '../../../api/testapi.json'

   const KanbanTable = ({  advisoryName }) => {
  const advisoryData = useAppSelector(selectCommonConfig);
  const [customFields] = useState<string[]>([]); // to store the keys of the data

  const [customData, setCustomData] = useState<any[]>([]); // whole data will store in the data variable only
  useEffect(() => {
    const fetchData = async () => {
      const filteredResources = pathname.includes("advisory-details")
      ? advisoryData.filteredAdvisoryData
      : advisoryData.filteredAdvisoryData.filter(
          (resource: any) => resource.Status !== "Completed"
        );
    setCustomData([...filteredResources]);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advisoryData.filteredAdvisoryData]);
  // onClick functionality
  const location = useLocation();
  const pathname = location.pathname;

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
 
  const cloud = searchParams.get("cloud");
  const status = advisoryName

  console.log("cloud",cloud)
  let filterData: any[] = [];

  // add advisory cloud filter for New, Review data
  if (cloud && status) {
    if (status.includes("New")) {
      filterData = customData.filter(
        (item) =>
          item.Cloud === cloud &&
          (item.Status === "Review" || item.Status === "New")
      );
    }
    // add advisory cloud filter for Completed, Approved data
    else if (status.includes("Completed")) {
      filterData = customData.filter(
        (item) =>
          item.Cloud === cloud &&
          (item.Status === "Completed" || item.Status === "Approved")
      );
    } else {
      filterData = customData.filter(
        (item) => item.Cloud === cloud && item.Status === status
      );
    }
  } else if (status) {
    filterData = customData.filter(
      (item) =>
        item.AdvisoryName === status ||
        item.ResourceName === status ||
        item.Status === status
    );
  }

  let finalExportData = status === null ? customData : filterData;
  console.log("filterData",customData,filterData)
  return (
    <div className="px-1 py-2">
      <Tile>
   {pathname.includes("/kanban-board") &&
          <Tableedit
            customData={finalExportData}
            customFields={customFields}
            apiUrl={`${testapi.baseURL}/advisory`}
          />
        
        }
      </Tile>
    </div>
  );
};

export default KanbanTable;
