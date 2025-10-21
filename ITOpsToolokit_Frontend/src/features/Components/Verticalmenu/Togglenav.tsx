import React, { useEffect, useState } from "react";
import Submenuhover from "./Submenuhover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

const Togglenav = (props: any) => {
  const [toggle, setToggle] = useState<Boolean>(false);
  const [activeOverlay, setActiveOverlay] = useState<any>(null);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // clear the timeout when the component is unmounted
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideTimeout]);

  const handleMouseEnter = () => {
    // clears the timeout if it's already running
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    setToggle(true);
  };

  const handleMouseLeave = () => {
    // start the timeout to hide the subitems after 3 seconds
    const timeout = setTimeout(() => {
      setToggle(false);
    }, 200);
    setHideTimeout(timeout);
  };

  const handleOverlayChange = (index: any) => {
    setActiveOverlay(index);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="d-flex justify-content-center">
        {/* <img alt="launch stacks" src="rocketImg.png" title="Launch Stack" className="rocket-icon img-width" /> */}
        <FontAwesomeIcon   className="" icon={faRocket} />
      </div>
      {toggle && (
        <div className="py-2">
          {Object.keys(props.subMenuItems).map(
            (currElem: any, index: number) => {
              // let menuIcon = 
              return (
                <Submenuhover
                  key={index}
                  subMenuItems={props.subMenuItems[currElem].submenuItems}
                  icon={props.subMenuItems[currElem].menuIcon}
                  activeHover={activeOverlay}
                  Cloud={currElem}
                  index={index}
                  setActiveOverlay={handleOverlayChange}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              );
            }
          )}
        </div>
      )}
    </div>
  );
};
export default Togglenav;
