import React from "react";

const PatchGroupsData = ({ group }) => {
  if (!group) {
    return <div>No data available</div>;
  }

  const {
    GroupName,
    Cloud,
    OS,
    Application,
    Environment,
    Servers,
    Service,
    RebootRequired,
    CRType,
    Provider,
    PostPatchingSteps,
    PostPatchingScripts,
    DistributionList,
    ChangeModel,
    Description,
    ShortDescription,
    AssignmentGroup,
    CrStartDate,
    CrEndDate,
    Justification,
    ImplementationPlan,
    BackoutPlan,
    TestPlan,
    AffectedCI,
    PatchStartDate,
    PatchEndDate,
    Recurrence,
    RecurrenceStartTime,
    RecurrenceEndTime,
    RecurrenceStartDate,
    RecurrenceEndDate,
    NoEndDate,
    RecurrenceNumber,
    Pattern,
    WeekDay,
    WeekNumber,
    RecurrenceDate,
    Interval,
    RecurrenceMonth
  } = group;

  return (
    <div style={{ width: '100%', padding: '20px', margin: '0 auto' }}>
      <table style={{ width: '100%', marginBottom: '1rem', color: '#212529', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Group Name</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Cloud</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>OS</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Application</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Environment</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Servers</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Service</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Reboot Required</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>CR Type</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Provider</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Description</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Short Description</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Assignment Group</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Affected CI</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Patch Start Date</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Patch End Date</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Recurrence</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Recurrence Start Time</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Recurrence End Time</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Recurrence Start Date</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Recurrence End Date</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>No End Date</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Pattern</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Week Day</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Week Number</th>
            <th style={{ border: '1px solid black', textAlign: 'center' }}>Recurrence Date</th>
            
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{GroupName}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Cloud}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{OS}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Application}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Environment}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Servers}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Service}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{RebootRequired}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{CRType}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Provider}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Description}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{ShortDescription}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{AssignmentGroup}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{AffectedCI}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{PatchStartDate}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{PatchEndDate}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Recurrence ? "Yes" : "No"}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{RecurrenceStartTime}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{RecurrenceEndTime}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{RecurrenceStartDate}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{RecurrenceEndDate}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{NoEndDate ? "Yes" : "No"}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{Pattern}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{WeekDay}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{WeekNumber}</td>
            <td style={{ border: '1px solid black', textAlign: 'center' }}>{RecurrenceDate}</td>
            
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PatchGroupsData;
