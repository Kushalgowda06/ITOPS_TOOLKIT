import React, { useEffect, useState } from "react";
import serviceNowAxios from "../../../api/ServicenowAxios";

export default function ProblemCard({
  problem,
  onClick,
  isActive,
  status,
   state
}) {

  const incidentCount = problem.associated_incidents
    ? problem.associated_incidents
        .split(",")
        .map((item) => item.trim().replace(/^'|'$/g, "")) // remove leading/trailing quotes
        .filter((item) => item.toLowerCase().startsWith("inc")).length // optional: filter valid INC entries
    : 0;


  
  return (
    <div
      className={`prb_card mb-1 prb_card_hover ${
        isActive ? "prb_active-card" : ""
      }`}
      onClick={() => onClick(problem)}
    >
      {/* Number */}
      {/* <div className="fw-bold mb-1 prb_title">{problem.Number}</div> */}

      {/* State and Assigned To */}
      <div className="d-flex justify-content-between align-items-center text-white mb-1  prb_title">
        {status === "Recommended" || status === "Rejected" ? (
          <span>{`Rec${String(problem.id)}`}</span>
        ) : (
          <span>{problem.problem_ticket_number}</span>
        )}
        {status === "Recommended" || status === "Rejected" ? (
          <span className="me-3">
            <span>State: </span>
            <span className="fw-normal ps-1">{problem.approval_status}</span>
          </span>
        ) : (
          <span className="me-3">
            <span>State: </span>
            <span className="fw-normal ps-1">
              {" "}
              {state.find((s) => s.value === String(problem.state))?.label}
            </span>
          </span>
        )}

        <span>
          <span>Assigned to: </span>
          <span className="fw-normal ps-1">{problem?.assigned_to || ""}</span>
        </span>
      </div>

      {/* Short Description */}
      <div className="mb-1 prb_title">
        <span className="me-4">
          <span>Short Description: </span>
          <span
            className="fw-normal ps-1"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={
              problem.short_description.length > 60
                ? problem.short_description
                : ""
            }
          >
            {problem.short_description.length > 60
              ? `${problem.short_description.slice(0, 60)}...`
              : problem.short_description}
          </span>
        </span>
      </div>

      {/* Configuration Item and Occurrence */}
      <div className="d-flex justify-content-between align-items-center prb_title pb-2 ">
        <span>
          <span> Configuration Item: </span>
          <span className="fw-normal ps-1">{problem?.cmdb_ci || ""}</span>
        </span>
        <span>
          <span>Occurrence: </span>
          <span className="fw-normal ps-1">{incidentCount}</span>
        </span>
      </div>
    </div>
  );
}
