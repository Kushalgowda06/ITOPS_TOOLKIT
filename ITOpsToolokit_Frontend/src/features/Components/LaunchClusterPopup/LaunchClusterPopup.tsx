import { Modal } from "react-bootstrap";
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";
import { useNavigate } from "react-router-dom";
const LaunchClusterPopup = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <Modal show={props.showPopup} centered onHide={props.onHide}>
        <Modal.Body>
          <div className="d-flex py-5 justify-content-around stack-popup">
            <div className="stack-popup-cloud-icon">
              <img
                src={awsIcon}
                className="cursor-pointer"
                alt="awsIcon"
                style={{ width: "100px", height: "100px" }}
                onClick={() =>
                  navigate({
                    pathname: "/launch-stack/aws/EKSCluster",
                  })
                }
              />
            </div>
            <div className="stack-popup-cloud-icon">
              <img
                src={azureIcon}
                alt="azureIcon"
                className="cursor-pointer"
                style={{ width: "100px", height: "100px" }}
                onClick={() =>
                  navigate({
                    pathname: "/launch-stack/azure/AKS_Cluster",
                  })
                }
              />
            </div>
            <div className="stack-popup-cloud-icon">
              <img
                src={gcpIcon}
                alt="gcpIcon"
                className="cursor-pointer"
                style={{ width: "100px", height: "100px" }}
                onClick={() =>
                  navigate({
                    pathname: "/launch-stack/gcp/GKECluster",
                  })
                }
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default LaunchClusterPopup;
