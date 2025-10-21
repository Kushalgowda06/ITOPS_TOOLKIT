import React from 'react';
import { Card, Tooltip } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBriefcase,
  faFileAlt,
  faLock,
  faCogs,
  faShareAlt,
  faLightbulb,
} from '@fortawesome/free-solid-svg-icons';
import CategoryCard from './CardWrapper';

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

function MyCardList({ mockCards, active, handleClick }) {
  return (

    <div className="d-flex flex-wrap gap-1 pt-5 padding_left ">
      {mockCards.length > 0 ? (
        mockCards.map((ticket, index) => (

<CategoryCard
  title={ticket.title}
  description={capitalizeFirstLetter(ticket.description)}
  // version="v2.1.4"
  iconType={getCategoryIcon(ticket.iconType)}
  // imageSrc="/images/cluster.png"
  active={active}
  index={ index}
  onClick={handleClick }
  ticket={ticket}
  paddingClass="p-3" 
/>


          // <Card
          //   key={ticket.id || index}
          //   className={`category_card text-primary mb-1 p-3 me-3 cursor-pointer ${active === index ? "selected" : ""}`}
          //   onClick={() => handleClick(ticket, index)}
          // >
          //   <div className="d-flex justify-content-between card-header-flex align-items-center">
          //     <span>
          //       <strong >{ticket.title}</strong>
          //     </span>
          //     <span>
          //       <FontAwesomeIcon icon={getCategoryIcon(ticket.iconType)} className="card_icon" />
          //     </span>
          //   </div>

          //   <p className="mb-1 mt-3 card_description">
          //     <Tooltip
          //       title={capitalizeFirstLetter(ticket.description)}
          //       placement="top"
          //       arrow
          //       followCursor
          //       PopperProps={{
          //         className: "high-z-index",
          //       }}
          //     >
          //       <span className="cursor-pointer">
          //         {ticket.description.substring(0, 60)}
          //         {ticket.description.length > 60 ? "..." : ""}
          //       </span>
          //     </Tooltip>
          //   </p>
          // </Card>
        ))
      ) : (
        <div className="text-white text-center w-100 p-3">No Categories found.</div>
      )}
    </div>
  );
}

export default MyCardList;
