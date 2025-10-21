import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Api } from "../../Utilities/api";
import {
  faCheckCircle,
  faCircleXmark,
  faMagnifyingGlass,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCommonConfig, setTicketDetailsData } from "../CommonConfig/commonConfigSlice";
import {
  StepConnector,
  TextField,
  Tooltip,
  stepConnectorClasses,
  styled,
} from "@mui/material";
import testapi from "../../../api/testapi.json";
import SkeletonGrid from "../../Utilities/SkeletonGrid";

const MyRequestDropDown = (props) => {
  const cloudData = useAppSelector(selectCommonConfig);
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const showAll: boolean = false;
  const [allTickets, setAllTickets] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [chgTickets, setChgTickets] = useState("");
  const [reqTickets, setReqTickets] = useState("");
  const dispatch = useAppDispatch();

  // const currentUser = cloudData.loginDetails.currentUser
  const currentUser = "dushyanth.pamala@cognizant.com";

  const hitApi = () => {
     // Ticket Details API hit
     Api.getData(testapi.ticketDetailsApi).then((response: any) => {
      dispatch(setTicketDetailsData(response));
    });
  }

//   const hitApi = () => {
     
//   // Get existing ticket data from Redux
//   const existingTickets = cloudData?.ticketDetailsData

//   Api.getData(testapi.ticketDetailsApi).then((response: any) => {
//     const newTickets = Array.isArray(response) ? response : [response];

//     // Merge existing and new tickets
//     // const mergedTickets = [...(existingTickets || []), ...newTickets];
//     const mergedTickets = [
//   ...newTickets,
//   ...existingTickets.filter(
//     (existing) => !newTickets.some((newT) => newT.TicketNumber === existing.TicketNumber)
//   )
// ];


//     dispatch(setTicketDetailsData(mergedTickets));
//   });
// };

  useEffect(() => {
    if(props?.showDropdown){
      hitApi()
    }
  },[props?.showDropdown])

  useEffect(() => {
    const chgArray = [];
    const reqArray = [];
console.log(cloudData?.ticketDetailsData,"testing cloudadata")  
    if(cloudData?.ticketDetailsData){
        cloudData.ticketDetailsData
          .filter((ticket) => ticket.TicketRequestor === currentUser)
          .forEach((ticket) => {
            if (ticket.TicketNumber.startsWith("CHG")) {
              chgArray.push(ticket.TicketNumber);
            } else if (ticket.TicketNumber.startsWith("REQ")) {
              reqArray.push(ticket.TicketNumber);
            }
          });
    const chgTicketsString = chgArray.join("%2C");
    const reqTicketsString = reqArray.join("%2C");

    setChgTickets(chgTicketsString);
    setReqTickets(reqTicketsString);
    setAllTickets([...chgArray, ...reqArray]);
  }
  }, [cloudData.ticketDetailsData, currentUser]);

  console.log("reqTickets : ", reqTickets);
  console.log("chgTickets : ", chgTickets);

  const username = "ServicenowAPI";
  const password = "Qwerty@123";

  useEffect(() => {
    if (reqTickets.length || chgTickets.length) {
      const customData = async () => {
        const options = {
          auth: {
            username: username,
            password: password,
          },
        };
        try {
          const reqResponse = await Api.getCallOptions(
            `https://cisicmpengineering1.service-now.com/api/now/table/sc_request?sysparm_query=numberIN${reqTickets}&sysparm_fields=number%2Crequest_state%2Csys_created_on%2Cassigned_to%2Cdescription%2Cshort_description%2Ccmdb_ci%2Csys_id%2Crequested_for&sysparm_limit=10000`,
            options
          );
          const chgResponse = await Api.getCallOptions(
            `https://cisicmpengineering1.service-now.com/api/now/table/change_request?sysparm_query=numberIN${chgTickets}&sysparm_fields=number%2Crequest_state%2Csys_created_on%2Cassigned_to%2Cdescription%2Cshort_description%2Ccmdb_ci%2Csys_id%2Crequested_for&sysparm_limit=10000`,
            options
          );

          const mergedData = [
            ...reqResponse.data.result,
            ...chgResponse.data.result,
          ].map((item) => {
            const matchingTicket = cloudData.ticketDetailsData.find(
              (ticket) => ticket.TicketNumber === item.number
            );
            return matchingTicket ? { ...item, ...matchingTicket } : item;
          });
  
          // Combine mergedData and cloudData.ticketDetailsData, then remove duplicates
          const combinedData = [...mergedData, ...cloudData.ticketDetailsData];
          const uniqueTickets = Array.from(
            new Set(combinedData.map((ticket) => ticket.TicketNumber))
          ).map((TicketNumber) => {
            return combinedData.find((ticket) => ticket.TicketNumber === TicketNumber);
          });
  
          // Inside the useEffect hook where you merge and set the data
          const sortedUniqueTickets = uniqueTickets.sort((a, b) => {
            const dateA = new Date(a.sys_created_on).getTime();
            const dateB = new Date(b.sys_created_on).getTime();
            return dateB - dateA; // Now both sides are numbers, allowing subtraction
          });
          setData(sortedUniqueTickets);
        } catch (error) {
          console.error("Error:", error);
        }
      };
  
      customData();
    }
  }, [reqTickets, chgTickets,props?.showDropdown]);

  const stopHandler = (e) => {
    e.preventDefault();
  };

  const filteredData = Data.filter((item) => {
    const isSearchMatch = Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchInput.toLowerCase())
    );
    return isSearchMatch;
  });

  console.log("filteredData123 : ", filteredData);

  const navigateToMyRequest = () => {
    navigate({
      pathname: "/myRequest",
    });
    dispatch(setTicketDetailsData(filteredData))
  };
  const steps = [
    "New",
    "InProgress",
    "Approved",
    "Execution",
    "Success",
    "Resolved",
  ];

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

  const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 10,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient(90deg, rgba(19,106,8,1) 0%, rgba(76,184,60,1) 35%, rgba(72,255,43,1) 100%);",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient(90deg, rgba(19,106,8,1) 0%, rgba(76,184,60,1) 35%, rgba(72,255,43,1) 100%);",
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
      {props?.showDropdown ? <div
        className="tab-content position-absolute top-99 end-0 myRequest-dropdown pe-5 me-5"
        id="myTabContent"
      >
        <div className="d-flex h-100 bg-white p-2 border border-primary shadow-lg rounded-2">
          <div
            className="tab-pane fade show active"
            id="home-tab-pane"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <form
              onSubmit={stopHandler}
              className="py-1 d-flex justify-content-end"
            >
              <div className="px-3">
                <TextField
                  id="search-field"
                  placeholder="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-primary"
                      />
                    ),
                  }}
                  sx={{ width: 150 }}
                />
              </div>
            </form>
            {filteredData.length === 0 ? (
              <div className="px-2" style={{ width: "600px" }}>
               <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
               <SkeletonGrid myRequestSkelton={{"show" : true, "width" : 30, "height" : 30}} />
              </div>
            ) : (
              <table className="table" style={{ width: "600px" }}>
                {filteredData
                  .slice(0, showAll ? filteredData.length : 2)
                  .map((val, key) => {
                    const activeStep = getActiveStep(val.Status);
                    const isFailed =
                      val.Status === "Failed" || val.Status === "UnSuccessful";
                    return (
                      <tbody key={key}>
                        <tr>
                          <tr className="d-flex px-2 bg-white f-size text-primary justify-content-between border border-0">
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
                            <td>{val.sys_created_on}</td>
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
                          <tr className="d-flex pt-0 pb-2 bg-white f-size text-primary border-0">
                            <td
                              className="tr-size  text-truncate text-hover pe-1"
                              style={{ height: "20px", maxWidth: "200px" }}
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
                              style={{ height: "20px", width: "350px" }}
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
              </table>
            )}
            {!showAll && filteredData.length > 2 && (
              <div className="text-center ">
                <button
                  className="btn btn-primary border-0 fw-bold"
                  onClick={navigateToMyRequest}
                >
                  View All
                </button>
              </div>
            )}
          </div>
        </div>
      </div> : <></>}
    </>
  );
};

export default MyRequestDropDown;
