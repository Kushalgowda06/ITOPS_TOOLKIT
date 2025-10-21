import { capitalizeFirstLetter } from "../../Utilities/capitalise";

const AKSCardDetails = ({ show, onClose, clusterdata, imageSrc }) => {
  if (!show) {
    return null;
  }

  console.log(clusterdata, "clusterdata");

  return (
    <div className="aks_modal-overlay" onClick={onClose}>
      <div className="aks_modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="aks_modal-top">
           <div className="d-flex d-inline align-items-center ">
           
         
            <img
              src={imageSrc}
              alt="Icon"
              style={{ width: "60px" }}
              // className="card_image_icon"
            />
            <p className="ps-2 fs-2">
              {" "}
              {capitalizeFirstLetter(clusterdata.Name)}
            </p>
             
          </div>
          <div className="ps-5 pt-4 ">
            <button className="aks_close-icon text-white" onClick={onClose}>&times;</button>
            {Object.entries(clusterdata).map(([key, value]) => (
              <div key={key} className="d-flex flex-row align-items-baseline mb-3">
                <div className="text-white fs-6" style={{ width: "200px" }}>{capitalizeFirstLetter(key)}: </div>
                <p className="f-size mb-1 ms-2">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AKSCardDetails;
