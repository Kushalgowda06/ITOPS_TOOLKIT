import React from "react";
import PropTypes from "prop-types";
import { Card, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
// import kuberneteslogo from "./../../../assets/Kubernetes.png";
const CategoryCard = ({
  title,
  description,
  descriptionItems,
  iconType,
  imageSrc,
  version,
  active,
  index,
  onClick,
  ticket,
  paddingClass,
  checked,
  checkable,
  onCheckboxChange
}) => {
  console.log(imageSrc, "image");
  const handleCardClick = () => {
    if (onClick) {
      onClick(ticket, index);
    }
  };

  return (
    <Card
      className={classNames(
        "category_card",
        "itsm-glass-card",
        "text-white",
        "mb-1",
        paddingClass ,
        "me-3",
        "cursor-pointer",
        { selected: active === index }
      )}
      onClick={handleCardClick}
    >
      <div className="d-flex justify-content-between card-header-flex align-items-center">
        <div className="d-flex align-items-center gap-2">
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Icon"
              style={{ width: "30px" }}
              // className="card_image_icon"
            />
          )}

          <div>
            <strong>{title}</strong>
            {version && <div className=" small pb-1 ">Version: {version}</div>}
          </div>
        </div>
        
    {checkable && (
      <div className="pb-4 pe-2 upgrade-controls">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onCheckboxChange(index)}
      />
       </div>
    )}
    {iconType && <FontAwesomeIcon icon={iconType} className="card_icon" />}
 
        {/* {iconType && <FontAwesomeIcon icon={iconType} className="card_icon" />} */}
      </div>
      {description && (
        <p className="mb-1 mt-3 card_description">
          <Tooltip
            title={description}
            placement="top"
            arrow
            followCursor
            PopperProps={{ className: "high-z-index" }}
          >
            <span className="cursor-pointer">
              {description.substring(0, 60)}
              {description.length > 60 ? "..." : ""}
            </span>
          </Tooltip>
        </p>
      )}

      {descriptionItems &&
        Object.entries(descriptionItems)
          .filter(
            ([key]) =>
              key.toLowerCase() !== "name" &&
              key.toLowerCase() !== "kubernetesversion"
          )
          .map(([key, value], idx) => {
            const stringValue = String(value);
            const maxChars = 10;
            const truncatedValue =
              stringValue.length > maxChars
                ? stringValue.substring(0, maxChars) + "..."
                : stringValue;

            return (
              <div key={idx} className="d-flex pt-1">
                <span className="me-2 small ">{key}:</span>
                <Tooltip
                  title={stringValue}
                  placement="top"
                  arrow
                  followCursor
                  PopperProps={{ className: "high-z-index" }}
                >
                  <span className="cursor-pointer small ">{truncatedValue}</span>
                </Tooltip>
              </div>
            );
          })}
    </Card>
  );
};

CategoryCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  descriptionItems: PropTypes.object,
  iconType: PropTypes.any, // Replace with exact icon type if known
  imageSrc: PropTypes.string,
  version: PropTypes.string,
  active: PropTypes.number,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  ticket: PropTypes.any,
  paddingClass:PropTypes.any,
  checked:PropTypes.any,
  checkable:PropTypes.any,
  onCheckboxChange:PropTypes.any,
};

export default CategoryCard;
