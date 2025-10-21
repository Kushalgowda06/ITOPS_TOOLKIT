import React from 'react';

const JsonRenderer = ({ data }: { data: any }) => {
  if (data === null || data === undefined) {
    return null;
  }

  // Handle primitive values (e.g., in an array of strings/numbers)
  if (typeof data !== 'object') {
    return <span>{String(data)}</span>;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    if (data.length === 0) {
        return <em className="text-muted">(empty)</em>;
    }
    return (
      <ul className="list-unstyled f-size ps-4 mb-0">
        {data.map((item, index) => (
          <li key={index}>
            <JsonRenderer data={item} />
          </li>
        ))}
      </ul>
    );
  }

  // Handle objects
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <em className="text-muted">(empty)</em>;
  }

  return (
    <ul className="list-unstyled ps-4 mb-0">
      {entries.map(([key, value]) => (
        <li key={key}>
          <strong className="f-size" style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}:</strong>
          {typeof value === 'object' && value !== null ? <JsonRenderer data={value} /> : <span className="ms-2 f-size">{String(value)}</span>}
        </li>
      ))}
    </ul>
  );
};

export default JsonRenderer;