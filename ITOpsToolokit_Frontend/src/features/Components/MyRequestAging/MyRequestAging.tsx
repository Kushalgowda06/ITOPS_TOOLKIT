import React from "react";

const MyRequestAging = () => {
  return (
    <div className="w-100">
      <div>
        <small className="text-center fw-bold">ITSM Status</small>
      </div>
      <div className={`d-flex justify-content-around w-100 text-center`}>
        <span className="fw-bold text-success big-font">3</span>
        <span className="fw-bold big-font" style={{color: "#FF8D02"}}>6</span>
        <span className="fw-bold big-font" style={{color: "#FF0000"}}>2</span>
      </div>
        <div className="ps-xl-5 ps-lg-4 ps-md-2 row justify-content-center pb-1 fnt-size">
          <small className="col-4 justify-content-center fw-bold text-success">{`New`}</small>
          <small className="col-4 justify-content-center fw-bold" style={{color: "#FF8D02"}}>{`In-Progress`}</small>
          <small className="col-4 justify-content-center fw-bold" style={{color: "#FF0000"}}>{`Pending`}</small>
        </div>
        <div className="progress rounded-0 justify-content-between" style={{ height: "8px" }} >
          <div className="progress-bar justify-content-center bg-success" style={{ width: `33%`,}}></div>
          <div className="progress-bar justify-content-center" style={{ width: `33%`, backgroundColor: "#FF8D02" }}></div>
          <div className="progress-bar justify-content-center" style={{ width: `33%`, backgroundColor: "#FF0000" }}></div>
        </div>
      </div>
  );
};

export default MyRequestAging;
