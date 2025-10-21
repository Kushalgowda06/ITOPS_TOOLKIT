import React from "react";
import { useAppSelector } from "../../../app/hooks";
import Tile from "../Tiles/Tile";
import PatchingTable from "../PatchingStatus/PatchingTable";
import { useLocation, useSearchParams } from "react-router-dom";
import { selectPatch } from "../PatchingSlice/PatchingSlice";

const PatchDetails: React.FC = () => {
  const patchData = useAppSelector(selectPatch);
  const location = useLocation();
  
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const checkNullValues = (element: any) => {
    return element === null || element === "Null";
  };

  let finalExportData = patchData.patchData.filter((item) => {
    if (status === "patched") {
      return item.AvailablePatches.length === 0;
    } else if (status === "Unpatched") {
      return item.AvailablePatches.length > 0;
    }
    return true;
  });

  return (
    <div className="px-1 py-2">
      <Tile>
        <PatchingTable data={finalExportData} />
      </Tile>
    </div>
  );
};

export default PatchDetails;
