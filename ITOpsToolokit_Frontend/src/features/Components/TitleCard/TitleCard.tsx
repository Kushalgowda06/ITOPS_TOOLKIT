import React from "react";

const TitleCard = (props) => {
  const { title, description, icon, cardBgIcon } = props;
  return (
    <div className="py-3 cursor-pointer">
      <div
        className="card rounded-4 text-white "
      >
        <div className={`card-body rounded-4 description ${cardBgIcon} shadow-lg card_height_xl `} >
          <div className="d-flex justify-space-around align-items-center">
            <span>{icon}</span>
            <span className="fw-bolder px-3">{title}</span>
          </div>
          <p className="f-size py-3 text-start">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default TitleCard;
