import React, { useEffect, useState } from "react";
import { Card, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faFileAlt,
  faLock,
  faCogs,
  faShareAlt,
  faLightbulb,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
interface Card {
  id: number;
  title: string;
  description: string;
  iconType: string;
  category: string;
}
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getCategoryIcon = (iconType) => {
  switch (iconType) {
    case 'briefcase': return faBriefcase;
    case 'document': return faFileAlt;
    case 'security': return faLock;
    case 'settings': return faCogs;
    case 'share': return faShareAlt;
    case 'idea': return faLightbulb;
    default: return faBriefcase;
  }
};




const SideCards = ({ cardsData,activeCardIndex,handleClick, handleBack }) => {
  return (
    <div className=" content-height d-flex flex-column">
      <div className="  text-primary box-shadow istm_header_height px-1 py-1 rounded-top text-center text-sm text-md text-lg text-xl text-xxl text-big fw-bold ">
        <div className="d-flex align-items-center text-center text-white">
          <FontAwesomeIcon
            icon={faArrowLeft}
            onClick={handleBack}
            className="me-2 cursor-pointer text-white"
          />
          <span>More Prompt</span>
        </div>
      </div>
      <div className="flex-grow-1 more_prompt p-2">

        <div className="row flex-column align-items-center ">
          {cardsData.map((ticket, index) => (
            <Card
              key={ticket.id || index}
              // className={`card_width text-primary mb-1 p-3 ${activeCardIndex === ticket.id ? "selected" : ""}`}
              className={`cursor-pointer itsm-glass-card card_width text-primary mb-1 p-3 ${activeCardIndex === ticket.id ? "selected" : ""}`}

              onClick={() => handleClick(ticket, index)}
            >
              <div className="d-flex justify-content-between card-header-flex f-size align-items-center">
                <span>
                  <strong >{ticket.title}</strong>
                </span>
                <span>
                  <FontAwesomeIcon icon={getCategoryIcon(ticket.iconType)} className="card_icon" />
                </span>
              </div>

              <p className="mb-1 mt-3 f-size">
                <Tooltip
                  title={capitalizeFirstLetter(ticket.description)}
                  placement="top"
                  arrow
                  followCursor
                  PopperProps={{
                    className: "high-z-index",
                  }}
                >
                  <span >
                    {ticket.description.substring(0, 45)}
                    {ticket.description.length > 60 ? "..." : ""}
                  </span>
                </Tooltip>
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>


  );
};
export default SideCards;