import { useNavigate } from "react-router-dom";
import {
  faBarsProgress,
  faGears,
  faFile,
  faPersonCircleQuestion,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function IacServiceCards() {
  const navigate = useNavigate();

  const handleCardClick = (title) => {
    if (title === "Build Automate") {
      navigate({
        pathname: "/BuildAutomate",
      });
    }
  };

  const icons = [faBarsProgress, faGears, faRobot, faPersonCircleQuestion];
  const description = ["Provision any resource with power of AI on your cloud platform","Configure the infra of any provisioned cloud resource according to requirement",
  "Chat with our cloud ops agent to perform any infra operation on you cloud","Track all your AI your requests here"]
  return (
    <div className="row p-3">
      {[
        "Build Automate",
        "Configuration Management",
        "Cloud Ops Agent",
        "User Requests",
      ].map((title, idx) => (
        <div
          className="col-md-4 pb-3"
          key={idx}
          onClick={() => handleCardClick(title)}
        >
          <div className="card fixed-card pt-2 ps-3">
            <div className="iac_card-body ">
              <FontAwesomeIcon
                icon={icons[idx]}
                size="2x"
                className="mb-1 pe-3"
                // color="#2C3539"
              />
              <h5 className="iac_card-title ">{title}</h5>
             
            </div>
            <p className="f-size  pb-2">{description[idx]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
