import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import {
  TextField,
  Tooltip,
  InputAdornment,
  Card,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Box,
  Autocomplete,
} from "@mui/material";
import { Button, Menu, MenuItem } from "@mui/material";
import {
  Search,
  Person,
  Group,
  PersonOff,
  ExpandMore,
  Close,
} from "@mui/icons-material";
import { Api } from "../../Utilities/api";
import HeaderBar from "../AksCluster/TitleHeader";
import { Controller, useForm, useWatch } from "react-hook-form";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import { ArrowDropDownIcon } from "@mui/x-date-pickers/icons";
import {
  selectCommonConfig,
  setActiveUserDetails,
  setLocalStorageUsers,
  setLoginDetails,
  setUserRolesApiData,
  setUsersApiData,
} from "../CommonConfig/commonConfigSlice";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

const ITSMPanel = ({
  tickets,
  selectedTicket,
  setSelectedTicket,
  onFilterChange,
  currentFilter,
  workNotesFromTechAssist,
}) => {
  const [active, setactive] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [selectedFilter, setSelectedFilter] = useState<
    "person" | "group" | "personoff"
  >("person"); // Default to person
  const [apiTickets, setApiTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ticketNames, setTicketNames] = useState({});
  // const [assignmentGroups, setAssignmentGroups] = useState([]);
  const [expandedTicket, setExpandedTicket] = useState(null); // For accordion
  const [showTicketDetails, setShowTicketDetails] = useState(false); // For accordion visibility
  const cloudData = useAppSelector(selectCommonConfig);

  /////////////////////
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const urgencyOptions = ["1 - High", "2 - Medium", "3 - Low"];
  const impactOptions = ["1 - High", "2 - Medium", "3 - Low"];

  const [assignmentGroups, setAssignmentGroups] = useState([]);
  const [assignTo, setAssignTo] = useState([]);
  const [state, setState] = useState([]);
  const [assignedToName, setAssignedToName] = useState("");
  const [assignmentGroupName, setAssignmentGroupName] = useState("");

  // const getFieldValue = (field) => {
  //   if (!field) return "";
  //   if (typeof field === "string") return field;
  //   if (typeof field === "object" && field.value !== undefined) return field.value;
  //   if (typeof field === "object" && field.display_value !== undefined) return field.display_value;
  //   return "";
  // };
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);

  const getSearchableText = (field) => {
    const value = getFieldValue(field);
    return value ? value.toLowerCase() : "";
  };

  const current_user = cloudData?.loginDetails?.currentUser;
  const current_user_sysID =
    cloudData?.loginDetails?.currentuserDetails?.sys_id;
  console.log("current_user_sysID : ", current_user_sysID);
  // const getFieldLink = (field) => {
  //   if (!field) return "";
  //   if (typeof field === "object" && field.link !== undefined) return field.link;
  //   return "";
  // };

  // const mapStateNumberToLabel = (stateValue) => {
  //   const stateNum = parseInt(getFieldValue(stateValue));
  //   switch (stateNum) {
  //     case 1:
  //       return "New";
  //     case 2:
  //       return "In Progress";
  //     case 3:
  //       return "On Hold";
  //     case 4:
  //       return "Close Incomplete";
  //     case 6:
  //       return "Resolved";
  //     case 7:
  //       return "Closed";
  //     case 8:
  //       return "Canceled";
  //     case -5:
  //       return "Pending";
  //     default:
  //       return getFieldValue(stateValue) || "Unknown";
  //   }
  // };

  const fetchNameFromLink = async (link) => {
    try {
      const options = {
        auth: {
          username: "ServicenowAPI",
          password: "Qwerty@123",
        },
      };

      console.log("Fetching name from:", link);
      const response = await Api.getCallOptions(link, options);

      if (response?.data?.result?.name) {
        console.log("Fetched name:", response.data.result.name);
        return response.data.result.name;
      } else if (response?.data?.result?.user_name) {
        console.log("Fetched user_name:", response.data.result.user_name);
        return response.data.result.user_name;
      } else {
        console.log("No name found in response");
        return null;
      }
    } catch (error) {
      console.error("Error fetching name from link:", error);
      return null;
    }
  };

  const resolveTicketNames = async (tickets) => {
    if (!tickets || tickets.length === 0) return;

    const namePromises = {};
    const newTicketNames = { ...ticketNames };

    for (const ticket of tickets) {
      const ticketId = ticket.sys_id;

      if (newTicketNames[ticketId]) continue;

      newTicketNames[ticketId] = {
        assignedTo: getFieldValue(ticket.assigned_to),
        assignmentGroup: getFieldValue(ticket.assignment_group),
      };

      const assignedToLink = getFieldLink(ticket.assigned_to);
      if (assignedToLink) {
        namePromises[`${ticketId}_assignedTo`] = fetchNameFromLink(
          assignedToLink
        ).then((name) => {
          if (name) {
            newTicketNames[ticketId].assignedTo = name;
          }
        });
      }

      const assignmentGroupLink = getFieldLink(ticket.assignment_group);
      if (assignmentGroupLink) {
        namePromises[`${ticketId}_assignmentGroup`] = fetchNameFromLink(
          assignmentGroupLink
        ).then((name) => {
          if (name) {
            newTicketNames[ticketId].assignmentGroup = name;
          }
        });
      }
    }

    if (Object.keys(namePromises).length > 0) {
      try {
        await Promise.all(Object.values(namePromises));
        setTicketNames(newTicketNames);
        console.log("All ticket names resolved:", newTicketNames);
      } catch (error) {
        console.error("Error resolving ticket names:", error);
        setTicketNames(newTicketNames);
      }
    } else {
      setTicketNames(newTicketNames);
    }
  };

  const getDisplayName = (ticket, field) => {
    const ticketId = ticket.sys_id;
    const ticketData = ticketNames[ticketId];

    if (!ticketData) {
      if (field === "assigned_to") return;
      if (field === "assignment_group") return;
      return getFieldValue(ticket[field]) || "";
    }

    if (field === "assigned_to") {
      return ticketData.assignedTo;
    } else if (field === "assignment_group") {
      return ticketData.assignmentGroup;
    }

    return getFieldValue(ticket[field]) || "";
  };

  const fetchTicketsByType = async (
    filterType: "person" | "group" | "personoff"
  ) => {
    setLoading(true);
    const options = {
      auth: {
        username: "ServicenowAPI",
        password: "Qwerty@123",
      },
    };

    try {
      let queryParams = "";
      switch (filterType) {
        case "person":
          queryParams = `sysparm_query=assigned_to%3D${current_user_sysID}%5EstateNOT%20IN6%2C7%2C3&sysparm_limit=10`;
          break;
        case "group":
          // queryParams = 'sysparm_query=assignment_group= ';
          if (assignmentGroups.length > 0) {
            console.log("assignmentGroups123: ", assignmentGroups);
            const groupConditions = assignmentGroups
              .map((group) => `${group?.sys_id}`)
              .join("%3D");
            console.log("groupConditions", groupConditions);
            queryParams = `sysparm_query=${groupConditions}^state!%3D7&sysparm_fields=sys_id,number,opened_by,state,priority,assigned_to,urgency,assignment_group,impact,short_description,description,comments_and_work_notes,comments&sysparm_limit=50`;
          } else {
            queryParams =
              "sysparm_query=assignment_group!=NULL^assigned_to=NULL^state!%3D7&sysparm_fields=sys_id,number,opened_by,state,priority,assigned_to,urgency,assignment_group,impact,short_description,description,comments_and_work_notes,comments&sysparm_limit=50";
          }
          break;
        case "personoff":
          queryParams =
            "sysparm_query=assigned_toISEMPTY%5EstateNOT%20IN6%2C7%2C3&sysparm_limit=15";
          break;
      }

      console.log("queryParams123 : ", queryParams);
      const apiUrl = `https://cisicmpengineering1.service-now.com/api/now/table/incident?${queryParams}`;

      console.log(`🔍 Fetching ${filterType} tickets from:`, apiUrl);

      const response = await Api.getCallOptions(apiUrl, options);

      if (response?.data?.result) {
        const fetchedTickets = response.data.result;
        console.log(
          `Fetched ${fetchedTickets.length} ${filterType} tickets`,
          fetchedTickets
        );
        setApiTickets(fetchedTickets);
        setFilteredTickets(fetchedTickets);

        // if (filterType === 'person') {
        //   const groups = fetchedTickets
        //     .map(ticket => getFieldValue(ticket.assignment_group))
        //     .filter(group => group && group !== "")
        //     .filter((group, index, self) => self.indexOf(group) === index);

        //   setAssignmentGroups(groups);
        //   console.log(`Collected ${groups.length} assignment groups from person tickets:`, groups);
        // }

        if (fetchedTickets.length > 0) {
          setSelectedTicket(null);
          setactive(null);
        } else {
          setSelectedTicket(null);
          setactive(null);
        }
      } else {
        console.warn(`No tickets found for ${filterType}`);
        setApiTickets([]);
        setFilteredTickets([]);
        setSelectedTicket(null);
        setactive(null);
      }
    } catch (error) {
      console.error(`Error fetching ${filterType} tickets:`, error);
      setApiTickets([]);
      setFilteredTickets([]);
      setSelectedTicket(null);
      setactive(null);
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = (filterType: "person" | "group" | "personoff") => {
    console.log(`Icon clicked: ${filterType}`);
    setSelectedFilter(filterType);
    setSearchTerm("");
    setTicketNames({});
    fetchTicketsByType(filterType);
  };

  useEffect(() => {
    fetchTicketsByType("person");
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTickets(apiTickets);
      return;
    }

    const lower = searchTerm.toLowerCase();
    const filtered = apiTickets.filter(
      (ticket) =>
        getSearchableText(ticket.number).includes(lower) ||
        getSearchableText(ticket.short_description).includes(lower) ||
        getSearchableText(ticket.state).includes(lower) ||
        getSearchableText(ticket.assigned_to).includes(lower) ||
        getSearchableText(ticket.assignment_group).includes(lower)
    );
    setFilteredTickets(filtered);
  }, [searchTerm, apiTickets]);

  useEffect(() => {
    resolveTicketNames(apiTickets);
  }, [apiTickets]);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleClick = (ticket, index) => {
    setSelectedTicket(ticket);
    setExpandedTicket(ticket.sys_id);
    setShowTicketDetails(true);
    setIsAccordionOpen(true); // freeze scroll

    const reordered = [
      ticket,
      ...filteredTickets.filter((t) => t.sys_id !== ticket.sys_id),
    ];
    setFilteredTickets(reordered);
  };

  const handleAccordionClose = () => {
    setExpandedTicket(null);
    setShowTicketDetails(false);
    setIsAccordionOpen(false); // restore scroll
  };

  useEffect(() => {
    if (apiTickets.length > 0) {
      console.log("Sample ticket structure:", apiTickets[0]);
    }
  }, [apiTickets]);
  ////////////////////////////////////////////////

  const getFieldValue = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field.value !== undefined)
      return field.value;
    if (typeof field === "object" && field.display_value !== undefined)
      return field.display_value;
    return "";
  };

  const getFieldLink = (field) => {
    if (!field) return "";
    if (typeof field === "object" && field.link !== undefined)
      return field.link;
    return "";
  };

  const fetchAssignedToName = async (assignedToField) => {
    if (!assignedToField) {
      setAssignedToName("");
      return;
    }

    const link = getFieldLink(assignedToField);
    if (!link) {
      setAssignedToName(getFieldValue(assignedToField));
      return;
    }

    try {
      const options = {
        auth: {
          username: "ServicenowAPI",
          password: "Qwerty@123",
        },
      };

      const response = await Api.getCallOptions(link, options);

      if (response?.data?.result?.name) {
        setAssignedToName(response.data.result.name);
      } else if (response?.data?.result?.user_name) {
        setAssignedToName(response.data.result.user_name);
      } else {
        setAssignedToName(getFieldValue(assignedToField));
      }
    } catch (error) {
      console.error("Error fetching assigned_to name:", error);
      setAssignedToName(getFieldValue(assignedToField));
    }
  };

  const fetchAssignmentGroupName = async (assignmentGroupField) => {
    if (!assignmentGroupField) {
      setAssignmentGroupName("");
      return;
    }

    const link = getFieldLink(assignmentGroupField);
    if (!link) {
      setAssignmentGroupName(getFieldValue(assignmentGroupField));
      return;
    }

    try {
      const options = {
        auth: {
          username: "ServicenowAPI",
          password: "Qwerty@123",
        },
      };

      const response = await Api.getCallOptions(link, options);

      if (response?.data?.result?.name) {
        setAssignmentGroupName(response.data.result.name);
      } else {
        setAssignmentGroupName(getFieldValue(assignmentGroupField));
      }
    } catch (error) {
      console.error("Error fetching assignment_group name:", error);
      setAssignmentGroupName(getFieldValue(assignmentGroupField));
    }
  };

  useEffect(() => {
    if (selectedTicket) {
      fetchAssignedToName(selectedTicket.assigned_to);
      fetchAssignmentGroupName(selectedTicket.assignment_group);
    }
  }, [selectedTicket]);

  const mapStateNumberToLabel = (value: number): string => {
    switch (value) {
      case 1:
        return "New";
      case 2:
        return "In Progress";
      case 3:
        return "On Hold";
      case 4:
        return "Close Incomplete";
      case 6:
        return "Resolved";
      case 7:
        return "Closed";
      case 8:
        return "Canceled";
      case -5:
        return "Pending";
      default:
        return "";
    }
  };

  const mapStateLabelToNumber = (label: string): number => {
    switch (label) {
      case "New":
        return 1;
      case "In Progress":
        return 2;
      case "On Hold":
        return 3;
      case "Close Incomplete":
        return 4;
      case "Resolved":
        return 6;
      case "Closed":
        return 7;
      case "Canceled":
        return 8;
      case "Pending":
        return -5;
      default:
        return 0;
    }
  };

  const mapUrgencyNumberToLabel = (num) =>
    urgencyOptions[parseInt(getFieldValue(num)) - 1] || "";
  const mapUrgencyLabelToNumber = (label) => label.split(" ")[0];

  const mapImpactNumberToLabel = (num) =>
    impactOptions[parseInt(getFieldValue(num)) - 1] || "";
  const mapImpactLabelToNumber = (label) => label.split(" ")[0];

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isDirty, errors, dirtyFields },
    setValue,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      number: "",
      openedBy: "",
      state: "",
      priority: "",
      assignTo: "",
      urgency: "",
      assignmentGroup: "",
      impact: "",
      short_description: "",
      resolution_notes: "",
      description: "",
      comments_and_work_notes: "",
      comments: "",
    },
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [conclusiveNotesGenerated, setConclusiveNotesGenerated] = useState(
    new Set()
  );
  const [isGeneratingConclusiveNotes, setIsGeneratingConclusiveNotes] =
    useState(false);

  // type StateOption = {
  //   label: string;
  //   value: string;
  // };

  const watchedState = useWatch<any>({
    control,
    name: "state",
  });

  const generateConclusiveNotes = async (
    shortDescription,
    description,
    workNotes
  ) => {
    if (!shortDescription || !description) {
      return;
    }

    setIsGeneratingConclusiveNotes(true);
    try {
      const requestBody = {
        query: `Below is the description of the issue - 
  
  ${shortDescription}
  ${description}
  
  Below are the work notes relevant to this issue - 
  
  ${workNotes || "No work notes available"}
  
  Prepare conclusive notes those include short summary of issue, cause and resolution steps taken.`,
      };

      const response = await axios.post(
        "https://predemo_backend.autonomousitopstoolkit.com/kb_management/api/v1/get_contextual_response/",
        requestBody,
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
      // const response = await Api.postCall(
      //   "https://predemo_backend.autonomousitopstoolkit.com/llm/api/v1/ask_llm_in_isolation/",
      //   requestBody
      // );

      if (response.data) {
        let conclusiveNotes = "";
        if (response.data.output && response.data.output.data) {
          conclusiveNotes = response.data.output.data;
        } else if (response.data.data) {
          conclusiveNotes = response.data.data;
        } else if (response.data.response) {
          conclusiveNotes = response.data.response;
        } else if (typeof response.data === "string") {
          conclusiveNotes = response.data;
        } else {
          conclusiveNotes = "Conclusive notes generated successfully.";
        }
        // Update the resolution_notes field with the conclusive notes
        setValue("resolution_notes", conclusiveNotes);
      }
    } catch (error) {
      console.error("Error generating conclusive notes:", error);
      // Optionally show an error message to the user
      setSubmitMessage(
        "Failed to generate conclusive notes. Please try again."
      );
      setMessageType("error");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 5000);
    } finally {
      setIsGeneratingConclusiveNotes(false);
    }
  };

  useEffect(() => {
    // Check if the dropdown value is "Resolved"
    if (watchedState && watchedState.label === "Resolved" && selectedTicket) {
      // Create a unique key for this ticket and state combination
      const ticketStateKey = `${
        selectedTicket.number || selectedTicket.sys_id
      }_resolved`;

      // Only generate if not already generated for this ticket
      if (
        !conclusiveNotesGenerated.has(ticketStateKey) &&
        !isGeneratingConclusiveNotes
      ) {
        const shortDescription =
          watch("short_description") || selectedTicket.short_description;
        const description = watch("description") || selectedTicket.description;
        const workNotes = watch("comments");

        if (shortDescription && description) {
          // Mark ticket as processed
          setConclusiveNotesGenerated(
            (prev) => new Set([...prev, ticketStateKey])
          );
          generateConclusiveNotes(shortDescription, description, workNotes);
        }
      }
    }
  }, [watchedState, setValue]);

  useEffect(() => {
    if (selectedTicket) {
      // Map state number to label for display
      const stateValue = getFieldValue(selectedTicket.state);
      const stateLabelValue = mapStateNumberToLabel(parseInt(stateValue));

      reset({
        number: getFieldValue(selectedTicket.number),
        openedBy: getFieldValue(selectedTicket.opened_by),
        state: stateLabelValue,
        priority: getFieldValue(selectedTicket.priority),
        assignTo: assignedToName || getFieldValue(selectedTicket.assigned_to), // Use fetched name or fallback
        urgency: mapUrgencyNumberToLabel(selectedTicket.urgency),
        assignmentGroup:
          assignmentGroupName || getFieldValue(selectedTicket.assignment_group), // Use fetched name or fallback
        impact: mapImpactNumberToLabel(selectedTicket.impact),
        short_description: getFieldValue(selectedTicket.short_description),
        resolution_notes: getFieldValue(selectedTicket.resolution_notes),

        description: getFieldValue(selectedTicket.description),
        comments_and_work_notes:
          workNotesFromTechAssist ||
          getFieldValue(selectedTicket.comments_and_work_notes),
        comments: getFieldValue(selectedTicket.comments) || "",
      });

      // console.log("Form reset with values:", {
      //   state: stateLabelValue,
      //   assignTo: assignedToName || getFieldValue(selectedTicket.assigned_to),
      //   assignmentGroup: assignmentGroupName || getFieldValue(selectedTicket.assignment_group)
      // });
    }
  }, [
    selectedTicket,
    workNotesFromTechAssist,
    assignedToName,
    assignmentGroupName,
    reset,
  ]); // Added assignedToName and assignmentGroupName dependencies

  useEffect(() => {
    const fetchData = async () => {
      const options = {
        auth: {
          username: "ServicenowAPI",
          password: "Qwerty@123",
        },
      };
      try {
        const [groups, assigns, states] = await Promise.all([
          Api.getCallOptions(
            `https://cisicmpengineering1.service-now.com/api/now/table/sys_user_group?sysparm_query=user%3D${current_user_sysID}&sysparm_fields=sys_id%2Cname&sysparm_limit=10`,
            options
          ),
          Api.getCallOptions(
            `https://cisicmpengineering1.service-now.com/api/now/table/sys_user?sysparm_fields=user_name`,
            options
          ),
          Api.getCallOptions(
            `https://cisicmpengineering1.service-now.com/api/now/table/sys_choice?sysparm_query=name=incident^element=incident_state`,
            options
          ),
        ]);
        setAssignmentGroups(groups?.data?.result);
        setAssignTo(assigns?.data?.result);
        setState(states?.data?.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    if (!isDirty) {
      setSubmitMessage("No changes detected.");
      setMessageType("info");
      return;
    }

    const options = {
      auth: {
        username: "ServicenowAPI",
        password: "Qwerty@123",
      },
    };
    const dataToSend = {};
    Object.keys(dirtyFields).forEach((field) => {
      if (dirtyFields[field]) {
        let value = data[field];
        switch (field) {
          case "urgency":
            value = mapUrgencyLabelToNumber(data.urgency);
            break;
          case "impact":
            value = mapImpactLabelToNumber(data.impact);
            break;
          case "state":
            value = mapStateLabelToNumber(data.state);
            break;
          case "assignTo":
            // For assignTo, if we're updating and the value is a name,
            // we need to send the original value from selectedTicket
            if (data.assignTo === assignedToName) {
              value = getFieldValue(selectedTicket?.assigned_to);
            } else {
              value = data[field];
            }
            break;
          case "assignmentGroup":
            // For assignmentGroup, if we're updating and the value is a name,
            // we need to send the original value from selectedTicket
            if (data.assignmentGroup === assignmentGroupName) {
              value = getFieldValue(selectedTicket?.assignment_group);
            } else {
              value = data[field];
            }
            break;
          default:
            value = data[field];
        }

        dataToSend[field] = value;
      }
    });

    try {
      setIsSubmitting(true);
      const res = await axios.patch(
        `https://cisicmpengineering1.service-now.com/api/now/table/incident/${selectedTicket?.sys_id}`,
        dataToSend,
        options
      );
      if (res.status === 200) {
        setSubmitMessage("Ticket updated successfully!");
        setMessageType("success");
        reset({
          ...data,
          urgency: mapUrgencyNumberToLabel(
            mapUrgencyLabelToNumber(data.urgency)
          ),
          impact: mapImpactNumberToLabel(mapImpactLabelToNumber(data.impact)),
          state: mapStateNumberToLabel(mapStateLabelToNumber(data.state)),
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      setSubmitMessage("Failed to update ticket.");
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitMessage("");
        setMessageType("");
      }, 4000);
    }
  };

  const handleFilterChange = (filterType) => {
    setSelectedTaskType(filterType);
    setactive(0); // Reset active selection when filter changes
    if (onFilterChange) {
      onFilterChange(filterType);
    }
  };

  const [selectedTaskType, setSelectedTaskType] = useState("incident");

  const tasksTypeOption = ["incident", "P_task"];
  const formatLabel = (str) =>
    str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <div className=" rounded-top shadow-lg text-dark custom-rounded me-1">
      <div className="d-flex align-items-center justify-content-between px-3 py-2 rounded-top istm_header_height box-shadow text-white">
        <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold ">
          {/* ===== Task type menu (MUI Menu - portal rendered to body) ===== */}
          <div>
            <Button
              id="task-type-button"
              aria-controls={menuOpen ? "task-type-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
              onClick={(e) => setMenuAnchorEl(e.currentTarget)}
              className="itsm_header-dropdown "
              // keep styling consistent with your existing class; change variant if needed
              variant="text"
              size="small"
              endIcon={<ArrowDropDownIcon />}
            >
              <span className="inc_btn_text">
                {formatLabel(
                  selectedTaskType === "incident" ? "INC" : "P-Task"
                )}
                {/* {selectedTaskType === "incident" ? "INC" : "P-Task"} */}
              </span>
            </Button>

            <Menu
              id="task-type-menu"
              anchorEl={menuAnchorEl}
              open={menuOpen}
              className="itsm_dropdown-menu glass-shadow"
              onClose={() => setMenuAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              // MUI Menu uses a portal by default, so it will not be clipped by parent overflow
              PaperProps={{
                sx: {
                  backdropFilter: "blur(24px)", // frosted glass blur
                  backgroundColor: "rgb(2 79 148 / 29%)", // semi-transparent dark
                  // borderRadius: "1px",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  // boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  color: "white",
                  zIndex: 3000,
                  marginLeft: "10px",
                  boxShadow:
                    "0px 8px 32px rgba(0, 0, 0, 0.1), 0px 2px 8px rgba(255, 255, 255, 0.3) inset, 0px -2px 8px rgba(255, 255, 255, 0.15) inset, 0px 1px 0px rgba(255, 255, 255, 0.4) inset",
                },
              }}
            >
              {tasksTypeOption.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    handleFilterChange(option);
                    setMenuAnchorEl(null);
                  }}
                  className="inc_btn_text"
                  sx={{
                    fontSize: "10px",
                    // backgroundColor: "rgba(255, 255, 255, 0.15)",
                    // "&:hover": {
                    //   backgroundColor: "rgba(255, 255, 255, 0.15)",
                    // },
                  }}
                >
                  {formatLabel(option)}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* <div className="dropdown">
            <button
              role="button"
              className="dropdown-toggle glass-header-partial-border px-1 rounded text-white border-none "
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span className="text-md">{selectedTaskType == "incident" ? "INC" : "P-Task"}</span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {tasksTypeOption.map((option, index) => (
                <li key={index}>
                  <button
                    className="dropdown-item"
                    onClick={() => handleFilterChange(option)}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          </div> */}

          {/* <Dropdown  >
            <Dropdown.Toggle className="itsm_header-dropdown" id="dropdown-basic">
              <span className="text-md">{selectedTaskType == "incident" ? "INC" : "P-Task"}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="itsm_dropdown-menu">
              {tasksTypeOption.map((option, index) => (
                <Dropdown.Item key={index}>
                  <div
                    className="dropdown-item"
                    onClick={() => handleFilterChange(option)}
                  >
                    {option}
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown> */}

          {/* <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Dropdown button
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </div> */}
        </div>
        <div className="mt-1 seach_layout">
          <TextField
            fullWidth
            size="small"
            className="bg-white rounded"
            variant="outlined"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="search_icon" />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <Tooltip title="Personal Tickets" arrow>
          <IconButton
            onClick={() => handleIconClick("person")}
            sx={{
              color: "white",
              backgroundColor:
                selectedFilter === "person"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              },
            }}
          >
            <Person />
          </IconButton>
        </Tooltip>
        <Tooltip title="Group Tickets" arrow>
          <IconButton
            onClick={() => handleIconClick("group")}
            sx={{
              color: "white",
              backgroundColor:
                selectedFilter === "group"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              },
            }}
          >
            <Group />
          </IconButton>
        </Tooltip>
        <Tooltip title="Unassigned Tickets" arrow>
          <IconButton
            onClick={() => handleIconClick("personoff")}
            sx={{
              color: "white",
              backgroundColor:
                selectedFilter === "personoff"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "transparent",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                color: "white",
              },
            }}
          >
            <PersonOff />
          </IconButton>
        </Tooltip>
      </div>
      {/* Ticket List */}
      <div>
        {/* <div className="px-3 py-2 glass-header-partial-border border-bottom border-white border-opacity-10">
          <div className="d-flex justify-content-center gap-1">
            <button
              onClick={() => handleFilterChange("incident")}
              className={`px-4 py-1 rounded  itsm-glass-card text-xs fw-medium transition ${currentFilter === "incident"
                ? "text-white shadow"
                : "text-white border border-secondary-subtle"
                }`}
            >
              Incident
            </button>
            <button
              onClick={() => handleFilterChange("problem_task")}
              className={`px-4 py-1 rounded  itsm-glass-card text-xs fw-medium transition ${currentFilter === "problem_task"
                ? "text-white shadow"
                : "text-white border border-secondary-subtle"
                }`}
            >
              P-Tasks
            </button>
          </div>
        </div> */}

        <div
          className={`flex-grow-1 mt-1 itsm_pannel ${
            isAccordionOpen ? "no-scroll" : "overflow-scroll"
          }`}
        >
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">
                Loading {selectedFilter} tickets...
              </p>
            </div>
          ) : filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => {
              // Debug logging to check state value
              console.log("Ticket state raw:", ticket.state);
              console.log(
                "Ticket state getFieldValue:",
                getFieldValue(ticket.state)
              );
              console.log(
                "Ticket state parseInt:",
                parseInt(getFieldValue(ticket.state))
              );

              return (
                <div key={ticket.sys_id || index}>
                  <Card
                    className={`ticket-card itsm-glass-card itsm-fixed-height-card text-white mb-1 p-2 ${
                      active === index ? "selected" : ""
                    }`}
                    onClick={() => handleClick(ticket, index)}
                  >
                    <div className="d-flex justify-content-between card_p align-items-center">
                      <span>
                        <strong className="card_title">
                          {getFieldValue(ticket.number)}
                        </strong>
                      </span>
                      <div className="d-flex gap-2">
                        <span
                          className={`status-badge status-${mapStateNumberToLabel(
                            parseInt(getFieldValue(ticket.state)) || 1
                          )
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {mapStateNumberToLabel(
                            parseInt(getFieldValue(ticket.state))
                          )}
                        </span>
                        <span className="priority-badge">
                          Priority - {getFieldValue(ticket.priority) || "3"}
                        </span>
                      </div>
                    </div>

                    <p className="mb-1 ">
                      <span>
                        <strong className="card_title">
                          Short Description :
                        </strong>
                      </span>
                      <Tooltip
                        title={capitalizeFirstLetter(
                          getFieldValue(ticket.short_description) || ""
                        )}
                        placement="top"
                        arrow
                        followCursor
                        PopperProps={{
                          className: "high-z-index",
                        }}
                      >
                        <span className="cursor-pointer card_p ps-1">
                          {getFieldValue(ticket.short_description)?.substring(
                            0,
                            60
                          ) || ""}
                          {(getFieldValue(ticket.short_description)?.length ||
                            0) > 40
                            ? "..."
                            : ""}
                        </span>
                      </Tooltip>
                    </p>
                    <div className="d-flex justify-content-between card_p align-items-center">
                      <span>
                        <strong className="card_title"></strong>{" "}
                        {getDisplayName(ticket, "assigned_to") || "Unassigned"}
                      </span>
                      <span>
                        <strong className="card_title">
                          Assignment Group:
                        </strong>{" "}
                        {getDisplayName(ticket, "assignment_group") || "None"}
                      </span>
                    </div>
                    {/* <div className="d-flex justify-content-between  card_p align-items-center">
                  <span>
                      <strong className="card_title">
                         {selectedFilter === 'group' ? 'Assignment Group' : 'Assigned to'} 
                      </strong> {selectedFilter === 'group' ? getDisplayName(ticket, 'assignment_group') : getDisplayName(ticket, 'assigned_to')}
                    </span>
                    <span>
                      <strong className="card_title">
                        {selectedFilter === 'group' ? 'Assignment Group' : 'Assigned to'}
                      </strong> - {selectedFilter === 'group' ? getDisplayName(ticket, 'assignment_group') : getDisplayName(ticket, 'assigned_to')}
                    </span>
                  </div> */}
                  </Card>

                  {/* Show accordion directly below the clicked card */}
                  {showTicketDetails && expandedTicket === ticket.sys_id && (
                    <div className="mb-2">
                      <Accordion
                        expanded={true}
                        className="shadow-sm "
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                      >
                        <AccordionDetails className="p-0 position-relative itsm-glass-card text-white">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAccordionClose();
                            }}
                            sx={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              zIndex: 1010,
                              background: "rgba(255, 255, 255, 0.1)",
                              backdropFilter: "blur(15px)",
                              WebkitBackdropFilter: "blur(15px)",
                              border: "1px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "50%",
                              boxShadow:
                                "0 4px 16px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(255, 255, 255, 0.2) inset",
                              color: "rgba(255, 255, 255, 0.9)",
                              width: "32px",
                              height: "32px",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 0.2)",
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                boxShadow:
                                  "0 6px 20px rgba(0, 0, 0, 0.2), 0 3px 12px rgba(255, 255, 255, 0.3) inset",
                                transform: "scale(1.05)",
                              },
                            }}
                          >
                            <Close
                              fontSize="small"
                              style={{
                                fontSize: "16px",
                                color: "rgba(255, 255, 255, 0.9)",
                              }}
                            />
                          </IconButton>
                          <div className="fs-7 me-2 itsm_form ccontainer text-white  rounded-top custom-container  shadow-lg text-primary custom-rounded">
                            <div className="ISTMAssit  lh-base">
                              <p>
                                {getFieldValue(
                                  selectedTicket?.short_description
                                )}{" "}
                              </p>
                              <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="text-white"
                              >
                                <div className="row g-4 mb-4">
                                  <div className="col-12 col-md-6">
                                    <p>
                                      <span className="fw-semibold">
                                        Number:
                                      </span>{" "}
                                      <span className="fw-normal">
                                        {getFieldValue(selectedTicket?.number)}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="col-12 col-md-6">
                                    <p>
                                      <span className="fw-semibold">
                                        Opened by:
                                      </span>{" "}
                                      <Tooltip
                                        title={
                                          getFieldValue(
                                            selectedTicket?.opened_by
                                          ) || "Unknown"
                                        }
                                        placement="top"
                                        arrow
                                        PopperProps={{
                                          className: "high-z-index",
                                        }}
                                      >
                                        <span className="fw-normal cursor-pointer">
                                          {(
                                            getFieldValue(
                                              selectedTicket?.opened_by
                                            ) || "Unknown"
                                          ).substring(0, 15)}
                                          {(
                                            getFieldValue(
                                              selectedTicket?.opened_by
                                            ) || ""
                                          ).length > 15
                                            ? "..."
                                            : ""}
                                        </span>
                                      </Tooltip>
                                    </p>
                                  </div>
                                  <div
                                    className="row g-3"
                                    style={{ marginTop: "-12px" }}
                                  >
                                    <div className="col-12 col-md-6">
                                      <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                          <Autocomplete
                                            options={state}
                                            value={field.value || ""}
                                            onChange={(event, newValue) => {
                                              field.onChange(newValue);
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="State"
                                                className="tv-autocomplete"
                                                variant="outlined"
                                                fullWidth
                                              />
                                            )}
                                          />
                                        )}
                                      />
                                    </div>

                                    <div className="col-12 col-md-6">
                                      <TextField
                                        id="priority"
                                        label="Priority"
                                        variant="outlined"
                                        disabled
                                        fullWidth
                                        {...register("priority", {
                                          required: "priority is required",
                                        })}
                                        error={!!errors.priority}
                                      />
                                    </div>

                                    <div className="col-12 col-md-6">
                                      <Controller
                                        name="assignTo"
                                        control={control}
                                        rules={{
                                          required: "Assigned To is required",
                                        }}
                                        render={({ field }) => (
                                          <Autocomplete
                                            {...field}
                                            value={
                                              assignTo.find(
                                                (item) =>
                                                  (item.user_name ||
                                                    item.name ||
                                                    item.display_value ||
                                                    item.value) === field.value
                                              ) || null
                                            }
                                            options={assignTo}
                                            getOptionLabel={(option) =>
                                              option.user_name ||
                                              option.name ||
                                              option.display_value ||
                                              option.value ||
                                              ""
                                            }
                                            isOptionEqualToValue={(
                                              option,
                                              value
                                            ) => {
                                              if (
                                                typeof value === "object" &&
                                                value !== null
                                              ) {
                                                const optionValue =
                                                  option.user_name ||
                                                  option.name ||
                                                  option.display_value ||
                                                  option.value;
                                                const valueValue =
                                                  value.user_name ||
                                                  value.name ||
                                                  value.display_value ||
                                                  value.value;
                                                return (
                                                  optionValue === valueValue
                                                );
                                              }
                                              const optionValue =
                                                option.user_name ||
                                                option.name ||
                                                option.display_value ||
                                                option.value;
                                              return optionValue === value;
                                            }}
                                            onChange={(_, value) =>
                                              field.onChange(
                                                value
                                                  ? value.user_name ||
                                                      value.name ||
                                                      value.display_value ||
                                                      value.value
                                                  : ""
                                              )
                                            }
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Assigned to"
                                                variant="outlined"
                                                className="tv-autocomplete"
                                                error={!!errors.assignTo}
                                                helperText={
                                                  errors.assignTo
                                                    ?.message as string
                                                }
                                                fullWidth
                                              />
                                            )}
                                          />
                                        )}
                                      />
                                    </div>

                                    <div className="col-12 col-md-6">
                                      <Controller
                                        name="urgency"
                                        control={control}
                                        rules={{
                                          required: "Urgency is required",
                                        }}
                                        render={({ field }) => (
                                          <Autocomplete
                                            {...field}
                                            value={field.value || null}
                                            options={urgencyOptions}
                                            getOptionLabel={(option) => option}
                                            isOptionEqualToValue={(
                                              option,
                                              value
                                            ) => option === value}
                                            onChange={(_, value) =>
                                              field.onChange(value)
                                            }
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Urgency"
                                                className="tv-autocomplete"
                                                variant="outlined"
                                                error={!!errors.urgency}
                                                helperText={
                                                  errors.urgency
                                                    ?.message as string
                                                }
                                                fullWidth
                                              />
                                            )}
                                          />
                                        )}
                                      />
                                    </div>

                                    <div className="col-12 col-md-6">
                                      <Controller
                                        name="assignmentGroup"
                                        control={control}
                                        rules={{
                                          required:
                                            "Assignment Group is required",
                                        }}
                                        render={({ field }) => (
                                          <Autocomplete
                                            {...field}
                                            value={
                                              assignmentGroups.find(
                                                (item) =>
                                                  (item.name ||
                                                    item.display_value ||
                                                    item.value) === field.value
                                              ) || null
                                            }
                                            options={assignmentGroups}
                                            getOptionLabel={(option) =>
                                              option.name ||
                                              option.display_value ||
                                              option.value ||
                                              ""
                                            }
                                            isOptionEqualToValue={(
                                              option,
                                              value
                                            ) => {
                                              if (
                                                typeof value === "object" &&
                                                value !== null
                                              ) {
                                                const optionValue =
                                                  option.name ||
                                                  option.display_value ||
                                                  option.value;
                                                const valueValue =
                                                  value.name ||
                                                  value.display_value ||
                                                  value.value;
                                                return (
                                                  optionValue === valueValue
                                                );
                                              }
                                              const optionValue =
                                                option.name ||
                                                option.display_value ||
                                                option.value;
                                              return optionValue === value;
                                            }}
                                            onChange={(_, value) =>
                                              field.onChange(
                                                value
                                                  ? value.name ||
                                                      value.display_value ||
                                                      value.value
                                                  : ""
                                              )
                                            }
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Assignment Group"
                                                variant="outlined"
                                                className="tv-autocomplete"
                                                error={!!errors.assignmentGroup}
                                                helperText={
                                                  errors.assignmentGroup
                                                    ?.message as string
                                                }
                                                fullWidth
                                              />
                                            )}
                                          />
                                        )}
                                      />
                                    </div>

                                    <div className="col-12 col-md-6">
                                      <Controller
                                        name="impact"
                                        control={control}
                                        rules={{
                                          required: "Impact is required",
                                        }}
                                        render={({ field }) => (
                                          <Autocomplete
                                            {...field}
                                            value={field.value || null}
                                            options={impactOptions}
                                            getOptionLabel={(option) => option}
                                            isOptionEqualToValue={(
                                              option,
                                              value
                                            ) => option === value}
                                            onChange={(_, value) =>
                                              field.onChange(value)
                                            }
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Impact"
                                                variant="outlined"
                                                className="tv-autocomplete"
                                                error={!!errors.impact}
                                                helperText={
                                                  errors.impact
                                                    ?.message as string
                                                }
                                                fullWidth
                                              />
                                            )}
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <TextField
                                    id="short_description"
                                    label="Short Description"
                                    rows={2}
                                    multiline
                                    variant="outlined"
                                    className="tv-autocomplete"
                                    fullWidth
                                    {...register("short_description", {
                                      required: "Short Description is required",
                                    })}
                                    error={!!errors.short_description}
                                  />
                                </div>

                                <div className="mb-3">
                                  <TextField
                                    id="description"
                                    label="Description"
                                    variant="outlined"
                                    className="tv-autocomplete"
                                    rows={3}
                                    multiline
                                    fullWidth
                                    {...register("description", {
                                      required: "Description is required",
                                    })}
                                    error={!!errors.description}
                                  />
                                </div>
                                <div className="mb-4">
                                  <TextField
                                    id="comments_and_work_notes"
                                    label="Comments / Work Notes"
                                    variant="outlined"
                                    fullWidth
                                    className="tv-autocomplete"
                                    multiline
                                    rows={2}
                                    {...register("comments_and_work_notes")}
                                  />
                                </div>

                                <div className="mb-3">
                                  <TextField
                                    id="resolution_notes"
                                    label="Resolution Notes"
                                    rows={2}
                                    multiline
                                    variant="outlined"
                                    className="tv-autocomplete"
                                    fullWidth
                                    {...register("resolution_notes", {
                                      required: "Short Description is required",
                                    })}
                                    error={!!errors.short_description}
                                  />
                                </div>

                                <div className="mt-4 text-center">
                                  <button
                                    type="submit"
                                    className="btn update-button"
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <span
                                          className="spinner-border spinner-border-sm me-2"
                                          role="status"
                                          aria-hidden="true"
                                        ></span>
                                        Updating...
                                      </>
                                    ) : (
                                      "Update Ticket"
                                    )}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-muted text-center p-4">
              <div className="mb-2">
                {selectedFilter === "person" && "No personal tickets found."}
                {selectedFilter === "group" && "No group tickets found."}
                {selectedFilter === "personoff" &&
                  "No unassigned tickets found."}
              </div>
              {searchTerm && (
                <small className="text-muted">
                  Try clearing the search or switching to a different filter.
                </small>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ITSMPanel;
