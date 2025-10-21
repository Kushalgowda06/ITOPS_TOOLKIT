//created new page to display version data
import React from "react";
import { Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { Loader } from "../../Utilities/Loader";

const VersionPopupData = ({
  selectedData,
  selectedVersion,
  isLoading,
  load,
  handleVersionChange,
  versionData,
}) => {
  return (
    <>
    { isLoading ? <Loader  load={load} isLoading={isLoading} />: null }
    <div className="d-flex justify-content-center">
    <div className="px-3">
      <p className=" text-muted fw-bold mb-0 nav-font">UPGRADE</p>
      <p className="ps-4 text-muted tab">
        You can upgrade your cluster to a newer version of Kubernetes or
        configure automatic upgrade settings. If you upgrade your
        cluster, you can choose whether to upgrade only the control
        plane or to also upgrade all node pools. To upgrade individual
        node pools, go to the 'Node pools' menu item instead.
      </p>
    </div>
  </div>
    <div>
      <div className="ps-4 ">
        {selectedData.map((currele, key) => {
          return (
            <div className="container  tab ps-5">
              <div className="row text-muted ps-5">
                <div className="col-md-6 pb-2">
                  Subscriptions ID:{" "}
                  <Tooltip
                    title={currele.Id}
                    placement="top"
                    arrow={true}
                    followCursor={true}
                    PopperProps={{
                      style: { zIndex: 9999 },
                    }}
                  >
                    <span className=" text-color fw-bold cursor-pointer ps-1">
                      {currele.Id.substring(0, 16)}
                      {currele.Id.length > 10 ? "..." : ""}
                    </span>
                  </Tooltip>
                </div>
                <div className="col-md-6">
                  Name :{" "}
                  <span className="text-color fw-bold">
                    {capitalizeFirstLetter(currele.Name)}
                  </span>{" "}
                </div>
                <div className="w-100"></div>
                <div className="col-md-6 pb-1">
                  Cloud :{" "}
                  <span className="text-color fw-bold">{currele.Cloud}</span>
                </div>
                <div className="col-md-6 ">
                  Location :{" "}
                  <span className="text-color fw-bold">
                    {capitalizeFirstLetter(currele.Location)}
                  </span>
                </div>
                <div className="row align-items-center">
                  <div className="col-md-6 pb-1">
                    {" "}
                    Version:{" "}
                    <span className="text-color fw-bold">
                      {currele.KubernetesVersion}
                      {"  "}
                    </span>
                    {selectedVersion.includes("UPGRADE") ? (
                      ""
                    ) : (
                      <FontAwesomeIcon
                        icon={faAngleDoubleRight}
                        className="arrow-color"
                      />
                    )}
                    {versionData.length > 0 && (
                      <Dropdown className="d-inline-flex ps-3 ">
                        <Dropdown.Toggle
                          id="dropdown-upgrade"
                          className="shadow border-0 text-white"
                          style={{
                            backgroundColor: "#066498",
                          }}
                        >
                          {selectedVersion ? selectedVersion : "UPGRADE"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {versionData.map((item, index) => (
                            <Dropdown.Item
                              key={index}
                              className="border-bottom"
                              onClick={() => handleVersionChange(item)}
                              disabled={currele.KubernetesVersion === item}
                            >
                              {item}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>

                  <div className="col-md-6 ps-4 ">
                    Status:{" "}
                    <span className="text-color fw-bold">
                      {currele.PowerState === "Running" ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="text-success"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="text-danger"
                        />
                      )}{" "}
                      {currele.PowerState}
                    </span>
                  </div>
                </div>
                <div className="w-100"></div>
                <div className="col-md-6">
                  Nodes :{" "}
                  <span className="text-color fw-bold">
                    {currele.NodePoolInfo.length} Nodes
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </> );
};

export default VersionPopupData;
