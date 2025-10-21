
import React, { useEffect,useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingDollar,
  faScrewdriverWrench,
  faTableColumns,
  faChartLine,
  faGear,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Togglenav from "./Togglenav";
import HoverMenu from "./HoverMenu";
import useApi from "../../../customhooks/useApi";
import getLaunchStacks from "../../../api/LaunchStack";
import { selectCommonConfig, setLaunchStackData } from "../CommonConfig/commonConfigSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";
import vmware from '../../../assets/vmware.jpg';
import { Link } from "react-router-dom";
import { GiArtificialIntelligence } from "react-icons/gi";
import { BsRobot } from "react-icons/bs";
const VerticalNavigation = () => {
  const getLaunchStackData: any = useApi(getLaunchStacks.getLaunchStacks);
  const storeData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const menuListCapabilities = storeData.loginDetails.capabilities
  const [isOpen, setIsOpen] = useState(false);

  var dashboardSubmenu: any = {
    "Tagging": {
      url: "/tagging-policy",
    },
    "Orphan Objects": {
      url: "/orphan-objects",
    },
    "Advisory": {
      url: "/cloud-advisory",
    },
    "Patching": {
      url: "/Patch-Dashboard",
    },
    "Compliance": {
      url: "/complaince-policy",
    },
    "Tag Policy Manager": {
      url: "/manage-tagging-policy",
    },
  }

  useEffect(() => {
    getLaunchStackData.request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(setLaunchStackData(getLaunchStackData?.data?.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getLaunchStackData.data]);

  let launchStackSubmenu: any = {};

  let reportsSubmenu: any = {
    "Observability": {
      url: "http://99.79.173.182:3000/d/PGmkrSzIk/hcm-finops-insights?orgId=1",
      // url: "http://35.183.115.112:3000/d/Kgvh8R-4z/cloud-natives-unified-view-final?orgId=1",
    },
    "Incidents Report": {
      url: "http://ec2-99-79-173-182.ca-central-1.compute.amazonaws.com:3000/d/-1-MCNYVk/itsm-incident-dashboard",
    },
    "Service request Report": {
      url: "http://ec2-99-79-173-182.ca-central-1.compute.amazonaws.com:3000/d/Ou8nIGB4z/itsm-service-request-dashboard?orgId=1",
    },
    "Power BI Report": {
      url: "/",
    },
  }

  let gearSubmenu: any = {
    "Onboarding": {
      url: "/onboarding",
    },
    "Stack Onboaring": {
      url: "/stack-onboarding",
    },
  }

  getLaunchStackData?.data?.data.forEach((curr: any, index: number) => {

    launchStackSubmenu[curr?.Cloud] = curr.LaunchStacks.map(
      (innerCurr: any, index: number) => {
        let url: any = Object.keys(innerCurr)[0].replaceAll(" ", "");
        return {
          menuItemLabel: Object.keys(innerCurr)[0],
          menuItemUrl: `/${url}`,
        };
      }
    );
  });

  var Submenu: any = {
    rocket: {},
    dashboards: {},
    reports: {},
    gear: {}
  };


  if (menuListCapabilities.LaunchStack) {
    Object.keys(launchStackSubmenu).forEach((curr: any, index: number) => {

      if ((menuListCapabilities.LaunchStack[0][curr])) {
        Submenu.rocket[curr] = {
          submenuItems: launchStackSubmenu[curr],
          menuIcon: curr === "AWS" ? awsIcon : curr === 'Azure' ? azureIcon : gcpIcon,
        }
      }

      if (storeData.loginDetails.role !== "launchStack_aws") {

        Submenu.rocket['vmware'] = {
          submenuItems: [{
            menuItemLabel: "Vm Ware",
            menuItemUrl: `/VmWare`,
          }],
          menuIcon: vmware
        }
      }

    })
  }

  if (menuListCapabilities.Dashboard) {
    Object.keys(dashboardSubmenu).forEach((curr: any, index: number) => {
      if (menuListCapabilities.Dashboard[0][curr]) {
        Submenu.dashboards[curr] = dashboardSubmenu[curr]
      }
    })
  }

  console.log("dashboardSubmenu",Submenu.dashboards)

  if (menuListCapabilities.Reports) {
    Object.keys(reportsSubmenu).forEach((curr: any, index: number) => {
      if (menuListCapabilities.Reports[0]['Observability'] && curr === "Observability") {
        Submenu.reports[curr] = reportsSubmenu[curr]
      }
      if (menuListCapabilities.Reports[0]['ITSM'] && curr === "Incidents Report") {
        Submenu.reports[curr] = reportsSubmenu[curr]
      }
      if (menuListCapabilities.Reports[0]['Power BI'] && curr === "Power BI Report") {
        Submenu.reports[curr] = reportsSubmenu[curr]
      }

      if (menuListCapabilities.Reports[0]['Service request Report'] && curr === "Service request Report") {
        Submenu.reports[curr] = reportsSubmenu[curr]
      }
    })
  }

  Object.keys(gearSubmenu).forEach((curr: any, index: number) => {
    if (menuListCapabilities['Onboarding'] && curr === "Onboarding") {
      Submenu.gear[curr] = gearSubmenu[curr]
    }

    if (menuListCapabilities['Onboarding']) {
      if (menuListCapabilities.StackOnboarding[0] && curr === "Stack Onboaring") {
        Submenu.gear[curr] = gearSubmenu[curr]
      }
    }
  })

  return (
    <>

      {/* Hamburger for mobile */}
      {/* <button
        className="btn btn-link d-sm-none position-fixed top-0 start-0 m-2 z-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button> */}

      {/* Sidebar */}
      <nav className={`navbar navbar-expand-sm pt-1 ${isOpen ? 'd-block' : 'd-none d-sm-block'}`}>
        <div
          className="collapse navbar-collapse show position-fixed d-flex flex-column align-items-center pt-5 vericalnav_bachground"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav gap_4 flex-column">
            {Object.keys(menuListCapabilities).includes('LaunchStack') && (
              <li className="nav-item icons_layout verical_nav_icons d-flex justify-content-center">
                <a className="text-white submenu_index" href="#">
                  <Togglenav
                    className="rocket-height text-white"
                    subMenuItems={Submenu.rocket}
                  />
                </a>
              </li>
            )}

            <li className="nav-item icons_layout verical_nav_icons d-flex justify-content-center">
              <Link className="text-white" to="/landingIAC" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faRobot} />
              </Link>
            </li>

            {Object.keys(menuListCapabilities).includes('FinOps') && (
              <li className="nav-item icons_layout verical_nav_icons d-flex justify-content-center">
                <Link className="text-white" to="/FinopsDashboard" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faHandHoldingDollar} />
                </Link>
              </li>
            )}

            {Object.keys(menuListCapabilities).includes('CloudOps') && (
              <li className="nav-item icons_layout verical_nav_icons d-flex justify-content-center">
                <Link className="text-white" to="/Cloud-operations" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faScrewdriverWrench} />
                </Link>
              </li>
            )}

            {Object.keys(menuListCapabilities).includes('Dashboard') && (
              <li className="nav-item icons_layout verical_nav_icons d-flex justify-content-center">
                <a className="text-white" href="#" title="Dashboards">
                  <HoverMenu
                    className="text-white"
                    icon={<FontAwesomeIcon icon={faTableColumns} />}
                    subMenuItems={Submenu.dashboards}
                  />
                </a>
              </li>
            )}

            {Object.keys(menuListCapabilities).includes('Reports') && (
              <li className="nav-item icons_layout verical_nav_icons d-flex justify-content-center">
                <a className="text-white" href="#" title="Reports">
                  <HoverMenu
                    className="text-white"
                    icon={<FontAwesomeIcon icon={faChartLine} />}
                    subMenuItems={Submenu.reports}
                    openInNewTab
                  />
                </a>
              </li>
            )}

            {Object.keys(menuListCapabilities).includes('Onboarding') && (
              <li className="nav-item icons_layout verical_nav_icons d-flex justify-content-center">
                <a className="text-white" href="#" title="Onboarding">
                  <HoverMenu
                    className="text-white"
                    icon={<FontAwesomeIcon icon={faGear} />}
                    subMenuItems={Submenu.gear}
                  />
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>

    </>
  );
};
export default VerticalNavigation;