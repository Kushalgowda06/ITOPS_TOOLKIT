import TitleCard from "../TitleCard/TitleCard";
import { Link } from "react-router-dom";
import { GiResize } from "react-icons/gi";
import { CiPower } from "react-icons/ci";
import { FaPowerOff } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { FaCircleStop } from "react-icons/fa6";
import { MdRestartAlt } from "react-icons/md";
import { MdDisplaySettings } from "react-icons/md";
import { LuCable } from "react-icons/lu";
import { BsBan } from "react-icons/bs";
import { AiOutlineKubernetes, AiOutlineRobot, AiFillRobot } from "react-icons/ai";
import { RxTimer } from "react-icons/rx";
import { LuCloudCog } from "react-icons/lu";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { wrapIcon } from "../../Utilities/WrapIcons";

const CloudOperationsPage: React.FC = () => {
  const GiResizeIcon = wrapIcon(GiResize);
  const CiPowerIcon = wrapIcon(CiPower);
  const FaPowerOffIcon = wrapIcon(FaPowerOff);
  const FaPlayIcon = wrapIcon(FaPlay);
  const FaCircleStopIcon = wrapIcon(FaCircleStop);
  const MdRestartAltIcon = wrapIcon(MdRestartAlt);
  const MdDisplaySettingsIcon = wrapIcon(MdDisplaySettings);
  const LuCableIcon = wrapIcon(LuCable);
  const BsBanIcon = wrapIcon(BsBan);
  const AiOutlineKubernetesIcon = wrapIcon(AiOutlineKubernetes);
  const AiFillRobotIcon = wrapIcon(AiFillRobot);
  const RxTimerIcon = wrapIcon(RxTimer);
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
            <p className="pt-3 k8title fw-bolder">Cloud Operations</p>
          </div>
          <div className="px-2">
            <div className="  row d-flex flex-wrap text-center pb-3 mx-2 mb-4 card-title">
              {menuListCapabilities['Resize VM'] ? <div className="cloudOps-width col-md-6  col-lg-4 " >
                <Link
                  className="pe-auto"
                  to="/Cloud-operations/Resize-vm"
                  title="Resize VM"
                >
                  <TitleCard
                    title="Resize VM"
                    description="A Kubernetes cluster is a set of nodes 
                  that run containerized applications
                  packages an app with its dependences
                  and some necessary services."
                    icon={<GiResizeIcon className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> : <></>}
              {menuListCapabilities['VM Status Manager'] ? <div className="cloudOps-width col-md-6 col-lg-4 " >
                <Link
                  className="pe-auto"
                  to="/Cloud-operations/Vm-status-manager"
                  title="VM Status Manager"
                >
                  <TitleCard
                    title="VM Status Manager"
                    description={
                      <span>
                        <li className="d-flex align-items-center">
                          <FaPowerOffIcon className="me-2" /> Power Status
                        </li>
                        <li className="d-flex align-items-center">
                          <FaPlayIcon className="me-2" /> Start Status
                        </li>
                        <li className="d-flex align-items-center">
                          <FaCircleStopIcon className="me-2" /> Stop Status
                        </li>
                        <li className="d-flex align-items-center">
                          <MdRestartAltIcon className="me-2" /> Restart Status
                        </li>
                      </span>
                    }
                    icon={<CiPowerIcon className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> : <></>}
              {menuListCapabilities['Configuration Manager'] ? <div className="cloudOps-width col-md-6 col-lg-4 ">
                <Link
                  className="pe-auto "
                  to="/Cloud-operations"
                  title="Resize VM"
                >
                  <TitleCard
                    title="VM Configuration
                  Manager"
                    description="Kubernetes often releases updates to
                  deliver security updates, fix known 
                  issues, and introduce new features"
                    icon={<MdDisplaySettingsIcon className="card-icon" />}
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
                          <FaPlayIcon className="me-1" /> Enable Port
                        </li>
                        <li className="d-flex align-items-center">
                          <BsBanIcon className="me-2" /> Disable Port
                        </li>
                      </span>
                    }
                    icon={<LuCableIcon className="card-icon" />}
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
                    icon={<RxTimerIcon className="card-icon" />}
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
                    icon={<AiOutlineKubernetesIcon className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> : <></>}
              {menuListCapabilities['Role Based Automation'] ? <div className="cloudOps-width col-md-6  col-lg-4 margin_top">
                <Link
                  className="pe-auto"
                  to="/Role-Based-Automation/"
                  title="Role Based Automation"
                >
                  <TitleCard
                    title="Role Based Automation"
                    description="Role Based Automation"
                    icon={<AiFillRobotIcon className="card-icon" />}
                    cardBgIcon={"title-card-background"}
                  />
                </Link>
              </div> : <></>}
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default CloudOperationsPage;
