import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
interface AgingProps {
  title: string;
  case: string;
  calculatedata: {
    gr1moncount: number;
    less1moncount: number;
    less1weekcount: number;
    less1daycount: number;
    grmon: number;
    lesmon: number;
    w: number;
    d: number;
  };
  upperPadding: string;
  lowerPadding: string;
}

const Aging: React.FC<AgingProps> = (props) => {
  const [Items] = useState(props.title);
  const navigate = useNavigate();
  let orphanstatus: boolean = false;
  const handleClick = (e1: string, e2: number) => {
    if (props.case === "Untagged-Aging") {
      if (e2 > 0) {
        const clickedLabel = e1;
        navigate({
          pathname: "/objectaging",
          search: `?label=${clickedLabel}`,
        });
      }
    } else if (props.case === "orphan-object") {
      if (e2 > 0) {
        const clickedLabel = e1;
        navigate({
          pathname: "/orphanaging",
          search: `?label=${clickedLabel}`,
        });
      }
    } else if (props.case === "advisory-aging") {
      if (e2 > 0) {
        const clickedLabel = e1;
        navigate({
          pathname: "/advisory-Aging",
          search: `?label=${clickedLabel}`,
        });
      }
    }
    else if (props.case === "complaince-aging") {
      if (e2 > 0) {
        const clickedLabel = e1;
        navigate({
          pathname: "/complaince-aging",
          search: `?label=${clickedLabel}`,
        });
      }
    }
  };

  //case for Orphan aging
  if (Items[0] === "O" || Items[0] === "N") {
    orphanstatus = true;
  }

  return (
    <>
      <div className="w-100">
        {" "}
        <div className={orphanstatus ? "status_height" : ""}>
          <small className="fw-bold nav-font">{props.title}</small>{" "}
        </div>
        <div
          className={` ${orphanstatus ? " status_height1" : ""} d-flex w-100 text-center  ${props.upperPadding}`}
        >
          {" "}
          <p
            className="col fs1 fw-bold text-danger un-tagged-aging-shadow"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleClick(">1Month", props.calculatedata.gr1moncount);
            }}
          >
            {props.calculatedata.gr1moncount}
          </p>{" "}
          <p
            className="col fs1 fw-bold text-orange un-tagged-aging-shadow"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleClick("<1Month", props.calculatedata.less1moncount);
            }}
          >
            {props.calculatedata.less1moncount}
          </p>{" "}
          <p
            className="col fs1 fw-bold text-warning un-tagged-aging-shadow"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleClick("<1Week", props.calculatedata.less1weekcount);
            }}
          >
            {props.calculatedata.less1weekcount}
          </p>{" "}
          <p
            className="col fs1 fw-bold text-success un-tagged-aging-shadow"
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleClick("<1Day", props.calculatedata.less1daycount);
            }}
          >
            {props.calculatedata.less1daycount}
          </p>{" "}
        </div>{" "}
        <div className={`${props.lowerPadding}`}>
          {" "}
          <div className="row justify-content-around tab pb-1 pt-1">
            {" "}
            <small className="col-2 justify-content-center fw-bold text-danger">
              {" "}
              {`>1Month`}{" "}
            </small>{" "}
            <small className="col-2 justify-content-center fw-bold text-orange">{`<1Month`}</small>{" "}
            <small className="col-2 justify-content-center fw-bold text-warning">{`<1Week`}</small>{" "}
            <small
              className="col-2 justify-content-center fw-bold text-success"
              style={{ color: "#2fb400" }}
            >{`<1Day`}</small>{" "}
          </div>{" "}
          <div className="progress rounded-0 box-shadow-aging status_height2" >
            {" "}
            <div
              className="progress-bar bg-danger"
              style={{ width: `${props.calculatedata.grmon}%` }}
            ></div>{" "}
            <div
              className="progress-bar bg-orange"
              style={{ width: `${props.calculatedata.lesmon}%` }}
            ></div>{" "}
            <div
              className="progress-bar bg-warning"
              style={{ width: `${props.calculatedata.w}%` }}
            ></div>{" "}
            <div
              className="progress-bar bg-success"
              style={{ width: `${props.calculatedata.d}%` }}
            ></div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
};
export default Aging;
