import React from "react";
import Tableedit from "../Table/Tableedit";
import Tile from "../Tiles/Tile";

const CrStatusData = ({ data }) => {
  if (!data) {
    return <div>No data available</div>;
  }

  return (
 
        <Tableedit customData={data} apiUrl={null} />
  );
};

export default CrStatusData;
