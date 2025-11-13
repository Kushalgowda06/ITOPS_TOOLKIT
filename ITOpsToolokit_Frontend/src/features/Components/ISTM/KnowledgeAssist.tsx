import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import HeaderBar from "../AksCluster/TitleHeader";
import serviceNowAxios from "../../../api/ServicenowAxios";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";

const KnowledgeAssist = ({ selectedTicket }) => {
  const [alerts, setAlerts] = useState([]);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [alertsError, setAlertsError] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [incidentsLoading, setIncidentsLoading] = useState(false);
  const [incidentsError, setIncidentsError] = useState(null);
  const [changes, setChanges] = useState([]);
  const [changesLoading, setChangesLoading] = useState(false);
  const [changesError, setChangesError] = useState(null);

  useEffect(() => {
    if (selectedTicket && selectedTicket.number) {
      fetchAlerts(selectedTicket.number);
      fetchRelatedIncidents();
      fetchRelatedChanges();
    }
  }, [selectedTicket]);

  console.log("selectedTicket123 : ",selectedTicket?.cmdb_ci?.link)

  const fetchAlerts = async (incidentNumber) => {
    if (!incidentNumber) return;

    setAlertsLoading(true);
    setAlertsError(null);

    try {
      // Step 1: Get sys_id using incident number
      const sysIdResponse = await serviceNowAxios.get(
        `/api/now/table/incident?sysparm_query=number=${incidentNumber}&sysparm_fields=sys_id`
      );

      if (sysIdResponse.data?.result && sysIdResponse.data.result.length > 0) {
        const sysId = sysIdResponse.data.result[0].sys_id;

        // Step 2: Get alerts using sys_id
        const alertsResponse = await serviceNowAxios.get(
          `/api/now/table/em_alert?sysparm_query=incident%3D${sysId}&sysparm_fields=number,short_description,state,severity,opened_at,source&sysparm_limit=3`
        );

        if (alertsResponse.data?.result) {
          setAlerts(alertsResponse.data.result);
        } else {
          setAlerts([]);
        }
      } else {
        setAlerts([]);
        setAlertsError("No sys_id found for this incident");
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setAlertsError("Failed to fetch alerts. Please try again.");
      setAlerts([]);
    } finally {
      setAlertsLoading(false);
    }
  };

  const fetchRelatedIncidents = async () => {
    
    console.log("brooo")
    setIncidentsLoading(true);
    setIncidentsError(null);

    try {
      const incidentsResponse = await serviceNowAxios.get(
        `/api/now/table/incident?sysparm_query=cmdb_ci%3D${selectedTicket?.cmdb_ci?.value}%5EORDERBYDESCsys_created_on&sysparm_limit=5&sysparm_fields=number,short_description,state,severity,opened_at`
      );
      console.log("incidentsResponse123 : ",incidentsResponse)
      if (incidentsResponse.data?.result) {
        setIncidents(incidentsResponse.data.result);
      } else {
        setIncidents([]);
      }
    } catch (error) {
      console.error("Error fetching related incidents:", error);
      setIncidentsError("Failed to fetch related incidents. Please try again.");
      setIncidents([]);
    } finally {
      setIncidentsLoading(false);
    }
  };



  // for change
    const fetchRelatedChanges = async () => {
  

    setChangesLoading(true);
    setChangesError(null);

    try {
      const changesResponse = await serviceNowAxios.get(
        `/api/now/table/change_request?sysparm_query=cmdb_ci%3D${selectedTicket?.cmdb_ci?.value}%5EORDERBYDESCsys_created_on&sysparm_limit=5&sysparm_fields=number,short_description,state,severity,opened_at`
      );

      console.log("changerel123 : ",changesResponse)
      if (changesResponse.data?.result) {
        setChanges(changesResponse.data.result);
      } else {
        setChanges([]);
      }
    } catch (error) {
      console.error("Error fetching related changes:", error);
      setChangesError("Failed to fetch related changes. Please try again.");
      setChanges([]);
    } finally {
      setChangesLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "1":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      case "high":
      case "2":
        return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "medium":
      case "3":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "low":
      case "4":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getStateColor = (state) => {
    switch (state?.toLowerCase()) {
      case "open":
      case "new":
      case "1":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      case "in progress":
      case "acknowledged":
      case "2":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "resolved":
      case "closed":
      case "6":
      case "7":
        return "text-green-400 bg-green-500/20 border-green-500/30";
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const urgencyOptions = ["1 - High", "2 - Medium", "3 - Low"];
  const impactOptions = ["1 - High", "2 - Medium", "3 - Low"];

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


    const getFieldValue = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    if (typeof field === "object" && field.value !== undefined) return field.value;
    if (typeof field === "object" && field.display_value !== undefined) return field.display_value;
    return "";
  };

  const mapUrgencyNumberToLabel = (num) =>
    urgencyOptions[parseInt(getFieldValue(num)) - 1] || "";
  const mapUrgencyLabelToNumber = (label) => label.split(" ")[0];

  const mapImpactNumberToLabel = (num) =>
    impactOptions[parseInt(getFieldValue(num)) - 1] || "";
  const mapImpactLabelToNumber = (label) => label.split(" ")[0];

  return (
    <div className="custom-container rounded-top shadow-lg text-white rounded-bottom" style={{maxHeight: "70%"}}>
      <HeaderBar
        content="Analysis"
        position="center"
        padding="px-3"
        partialBorder={true}
      />

      {selectedTicket === null ? (
        <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4 mb-1">
          <div className="d-flex flex-column align-items-center text-center">
            <div className="fw-medium no_card_p text-white">
              Please select a ticket for analysis
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-auto knowledge_assist_height" >
          <div className="d-flex flex-column align-items-center ms-2 mt-1 ">
            <span className="small">
              <strong className="card_title">{selectedTicket?.number}</strong>
            </span>
            <span className="small">
              <Tooltip
                title={capitalizeFirstLetter(selectedTicket?.short_description)}
                placement="top"
                arrow={true}
                followCursor={true}
                PopperProps={{
                  style: { zIndex: 9999 },
                }}
              >
                <span className="text-white card_title cursor-pointer ps-1">
                  {selectedTicket?.short_description?.substring(0, 60)}
                  {selectedTicket?.short_description?.length > 60 ? "..." : ""}
                </span>
              </Tooltip>
            </span>
          </div>
          <div className="mt-1 rounded-bottom px-1">
            {/* Related Alerts Section */}
            <div className="mb-3 p-2 itsm-glass-card rounded border border-light-subtle small">
              <h3 className="h5 fw-semibold text-white mb-2 d-flex align-items-center small">
                <span className="me-2 small">🚨</span>
                Related Alerts
              </h3>

              {alertsLoading ? (
                <div className="d-flex justify-content-center py-4 small">
                  <div className="d-flex flex-column align-items-center gap-2 small">
                    <div
                      className="spinner-border text-warning"
                      role="status"
                      style={{ width: "2rem", height: "2rem" }}
                    ></div>
                    <p className="text-white small">Loading alerts...</p>
                  </div>
                </div>
              ) : alertsError ? (
                <div className="text-center py-3 small">
                  <div
                    className="rounded-circle bg-danger bg-opacity-25 d-flex align-items-center justify-content-center small mx-auto mb-2"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <svg
                      className="bi bi-exclamation-circle text-danger"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-1A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm.93-6.412a.5.5 0 0 1 .938 0l.5 4a.5.5 0 0 1-.938.412l-.5-4a.5.5 0 0 1 .938-.412z" />
                    </svg>
                  </div>
                  <p className="text-danger small">{alertsError}</p>
                </div>
              ) : alerts && alerts.length > 0 ? (
                <div className="overflow-auto" style={{ maxHeight: "12rem" }}>
                  {alerts.map((alert, index) => (
                    <div
                      key={alert.number || index}
                      className="itsm-glass-card border border-light-subtle small rounded p-2 mb-2"
                    >
                      <div className="d-flex justify-content-between mb-2 small">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-medium text-white small">
                              {alert.number || "N/A"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-pill text-xs fw-medium border small ${getSeverityColor(
                                alert.severity
                              )}`}
                            >
                              {alert.severity || "Unknown"}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-pill text-xs fw-medium border small ${getStateColor(
                                alert.state
                              )}`}
                            >
                              {alert.state || "Unknown"}
                            </span>
                          </div>
                          <p className="text-white small mb-2">
                            {alert.short_description || "No description available"}
                          </p>
                        </div>
                      </div>
                      <div className="row text-xs">
                        <div className="col d-flex align-items-center gap-1 small">
                          <span className="text-muted">Source:</span>
                          <span className="text-white">{alert.source || "N/A"}</span>
                        </div>
                        <div className="col d-flex align-items-center gap-1 small">
                          <span className="text-muted">Opened:</span>
                          <span className="text-white">{alert.opened_at}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3 small">
                  <div
                    className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <svg
                      className="bi bi-info-circle text-secondary"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-1A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                      <path d="M8.93 6.588a.5.5 0 0 0-.938 0l-.5 4a.5.5 0 0 0 .938.412l.5-4a.5.5 0 0 0-.938-.412zM8 4.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" />
                    </svg>
                  </div>
                  <p className="text-muted small">
                    {selectedTicket
                      ? `No alerts found for ticket ${selectedTicket.number}`
                      : "No alerts available"}
                  </p>
                </div>
              )}
            </div>

            {/* Related Incidents Section */}
            <div className="mb-3 p-2 itsm-glass-card rounded border border-light-subtle small">
              <h3 className="h5 fw-semibold text-white mb-2 d-flex align-items-center small">
                <span className="me-2 small">📋</span>
                Related Incidents
              </h3>

              {incidentsLoading ? (
                <div className="d-flex justify-content-center py-4 small">
                  <div className="d-flex flex-column align-items-center gap-2">
                    <div
                      className="spinner-border small text-warning"
                      role="status"
                      style={{ width: "2rem", height: "2rem" }}
                    ></div>
                    <p className="text-white small">Loading incidents...</p>
                  </div>
                </div>
              ) : incidentsError ? (
                <div className="text-center py-3">
                  <div
                    className="rounded-circle bg-danger bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-2 small"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <svg
                      className="bi bi-exclamation-circle text-danger"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-1A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm.93-6.412a.5.5 0 0 1 .938 0l.5 4a.5.5 0 0 1-.938.412l-.5-4a.5.5 0 0 1 .938-.412z" />
                    </svg>
                  </div>
                  <p className="text-danger small">{incidentsError}</p>
                </div>
              ) : incidents && incidents.length > 0 ? (
                <div className="overflow-auto" style={{ maxHeight: "12rem" }}>
                  {incidents.map((incident, index) => (
                    <div
                      key={incident.number || index}
                      className="itsm-glass-card border border-light-subtle rounded p-3 mb-2 small"
                    >
                      <div className="d-flex justify-content-between mb-2">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-medium text-white small">
                              {incident.number || "N/A"}
                            </span>
                            <div className="d-flex gap-2 small">
                        <span className={`status-badge small status-${mapStateNumberToLabel(parseInt(getFieldValue(incident.state)) || 1).toLowerCase().replace(/\s+/g, '-')}`}>
                          {mapStateNumberToLabel(parseInt(getFieldValue(incident.state)))}
                        </span>
                        <span className="priority-badge small">
                          Priority - {getFieldValue(incident.priority) || "3"}
                        </span>
                      </div>
                          </div>
                          <p className="small mb-2">
                            {incident.short_description || "No description available"}
                          </p>
                        </div>
                      </div>
                      <div className="row text-xs">
                        <div className="col d-flex align-items-center small gap-1">
                          <span className="text-muted">Opened:</span>
                          <span className="text-white small">{incident.opened_at}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <div
                    className="rounded-circle bg-secondary small bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <svg
                      className="bi bi-info-circle text-secondary"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-1A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                      <path d="M8.93 6.588a.5.5 0 0 0-.938 0l-.5 4a.5.5 0 0 0 .938.412l.5-4a.5.5 0 0 0-.938-.412zM8 4.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" />
                    </svg>
                  </div>
                  <p className="text-muted small">
                    {selectedTicket
                      ? `No related incidents found for ticket ${selectedTicket.number}`
                      : "No incidents available"}
                  </p>
                </div>
              )}
            </div>

            {/* Related Changes Section */}
            <div className="mb-3 p-2 itsm-glass-card rounded border border-light-subtle small">
              <h3 className="h5 fw-semibold text-white mb-2 d-flex align-items-center small">
                <span className="me-2 small">🔄</span>
                Related Changes
              </h3>

              {changesLoading ? (
                <div className="d-flex justify-content-center py-4 small">
                  <div className="d-flex flex-column align-items-center gap-2">
                    <div
                      className="spinner-border small text-warning"
                      role="status"
                      style={{ width: "2rem", height: "2rem" }}
                    ></div>
                    <p className="text-white small">Loading changes...</p>
                  </div>
                </div>
              ) : changesError ? (
                <div className="text-center py-3 small">
                  <div
                    className="rounded-circle small bg-danger bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <svg
                      className="bi bi-exclamation-circle text-danger"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-1A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                      <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm.93-6.412a.5.5 0 0 1 .938 0l.5 4a.5.5 0 0 1-.938.412l-.5-4a.5.5 0 0 1 .938-.412z" />
                    </svg>
                  </div>
                  <p className="text-danger small">{changesError}</p>
                </div>
              ) : changes && changes.length > 0 ? (
                <div className="overflow-auto" style={{ maxHeight: "12rem" }}>
                  {changes.map((change, index) => (
                    <div
                      key={change.number || index}
                      className="itsm-glass-card small border border-light-subtle rounded p-3 mb-2"
                    >
                      <div className="d-flex justify-content-between mb-2 small">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-medium text-white  small">
                              {change.number || "N/A"}
                            </span>
                            <div className="d-flex gap-2">
                        <span className={`status-badge small status-${mapStateNumberToLabel(parseInt(getFieldValue(change.state)) || 1).toLowerCase().replace(/\s+/g, '-')}`}>
                          {mapStateNumberToLabel(parseInt(getFieldValue(change.state)))}
                        </span>
                        <span className="priority-badge small">
                          Priority - {getFieldValue(change.priority) || "3"}
                        </span>
                      </div>
                          </div>
                          <p className="text-white small mb-2">
                            {change.short_description || "No description available"}
                          </p>
                        </div>
                      </div>
                      <div className="row text-xs">
                        <div className="col d-flex align-items-center gap-1 small">
                          <span className="text-muted small">Opened:</span>
                          <span className="text-white small">{change.opened_at}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <div
                    className="rounded-circle bg-secondary bg-opacity-25 d-flex align-items-center justify-content-center mx-auto mb-2"
                    style={{ width: "3rem", height: "3rem" }}
                  >
                    <svg
                      className="bi bi-info-circle text-secondary"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0-1A6 6 0 1 1 8 2a6 6 0 0 1 0 12z" />
                      <path d="M8.93 6.588a.5.5 0 0 0-.938 0l-.5 4a.5.5 0 0 0 .938.412l.5-4a.5.5 0 0 0-.938-.412zM8 4.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" />
                    </svg>
                  </div>
                  <p className="text-muted small">
                    {selectedTicket
                      ? `No related changes found for ticket ${selectedTicket.number}`
                      : "No changes available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeAssist;