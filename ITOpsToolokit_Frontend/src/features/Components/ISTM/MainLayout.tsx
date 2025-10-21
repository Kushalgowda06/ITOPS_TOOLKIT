import React, { useEffect, useState } from "react";
import ITSMPanel from "../ISTM/ITSMPanel";
import KnowledgeAssist from "../ISTM/KnowledgeAssist";
import TechAssist from "../ISTM/TechAssist";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectCommonConfig,
  setActiveUserDetails,
  setLocalStorageUsers,
  setLoginDetails,
  setUserRolesApiData,
  setUsersApiData,
} from "../CommonConfig/commonConfigSlice";
import ITSMDetailsPanel from "./ITSMDetailsPanel";
import { Api } from "../../Utilities/api";
import axios from "axios";
import serviceNowAxios from "../../../api/ServicenowAxios";

const MainLayout = () => {
  const [tickets, setTickets] = useState([]);
  console.log(tickets , "tickets")
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [workNotesFromTechAssist, setWorkNotesFromTechAssist] = useState("");
  const user = "6616888923130c085e31da31jbjnj";
  const currentUsers: any = useAppSelector(selectCommonConfig);
  const [currentFilter, setCurrentFilter] = useState("incident");

  const handleWorkNotesUpdate = (workNotes: string) => {
    setWorkNotesFromTechAssist(workNotes);
    console.log("Work notes updated from TechAssist:", workNotes);
  };
  console.log("currentUsers", currentUsers);

  const fetchIncidents = async () => {
    try {
      // Use ServiceNow axios instance to avoid authentication conflicts
      const response = await serviceNowAxios.get(
        `https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_query=state%20not%20in%206%2C%207%5Eassignment_group.name%3DIncident%20Management&sysparm_limit=100`
      );

      const incidents = response?.data?.result || [];
      // Normalize incident data structure

      console.log(incidents , "incidents call")
      return incidents.map((incident) => ({
        ...incident,
        assigned_to:
          incident.assigned_to?.name ||
          incident.assigned_to?.value ||
          incident.assigned_to ||
          "",
        assignment_group:
          incident.assignment_group?.name ||
          incident.assignment_group?.value ||
          incident.assignment_group ||
          "",
        priority: incident.priority?.value || incident.priority || "",
        state: incident.state?.value || incident.state || "",
        urgency: incident.urgency?.value || incident.urgency || "",
        impact: incident.impact?.value || incident.impact || "",
        caller_id: incident.caller_id?.value || incident.caller_id || "",
        type: "incident",
      }));
    } catch (error) {
      console.error("Error fetching incidents: ", error);
      return [];
    }
  };

  const fetchProblemTasks = async () => {
    try {
      const response = await serviceNowAxios.get(
        `https://cisicmpengineering1.service-now.com/api/now/table/problem_task?sysparm_query=stateNOT IN6,7^numberINPTASK0010326,PTASK0010327,PTASK0010329,PTASK0010330&sysparm_fields=sys_id,number,problem.number,caller_id,location,sys_created_by,opened_by,sys_created_on,state,hold_reason,cmdb_ci,priority,category,subcategory,assignment_group,assigned_to,short_description,description,comments_and_work_notes`
      );

      const problemTasks = response?.data?.result || [];
      // Normalize problem task data structure
      return problemTasks.map((task) => ({
        ...task,
        assigned_to:
          task.assigned_to?.name ||
          task.assigned_to?.value ||
          task.assigned_to ||
          "",
        assignment_group:
          task.assignment_group?.name ||
          task.assignment_group?.value ||
          task.assignment_group ||
          "",
        priority: task.priority?.value || task.priority || "",
        state: task.state?.value || task.state || "",
        category: task.category?.value || task.category || "",
        subcategory: task.subcategory?.value || task.subcategory || "",
        caller_id: task.caller_id?.value || task.caller_id || "",
        location: task.location?.value || task.location || "",
        sys_created_by: task.sys_created_by?.value || task.sys_created_by || "",
        opened_by: task.opened_by?.value || task.opened_by || "",
        cmdb_ci: task.cmdb_ci?.value || task.cmdb_ci || "",
        hold_reason: task.hold_reason?.value || task.hold_reason || "",
        type: "problem_task",
      }));
    } catch (error) {
      console.error("Error fetching problem tasks: ", error);
      return [];
    }
  };
  // const customData = async () => {
  //   const username = "ServicenowAPI";
  //   const password = "Qwerty@123";
  //   const options = {
  //     auth: {
  //       username: username,
  //       password: password,
  //     },
  //   };

  //   try {
  //     const response = await Api.getCallOptions(
  //       `https://cisicmpengineering1.service-now.com/api/now/table/incident?sysparm_fields=sys_id,number,opened_by,state,priority,assigned_to,urgency,assignment_group,impact,short_description,description,comments_and_work_notes,comments&sysparm_query=assigned_to.user_name%3D452971%5Estate!%3D7&sysparm_limit=10`,
  //       options
  //     );

  //     if (response?.data?.result) {
  //       console.log("API Response:", response.data.result);
  //       console.log("Sample ticket structure:", response.data.result[0]);
  //       setTickets(response.data.result);
  //       if (response.data.result.length > 0) {
  //         setSelectedTicket(response.data.result[0]);
  //       }
  //     } else {
  //       console.warn("No data received from API");
  //       setTickets([]);
  //       setSelectedTicket(null);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching tickets:", error);
  //     setTickets([]);
  //     setSelectedTicket(null);
  //   }
  // };

  // useEffect(() => {
  //   customData()
  // }, [])

  const loadTickets = async (filterType ) => {
    let ticketData = [];

    if (filterType === "incident") {
      ticketData = await fetchIncidents();
    } else if (filterType === "problem_task") {
      ticketData = await fetchProblemTasks();
    }

    console.log(ticketData , "ticketData")
    // fetchKnowledgeAssistContent(
    //   selectedTicket[0].short_description,
    //   selectedTicket[0].description
    // );
    setTickets(ticketData);
    // const firstTicket = ticketData[0];
    // if (firstTicket) {
    //   setSelectedTicket(firstTicket);
    //   // Automatically fetch knowledge assist content for the first ticket
    // if (setSelectedTicket?.short_description && setSelectedTicket.description) {

    // }
    // } else {
    setSelectedTicket(null);
    setKnowledgeAssistContent(null);
    // }
  };

  const handleFilterChange = (filterType) => {
  console.log("here Filter type" , filterType)
    setCurrentFilter(filterType);
    loadTickets(filterType);
  };

  console.log(currentFilter , "currentFilter")
  useEffect(() => {
    loadTickets(currentFilter);
  }, [currentFilter])

  const customData = async () => {
    await loadTickets("incident"); // Load incidents by default
  };

  useEffect(() => {
    customData();
    setSelectedTicket(null);
    setKnowledgeAssistContent(null);
  }, []);

  useEffect(() => {
    setWorkNotesFromTechAssist("");
    // customData();
    if (
      selectedTicket &&
      selectedTicket.short_description &&
      selectedTicket.description
    ) {
      fetchKnowledgeAssistContent(
        selectedTicket.short_description,
        selectedTicket.description
      );
    }
  }, [selectedTicket]);

  console.log("Items", tickets);

  const [knowledgeAssistContent, setKnowledgeAssistContent] = useState(null);
  const [knowledgeAssistLoading, setKnowledgeAssistLoading] = useState(false);

  const fetchKnowledgeAssistContent = async (shortDescription, description) => {
    if (!shortDescription || !description) return;

    const options = {
      auth: {
        username: "ServicenowAPI",
        password: "Qwerty@123",
      },
    };

    setKnowledgeAssistLoading(true);
    try {
      const response = await axios.post(
        "https://predemo_backend.autonomousitopstoolkit.com/kb_management/api/v1/get_contextual_response/",
        { query: shortDescription + description },
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

      if (response.data) {
        setKnowledgeAssistContent(response.data);
      }
    } catch (error) {
      console.error("Error fetching knowledge assist content:", error);
      setKnowledgeAssistContent({
        error: "Failed to fetch knowledge assist content. Please try again.",
      });
    } finally {
      setKnowledgeAssistLoading(false);
    }
  };

  const hasKnowledgeAssistSuccess = () => {
    return (
      !knowledgeAssistLoading &&
      knowledgeAssistContent &&
      !knowledgeAssistContent.error
    );
  };
  console.log(
    "knowledgeAssistContent",
    selectedTicket,
    knowledgeAssistLoading,
    knowledgeAssistContent,
    knowledgeAssistContent
  );
  // console.log("selectedTicket",knowledgeAssistContent);
  // console.log("selectedTicket",selectedTicket);

  const [chatHistory , setChatHistory] = useState()
  
  return (
    <div className="container-fluid p-0 pe-2 mt-1 ">
      <div className="row g-0">
        {/* Left Column */}
        <div className="col-12 col-md-3 gap-1 d-flex flex-column text-white">
          <div className="">
            <ITSMPanel
              tickets={tickets}
              selectedTicket={selectedTicket}
              setSelectedTicket={setSelectedTicket}
              onFilterChange={handleFilterChange}
              currentFilter={currentFilter}
              workNotesFromTechAssist={workNotesFromTechAssist}
            />
          </div>
          {/* <div className=""><ITSMDetailsPanel selectedTicket={selectedTicket} workNotesFromTechAssist={workNotesFromTechAssist} /></div> */}
        </div>

        {/* Right Column */}
        <div className="col-12 col-md-5 d-flex flex-column ">
          <div className=" me-1 border rounded ">
            {/* <TechAssist selectedTicket={selectedTicket} onWorkNotesUpdate={handleWorkNotesUpdate}/> */}
            <TechAssist
              selectedTicket={selectedTicket}
              knowledgeAssistContent={knowledgeAssistContent}
              knowledgeAssistSuccess={hasKnowledgeAssistSuccess()}
              knowledgeAssistLoading={knowledgeAssistLoading}
              onWorkNotesUpdate={handleWorkNotesUpdate}
            />
          </div>

          {/* <div className=" bg-light border rounded "><TechAssist selectedTicket={selectedTicket} onWorkNotesUpdate={handleWorkNotesUpdate}/></div> */}
        </div>
        <div className="col-12 col-md-4 d-flex flex-column ">
          {/* <div className=" bg-light border rounded ">  <KnowledgeAssist selectedTicket={selectedTicket} /></div> */}
          <div className="  border rounded me-1 ">
            {" "}
            <KnowledgeAssist selectedTicket={selectedTicket} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
