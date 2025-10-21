import React from "react";
import Treenode from "./Treenode";

const Tree = (props: any) => {
  return (
    props.treeData && (
      <ul className="ps3 mb-0">
        {props.treeData.map((node: any) => (
          <Treenode
            node={node}
            key={node.key}
          />
        ))}
      </ul>
    )
  );
};

export default Tree;
