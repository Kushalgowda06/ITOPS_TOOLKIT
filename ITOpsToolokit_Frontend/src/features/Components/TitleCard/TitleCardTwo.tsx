import React from "react";
import { GoArrowUpRight } from "react-icons/go";
import { wrapIcon } from "../../Utilities/WrapIcons";


const TitleCardTwo = (props) => {
  const GoArrowUpRightIcon = wrapIcon(GoArrowUpRight);

  return (
    <div className="py-3 cursor-pointer flip-card">
      <div className="card " style={{ height: "185px" }}>
        <div className="card-body  flip-card-bg">
          <div className="card-front">
            <div className="d-flex justify-space-between align-items-center">
              {props.icon}
              <span className="text-center fw-bold text-primary p-3 description_font">{props.title}</span>
            </div>
            <p className="f-size py-3 text-primary text-start">{props.description.message}</p>
          </div>
          <div className="card-back">
            {props.description.features.map((item, index) => (
              <div className="f-size ps-4 pt-1"><GoArrowUpRightIcon key={index} className="px-2 fs-2" />{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TitleCardTwo;
