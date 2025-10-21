import React, { useEffect, useState } from "react";
import { Api } from "../../Utilities/api";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import HeaderBar from "../AksCluster/TitleHeader";

export default function ITSMAssist({ selectedTicket, workNotesFromTechAssist }) {
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

  const getFieldValue = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field.value !== undefined) return field.value;
    if (typeof field === "object" && field.display_value !== undefined) return field.display_value;
    return "";
  };

  const getFieldLink = (field) => {
    if (!field) return "";
    if (typeof field === "object" && field.link !== undefined) return field.link;
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
    formState: { isDirty, errors, dirtyFields },
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
      description: "",
      comments_and_work_notes: "",
      comments: "",
    },
  });

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
        assignmentGroup: assignmentGroupName || getFieldValue(selectedTicket.assignment_group), // Use fetched name or fallback
        impact: mapImpactNumberToLabel(selectedTicket.impact),
        short_description: getFieldValue(selectedTicket.short_description),
        description: getFieldValue(selectedTicket.description),
        comments_and_work_notes: getFieldValue(selectedTicket.comments_and_work_notes),
        comments: workNotesFromTechAssist || getFieldValue(selectedTicket.comments) || "",
      });
      
      // console.log("Form reset with values:", {
      //   state: stateLabelValue,
      //   assignTo: assignedToName || getFieldValue(selectedTicket.assigned_to),
      //   assignmentGroup: assignmentGroupName || getFieldValue(selectedTicket.assignment_group)
      // });
    }
  }, [selectedTicket, workNotesFromTechAssist, assignedToName, assignmentGroupName, reset]); // Added assignedToName and assignmentGroupName dependencies

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
            `https://cisicmpengineering1.service-now.com/api/now/table/sys_user_group?sysparm_fields=name`,
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
    Object.keys(dirtyFields).forEach(field => {
      if (dirtyFields[field]) {
        let value = data[field];
        switch (field) {
          case 'urgency':
            value = mapUrgencyLabelToNumber(data.urgency);
            break;
          case 'impact':
            value = mapImpactLabelToNumber(data.impact);
            break;
          case 'state':
            value = typeof data.state === 'object' && data.state !== null
              ? parseInt((data.state as any).value, 10)
              : mapStateLabelToNumber(data.state);
            break;
          case 'assignTo':
            // For assignTo, if we're updating and the value is a name, 
            // we need to send the original value from selectedTicket
            if (data.assignTo === assignedToName) {
              value = getFieldValue(selectedTicket?.assigned_to);
            } else {
              value = data[field];
            }
            break;
          case 'assignmentGroup':
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

  if (!selectedTicket) {
    return (
      <div className="fs-7 me-2 itsm_form ccontainer rounded-top custom-container shadow-lg text-primary custom-rounded">
        <HeaderBar content=" ITSM Assist" position="start" padding="px-3" />
        
        <div className="d-flex flex-column align-items-center justify-content-center text-center p-5" >
          <div className="mb-4">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="text-muted"
            >
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h5 className="text-muted mb-3">No Ticket Selected</h5>
         
        </div>
      </div>
    );
  }
  return (
    <>
      <Snackbar
        open={!!submitMessage}
        autoHideDuration={4000}
        onClose={() => {
          setSubmitMessage("");
          setMessageType("");
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => {
            setSubmitMessage("");
            setMessageType("");
          }}
          severity={
            messageType === "success"
              ? "success"
              : messageType === "info"
              ? "info"
              : "error"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {submitMessage}
        </Alert>
      </Snackbar>

      <div className="fs-7 me-2 itsm_form ccontainer rounded-top custom-container  shadow-lg text-primary custom-rounded">
        <HeaderBar content=" ITSM Assist" position="start" padding="px-3" />
        {/* <div className="d-flex align-items-center istm_header_height rounded-top justify-content-between px-3 py-2 background box-shadow text-primary" >
          <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold">
            ITSM Assist
          </div>
        </div> */}

        <div className="ISTMAssit  lh-base">
          <p>{getFieldValue(selectedTicket?.short_description)} </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <p>
                  <span className="fw-semibold">Number:</span>{" "}
                  <span className="fw-normal">{getFieldValue(selectedTicket?.number)}</span>
                </p>
              </div>
              <div className="col-12 col-md-6">
                <p>
                  <span className="fw-semibold">Opened by:</span>{" "}
                  <Tooltip
                    title={getFieldValue(selectedTicket?.opened_by) || "Unknown"}
                    placement="top"
                    arrow
                    PopperProps={{
                      className: "high-z-index",
                    }}
                  >
                    <span className="fw-normal cursor-pointer">
                      {(getFieldValue(selectedTicket?.opened_by) || "Unknown").substring(0, 15)}
                      {((getFieldValue(selectedTicket?.opened_by) || "").length > 15) ? "..." : ""}
                    </span>
                  </Tooltip>
                </p>
              </div>
              <div className="row g-3" style={{marginTop: "-12px"}}>
                <div className="col-12 col-md-6">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => {
                      const selectedOption = Array.isArray(state)
                        ? state.find((opt: any) => opt?.label === field.value) || null
                        : null;
                      return (
                        <Autocomplete
                          options={state}
                          value={selectedOption}
                          getOptionLabel={(option: any) => option?.label ?? option?.value ?? ""}
                          isOptionEqualToValue={(option: any, value: any) => option?.value === value?.value}
                          onChange={(_, newValue: any) => {
                            field.onChange(newValue ? newValue.label : "");
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="State" className="tv-autocomplete" style={{ backgroundColor: 'white' }} variant="outlined" fullWidth />
                          )}
                        />
                      );
                    }}
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
                    rules={{ required: "Assigned To is required" }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        value={
                          assignTo.find(
                            (item) => (item.user_name || item.name || item.display_value || item.value) === field.value
                          ) || null
                        }
                        options={assignTo}
                        getOptionLabel={(option) => option.user_name || option.name || option.display_value || option.value || ""}
                        isOptionEqualToValue={(option, value) => {
                          if (typeof value === "object" && value !== null) {
                            const optionValue = option.user_name || option.name || option.display_value || option.value;
                            const valueValue = value.user_name || value.name || value.display_value || value.value;
                            return optionValue === valueValue;
                          }
                          const optionValue = option.user_name || option.name || option.display_value || option.value;
                          return optionValue === value;
                        }}
                        onChange={(_, value) =>
                          field.onChange(value ? (value.user_name || value.name || value.display_value || value.value) : "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Assigned to"
                            variant="outlined"
                            className="tv-autocomplete"
                            error={!!errors.assignTo}
                            style={{ backgroundColor: 'white' }}
                            helperText={errors.assignTo?.message as string}
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
                    rules={{ required: "Urgency is required" }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        value={field.value || null}
                        options={urgencyOptions}
                        getOptionLabel={(option) => option}
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        onChange={(_, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Urgency"
                            className="tv-autocomplete"
                            variant="outlined"
                            style={{ backgroundColor: 'white' }}
                            error={!!errors.urgency}
                            helperText={errors.urgency?.message as string}
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
                    rules={{ required: "Assignment Group is required" }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        value={
                          assignmentGroups.find(
                            (item) => (item.name || item.display_value || item.value) === field.value
                          ) || null
                        }
                        options={assignmentGroups}
                        getOptionLabel={(option) => option.name || option.display_value || option.value || ""}
                        isOptionEqualToValue={(option, value) => {
                          if (typeof value === "object" && value !== null) {
                            const optionValue = option.name || option.display_value || option.value;
                            const valueValue = value.name || value.display_value || value.value;
                            return optionValue === valueValue;
                          }
                          const optionValue = option.name || option.display_value || option.value;
                          return optionValue === value;
                        }}
                        onChange={(_, value) =>
                          field.onChange(value ? (value.name || value.display_value || value.value) : "")
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Assignment Group"
                            variant="outlined"
                            className="tv-autocomplete"
                            style={{ backgroundColor: 'white' }}
                            error={!!errors.assignmentGroup}
                            helperText={
                              errors.assignmentGroup?.message as string
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
                    rules={{ required: "Impact is required" }}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        value={field.value || null}
                        options={impactOptions}
                        getOptionLabel={(option) => option}
                        isOptionEqualToValue={(option, value) =>
                          option === value
                        }
                        onChange={(_, value) => field.onChange(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Impact"
                            variant="outlined"
                            className="tv-autocomplete"
                            error={!!errors.impact}
                            style={{ backgroundColor: 'white' }}
                            helperText={errors.impact?.message as string}
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
                style={{ backgroundColor: 'white' }}
                InputProps={{
                  style: { backgroundColor: 'white' }
                }}
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
                style={{ backgroundColor: 'white' }}
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
                style={{ backgroundColor: 'white' }}
                rows={2}
                {...register("comments_and_work_notes")}
              />
            </div>
            <div className="mb-4">
              <Controller
                name="comments"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="comments"
                    label={workNotesFromTechAssist ? "Additional Comment (From TechAssist)" : "Additional Comment"}
                    variant="outlined"
                    fullWidth
                    className="tv-autocomplete"
                    multiline
                    style={{ backgroundColor: 'white' }}
                    rows={2}
                  />
                )}
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
    </>
  );
}
