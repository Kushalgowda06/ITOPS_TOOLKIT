import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCircleXmark,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {
  Card,
  StepConnector,
  Tooltip,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import SkeletonGrid from "../../Utilities/SkeletonGrid";

const MyRequest = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [resolvedFilter, setResolvedFilter] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [filteredSearchData, setFilteredSearchData] = useState([]);
  const [failedFilter, setFailedFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState(""); // New state to track active filter
  const currentUser = "dushyanth.pamala@cognizant.com";

  const handleChange = (e) => {
    setSearch(e.target.value);

    const searchedData = cloudData?.ticketDetailsData.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );

    setFilterData(searchedData);
  };

  const stopHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    let filteredData = cloudData?.ticketDetailsData;
    if (openFilter) {
      filteredData = filteredData.filter((val) => val.Status === "New");
    } else if (resolvedFilter) {
      filteredData = filteredData.filter((val) => val.Status === "Resolved");
    } else if (failedFilter) {
      filteredData = filteredData.filter((val) => val.Status === "Failed");
    }
  
    const searchedData = filteredData.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(search.toLowerCase())
      )
    );
  
    setFilterData(searchedData);
    setFilteredSearchData(searchedData);
  }, [openFilter, resolvedFilter, failedFilter, search, cloudData?.ticketDetailsData]);

  const handleOpenFilter = () => {
    setOpenFilter(true);
    setResolvedFilter(false);
    setFailedFilter(false);
    setActiveFilter("Open");
  };

  const handleResolvedFilter = () => {
    setOpenFilter(false);
    setResolvedFilter(true);
    setFailedFilter(false);
    setActiveFilter("Resolved");
  };

  const handleFailedFilter = () => {
    setOpenFilter(false);
    setResolvedFilter(false);
    setFailedFilter(true);
    setActiveFilter("Failed");
  };
  

  const getActiveStep = (requestState) => {
    switch (requestState) {
      case "New":
        return 0;
      case "InProgress":
        return 1;
      case "Approved":
        return 2;
      case "Execution":
        return 3;
      case "Success":
        return 4;
      case "Resolved":
        return 5;
      default:
        return 0;
    }
  };

  const steps = [
    "New",
    "InProgress",
    "Approved",
    "Execution",
    "Success",
    "Resolved",
  ];

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient(90deg, rgba(19,106,8,1) 0%, rgba(76,184,60,1) 35%, rgba(72,255,43,1) 100%)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient(90deg, rgba(19,106,8,1) 0%, rgba(76,184,60,1) 35%, rgba(72,255,43,1) 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 5,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 11,
    },
  }));

  return (
    <>
      <div className="mx-3 my-2">
        <div className="row col-row gx-1">
          <div className="col-6 gx-0  h-100 ">
            <Card  variant="outlined" className="text-primary  me-1 position-sticky">
              <div className="d-flex">
                <div className="p-2 flex-grow-1">
                  <h5 className="pt-1 fw-bold">My Requests</h5>
                </div>
                <div className="p-2">
                  <button
                    className={`btn btn-sm me-1 ${
                      activeFilter === "Open"
                        ? "btn-primary"
                        : "btn-outline-primary"
                    }`}
                    onClick={handleOpenFilter}
                  >
                    Open
                  </button>
                  <button
                    className={`btn btn-sm me-1 ${
                      activeFilter === "Resolved"
                        ? "btn-success"
                        : "btn-outline-success"
                    }`}
                    onClick={handleResolvedFilter}
                  >
                    Resolved
                  </button>
                  <button
                    className={`btn btn-sm me-1 ${
                      activeFilter === "Failed"
                        ? "btn-danger"
                        : "btn-outline-danger"
                    }`}
                    onClick={handleFailedFilter}
                  >
                    Failed
                  </button>
                </div>
                <div className="p-2  me-0">
                  <form onSubmit={stopHandler}>
                    <input
                      className="form-control  h-25 border border-primary"
                      type="search"
                      placeholder="Search"
                      value={search}
                      onChange={handleChange}
                    />
                  </form>
                </div>
              </div>
            </Card>
            <div className="pe-1">
              {!filterData.length ? <div className="onboarding-h bg-white p-2">
                <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
                <br />
                <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
                <br />
                <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
                <br />
                <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
                <br />
              </div> : 
              <table className="table">
                {filterData.map((val, key) => {
                  const activeStep = getActiveStep(val.Status);
                  const isFailed =
                    val.Status === "Failed" || val.Status === "unSuccessful";
                    if (!val.number && !val.TicketNumber) {
                      return null;
                    }
                  return (
                    <tbody>
                      <tr key={key} style={{borderWidth:"0px 0px 8px 0px",borderColor:"rgb(242 242 242)"}}>
                        <tr className="d-flex px-2 border-0 bg-white f-size text-primary justify-content-between border">
                          <td className="pe-4 fw-bold">
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                             {val.number}
                            </a>
                          </td>
                            <td>{val?.sys_created_on}</td>
                          <td>
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {val.Status}
                            </a>
                          </td>
                          <td>
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {currentUser}
                            </a>
                          </td>
                        </tr>
                        <tr className="d-flex pt-0 pb-2 bg-white f-size text-primary border border-0">
                          <td
                            className="tr-size  text-truncate text-hover pe-1"
                            style={{ height: "40px", width: "308px" }}
                          >
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {!val.short_description
                                ? val.description
                                : val.short_description}
                            </a>
                          </td>
                          {"|"}
                          <td
                            className="ps-3 text-truncate  text-hover"
                            style={{ height: "40px", width: "204px" }}
                          >
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {val.cmdb_ci ? val.cmdb_ci : "cmdb ci"}
                            </a>
                          </td>
                        </tr>

                        <tr className="d-flex px-0 border-0 bg-white f-size text-primary border border-bottom">
                          <td className="px-0 w-100">
                            <Box>
                              <Stepper
                                activeStep={isFailed ? 4 : activeStep}
                                alternativeLabel={true}
                                connector={<ColorlibConnector />}
                              >
                                {steps.map((label, index) => (
                                  <Step key={label}>
                                    <StepLabel
                                      icon={
                                        label === "Success" && isFailed ? (
                                          <>
                                            <Tooltip
                                              title={val.Logs}
                                              placement="top"
                                            >
                                              <FontAwesomeIcon
                                                // title={val.Status}
                                                icon={faCircleXmark}
                                                className="text-danger fs-5"
                                              />
                                            </Tooltip>
                                          </>
                                        ) : index <= (isFailed ? activeStep + 3  : activeStep)  ? (
                                          <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            className="text-success fs-5"
                                          />
                                        ) : (
                                          <FontAwesomeIcon
                                            // title={val.Logs}
                                            // title="Hellooo"
                                            icon={faCircle}
                                            className="text-black text-opacity-25 fs-5"
                                          />
                                        )
                                      }
                                    >
                                      <span className="f-size text-dark">
                                        {label}
                                      </span>
                                    </StepLabel>
                                  </Step>
                                ))}
                              </Stepper>
                            </Box>
                          </td>
                        </tr>
                      </tr>
                    </tbody>
                  );
                })}
              </table>}
            </div>
          </div>
          <div className="col-6 gx-2 h-100">
            <Card  variant="outlined" className="text-primary  position-sticky">
              <div className="d-flex">
                <div className="p-2 flex-grow-1">
                  <h5 className="pt-1 fw-bold">Scheduled Jobs</h5>
                </div>
                <div className="p-2">
                  <button className="btn btn-sm btn-outline-primary me-4">
                    Running
                  </button>
                  <button className="btn btn-sm btn-outline-primary me-1">
                    Scheduled
                  </button>
                </div>
                <div className="p-2  me-0">
                  <form onSubmit={stopHandler}>
                    <input
                      className="form-control  h-25 border border-primary"
                      type="search"
                      placeholder="Search"
                      value={search}
                      onChange={handleChange}
                    />
                  </form>
                </div>
              </div>
            </Card>
            <div>
              {!filterData.length ? <div className="onboarding-h bg-white p-2">
                <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
                <br />
                <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
                <br />
                <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
                <br />
                <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
                <br />
              </div> : <table className="table">
                {filterData.map((val, key) => {
                  if (!val.number && !val.TicketNumber) {
                    return null;
                  }
                  const activeStep = getActiveStep(val.Status);
                  const isFailed =
                    val.Status === "Failed" || val.Status === "unSuccessful";
                  return (
                    <tbody>
                      <tr key={key} style={{borderWidth:"0px 0px 8px 0px",borderColor:"rgb(242 242 242)"}}>
                        <tr className="d-flex px-2 border-0 bg-white f-size text-primary justify-content-between border">
                          <td className="pe-4 fw-bold">
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {val.number}
                            </a>
                          </td>
                            <td>{val?.sys_created_on}</td>
                          <td>
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {val.Status}
                            </a>
                          </td>
                          <td>
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {currentUser}
                            </a>
                          </td>
                        </tr>
                        <tr className="d-flex pt-0 pb-2 bg-white f-size text-primary border border-0">
                          <td
                            className="tr-size  text-truncate text-hover pe-1"
                            style={{ height: "40px", width: "308px" }}
                          >
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                             {!val.short_description
                                  ? val.description
                                  : val.short_description}
                            </a>
                          </td>
                          {"|"}
                          <td
                            className="ps-3 text-truncate  text-hover"
                            style={{ height: "40px", width: "204px" }}
                          >
                            <a
                              href={`https://cisicmpengineering1.service-now.com/nav_to.do?uri=%2Fsc_request.do%3Fsys_id%3D${val.sys_id}%26sysparm_stack%3D%26sysparm_view%3D`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-decoration-none"
                            >
                              {val.cmdb_ci ? val.cmdb_ci : "cmdb ci"}
                            </a>
                          </td>
                        </tr>

                        <tr className="d-flex px-0 border-0 bg-white f-size text-primary border border-bottom">
                          <td className="px-0 w-100">
                            {/* <div> */}
                            <Box>
                              <Stepper
                                activeStep={isFailed ? 4 : activeStep}
                                alternativeLabel={true}
                                connector={<ColorlibConnector />}
                              >
                                {steps.map((label, index) => (
                                  <Step key={label}>
                                    <StepLabel
                                      icon={
                                        label === "Success" && isFailed ? (
                                          <>
                                            <Tooltip
                                              title={val.Logs}
                                              placement="top"
                                            >
                                              <FontAwesomeIcon
                                                // title={val.Status}
                                                icon={faCircleXmark}
                                                className="text-danger fs-5"
                                              />
                                            </Tooltip>
                                          </>
                                        ) : index <= (isFailed ? activeStep + 3  : activeStep)  ? (
                                          // <Tooltip title="Success"> {/* Optionally, add a tooltip for the success icon */}
                                          <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            className="text-success fs-5"
                                          />
                                        ) : (
                                          // </Tooltip>
                                          // <Tooltip title="In Progress"> {/* Optionally, add a tooltip for the in-progress icon */}
                                          // <FontAwesomeIcon icon={faCircle} />
                                          <FontAwesomeIcon
                                            // title={val.Logs}
                                            // title="Hellooo"
                                            icon={faCircle}
                                            className="text-black text-opacity-25 fs-5"
                                          />
                                          // </Tooltip>
                                        )
                                      }
                                    >
                                      <span className="f-size text-dark">
                                        {label}
                                      </span>
                                    </StepLabel>
                                  </Step>
                                ))}
                              </Stepper>
                            </Box>
                          </td>
                        </tr>
                      </tr>
                    </tbody>
                  );
                })}
              </table>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyRequest;
