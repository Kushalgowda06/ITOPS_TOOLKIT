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
  const apiUrl = [
    `${testapi.baseURL}/mfa`,
    `${testapi.baseURL}/access_key`,
    `${testapi.baseURL}/ebs_volume_encryption_withouttags`,
    `${testapi.baseURL}/aws_s3_lifecycle_policy`
  ];

  const [customData, setcustomData] = useState<any[]>(
    cloudData.filteredComplainceData
  ); // whole data will store in the data variable only
  const [customFields] = useState<string[]>([]); // to store the keys of the data

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    setcustomData(cloudData.filteredComplainceData);
  }, [cloudData.filteredComplainceData]);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const cloud = searchParams.get("cloud");
  const status = searchParams.get("status");
  const label = searchParams.get("label");

  let filterData: any[] = [];
  // Cost analysis
  if (cloud && status) {
    filterData = customData.filter(
      (item) => item.Cloud === cloud && item.Compliance === status
    );
  } else if (
    status === "InActive" ||
    status === "Active" ||
    status === "NotEncrypted" ||
    status === "Encrypted" ||
    status === "Compliant" ||
    status === "Non-Compliant"
  ) {
    filterData = customData.filter((item) => item.Status === status);
  } else if (status) {
    filterData = customData.filter((item) => item.ResourceType === status && item.Compliance === "Non-Compliant");
  }

  let finalExportData = status === null ? customData.filter((ele:any)=> ele.Compliance === "Non-Compliant") : filterData;

  return (
    <div className="px-1 py-2">
      <Tile>
        {pathname.includes("/complaince-policy") ||
        (pathname.includes("complaince-details") &&
          cloudData.filteredComplainceData.length > 0) ? (
          <Tableedit
            customData={finalExportData}
            customFields={customFields}
            apiUrl={apiUrl}
          />
        ) : (
          navigate({
            pathname: "/complaince-policy",
          })
        )}
      </Tile>
    </div>
  );
};

export default OrphanTable;
