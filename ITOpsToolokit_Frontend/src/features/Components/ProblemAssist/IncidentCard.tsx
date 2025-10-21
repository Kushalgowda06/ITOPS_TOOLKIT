import React from 'react';

export default function IncidentCard({ incident, checked, onCheck,status }) {
  console.log("incident",incident);
 
  return (
    <div className="prb_incident-card prb_card_hover p-3 mt-2">
        {status === 'Recommended' && (
      <input
        type="checkbox"
        className="prb_incident-checkbox"
        checked={checked}
        onChange={() => onCheck(incident.id)}
      />)}
      <div className="incident-content text-start">
        <div className="prb_incident-number">{incident.incident}</div>
        {/* <span className="prb_incident-description">{incident.ShortDescription}</span>
        <span className="prb_incident-state">{incident.state}</span> */}
        {/* <div className="prb_incident-description">{incident.ShortDescription}</div> */}
      </div>
    </div>
  );
}
