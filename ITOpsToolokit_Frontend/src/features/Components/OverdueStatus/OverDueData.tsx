import React from "react";
import { useAppSelector } from "../../../app/hooks";
import Tile from "../Tiles/Tile";
import PatchingTable from "../PatchingStatus/PatchingTable";
import { useSearchParams } from "react-router-dom";
import { selectPatch } from "../PatchingSlice/PatchingSlice";
import moment from "moment";

const OverDueData: React.FC = () => {
  const patchData = useAppSelector(selectPatch);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  let finalExportData = patchData.patchData.filter((item) => {
    const daysDiff = moment.utc().diff(moment(item.PatchEndDate), "days");
    if (category === ">1Month") {
      return daysDiff >= 30;
    } else if (category === "<1Month") {
      return daysDiff < 30 && daysDiff >= 7;
    } else if (category === "<1Week") {
      return daysDiff < 7 && daysDiff >= 1;
    } else if (category === "<1Day") {
      return daysDiff < 1;
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

export default OverDueData;
