import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import Avatar from "@mui/material/Avatar";
import { Link, useLocation } from "react-router-dom";
import Cloudtoggle from "../Cloudtoggle/Cloudtoggle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import MyRequestDropDown from "../MyRequest/MyRequestDropDown";
import useApi from "../../../customhooks/useApi";
import getUser from "../../../api/user";
import { Dropdown } from "react-bootstrap";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  hasKClogout,
  resetLoginDetails,
  selectCommonConfig,
} from "../CommonConfig/commonConfigSlice";
import DropDown from "../MyRequest/DropDown";
import TagsFilter from "../TagsFilter/TagsFilter";
import { VscFilter } from "react-icons/vsc";
import { wrapIcon } from "../../Utilities/WrapIcons";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import keycloak from "../../Utilities/keyCloak";

const Header: React.FC = (props) => {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const VscFilterIcon = wrapIcon(VscFilter);


  const [showDropdown, setShowDropdown] = useState(false);
  const [showDropdownNew, setShowDropdownNew] = useState(false);
  const currentUsers: any = useAppSelector(selectCommonConfig);
  const referenceProjects = currentUsers.activeUserDetails.projects; // Declare the referenceProjects state variable
  const [dataFromChild, setDataFromChild] = useState([]);
  const ref = React.useRef(null);

  function handleDataFromChild(data) {
    setDataFromChild(data);
  }

  let data = dataFromChild.length === 0 ? referenceProjects : dataFromChild;

  const handleDropdownToggle = (event) => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownToggleTwo = () => {
    setShowDropdownNew(!showDropdownNew);
    !showDropdownNew === true && setDataFromChild(referenceProjects);
  };

  useEffect(() => {
    setDataFromChild(referenceProjects);
  }, [location]);

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setShowDropdown(false);
      setShowDropdownNew(false);
    }
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [hideTagsDrop, setHideTagsDrop] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      var classlist = event.target.className;
      const cls = [
        "Mui-focused",
        "ps-2",
        "cursor-pointer",
        "MuiAutocomplete-listbox",
        "base-Popper-root",
        "MuiInputBase-root",
        "PrivateSwitchBase-input css-1m9pwf3",
        "MuiBox-root css-1flbre6",
        "MuiBox-root",
        "css-1flbre6",
      ];

      if (classlist.length) {
        const clsNamecheck = cls?.some((i) => classlist?.includes(i));
        if (ref.current && !ref.current.contains(event.target) && !clsNamecheck) {
          setHideTagsDrop(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <>
      <nav className="navbar navbar-expand-sm  navbar-light glass-header-nav  header_bachground p-0">
        <div className="container-fluid nav-padding">
          <a
            className="navbar-brand header_logo  text-decoration-none text-white"
            href="/home"
          >
            <Link
              className="text-white text-decoration-none"
              to={
                Object.keys(currentUsers.loginDetails.capabilities).includes(
                  "Dashboard"
                ) &&
                  Object.keys(currentUsers.loginDetails.capabilities).includes(
                    "FinOps"
                  )
                  ? "/home"
                  : "/welcome"
              }
            >
              {/* <img alt="logo" className="logo-width" style={{width: "167px", height:"27px"}} src="cloud360logo.png" /> */}
              Cognizant
            </Link>

          </a>
           {!pathname.includes("home") && <Breadcrumbs />}
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNavAltMarkup"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu} // Attach the toggle function to the button
            data-bs-toggle="collapse"
            data-bs-target="#n_bar"
          >
            {/* <span className="navbar-toggler-icon"></span> */}
          </button>
          <div
            // className="collapse navbar-collapse d-flex justify-content-end"
            // id="navbarSupportedContent"
            className={`navbar-collapse justify-content-end ${isMenuOpen ? "show " : "collapse justify-content-start"
              } `}
            id="n_bar"
          >
            <ul className="navbar-nav d-flex align-item-center header-font   mb-lg-0">
              {pathname.includes("tagging-policy") ||
                pathname.includes("orphan-objects") ||
                // pathname.includes("/home") ||
                pathname.includes("/complaince-policy") ||
                pathname.includes("cloud-advisory") ||
                pathname.includes("/Analytics_AI") ? (
                <div onBlur={handleBlur}>
                  {currentUsers.loginDetails.role !== "launchStack_aws" && (
                    <div
                      className="nav nav-tabs text-white margin_tab border border-0"
                      id="nav-tab"
                      role="tablist"
                    >
                      <button
                        className={`nav-link text-white ${showDropdown
                          ? "active text-white border border-bottom-0 border-left border-right border-top"
                          : ""
                          }`}
                        onClick={handleDropdownToggle}
                        type="button"
                        role="tab"
                        aria-controls="nav-my-request"
                        aria-selected={showDropdown}
                      >
                        {" "}
                        My Request
                      </button>
                    </div>
                  )}
                  {/* {showDropdown && ( */}
                  <div className="py-0 shadow-lg">
                    <MyRequestDropDown showDropdown={showDropdown} />
                  </div>
                  {/* )} */}
                </div>
              ) : (
                <></>
                // <li className="px-2 nav-item ">
                //   <a
                //     className="nav-link active pe-auto  text-white"
                //     aria-current="page"
                //     href="/#"
                //   >
                //     My Request
                //   </a>
                // </li>
              )}

              {/* <li className="px-2 nav-item d-flex align-items-center text-white bell-size ">
                {/* <FontAwesomeIcon icon={faBell} /> */}
              {/* <IconButton color="inherit"> */}
              {/* <Badge badgeContent={4} color="error"> */}
              {/* <NotificationsIcon /> */}
              {/* </Badge> */}
              {/* </IconButton> */}
              {/* </li> */}

              {pathname.includes("/") ||
                pathname.includes("/itops") ||
                pathname.includes("/problem-ai") ||
                pathname.includes("/analytics") ||
                pathname.includes("/knowledge-ai") ||
                pathname.includes("/train-ai") ||
                pathname.includes("/incident-ai") ||
                pathname.includes("/transition-ai") ||
                pathname.includes("/compliance-ai") ||
                pathname.includes("/change-ai") ||
                pathname.includes("/Analytics_AI") ? (
                <></>
              ) : (
                <>
                  {" "}
                  {currentUsers.loginDetails.role !== "launchStack_aws" && (
                    <div onBlur={handleBlur}>
                      <div
                        className="nav ms-2 margin_tab rounded-pill  nav-tabs fw-bold border"
                        id="nav-tab"
                        role="tablist"
                      >
                        <button
                          className={`nav-link rounded-pill ${showDropdownNew
                            ? "active text-primary fw-bold border border-bottom-0 border-left border-right border-top border-primary"
                            : ""
                            }`}
                          onClick={handleDropdownToggleTwo}
                          type="button"
                          role="tab"
                          aria-controls="nav-my-dropdown"
                          aria-selected={showDropdownNew}
                        >
                          {" "}
                          {data.map((project) => (
                            <span
                              key={project}
                              className="badge bg-primary fw-bold rounded-pill mx-1"
                            >
                              {project}
                            </span>
                          ))}
                          {showDropdownNew ? (
                            <FontAwesomeIcon
                              icon={faCaretUp}
                              className="ps-1 fs_6"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faCaretDown}
                              className="ps-1 fs_6"
                            />
                          )}
                        </button>
                      </div>
                      {showDropdownNew && (
                        <div className="py-0 shadow-lg">
                          <DropDown sendDataToParent={handleDataFromChild} />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {pathname.includes("tagging-policy") ||
                pathname.includes("orphan-objects") ||
                // pathname.includes("/home") ||
                // pathname.includes("/istm") ||
                // pathname.includes("/Analytics_Ai") ||
                pathname.includes("/complaince-policy") ||
                pathname.includes("cloud-advisory") ? (
                <li className="px-2 nav-item align-items-center mt-2 mx-lg-3 ms-lg-3 border toggle bg-white rounded d-flex">
                  <Cloudtoggle />
                </li>
              ) : (
                <></>
              )}
              {/* <span className="fs-5">D</span> */}
              {pathname.includes("tagging-policy") ||
                pathname.includes("orphan-objects") ||
                // pathname.includes("/home") ||
                pathname.includes("cloud-advisory") ? (
                <li className="d-flex px-2 nav-item align-items-center">
                  <VscFilterIcon
                    className="fs_5 mb-1 text-white cursor-pointer"
                    onClick={() => setHideTagsDrop(!hideTagsDrop)}
                  // Toggle dropdowns on click
                  />
                </li>
              ) : (
                <></>
              )}
              <div className="py-0 pt-5 shadow-lg" ref={ref}>
                {hideTagsDrop && <TagsFilter />}
              </div>
              {/* <Dropdown className="" title="Tags Filter" autoClose="outside">
                  <Dropdown.Toggle
                    className="p-0 bg-transparent tags-filter-toggle border-0"
                    id="tags-filter-button"
                    
                  >
                    <VscFilter
                    className="fs-5 mb-1 text-white cursor-pointer"
                    onClick={() => setHideTagsDrop(true)}
                    // Toggle dropdowns on click
                  />
                  </Dropdown.Toggle>
                  <Dropdown.Menu >
                    <Dropdown.Item >
                    <TagsFilter  />
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> */}

              <li className="d-flex px-2 nav-item align-items-center">
                {/* <span className="fs-5">D</span> */}
                <Dropdown
                  className="profile-dropdown-container bg-secondary text-white d-flex align-items-center justify-content-center"
                  title="Logout"
                  autoClose="outside"
                  // key={'start'}
                  // drop={'down'}
                  align="end"
                  id="dropdown-menu-align-end"
                >
                  <Dropdown.Toggle
                    className="p-0 bg-transparent userId logout-toggle border-0"
                    id="logout-button"
                  >
                    <span className="current-user">
                      {currentUsers.loginDetails.currentUser
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="glass-card me-4 glass-shadow" >
                    <Dropdown.Item >
                      <div
                        onClick={() => {
                          dispatch(resetLoginDetails());
                          dispatch(hasKClogout(true))
                          keycloak.logout()
                        }}
                        className="d-flex glass-card glass-shadow justify-content-center"
                      >
                        <span className="text-lg text-white">Logout</span>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Header;
