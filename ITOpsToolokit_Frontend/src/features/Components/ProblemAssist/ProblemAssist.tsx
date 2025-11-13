import React, { useEffect, useMemo, useState } from "react";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import IncidentCard from "./IncidentCard";
import ProblemCard from "./ProblemCard";
import TicketDetails from "./TicketDetails";
import ProblemPopUpModal from "./ProblemPopUpModal";
import axios from "axios";
import serviceNowAxios from "../../../api/ServicenowAxios";
import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { Loader } from "../../Utilities/Loader";

export default function ProblemAssist() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("Recommended");
  const [search, setSearch] = useState("");
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvedData, setApprovedData] = useState([]);
  const [incidentNumbers, setIncidentNumbers] = useState([]);
  const [submitData, setSubmittedData] = useState<any>({});
  const [problemData, setProblemData] = useState([]);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [state, setState] = useState([]);
//  const [createChange, setCreateChange] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "info"
  >("info");
  const [isLoading, setIsLoading] = useState(false);
  const allIncidentIds = incidentNumbers?.map((i) => i.id);
  const allSelected = selectedIncidents?.length === allIncidentIds?.length;



  const enrichApprovedData = (approvedData, problemData) => {
    return approvedData.map(approved => {
      const match = problemData.find(problem => problem.number === approved.
        problem_ticket_number);
      if (match) {
        return {
          ...approved,
          state: match.state,
          sys_created_by: match.sys_created_by,
          cmdb_ci: match.cmdb_ci,
          impact: match.impact,
          priority: match.priority,
          assigned_to: match.assigned_to,
          assignment_group: match.assignment_group,
          urgency: match.urgency,
          approval: match.approval
        };
      }
      return approved;
    });
  };
  
  const handleIncidentCheck = (id) => {
    setSelectedIncidents((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedIncidents(allSelected ? [] : allIncidentIds);
  };

  const handleRejectClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setRejectionReason("");
  };
  const handleSave = async() => {
    // Create a shallow copy of selectedTicket
    const updatedTicket = { ...selectedTicket };

    updatedTicket.rejection_reason = rejectionReason;

    updatedTicket.approval_status = "proactive_rejected";
    setSubmittedData(updatedTicket);
    console.log(updatedTicket, "updatedTicket");

    if (Object?.keys(submitData)?.length > 0) {

      try {
        setIsLoading(true)
        const { id, ...cleanedData } = submitData;
        const response = await axios.post(
          "https://backend.autonomousitopstoolkit.com/database/api/v1/update_sql_data/", // corrected from hrrp to http
          {
            table_name: "prblm_tkt_details",
            update_dict: cleanedData,
            conditions: [{ col: "id", op: "eq", val: submitData.id }],
          },
          {
            auth: {
              username: "rest",
              password: "!fi$5*4KlHDdRwdbup%ix",
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setIsLoading(false);
        setToastMessage("Ticket Rejected");
        setToastSeverity("success");
         setToastOpen(true);
        console.log("API Response:", response.data.output.data);
      } catch (error) {
        console.error("API Error:", error);
        setIsLoading(false)
        setToastMessage("API Error");
        setToastSeverity("error");
        setToastOpen(true);
       
      }
    }
    handleCloseModal();
  };

  const RejectApiCall = async () => {
    console.log("test");

    console.log(submitData, "submitData");
    if (Object?.keys(submitData)?.length > 0) {
      try {
        const { id, ...cleanedData } = submitData;
        const response = await axios.post(
          "https://backend.autonomousitopstoolkit.com/database/api/v1/update_sql_data/", // corrected from hrrp to http
          {
            table_name: "prblm_tkt_details",
            update_dict: cleanedData,
            conditions: [{ col: "id", op: "eq", val: submitData.id }],
          },
          {
            auth: {
              username: "rest",
              password: "!fi$5*4KlHDdRwdbup%ix",
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("API Response:", response.data.output.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };

  const handleUpdateClick = async () => {
    const updatedTicket = { ...selectedTicket };
    setSubmittedData(updatedTicket);
    console.log(submitData, "submitData");
    const matchedProblem = problemData?.find(
      (item) => item.number === updatedTicket.problem_ticket_number
    );

    // Get the sys_id if found
    const sysId = matchedProblem?.sys_id || null;
    try {
      setIsLoading(true)
      // Use ServiceNow axios instance to avoid authentication conflicts
      await serviceNowAxios
        .put(
          `https://cisicmpengineering1.service-now.com/api/now/table/problem/${sysId}`,

          {
            description: updatedTicket.description,
            short_description: updatedTicket.short_description,
            impact: updatedTicket.impact,
            urgency: updatedTicket.urgency,
            assignment_group: updatedTicket.assignment_group,
            assigned_to: updatedTicket.assigned_to,
            related_incidents: updatedTicket.associated_incidents,
            cmdb_ci: updatedTicket.cmdb_ci,
          }
        )
        .then((response) => {
          console.log(response, "update resposne");

          RejectApiCall();
          setIsLoading(false)
        setToastMessage("Ticket Updated Successfully");
      setToastSeverity("success");
       setToastOpen(true);
        });
    } catch (error) {
      setIsLoading(false)
       setToastMessage("API Error");
      setToastSeverity("error");
       setToastOpen(true);
      console.error("Error fetching incidents: ", error);
      return [];
    }
  };

  const handleApproveClick = async () => {
    const updatedTicket = { ...selectedTicket };

    // const fetchIncidents = async () => {
    try {
      setIsLoading(true)
      // Use ServiceNow axios instance to avoid authentication conflicts
      await serviceNowAxios
        .post(
          `https://cisicmpengineering1.service-now.com/api/now/table/problem`,

          {
            description: updatedTicket.description,
            short_description: updatedTicket.short_description,
            impact: "",
            urgency: "",
            assignment_group: "",
            assigned_to: "",
            related_incidents: updatedTicket.associated_incidents,
            cmdb_ci: "",
          }
        )
        .then((response) => {
          if (response?.data?.result?.number) {
            updatedTicket.problem_ticket_number =
              response?.data?.result?.number;
            updatedTicket.approval_status = "proactive_approved";
            setSubmittedData(updatedTicket);
            RejectApiCall();
            setToastMessage(
              "Ticket Approved Successfully"
            );
            setToastSeverity("success");
            setToastOpen(true);
            setIsLoading(false)
          }
        });
    } catch (error) {
      console.error("Error fetching incidents: ", error);
      setIsLoading(false)
      setToastMessage(
          "Failed to approve the ticket. API Error"
      );
      setToastSeverity("error");
      setToastOpen(true);
      return [];
    }
    // };
  };

  const fetchProblemTasks = async (ticketString) => {
    if (ticketString?.length > 0) {
      setIsLoading(true)
      try {
        const response = await serviceNowAxios.get(
          `https://cisicmpengineering1.service-now.com/api/now/table/problem?sysparm_query=numberIN${ticketString}`
        );

        const problemTasks = response?.data?.result || [];
        setProblemData(problemTasks);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching problem tasks: ", error);
        setIsLoading(false)
        setToastMessage(
          "API Error"
        );
        setToastSeverity("error");
        setToastOpen(true);
        return [];
      }
    }
  };

  useEffect(() => {
    const ticketString = Array.from(
      new Set(
        approvedData
          ?.map((item) => item?.problem_ticket_number)
          .filter((ticket) => ticket) // removes null, undefined, empty string
      )
    ).join(",");
    fetchProblemTasks(ticketString);
  }, [approvedData]);

  useEffect(() => {
    if (status === "Recommended") {
      const postData = async () => {
        setIsLoading(true)
        try {
          const response = await axios.post(
            "https://backend.autonomousitopstoolkit.com/database/api/v1/retrieve_sql_data/", // corrected from hrrp to http
            {
              table_name: "prblm_tkt_details",
              columns: [],
              conditions: [],
            },
            {
              auth: {
                username: "rest",
                password: "!fi$5*4KlHDdRwdbup%ix",
              },
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("API Response:", response.data.output.data);
          setApprovedData(response.data.output.data);
          setIsLoading(false)
        } catch (error) {
          console.error("API Error:", error);
          setIsLoading(false)
          setToastMessage( "API Error"
          );
          setToastSeverity("error");
          setToastOpen(true);
        }
      };

      postData();
    }
  }, [status]);
  const handleToastClose = () => {
    setToastOpen(false);
  };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await serviceNowAxios.get(
            `https://cisicmpengineering1.service-now.com/api/now/table/sys_choice?sysparm_query=name=problem^element=state&sysparm_fields=label,value`
          );
  
          const problemTasks = response?.data?.result || [];
          setState(problemTasks);
        } catch (error) {
          console.error("Error fetching problem tasks: ", error);
        }
      };
      fetchData();
    }, []);

  const enrichedApprovedData = useMemo(() => enrichApprovedData(approvedData, problemData), [approvedData, problemData]);
 useEffect(()=>{setSelectedTicket(null)},[status])
  return (
    <div className="container-fluid py-1 Itsm_bg_image  h-100">
            <Snackbar
            open={toastOpen}
            autoHideDuration={6000000}
            onClose={handleToastClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleToastClose}
              severity={toastSeverity}
              className="glass-notice-card"
              variant="filled"
              sx={{
                // display: "flex",
                top: "50px",
                // flexDirection: "column",
                // alignItems: "center",
                padding: "16px 24px",
                borderRadius: "8px",
                backdropFilter: "blur(5px)", // Glassmorphism effect
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white", // Keep the text white for contrast
                width: "400px", // Adjust the width as needed
              }}
            >            
             {toastMessage}
             
            </Alert>
          </Snackbar>
      <div className="row ">
        <div className="col-12 col-lg-5 mb-3 mb-lg-0 prb_list">
          <HeaderLeft
            status={status}
            setStatus={setStatus}
            search={search}
            setSearch={setSearch}
          />
          <div className="itsm_pannel overflow-scroll">
          {status==="Approved" ?
         
         (enrichedApprovedData
            ?.filter(p =>
              p?.approval_status?.toLowerCase().includes(status.toLowerCase()) &&
              p?.short_description?.toLowerCase().includes(search.toLowerCase())
            )
            ?.map(problem => (
              <ProblemCard
                status={status}
                key={problem.id}
                problem={problem}
                onClick={setSelectedTicket}
                isActive={selectedTicket?.id === problem.id}
                state={state} 
              />
            ))
       )  :(approvedData
            ?.filter(
              (p) =>
                p?.approval_status
                  ?.toLowerCase()
                  .includes(status.toLowerCase()) &&
                p?.short_description
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
            ?.map((problem) => (
              <ProblemCard
                status={status}
                key={problem.id}
                problem={problem}
                onClick={setSelectedTicket}
                isActive={selectedTicket?.id === problem.id}
                 state={state} 
              />
            )))}
        </div>
        </div>
        <div className="col-12 col-lg-7">
          <HeaderRight />
          <div className="prb-content-box prb_ticket_height p-3 mt-2">
            <TicketDetails
              ticket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
              setIncidentNumbers={setIncidentNumbers}
               state={state} 
            />

{status === "Recommended" ? (<>
               { !selectedTicket ?  "" :<>
              <div className="prb_related-incidents">
                <span className="prb_header-title">Related Incidents</span>
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="prb_select-checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                  <label className="text-light ms-1 f-size">Select All</label>
                </div>
              </div>
              </> }
              </>
            ) : (
              <></>
            )}

            <div className="container-fluid px-0">
              {Array.from({
                length: Math.ceil(incidentNumbers?.length / 4),
              }).map((_, rowIndex) => (
                <div className="row gx-3 gy-3" key={rowIndex}>
                  {incidentNumbers
                    ?.slice(rowIndex * 4, rowIndex * 4 + 4)
                    .map((incident) => (
                      <div
                        className={`col-md-3 ${
                          status !== "Recommended" ? "pt-3" : ""
                        }`}
                        key={incident.id}
                      >
                        <IncidentCard
                          incident={incident}
                          checked={selectedIncidents.includes(incident.id)}
                          onCheck={handleIncidentCheck}
                          status={status}
                        />
                      </div>
                    ))}
                </div>
              ))}
              { !selectedTicket ? <span className="text-white d-flex no_card_p justify-content-center">Please select a ticket  for AI recommendation</span> : <>
              <div className="d-flex justify-content-center mt-4 mb-2">
                {status !== "Recommended" ? (
                  <>
                    <button
                      type="button"
                      className="prb_action-btn me-3"
                      onClick={handleUpdateClick}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="prb_action-btn"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="prb_action-btn me-3"
                      onClick={handleApproveClick}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="prb_action-btn"
                      onClick={handleRejectClick}
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
              </>}
              

              <ProblemPopUpModal
                show={showModal}
                onClose={handleCloseModal}
                onSave={handleSave}
                reason={rejectionReason}
                setReason={setRejectionReason}
                saveButtonName={"Save"}
                title={"Please mention the reason for rejection"}
                quizListData={null} 
                setSelectedQuizId={null}
              />
                <Loader isLoading={isLoading} load={null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
