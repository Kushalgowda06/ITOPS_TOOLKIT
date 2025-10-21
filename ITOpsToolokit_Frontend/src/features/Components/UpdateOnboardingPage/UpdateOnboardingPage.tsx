import React from "react";
import { Link } from "react-router-dom";
import TitleCardTwo from "../TitleCard/TitleCardTwo";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectCommonConfig,
  setActiveOnboarding,
} from "../CommonConfig/commonConfigSlice";
import { BsBriefcase } from "react-icons/bs";
import {
  PiProjectorScreenLight,
  PiAirTrafficControlThin,
  PiVaultThin,
} from "react-icons/pi";
import { CiUser, CiGlobe } from "react-icons/ci";
import { GiMoneyStack } from "react-icons/gi";
import { TfiLayoutListThumb } from "react-icons/tfi";
import { wrapIcon } from "../../Utilities/WrapIcons";

  const BsBriefcaseIcon = wrapIcon(BsBriefcase);
  const PiProjectorScreenLightIcon = wrapIcon(PiProjectorScreenLight);
  const PiAirTrafficControlThinIcon = wrapIcon(PiAirTrafficControlThin);
  const PiVaultThinIcon = wrapIcon(PiVaultThin);
  const CiUserIcon = wrapIcon(CiUser);
  const CiGlobeIcon = wrapIcon(CiGlobe);
  const GiMoneyStackIcon = wrapIcon(GiMoneyStack);
  const TfiLayoutListThumbIcon = wrapIcon(TfiLayoutListThumb);


const titleCardsData = [
  {
    link: "BU-onboarding-details",
    activeOnboarding: "BU",
    title: "BU Onboarding",
    description: {
      message: "This is Business Unit Onboard Hub",
      features: [
        "BU Onboarding Form",
        "Take look of All the available BUs",
        "Onboard new Business Unit",
        "Edit existing Business Unit",
      ],
    },
    icon: <BsBriefcaseIcon className="icon__size" />,
    cardBgIcon: "title-card-background",
    iconClass: "text-primary fs-3",
  },
  {
    link: "project-onboarding-details",
    title: "Project Onboarding",
    activeOnboarding: "Project",
    description: {
      message: "This is Project Onboarding Hub",
      features: [
        "Project Onboarding Form",
        "Take look of All the available Project",
        "Onboard new Project",
        "Edit existing Project",
      ],
    },
    icon: <PiProjectorScreenLightIcon className="icon__size" />,
    cardBgIcon: "title-card-background",
    iconClass: "text-primary fs-3",
  },
  {
    link: "subscription-onboarding-details",
    title: "Subscription Onboarding",
    activeOnboarding: "Subscription",
    description: {
      message: "This is Subscription Onboarding Hub",
      features: [
        "Subscription Onboarding Form",
        "Take look of All the available Subscription",
        "Onboard new Subscription",
        "Edit existing Subscription",
      ],
    },
    icon: <PiVaultThinIcon className="icon__size" />,
    cardBgIcon: "title-card-background",
    iconClass: "text-primary fs-3",
  },
  {
    link: "user-onboarding-details",
    title: "User Management",
    activeOnboarding: "User",
    description: {
      message: "This is User Management Hub",
      features: [
        "User Management Form",
        "Take look of All the available User",
        "Onboard new User",
        "Edit existing User",
      ],
    },
    icon: <CiUserIcon className="icon__size" />,
    cardBgIcon: "title-card-background",
    iconClass: "text-primary fs-3",
  },
  {
    link: "role-onboarding-details",
    title: "Role Management",
    description: {
      message: "This is Role Management Hub",
      features: [
        "Role Management Form",
        "Take look of All the available Role",
        "Onboard new Role",
        "Edit existing Role",
      ],
    },
    icon: <PiAirTrafficControlThinIcon className="icon__size" />,
    activeOnboarding: "Role",
    cardBgIcon: "title-card-background",
    iconClass: "text-primary fs-3",
  },
  {
    link: "costcode-onboarding-details",
    title: "CostCode Onboarding",
    activeOnboarding: "CostCode",
    description: {
      message: "This is CostCode Onboarding Hub",
      features: [
        "CostCode Onboarding Form",
        "Take look of All the available CostCode",
        "Onboard new CostCode",
        "Edit existing CostCode",
      ],
    },
    icon: <GiMoneyStackIcon className="icon__size" />,
    cardBgIcon: "title-card-background",
    iconClass: "text-primary fs-3",
  },
  {
    link: "application-onboarding-details",
    title: "Application Onboarding",
    activeOnboarding: "Application",
    description: {
      message: "This is Application Onboarding Hub",
      features: [
        "Application Onboarding Form",
        "Take look of All the available Application",
        "Onboard new Application",
        "Edit existing Application",
      ],
    },
    icon: <CiGlobeIcon className="icon__size" />,
    cardBgIcon: "title-card-background",
    iconClass: "text-primary fs-3",
  },
  {
    link: "Patch-onboarding",
    title: "Patch Onboarding",
    activeOnboarding: "Patch",
    description: {
      message: "This is Patch Onboarding Hub",
      features: [
        "Patch Onboarding Form",
      ],
    },
    icon: <CiGlobeIcon className="icon__size" />,
    cardBgIcon: "title-card-background",
    iconClass: "text-primary fs-3",
  },
];

const UpdateOnboardingPage: React.FC = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();

  const userCapabilities = cloudData.loginDetails.capabilities.Onboarding[0];

  return (
    <div className="bg_color onboarding-page-h m-2">
      <div className="p-2">
        <div className="d-flex align-items-center">
          <TfiLayoutListThumbIcon className="k8-title-logo-size fs-1 mx-2" />
          <p className="pt-2 k8title ps-2 fw-bolder"> Onboarding</p>
        </div>
        <div className="container contain_width">
          <div className="pb-3 mb-4">
            <div className="row gx-5 py-3">
              {titleCardsData.map((card, index) => {
                console.log(card.activeOnboarding, "card.activeOnboarding");
                console.log(
                  userCapabilities[card.activeOnboarding],
                  "userCapabilities[card.activeOnboarding]"
                );
                if (userCapabilities[card.activeOnboarding]) {
                  return (
                    <div key={index} className="col-lg-3 col-md-6 py-2">
                      <Link
                        className="pe-auto"
                        to={card.link}
                        title={card.title}
                        onClick={() =>
                          dispatch(setActiveOnboarding(card.activeOnboarding))
                        }
                      >
                        <TitleCardTwo
                          title={card.title}
                          description={card.description}
                          icon={card.icon}
                          iconClass={card.iconClass}
                        />
                      </Link>
                    </div>
                  );
                } else {
                  return <></>;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpdateOnboardingPage;
