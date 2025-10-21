import React, { useState, useEffect } from "react";
import Tableedit from "../Table/Tableedit";
import { useSearchParams } from "react-router-dom";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { useAppSelector } from "../../../app/hooks";
import Tile from "../Tiles/Tile";
import { useNavigate, useLocation } from "react-router-dom";
import testapi from '../../../api/testapi.json'


const OrphanTable = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  const apiUrl =
    `${testapi.baseURL}/orphan`

  const [customData, setcustomData] = useState<any[]>(cloudData.filteredOrphanData); // whole data will store in the data variable only
  const [customFields] = useState<string[]>([]); // to store the keys of the data

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    setcustomData(cloudData.filteredOrphanData);
  }, [cloudData.filteredOrphanData]);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const cloud = searchParams.get("cloud");
  const status = searchParams.get("status");

  let filterData: any[] = [];

  if (cloud && status) {
    filterData = customData.filter(
      (item) => item.Cloud === cloud && item.ResourceStatus === status
    );
  } else if (
    status === "Orphaned" ||
    status === "Deleted" ||
    status === "Rejected" ||
    status === "UnOrphaned"
  ) {
    filterData = customData.filter(
      (item) => item.ResourceType === status || item.ResourceStatus === status
    );
  } else if (status) {
    filterData = customData.filter(
      (item) =>
        item.ResourceType === status && item.ResourceStatus === "Orphaned"
    );
  }

  let finalExportData =
    status === null
      ? customData.filter(
        (resource: any) => resource.ResourceStatus === "Orphaned"
      )
      : filterData;

  return (
    <div className="px-1 py-2">
      <Tile>
        {pathname.includes("/orphan-objects") ||
          (pathname.includes("orphan-details") &&
            cloudData.filteredOrphanData.length > 0) ? (
          <Tableedit
            customData={finalExportData}
            customFields={customFields}
            apiUrl={apiUrl}
          />
        ) : (
          navigate({
            pathname: "/orphan-objects",
          })
        )}
      </Tile>
    </div>
  );
};

export default OrphanTable;
