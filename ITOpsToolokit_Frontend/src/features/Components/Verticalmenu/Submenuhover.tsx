import { useRef } from "react";
import { Popover } from "react-bootstrap";
import Overlay from "react-bootstrap/Overlay";
import { Link } from "react-router-dom";

const Submenuhover = (props: any) => {
  const target = useRef(null);
  const setActiveOverlay = (index: any) => {
    props.setActiveOverlay(index);
  };
  let subMenuItems = props.subMenuItems;
  let currentCloud = props.Cloud;
 
  return (
    <div ref={target}>
      {
        <div
          onMouseEnter={() => {
            setActiveOverlay(props.index);
          }}
          className="submenu-container pe-auto  px_3 py-1 bg-light"
        >
          <img
            src={props.icon}
            alt="cloud-icon"
            className="cloud-icon"
          />
          <Overlay
            target={target.current}
            show={props.activeHover === props.index}
            placement="right-start"
          >
            {(props) => (
              <Popover onMouseLeave={() => {
                setActiveOverlay(null);
              }}
                id="overlay-example" {...props}>
                <div className="setborder  shadow-lg">{subMenuItems?.map((innerCurrElem: any, index: number) => {
             
                  return <>
                    <Link key={index}className="nav-link bs-gradient border-bottom border-2 hover_menu" to={ currentCloud !== "vmware" ? `launch-stack/${currentCloud}${innerCurrElem.menuItemUrl}` : `/${currentCloud}`}>
                      <p className=" px-3 mb-0 py-2 ">
                        {innerCurrElem.menuItemLabel}
                      </p>
                    </Link>
                  </>
                })}
                </div>
              </Popover>
            )}
          </Overlay>
        </div>
      }
    </div>
  );
};

export default Submenuhover;