import TitleCard from "../TitleCard/TitleCard";
import { Link } from "react-router-dom";
import { FaWindows, FaLinux, FaGlobe, FaBolt } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { LuCloudCog } from "react-icons/lu";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { wrapIcon } from "../../Utilities/WrapIcons";

const RoleAutomationPage: React.FC = () => {

    const FaWindowsIcon = wrapIcon(FaWindows);
    const FaLinuxIcon = wrapIcon(FaLinux);
    const FaGlobeIcon = wrapIcon(FaGlobe);
    const IoIosSettingsIcon = wrapIcon(IoIosSettings);
    const LuCloudCogIcon = wrapIcon(LuCloudCog);
  
  const storeData = useAppSelector(selectCommonConfig);
  const menuListCapabilities = storeData.loginDetails.capabilities.CloudOps[0]

  return (
    <>
      <div className="m-2 onboarding-page-h bg_color">
        <div className="">
          <div className="d-flex  align-items-center">
            <LuCloudCogIcon
              className="py-2 mx-1 big-font"
            />
            <p className="pt-3 k8title fw-bolder">Role Based Automation</p>
          </div>
          <div className="px-2">
            <div className="  row d-flex flex-wrap text-center pb-3 mx-2 mb-4 card-title">
              {/* {menuListCapabilities['Resize VM'] ? */}

              <div className="cloudOps-width col-md-6  col-lg-4 " >
                <Link
                  className="pe-auto"
                  to="/Role-Based-Automation/Windows"
                  title="Windows"
                >
                  <TitleCard
                    title="Windows Bots"
                    description="A Kubernetes cluster is a set of nodes 
                  that run containerized applications
                  packages an app with its dependences
                  and some necessary services."
                    icon={<FaWindowsIcon className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div>
              <div className="cloudOps-width col-md-6  col-lg-4 " >
                <Link
                  className="pe-auto"
                  to="/Role-Based-Automation/Linux"
                  title="Linux"
                >
                  <TitleCard
                    title="Linux Bots"
                    description="A Kubernetes cluster is a set of nodes 
                  that run containerized applications
                  packages an app with its dependences
                  and some necessary services."
                    icon={<FaLinuxIcon className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div>
              <div className="cloudOps-width col-md-6  col-lg-4 " >
                <Link
                  className="pe-auto"
                  to=""
                  // /Role-Based-Automation/Network
                  title="Network"
                >
                  <TitleCard
                    title="Network Bots"
                    description="A Kubernetes cluster is a set of nodes 
                  that run containerized applications
                  packages an app with its dependences
                  and some necessary services."
                    icon={<FaGlobeIcon className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div>
              <div className="cloudOps-width col-md-6  col-lg-4 " >
                <Link
                  className="pe-auto"
                  to=""
                  // /Role-Based-Automation/BatchOps
                  title="BatchOps"
                >
                  <TitleCard
                    title="Batch ops Bots"
                    description="A Kubernetes cluster is a set of nodes 
                  that run containerized applications
                  packages an app with its dependences
                  and some necessary services."
                    icon={<IoIosSettingsIcon className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div>
              {/* // : <></>} */}
              {/* {menuListCapabilities['VM Status Manager'] ? <div className="cloudOps-width col-md-6 col-lg-4 " >
                <Link
                  className="pe-auto"
                  to="/Cloud-operations/Vm-status-manager"
                  title="Linux"
                >
                  <TitleCard
                    title="Linux"
                    description={
                      <span>
                          <li className="d-flex align-items-center">
                            <FaPowerOff className="me-2" /> Power Status
                          </li>
                          <li className="d-flex align-items-center">
                            <FaPlay className="me-2" /> Start Status
                          </li>
                          <li className="d-flex align-items-center">
                            <FaCircleStop className="me-2" /> Stop Status
                          </li>
                          <li className="d-flex align-items-center">
                            <MdRestartAlt className="me-2" /> Restart Status
                          </li>
                      </span>
                    }
                    icon={<CiPower className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> : <></>}
              {menuListCapabilities['Configuration Manager'] ? <div className="cloudOps-width col-md-6 col-lg-4 ">
                <Link
                  className="pe-auto "
                  to="/Role-Based-Automation"
                  title="DataBase" 
                >
                  <TitleCard
                    title="DataBase"
                    description="Kubernetes often releases updates to
                  deliver security updates, fix known 
                  issues, and introduce new features"
                    icon={<MdDisplaySettings className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> : <></>}
              {menuListCapabilities['Ports Manager'] ? <div className="cloudOps-width col-md-6 col-lg-4 margin_top">
                <Link
                  className="pe-auto"
                  to="/Cloud-operations/"
                >
                  <TitleCard
                    title="Ports Manager"
                    description={
                      <span>
                        <li className="d-flex align-items-center">
                          <FaPlay className="me-1" /> Enable Port
                        </li>
                        <li className="d-flex align-items-center">
                          <BsBan className="me-2" /> Disable Port
                        </li>
                      </span>
                    }
                    icon={<LuCable className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> : <></>}
              {menuListCapabilities['Idle Session'] ? <div className="cloudOps-width col-md-6  col-lg-4 margin_top">
                <Link
                  className="pe-auto"
                  to="/Cloud-operations/"
                >
                  <TitleCard
                    title="Idle Session"
                    description="The ingress and egress rules manager 
                  specify the direction of allowed access 
                  to and from different identities and 
                  resources. Ingress and egress rules"
                    icon={<RxTimer className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> : <></>}
              {menuListCapabilities['Kubernetes Manager'] ? <div className="cloudOps-width col-md-6  col-lg-4 margin_top">
                <Link
                  className="pe-auto"
                  to="/Cloud-operations/Kubernetes-cluster-manager"
                  title="Cloud Operations"
                >
                  <TitleCard
                    title="Kubernetes 
                    Configuration Manager"
                    description="Kubernetes often releases updates to
                    deliver security updates, fix known 
                    issues, and introduce new features"
                    icon={<AiOutlineKubernetes className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> :<></>} */}
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default RoleAutomationPage;
