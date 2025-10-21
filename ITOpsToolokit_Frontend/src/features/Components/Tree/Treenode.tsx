import React, { useState } from "react";
import Tree from "./Tree";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Treenode = ({ node}) => {
  const { children, label, ownerName, count } = node;
  const [showChildren, setShowChildren] = useState(false);
  const handleClick = () => {
    if (node.children) {
      setShowChildren(!showChildren);
    }
  };
  const icon =
    children && children.length > 0
      ? showChildren
        ? faCaretUp
        : faCaretDown
      : null;
  return (
    <>
      <li
        onClick={handleClick}
        className="d-flex pe-auto justify-content-between border-1 border-start"
      >
        <span className="ps-4 d-inline border-1 border-bottom">
          <span
            className="d-flex align-middle position-relative mb-1 bg-white treeview-p"
          >
            <FontAwesomeIcon icon={icon} className="me-2 mt-1" />
            <p className="position-relative bg-white fw-bold treeview-p cursor-pointer">
              {label}
            </p>
          </span>
        </span>
        <span className="ps-4 d-inline">
          <span
            className="d-flex align-middle position-relative mb-1 bg-white treeview-p cursor-pointer"
          >
            {count}
          </span>
        </span>
        <span className="ps-4 d-inline">
          <p className="text-indigo-500 position-relative bg-white treeview-p cursor-pointer">
            {ownerName}
          </p>
        </span>
      </li>
      <ul className="ps-0 border-start border-1">
        {showChildren && <Tree treeData={children} />}
      </ul>
    </>
  );
};
export default Treenode;
