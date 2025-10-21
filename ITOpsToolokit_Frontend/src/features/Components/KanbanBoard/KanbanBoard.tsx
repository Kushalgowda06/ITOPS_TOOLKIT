import React, { useState, useEffect } from "react";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { Link } from "react-router-dom";
import PopupWrapper from "../KubernetePopupWrapper/PopupWrapper";
import { Dropdown } from "react-bootstrap";
import { CloudState, selectCloud } from "../Cloudtoggle/CloudToggleSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { KanbanPopup } from "../KanbanPopup/KanbanPopup";
import {
  faMagnifyingGlass,
  faCircleCheck,
  faLocationDot,
  faArrowUp,
  faArrowDown,
  faCircleXmark,
  faFilter,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface AdvisoryData {
  id: number;
  AdvisoryStatus: string;
  Status: string;
  Cloud: string;
  Region: string;
  AdvisoryName: string;
  Description: string;
  EstimatedMonthlySavings: number | "NA" | null;
}

const KanbanBoard = () => {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const advisoryData = useAppSelector(selectCommonConfig);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupData, setPopupData] = useState();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const menuListCapabilities =
    advisoryData.loginDetails.capabilities.Dashboard[0];
  const [reRender, setRerender] = useState<boolean>(false);
  const [showDropdowns, setShowDropdowns] = useState(false); // New state to control dropdown visibility
  const currentCloud: CloudState = useAppSelector(selectCloud);
  const [advisoryName, setAdvisoryName] = useState("");
  const [activeCloud, setActiveCloud] = useState<string[]>(
    currentCloud.currentCloud
  );

  const onModalClose = () => {
    setShowModal(false);
  };

  const handleCardClick = (Advisory) => {
    setAdvisoryName(Advisory);
    // setPopupData(filteredData[index]);
    setShowModal(true);
  };

  const filteredCloudData = advisoryData.filteredAdvisoryData.filter((item) => {
    const isCloud = !activeCloud.length || activeCloud.includes(item.Cloud);
    console.log("isCloud", isCloud);
    return isCloud;
  });

  const filteredNew = filteredCloudData.filter((item) => item.Status === "New");
  const filteredReview = filteredCloudData.filter(
    (item) => item.Status === "Riview"
  );
  const filteredApproved = filteredCloudData.filter(
    (item) => item.Status === "Approved"
  );
  const filteredDeferred = filteredCloudData.filter(
    (item) => item.Status === "Deferred"
  );
  const filteredDropped = filteredCloudData.filter(
    (item) => item.Status === "Dropped"
  );
  const filteredCompleted = filteredCloudData.filter(
    (item) => item.Status === "Completed"
  );
  const [newSortData, setNewSortData] = useState(filteredNew);
  const [reviewSortData, setReviewSortData] = useState(filteredReview);
  const [approvedSortData, setApprovedSortData] = useState(filteredApproved);
  const [deferredSortData, setDeferredSortData] = useState(filteredDeferred);
  const [droppedSortData, setDroppedSortData] = useState(filteredDropped);
  const [completedSortData, setCompletedSortData] = useState(filteredCompleted);
  const [arrow1,setArrow1] = useState(false)
  const [arrow2,setArrow2] = useState(false)
  const [arrow3,setArrow3] = useState(false)
  const [arrow4,setArrow4] = useState(false)
  const [arrow5,setArrow5] = useState(false)
  const [arrow6,setArrow6] = useState(false)


  const [sortDirection, setSortDirection] = useState("asc"); // sort direction

  const handleSort = (field, direction) => {
    let dataset;
    if (field === "New") {
      setArrow1(!arrow1)
      dataset = newSortData;
    } else if (field === "Review") {
      setArrow2(!arrow2)
      dataset = reviewSortData;
    } else if (field === "Approved") {
      setArrow3(!arrow3)
      dataset = approvedSortData;
    } else if (field === "Deferred") {
      setArrow4(!arrow4)
      dataset = deferredSortData;
    } else if (field === "Dropped") {
      setArrow5(!arrow5)
      dataset = droppedSortData;
    } else if (field === "Completed") {
      setArrow6(!arrow6)
      dataset = completedSortData;
    }
    // const dataMap = {
    //   New: newSortData,
    //   Review: reviewSortData,
    //   Approved: approvedSortData,
    //   Deferred: deferredSortData,
    //   Dropped: droppedSortData,
    //   Completed: completedSortData,
    // };
    
    // const dataset = dataMap[field];

    const sortedData = [...dataset].sort((a, b) => {
      if (a.AdvisoryName < b.AdvisoryName) return direction === "asc" ? -1 : 1;
      if (a.AdvisoryName > b.AdvisoryName) return direction === "asc" ? 1 : -1;
      return 0;
    });

    if (field === "New") {
      setNewSortData(sortedData);
    } else if (field === "Review") {
      setReviewSortData(sortedData);
    } else if (field === "Approved") {
      setApprovedSortData(sortedData);
    } else if (field === "Deferred") {
      setDeferredSortData(sortedData);
    } else if (field === "Dropped") {
      setDroppedSortData(sortedData);
    } else if (field === "Completed") {
      setCompletedSortData(sortedData);
    } 
    setSortDirection(direction);
  };




  const filteredData = filteredCloudData.filter((curr: AdvisoryData) => {
    if (filterStatus === "") {
      return true;
    } else {
      return curr.AdvisoryStatus === filterStatus;
    }
  });


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

  // console.log("filteredData", filteredData[0]?.Status);

  return (
    <>
      <div className=" h-100 bg-white p-1 mx-2 my-2">
        <div className="p-2">
          <div className="d-flex align-items-center ">
            <h4 className=" p-2 ps-3 fw-bold k8title"> Kanban-Board </h4>
          </div>
          <div className="d-flex justify-content-center sha">
            <div className="col-2 text-center fw-bold ">
              <p className=" shadowww mb-1 kanban ">
                New{" "}
                <FontAwesomeIcon
                  className="cursor-pointer"
                  onClick={() =>
                    handleSort("New", sortDirection === "asc" ? "desc" : "asc")
                  }
                  icon={arrow1 ? faArrowDown : faArrowUp}
                />
              </p>
            </div>
            <div className="col-2 text-center fw-bold ">
              <p className=" shadowww mb-1 kanban ">
                Review{" "}
                <FontAwesomeIcon
                className="cursor-pointer"
                  onClick={() =>
                    handleSort(
                      "Review",
                      sortDirection === "asc" ? "desc" : "asc"
                    )
                  }
                  icon={arrow2 ? faArrowDown : faArrowUp}
                />{" "}
              </p>
            </div>
            <div className="col-2 text-center fw-bold ">
              <p className=" shadowww mb-1 kanban ">
                Approved{" "}
                <FontAwesomeIcon
                className="cursor-pointer"
                  onClick={() =>
                    handleSort(
                      "Approved",
                      sortDirection === "asc" ? "desc" : "asc"
                    )
                  }
                  icon={arrow3 ? faArrowDown : faArrowUp}
                />
              </p>
            </div>
            <div className="col-2 text-center fw-bold ">
              <p className=" shadowww mb-1 kanban ">
                Deferred{" "}
                <FontAwesomeIcon
                className="cursor-pointer"
                  onClick={() =>
                    handleSort(
                      "Deferred",
                      sortDirection === "asc" ? "desc" : "asc"
                    )
                  }
                  icon={arrow4 ? faArrowDown : faArrowUp}
                />
              </p>
            </div>
            <div className="col-2 text-center fw-bold ">
              <p className=" shadowww mb-1 kanban ">
                Dropped{" "}
                <FontAwesomeIcon
                className="cursor-pointer"
                  onClick={() =>
                    handleSort(
                      "Dropped",
                      sortDirection === "asc" ? "desc" : "asc"
                    )
                  }
                  icon={arrow5 ? faArrowDown : faArrowUp}
                />
              </p>
            </div>
            <div className="col-2 text-center fw-bold ">
              <p className=" shadowww mb-1 kanban ">
                Completed{" "}
                <FontAwesomeIcon
                className="cursor-pointer"
                  onClick={() =>
                    handleSort(
                      "Completed",
                      sortDirection === "asc" ? "desc" : "asc"
                    )
                  }
                  icon={arrow6 ? faArrowDown : faArrowUp}
                />
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-center overflow-auto  sha kanban_height">
            <div className="col-2 text-center fw-bold  ">
              {filteredNew.length > 0 ? (
                <div>
                  {newSortData?.map((curr: AdvisoryData, index: number) => {
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
                        className=""
                        data-masonry='{"percentPosition": true }'
                        onClick={(e) => handleCardClick(curr.AdvisoryName)}

                        // onClick={(event) => {
                        //   const clickedLabel = curr.AdvisoryName;
                        //   navigate({
                        //     pathname: "/advisory-details",
                        //     search: `?status=${clickedLabel}`,
                        //   });
                        // }}
                      >
                        <div className="px-2 py-1">
                          <div className="card rounded-0 shadowww px-1 cursor-pointer">
                            <div className="card-body p-2">
                              <div className="f-size fw-bold">
                                <span
                                  className={`circle ${circleColor}`}
                                ></span> 
                                <Tooltip
                                  title={curr.AdvisoryName}
                                  placement="top"
                                  arrow={true}
                                  followCursor={true}
                                >
                                  <span className="d-inline-block cursor-pointer py-1">
                                    {curr.AdvisoryName.substring(0, 17)}
                                    {curr.AdvisoryName.length > 15 ? "..." : ""}
                                  </span>
                                </Tooltip>
                              </div>
                              <div className="d-flex align-items-center justify-content-end">
                                    <span className="f-size ps-1">
                                      {curr.Region}
                                    </span>
                                    <FontAwesomeIcon
                                      icon={faLocationDot}
                                      className="text-primary ml-2 px-1 No_data"
                                    />
                                  </div>
                              <div>
                                <div className="card-size d-flex align-items-center">
                                  <Tooltip
                                    title={curr.Description}
                                    placement="top"
                                    arrow={true}
                                    followCursor={true}
                                  >
                                    <span className="d-inline-block cursor-pointer py-1 text-start">
                                      {curr.Description.substring(0, 100)}
                                      {curr.Description.length > 15
                                        ? "..."
                                        : ""}
                                    </span>
                                   
                                  </Tooltip>
                                  <div className="fw-bolder fs_6">
                                    $
                                    {curr.EstimatedMonthlySavings === "NA" ||
                                    null
                                      ? 0
                                      : (
                                          Math.floor(
                                            curr.EstimatedMonthlySavings * 100
                                          ) / 100
                                        ).toFixed(2)}
                                    <p className="card-size text-muted">
                                      Monthly Savings
                                    </p>
                                  </div>
                                </div>
                                <div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center  mt-5 mr-1 ml-1">
                  <p className="alert alert-primary No_data  No_data">
                    No Data Found!!!
                  </p>
                </div>
              )}
            </div>

            <div className="col-2 text-center fw-bold  ">
              {/* <p className=" shadowww">Review</p> */}
              {filteredReview.length > 0 ? (
                <div>
                  {reviewSortData?.map((curr: AdvisoryData, index: number) => {
                    console.log("filteredData", curr?.Status);
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
                        className=""
                        data-masonry='{"percentPosition": true }'
                        onClick={(e) => handleCardClick(curr.AdvisoryName)}
                      >
                        <div className="px-2 py-1">
                          <div className="card rounded-0 shadowww px-1 cursor-pointer">
                            <div className="card-body p-2">
                              <div className="f-size fw-bold">
                                <span
                                  className={`circle ${circleColor}`}
                                ></span>
                                <Tooltip
                                  title={curr.AdvisoryName}
                                  placement="top"
                                  arrow={true}
                                  followCursor={true}
                                >
                                  <span className="d-inline-block cursor-pointer py-1">
                                    {curr.AdvisoryName.substring(0, 17)}
                                    {curr.AdvisoryName.length > 15 ? "..." : ""}
                                  </span>
                                </Tooltip>
                                <div className="d-flex align-items-center justify-content-end">
                                    <span className="f-size ps-1">
                                      {curr.Region}
                                    </span>
                                    <FontAwesomeIcon
                                      icon={faLocationDot}
                                      className="text-primary ml-2 px-1 No_data"
                                    />
                                  </div>
                              </div>
                              <div>
                                <div className="card-size d-flex align-items-center">
                                  <Tooltip
                                    title={curr.Description}
                                    placement="top"
                                    arrow={true}
                                    followCursor={true}
                                  >
                                    <span className="d-inline-block cursor-pointer py-1 text-start">
                                      {curr.Description.substring(0, 100)}
                                      {curr.Description.length > 15
                                        ? "..."
                                        : ""}
                                    </span>
                                  </Tooltip>
                                  <div className="fw-bolder fs_6">
                                    $
                                    {curr.EstimatedMonthlySavings === "NA" ||
                                    null
                                      ? 0
                                      : (
                                          Math.floor(
                                            curr.EstimatedMonthlySavings * 100
                                          ) / 100
                                        ).toFixed(2)}
                                    <p className="card-size text-muted">
                                      Monthly Savings
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  
                                 
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center  mt-5 mr-1 ml-1">
                  <p className="alert alert-primary No_data ">
                    No Data Found!!!
                  </p>
                </div>
              )}
            </div>

            <div className="col-2 text-center fw-bold  ">
              {/* <p className=" shadowww">Approved</p> */}

              {filteredApproved.length > 0 ? (
                <div>
                  {approvedSortData?.map(
                    (curr: AdvisoryData, index: number) => {
                      console.log("filteredData", curr?.Status);
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
                          className=""
                          data-masonry='{"percentPosition": true }'
                          onClick={(e) => handleCardClick(curr.AdvisoryName)}
                        >
                          <div className="px-2 py-1">
                            <div className="card rounded-0 shadowww px-1 cursor-pointer">
                              <div className="card-body p-2">
                                <div className="f-size fw-bold">
                                  <span
                                    className={`circle ${circleColor}`}
                                  ></span>
                                  <Tooltip
                                    title={curr.AdvisoryName}
                                    placement="top"
                                    arrow={true}
                                    followCursor={true}
                                  >
                                    <span className="d-inline-block cursor-pointer py-1">
                                      {curr.AdvisoryName.substring(0, 17)}
                                      {curr.AdvisoryName.length > 15
                                        ? "..."
                                        : ""}
                                    </span>
                                  </Tooltip>
                                  <div className="d-flex align-items-center justify-content-end">
                                      <span className="f-size ps-1">
                                        {curr.Region}
                                      </span>
                                      <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className="text-primary ml-2 px-1 No_data"
                                      />
                                    </div>
                                </div>
                                <div>
                                  <div className="card-size d-flex align-items-center">
                                    <Tooltip
                                      title={curr.Description}
                                      placement="top"
                                      arrow={true}
                                      followCursor={true}
                                    >
                                      <span className="d-inline-block cursor-pointer py-1 text-start">
                                        {curr.Description.substring(0, 100)}
                                        {curr.Description.length > 15
                                          ? "..."
                                          : ""}
                                      </span>
                                    </Tooltip>
                                    <div className="fw-bolder fs_6">
                                      $
                                      {curr.EstimatedMonthlySavings === "NA" ||
                                      null
                                        ? 0
                                        : (
                                            Math.floor(
                                              curr.EstimatedMonthlySavings * 100
                                            ) / 100
                                          ).toFixed(2)}
                                      <p className="card-size text-muted">
                                        Monthly Savings
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                  
                                   
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center mt-5 mr-1 ml-1">
                  <p className="alert alert-primary No_data">
                    No Data Found!!!
                  </p>
                </div>
              )}
            </div>

            <div className="col-2 text-center fw-bold ">
              {/* <p className=" shadowww">Deferred</p> */}
              {filteredDeferred.length > 0 ? (
                <div>
                  {deferredSortData?.map(
                    (curr: AdvisoryData, index: number) => {
                      console.log("filteredData", curr?.Status);
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
                          className=""
                          data-masonry='{"percentPosition": true }'
                          onClick={(e) => handleCardClick(curr.AdvisoryName)}
                        >
                          <div className="px-2 py-1">
                            <div className="card rounded-0 shadowww px-1 cursor-pointer">
                              <div className="card-body p-2">
                                <div className="f-size fw-bold">
                                  <span
                                    className={`circle ${circleColor}`}
                                  ></span>
                                  <Tooltip
                                    title={curr.AdvisoryName}
                                    placement="top"
                                    arrow={true}
                                    followCursor={true}
                                  >
                                    <span className="d-inline-block cursor-pointer py-1">
                                      {curr.AdvisoryName.substring(0, 17)}
                                      {curr.AdvisoryName.length > 15
                                        ? "..."
                                        : ""}
                                    </span>
                                  </Tooltip>
                                  <div className="d-flex align-items-center justify-content-end">
                                      <span className="f-size ps-1">
                                        {curr.Region}
                                      </span>
                                      <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className="text-primary ml-2 px-1 No_data"
                                      />
                                    </div>
                                </div>
                                <div>
                                  <div className="card-size d-flex align-items-center">
                                    <Tooltip
                                      title={curr.Description}
                                      placement="top"
                                      arrow={true}
                                      followCursor={true}
                                    >
                                      <span className="d-inline-block cursor-pointer py-1 text-start">
                                        {curr.Description.substring(0, 100)}
                                        {curr.Description.length > 15
                                          ? "..."
                                          : ""}
                                      </span>
                                    </Tooltip>
                                    <div className="fw-bolder fs_6">
                                      $
                                      {curr.EstimatedMonthlySavings === "NA" ||
                                      null
                                        ? 0
                                        : (
                                            Math.floor(
                                              curr.EstimatedMonthlySavings * 100
                                            ) / 100
                                          ).toFixed(2)}
                                      <p className="card-size text-muted">
                                        Monthly Savings
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                  
                                    
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center mt-5 mr-1 ml-1">
                  <p className="alert alert-primary No_data ">
                    No Data Found!!!
                  </p>
                </div>
              )}
            </div>
            <div className="col-2 text-center fw-bold   ">
              {/* <p className=" shadowww">Dropped</p> */}
              {filteredDropped.length > 0 ? (
                <div>
                  {droppedSortData?.map((curr: AdvisoryData, index: number) => {
                    console.log("filteredData", curr?.Status);
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
                        className=""
                        data-masonry='{"percentPosition": true }'
                        onClick={(e) => handleCardClick(curr.AdvisoryName)}
                      >
                        <div className="px-2 py-1">
                          <div className="card rounded-0 shadowww px-1 cursor-pointer">
                            <div className="card-body p-2">
                              <div className="f-size fw-bold">
                                <span
                                  className={`circle ${circleColor}`}
                                ></span>
                                <Tooltip
                                  title={curr.AdvisoryName}
                                  placement="top"
                                  arrow={true}
                                  followCursor={true}
                                >
                                  <span className="d-inline-block cursor-pointer py-1">
                                    {curr.AdvisoryName.substring(0, 17)}
                                    {curr.AdvisoryName.length > 15 ? "..." : ""}
                                  </span>
                                </Tooltip>
                                <div className="d-flex align-items-center justify-content-end">
                                    <span className="f-size ps-1">
                                      {curr.Region}
                                    </span>
                                    <FontAwesomeIcon
                                      icon={faLocationDot}
                                      className="text-primary ml-2 px-1 No_data"
                                    />
                                  </div>
                              </div>
                              <div>
                                <div className="card-size d-flex align-items-center">
                                  <Tooltip
                                    title={curr.Description}
                                    placement="top"
                                    arrow={true}
                                    followCursor={true}
                                  >
                                    <span className="d-inline-block cursor-pointer py-1 text-start">
                                      {curr.Description.substring(0, 100)}
                                      {curr.Description.length > 15
                                        ? "..."
                                        : ""}
                                    </span>
                                  </Tooltip>
                                  <div className="fw-bolder fs_6">
                                    $
                                    {curr.EstimatedMonthlySavings === "NA" ||
                                    null
                                      ? 0
                                      : (
                                          Math.floor(
                                            curr.EstimatedMonthlySavings * 100
                                          ) / 100
                                        ).toFixed(2)}
                                    <p className="card-size text-muted">
                                      Monthly Savings
                                    </p>
                                  </div>
                                </div>
                                <div>
                                 
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center  mt-5 mr-1 ml-1">
                  <p className="alert alert-primary No_data">
                    No Data Found!!!
                  </p>
                </div>
              )}
            </div>

            <div className="col-2 text-center fw-bold ">
              {/* <p className=" shadowww">Completed</p> */}
              {filteredCompleted.length > 0 ? (
                <div>
                  {completedSortData?.map(
                    (curr: AdvisoryData, index: number) => {
                      console.log("filteredData", curr?.Status);
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
                          className=""
                          data-masonry='{"percentPosition": true }'
                          onClick={(e) => handleCardClick(curr.AdvisoryName)}
                        >
                          <div className="px-2 py-1">
                            <div className="card rounded-0 shadowww px-1 cursor-pointer">
                              <div className="card-body p-2">
                                <div className="f-size fw-bold">
                                  <span
                                    className={`circle ${circleColor}`}
                                  ></span>
                                  <Tooltip
                                    title={curr.AdvisoryName}
                                    placement="top"
                                    arrow={true}
                                    followCursor={true}
                                  >
                                    <span className="d-inline-block cursor-pointer py-1">
                                      {curr.AdvisoryName.substring(0, 17)}
                                      {curr.AdvisoryName.length > 15
                                        ? "..."
                                        : ""}
                                    </span>
                                  </Tooltip>
                                  <div className="d-flex align-items-center justify-content-end">
                                      <span className="f-size ps-1">
                                        {curr.Region}
                                      </span>
                                      <FontAwesomeIcon
                                        icon={faLocationDot}
                                        className="text-primary ml-2 px-1 No_data"
                                      />
                                    </div>
                                </div>
                                <div>
                                  <div className="card-size d-flex align-items-center">
                                    <Tooltip
                                      title={curr.Description}
                                      placement="top"
                                      arrow={true}
                                      followCursor={true}
                                    >
                                      <span className="d-inline-block cursor-pointer py-1 text-start">
                                        {curr.Description.substring(0, 100)}
                                        {curr.Description.length > 15
                                          ? "..."
                                          : ""}
                                      </span>
                                    </Tooltip>
                                    <div className="fw-bolder fs_6">
                                      $
                                      {curr.EstimatedMonthlySavings === "NA" ||
                                      null
                                        ? 0
                                        : (
                                            Math.floor(
                                              curr.EstimatedMonthlySavings * 100
                                            ) / 100
                                          ).toFixed(2)}
                                      <p className="card-size text-muted">
                                        Monthly Savings
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    
                                   
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center  mt-5 mr-1 ml-1">
                  <p className="alert alert-primary No_data ">
                    No Data Found!!!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <KanbanPopup
        show={showModal}
        onHide={onModalClose}
        advisoryName={advisoryName}
      />
    </>
  );
};

export default KanbanBoard;
