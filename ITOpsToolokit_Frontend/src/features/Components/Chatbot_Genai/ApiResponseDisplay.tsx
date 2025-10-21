import React from 'react';
import JsonRenderer from './JsonRenderer';

// Using `any` for flexibility with the provided examples.
interface ApiResponse {
  Description?: string;
  Components?: any[];
  Flow?: string;
  Summary?:string;
  [key: string]: any; // Allow other top-level keys
}

interface ApiResponseDisplayProps {
  response: ApiResponse;
}

const ApiResponseDisplay: React.FC<ApiResponseDisplayProps> = ({ response }) => {
  // if (!response || Object.keys(response).length === 0) {
  //   return <div className="alert alert-warning">No data to display.</div>;
  // }

  // Separate known keys from the rest to structure the output
  const { Description, Components, Flow, Summary, ...otherData } = response;

  const renderComponent = (component: any, index: number) => {
    // The main identifier for a component seems to be the "Component" key.
    const { Component, ...rest } = component;
    return (
      <div key={index} className="mb-3 p-3 border rounded" style={{ backgroundColor: '#f8f9fa' }}>
        {Component && <h6 className="fw-bold f-size">{Component}</h6>}
        <JsonRenderer data={rest} />
      </div>
    );
  };

  return (
    <div className="card m-3 shadow-sm">
      {/* <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Request Details</h5>
      </div> */}
      <div className="card-body">
        {Description && (
          <div className="mb-4">
            <h6 className="fw-bold f-size">Description</h6>
            <p className="card-text f-size">{Description}</p>
          </div>
        )}

        {Components && Components.length > 0 && (
          <div className="mb-4">
            <h6 className="fw-bold f-size">Components</h6>
            {Components.map(renderComponent)}
          </div>
        )}

        {Flow && (
          <div className="mb-4">
            <h6 className="fw-bold f-size">Flow</h6>
            <p className="card-text f-size">{Flow}</p>
          </div>
        )}

        {Summary && (
          <div className="mb-4">
            <h6 className="fw-bold f-size">Summary</h6>
            <p className="card-text f-size">{Summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiResponseDisplay;