import React, { useEffect, useRef, useState } from "react";
import { Overlay, Popover } from "react-bootstrap";
import { Link } from "react-router-dom";

const HoverMenu = (props: any) => {
  const target = useRef(null);
  const [overlay, setOverlay] = useState<boolean>(false);
  // const popoverRef = useRef(null) // refer for the popover component
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const { openInNewTab } = props;

  useEffect(() => {
    return () => {
      // clear the timeout when the component is unmounted
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [hideTimeout]);

  const handleMouseEnter = () => {
    // clears the timeout if it's already running
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    setOverlay(true);
  };

  const handleMouseLeave = () => {
    // start the timeout to hide the subitems after 3 seconds
    const timeout = setTimeout(() => {
      setOverlay(false);
    }, 200);
    setHideTimeout(timeout);
  };

  let subMenuItems = props.subMenuItems;
  return (
    <div ref={target}>
      {
        <div
          className="submenu-container px_3 pe-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="cloud-icon">{props.icon}</span>
          <Overlay
            target={target.current}
            show={overlay}
            placement="right-start"
          >
            {(props) => (
              <Popover
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                id="overlay-example"
                {...props}
              >
                <div className="setborder  shadow-lg">
                  {Object.keys(subMenuItems).map(
                    (innerCurrElem: any, index: number) => {
                      return (
                        <>
                          <p className="border-bottom border-1  mb-0 bs-gradient cursor-pointer">
                            <Link
                              className="nav-link hover_menu px-3 py-2 "
                              to={subMenuItems[innerCurrElem]?.url}
                              target={openInNewTab ? "_blank" : "_self"}
                              rel="noopener noreferrer"
                            >
                              {innerCurrElem}
                              <span className="yellow">
                                {subMenuItems[innerCurrElem]?.subtitle}
                              </span>
                            </Link>
                          </p>
                        </>
                      );
                    }
                  )}
                </div>
              </Popover>
            )}
          </Overlay>
        </div>
      }
    </div>
  );
};

export default HoverMenu;
