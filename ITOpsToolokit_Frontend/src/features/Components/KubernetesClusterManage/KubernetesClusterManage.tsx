import React, { useState } from "react";
import TitleCard from "../TitleCard/TitleCard";
import { Link, useLocation } from "react-router-dom";
import LaunchClusterPopup from "../LaunchClusterPopup/LaunchClusterPopup";
import { AiOutlineKubernetes } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { GoVersions } from "react-icons/go";
import { PiTreeViewThin } from "react-icons/pi";
import { PiArrowsDownUpThin } from "react-icons/pi";
import { PiShippingContainerThin } from "react-icons/pi";
import { FaChevronRight } from "react-icons/fa";
import { PiRocketLaunchThin } from "react-icons/pi";
import { Breadcrumbs } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { wrapIcon } from '../../Utilities/WrapIcons';


const KubernetesClusterManage: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
    const AiOutlineKubernetesIcon = wrapIcon(AiOutlineKubernetes);
    const RxDashboardIcon = wrapIcon(RxDashboard);
    const GoVersionsIcon = wrapIcon(GoVersions);
    const PiTreeViewThinIcon = wrapIcon(PiTreeViewThin);
    const PiArrowsDownUpThinIcon = wrapIcon(PiArrowsDownUpThin);
    const PiShippingContainerThinIcon = wrapIcon(PiShippingContainerThin);
    const FaChevronRightIcon = wrapIcon(FaChevronRight);
    const PiRocketLaunchThinIcon = wrapIcon(PiRocketLaunchThin);

  const lastPathSegment = location.pathname.split("/").pop();

  const breadcrumbs = [
    <Link
      className="border-bottom border-primary fw-normal"
      to="/Cloud-operations"
      title="Cloud operations"
    >
      Cloud operations
    </Link>,
    <Link
      className="pe-auto border-bottom border-primary fw-normal"
      to={pathname}
      title={`${lastPathSegment}`}
    >
      {lastPathSegment}
    </Link>,
  ];

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const cloudData = useAppSelector(selectCommonConfig);

  const userCapabilities = cloudData.loginDetails.capabilities.CloudOps;

  return (
    <div className="m-2 onboarding-page-h bg_color">
      <div className="p-2 k8-background">
        <div className="d-flex">
          <AiOutlineKubernetesIcon className="k8-title-logo-size k8-logo-size py-1 mx-2 mt-1" />
          <span className="k8_title  fw-bolder pe-2">
            Kubernetes Cluster Manager
          </span>
          <span className="align-self-center pt-1">
            <Breadcrumbs
              className="d-flex justify-content-start card-title align-items-center fw-bold px-2"
              separator={<FaChevronRightIcon className="text-primary pt-1" />}
              aria-label="breadcrumb"
            >
              {breadcrumbs}
            </Breadcrumbs>
          </span>
        </div>
        <div className="px-4">
          <div className="container  text-center mb-4 container_width">
            <div className="row gx-5 py-5 card-title">
              <div className="col-md-6 col-lg-4">
                <TitleCard
                  title="Kubernetes Dashboard"
                  description="A Kubernetes cluster is a set of nodes 
                that run containerized applications
                packages an app with its dependences
                and some necessary services."
                  icon={<RxDashboardIcon className="card-icon" />}
                  cardBgIcon={"card-background"}
                />
              </div>
              {true ? (
                <div className="col-md-6 col-lg-4" onClick={togglePopup}>
                  <TitleCard
                    title="Launch Cluster"
                    description="A Kubernetes cluster is a set of nodes that run containerized applications packages an app with its dependencies and some necessary services."
                    icon={<PiRocketLaunchThinIcon className="card-icon" />}
                    cardBgIcon={"card-background"}
                  />
                </div>
              ) : (
                <></>
              )}
              {
                <LaunchClusterPopup
                  showPopup={showPopup}
                  onHide={handleClosePopup}
                />
              }
              {true ? (
                <div className="col-md-6 col-lg-4">
                  <Link
                    className="pe-auto"
                    to="/Cloud-operations/Kubernetes-cluster-manager/version-upgrade"
                    title="Cloud Operations"
                  >
                    <TitleCard
                      title="Version Upgrade"
                      description="Kubernetes often releases updates to
              deliver security updates, fix known 
              issues, and introduce new features"
                      icon={<GoVersionsIcon className="card-icon" />}
                      cardBgIcon={"card-background"}
                    />
                  </Link>
                </div>
              ) : (
                <></>
              )}
              {true ? (
                <div className="col-md-6 col-lg-4 margin_top">
                  <Link
                    className="pe-auto"
                    to="/Cloud-operations/Kubernetes-cluster-manager/node-manager"
                    title="Cloud Operations"
                  >
                    <TitleCard
                      title="Node Manager"
                      description="Kubernetes nodes are managed by a control plane, which automatically handles the deployment and scheduling of pods across nodes in a Kubernetes cluster"
                      icon={<PiTreeViewThinIcon className="card-icon" />}
                      cardBgIcon={"card-background"}
                    />
                  </Link>
                </div>
              ) : (
                <></>
              )}
              {true ? (
                <div className="col-md-6 col-lg-4 margin_top">
                  <Link
                    className="pe-auto"
                    to="/Cloud-operations/Kubernetes-cluster-manager/ingress-egress"
                    title="ingress egress"
                  >
                    <TitleCard
                      title="Ingress & Egress"
                      description="The ingress and egress rules manager 
                    specify the direction of allowed access 
                    to and from different identities and 
                    resources. Ingress and egress rules"
                      icon={<PiArrowsDownUpThinIcon className="card-icon" />}
                      cardBgIcon={"card-background"}
                    />
                  </Link>
                </div>
              ) : (
                <></>
              )}
              <div className="col-md-6 col-lg-4 margin_top">
                <Link
                  className="pe-auto"
                  to="/Cloud-operations/Kubernetes-cluster-manager/container-deployment"
                  title="container Deployment"
                >
                  <TitleCard
                    title="Container deployment"
                    description="Kubernetes often releases updates to
                  deliver security updates, fix known 
                  issues, and introduce new features"
                    icon={<PiShippingContainerThinIcon className="card-icon" />}
                    cardBgIcon={"card-background"}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KubernetesClusterManage;
