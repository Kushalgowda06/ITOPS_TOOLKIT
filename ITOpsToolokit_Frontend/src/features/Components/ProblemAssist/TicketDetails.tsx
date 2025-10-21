import React, { useEffect } from 'react';

export default function TicketDetails({ ticket, setSelectedTicket, setIncidentNumbers }) {
  function generateUniqueId(incident: string): string {
    // Simple hash using incident + timestamp
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${incident}_${timestamp}_${random}`;
  }
  useEffect(() => {
    const associatedIncidentsArray = ticket?.associated_incidents
      ?.split(',')
      .map(item => item.trim().replace(/^'|'$/g, ''));
  
    const incidentsWithIds = associatedIncidentsArray?.map(incident => ({
      incident,
      id: generateUniqueId(incident),
    }));
  
    setIncidentNumbers(incidentsWithIds);
  }, [ticket, setIncidentNumbers]);

  if (!ticket) return null;

  const handleChange = (key, value) => {
    setSelectedTicket(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mt-5">
      {/* Row 1 */}
      <div className="row mb-3">
        <div className="col-md-4 d-flex align-items-center">
          <label className="prb_ticket-label me-2">Number:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={
              ticket.approval_status?.toLowerCase().includes('recommend') ||   ticket.approval_status?.toLowerCase().includes('rejected')
                ? `Rec${ticket["id"] || ''}`
                : ticket["problem_ticket_number"] || ''
            }
            onChange={e => handleChange("problem_ticket_number", e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <label className="prb_ticket-label me-2">Opened by:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={ticket["sys_created_by"] || ''}
            onChange={e => handleChange("sys_created_by", e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <label className="prb_ticket-label me-2">Priority:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={ticket["priority"] || ''}
            onChange={e => handleChange("priority", e.target.value)}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="row mb-3">
        <div className="col-md-4 d-flex align-items-center">
          <label className="prb_ticket-label me-2">State:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={ticket["approval_status"] || ''}
            onChange={e => handleChange("approval_status", e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <label className="prb_ticket-label me-2">Urgency:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={ticket["urgency"] || ''}
            onChange={e => handleChange("urgency", e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <label className="prb_ticket-label me-2">Impact:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={ticket["impact"] || ''}
            onChange={e => handleChange("impact", e.target.value)}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="row mb-3">
        <div className="col-md-6 d-flex align-items-center">
          <label className="prb_ticket-label me-2">Assigned to:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={ticket["assigned_to"] || ''}
            onChange={e => handleChange("assigned_to", e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <label className="prb_ticket-label me-2">Assignment Group:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={ticket["assignment_group"] || ''}
            onChange={e => handleChange("assignment_group", e.target.value)}
          />
        </div>
      </div>
      {/* Row 4 */}
      <div className="row mb-3">
        <div className="col-12 d-flex align-items-center">
          <label className="prb_ticket-label me-2">Short Description:</label>
          <input
            type="text"
            className="prb_ticket-input flex-grow-1"
            value={ticket["short_description"] || ''}
            onChange={e => handleChange("short_description", e.target.value)}
          />
        </div>
      </div>

      {/* Row 5 */}
      <div className="row">
        <div className="col-12 d-flex align-items-start">
          <label className="prb_ticket-label me-2 mt-1">Description:</label>
          <textarea
            className="prb_ticket-input prb_ticket-textarea flex-grow-1"
            value={ticket["description"] || ''}
            onChange={e => handleChange("description", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
