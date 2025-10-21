import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const HeaderBar = ({ content, position = "start", padding, partialBorder = false }) => {
  const justifyClass =
    {
      start: "justify-content-start",
      center: "justify-content-center",
      end: "justify-content-end",
    }[position] || "justify-content-start";

  return (
    <div
      className={classNames(
        "d-flex",
        "align-items-center",
        justifyClass,
        padding,
        "px-1",
        "py-1",
        "rounded-top",
        // "background",
        "istm_header_height",
        partialBorder ? "glass-header-partial-border" : "box-shadow",
        // "text-primary"
      )}
    >
      <div className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold text-white" style={{ letterSpacing: '1px' }}>
        {content}
      </div>
    </div>
  );
};

HeaderBar.propTypes = {
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["start", "center", "end"]),
  padding: PropTypes.string,
  partialBorder: PropTypes.bool,
};

export default HeaderBar;
