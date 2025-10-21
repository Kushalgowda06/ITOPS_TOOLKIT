import React from "react";
import Tableedit from "../Table/Tableedit";
import Tile from "../Tiles/Tile";

interface PatchData {
  _id: string;
  GroupName: string;
  Cloud: string;
  OS: string;
  ServerName: string;
  ServerIP: string;
  LastPatch: string;
  LastPatchBy: string;
  NewAvailable: string;
  AvailablePatches: Array<{
    Size: string;
    Title: string;
  }>;
}

interface PatchingTableProps {
  data: PatchData[];
}

const PatchingTable: React.FC<PatchingTableProps> = ({ data }) => {
  console.log("PatchingTable", data)
  return (<>
    <Tableedit customData={data} apiUrl={null} />  
  </>
  );
};

export default PatchingTable;
