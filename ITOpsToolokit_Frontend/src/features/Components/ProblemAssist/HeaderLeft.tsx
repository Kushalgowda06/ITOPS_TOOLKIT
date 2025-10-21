import React from 'react';
import { Dropdown } from 'react-bootstrap';
export default function HeaderLeft({ status, setStatus, search, setSearch }) {
  return (
    <div className="prb_header-left d-flex align-items-center justify-content-between px-3 py-2 mb-1">
      <span className="prb_header-title">Pro Active Problems</span>

      <input
        type="text"
        className="prb_header-search  ps-2"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

<Dropdown className="mb-1">
  <Dropdown.Toggle className="prb_header-dropdown">
    {status}
  </Dropdown.Toggle>

  <Dropdown.Menu className="prb_dropdown-menu">
    <Dropdown.Item onClick={() => setStatus('Recommended')}>Recommended</Dropdown.Item>
    <Dropdown.Item onClick={() => setStatus('Approved')}>Approved</Dropdown.Item>
    <Dropdown.Item onClick={() => setStatus('Rejected')}>Rejected</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
    </div>
  );
}
