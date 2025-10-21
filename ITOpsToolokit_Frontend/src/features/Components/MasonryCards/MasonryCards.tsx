import React, { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { CloudState, selectCloud } from "../Cloudtoggle/CloudToggleSlice";
import { VscFilter } from "react-icons/vsc";
import { filterData } from "../../Utilities/filterData";
import { wrapIcon } from "../../Utilities/WrapIcons";

interface AdvisoryData {
  id: number;
  AdvisoryStatus: string;
  Cloud: string;
  AdvisoryName: string;
  Description: string;
  EstimatedMonthlySavings: number | "NA" | null;
}

const MasonryCards: React.FC = () => {
  const VscFilterIcon = wrapIcon(VscFilter);

  const [filterStatus, setFilterStatus] = useState<string>("");
  const advisoryData = useAppSelector(selectCommonConfig);
  const navigate = useNavigate();
  const menuListCapabilities =
    advisoryData.loginDetails.capabilities.Dashboard[0];
  const [reRender, setRerender] = useState<boolean>(false);
  const [showDropdowns, setShowDropdowns] = useState(false); // New state to control dropdown visibility
  const currentCloud: CloudState = useAppSelector(selectCloud);
  const [activeCloud, setActiveCloud] = useState<string[]>(
    currentCloud.currentCloud
  );

  const handleFilter = (status: string) => {
    setFilterStatus(status);
  };

  const toggleDropdowns = () => {
    setShowDropdowns(!showDropdowns);
  };

  const filteredCloudData = advisoryData.filteredAdvisoryData.filter((item) => {
    const isCloud = !activeCloud.length || activeCloud.includes(item.Cloud);
    return isCloud;
  });

  const filteredData = filteredCloudData.filter((curr: AdvisoryData) => {
    if (filterStatus === "") {
      return true;
    } else {
      return curr.AdvisoryStatus === filterStatus;
    }
  });

  const test = filterData("AdvisoryID", filteredData);

  const firstObjects = Object.values(test).map(([firstObject]) => firstObject);

  const hasData = filteredData.length > 0;

  const handlActiveCloudChange = (cloud: string) => {
    let tempActiveCLoud = [...activeCloud];
    if (activeCloud.includes(cloud) && activeCloud.length) {
      tempActiveCLoud.splice(activeCloud.indexOf(cloud), 1);
    } else {
      tempActiveCLoud = [...activeCloud, cloud];
    }
    tempActiveCLoud.length < 1
      ? setActiveCloud([...activeCloud])
      : setActiveCloud(tempActiveCLoud);
  };

  useEffect(() => {
    setActiveCloud(currentCloud.currentCloud);
  }, [currentCloud]);

  useEffect(() => {
    setRerender(!reRender);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCloud]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        {/* <div className="d-flex align-items-center"> */}
        <button
          type="button"
          className="btn btn-outline-primary rounded-0 btn-sm mx-1 stack_btn_width"
        >
          {menuListCapabilities.Advisory &&
            menuListCapabilities.Advisory.includes("Add") && (
              <Link
                className="nav-link active pe-auto fw-bold"
                aria-current="page"
                to="/add-advisory"
              >
                Add New Advisory
              </Link>
            )}
        </button>
        <button
          type="button"
          className="btn btn-outline-primary rounded-0 btn-sm mx-1 stack_btn_width"
        >
          {menuListCapabilities.Advisory &&
            menuListCapabilities.Advisory.includes("Add") && (
              <Link
                className="nav-link active pe-auto fw-bold"
                aria-current="page"
                to="/kanban-board"
              >
                Kanban Board
              </Link>
            )}
        </button>
        {/* </div> */}

        {showDropdowns && (
          <span className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-outline-primary rounded-0 btn-sm mx-1"
              onClick={() => handleFilter("")}
            >
              All
            </button>
            <button
              type="button"
              className="btn btn-outline-info rounded-0 btn-sm mx-1"
              onClick={() => handleFilter("New")}
            >
              New
            </button>
            <button
              type="button"
              className="btn btn-outline-success rounded-0 btn-sm mx-1"
              onClick={() => handleFilter("Review")}
            >
              Review
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary rounded-0 btn-sm mx-1"
              onClick={() => handleFilter("Approved")}
            >
              Approved
            </button>
            <Dropdown autoClose="outside">
              <Dropdown.Toggle
                className="bg-transparent text-primary border-0"
                id="dropdown-basic"
                style={{ width: "136px" }}
              >
                <span className="text-primary fw-bold">
                  {activeCloud.map((cloud: any, index: any) => {
                    if (cloud !== "All") {
                      return (
                        <span className="px-1">
                          <img
                            className="Masonrycloud-icon"
                            alt="cloud-icon"
                            src={`${cloud.toLowerCase()}Icon.png`}
                          />
                        </span>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ marginLeft: "-50px" }}>
                {/* <Form> */}
                <Dropdown.Item className="px-1">
                  <div className="d-flex justify-content-around">
                    <div className="form-check">
                      <input
                        onChange={() => handlActiveCloudChange("AWS")}
                        checked={activeCloud.includes("AWS")}
                        className="form-check-input"
                        type="checkbox"
                        id="awsCheck"
                        value="AWS"
                      />
                      <label className="form-check-label" htmlFor="awsCheck">
                        <img
                          alt="AWS"
                          className="Masonrycloud-icon"
                          src="awsIcon.png"
                        />
                      </label>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div className="d-flex justify-content-around">
                    <div className="form-check">
                      <input
                        onChange={() => handlActiveCloudChange("Azure")}
                        checked={activeCloud.includes("Azure")}
                        className="form-check-input"
                        type="checkbox"
                        id="azurecheck"
                        value="Azure"
                      />
                      <label className="form-check-label" htmlFor="azurecheck">
                        <img
                          alt="Azure"
                          className="Masonrycloud-icon"
                          src="azureIcon.png"
                        />
                      </label>
                    </div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <div className="d-flex justify-content-around">
                    <div className="form-check">
                      <input
                        onChange={() => handlActiveCloudChange("GCP")}
                        checked={activeCloud.includes("GCP")}
                        className="form-check-input"
                        type="checkbox"
                        id="gcpCheck"
                        value="GCP"
                      />
                      <label className="form-check-label" htmlFor="gcpCheck">
                        <img
                          alt="GCP"
                          className="cloud-icon"
                          src="gcpIcon.png"
                        />
                      </label>
                    </div>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </span>
        )}
        <VscFilterIcon
          className="vc_fil text-primary cursor-pointer"
          onClick={toggleDropdowns} // Toggle dropdowns on click
        />
      </div>

      {hasData ? (
        <div
          className="card-container d-flex flex-wrap overflow-auto masonry_cards_height"
        // style={{ height: "690px" }}
        >
          {firstObjects.map((curr: AdvisoryData, index: number) => {
            let circleColor = "";
            if (curr.Cloud === "AWS") {
              circleColor = "bg-orange";
            } else if (curr.Cloud === "GCP") {
              circleColor = "bg-green";
            } else if (curr.Cloud === "Azure") {
              circleColor = "bg-blue";
            }
            return (
              <div
                key={curr.id}
                className="col-lg-3 col-sm-4"
                data-masonry='{"percentPosition": true }'
                onClick={(event) => {
                  const clickedLabel = curr.AdvisoryName;
                  navigate({
                    pathname: "/advisory-details",
                    search: `?status=${clickedLabel}`,
                  });
                }}
              >
                <div className="px-2 py-2">
                  <div className="card rounded-0 card-sh px-1 cursor-pointer">
                    <div className="card-body p-2">
                      <div className="f-size fw-bold">
                        <span className={`circle ${circleColor}`}></span>
                        {curr.AdvisoryName}
                      </div>
                      <div className="card-size ">
                        <Tooltip
                          title={curr.Description}
                          placement="top"
                          arrow={true}
                          followCursor={true}
                        >
                          <span className="d-inline-block cursor-pointer py-1">
                            {curr.Description.substring(0, 100)}
                            {curr.Description.length > 12 ? "..." : ""}
                          </span>
                        </Tooltip>
                      </div>
                      <div className="fw-bolder fs-6">
                        $
                        {curr.EstimatedMonthlySavings === "NA" || null
                          ? 0
                          : (
                            Math.floor(curr.EstimatedMonthlySavings * 100) /
                            100
                          ).toFixed(2)}
                        <p className="card-size text-muted">Monthly Savings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center pt-5 mt-5">
          <p className="alert alert-primary px-5 ">No Data Found!!!</p>
        </div>
      )}
    </>
  );
};
export default MasonryCards;