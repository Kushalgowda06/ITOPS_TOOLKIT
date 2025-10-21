import React from "react";

const Tile = (props: any) => {
  return <div className="d-flex h-100 bg-white p-2">{props.children}</div>;
};

export default Tile;