
import { useEffect, useState } from "react";
import { Api } from "../../Utilities/api";
import { PopUpModal } from "../../Utilities/PopUpModal";
import testapi from '../../../api/testapi.json'
import ResourceDetailsList from "./ResourceDetailsList";
import { LuTimerReset } from "react-icons/lu";
import { wrapIcon } from "../../Utilities/WrapIcons";

const ChatBotForm = ({ fieldsData, orderID, onRefresh }) => {
  const LuTimerResetIcon = wrapIcon(LuTimerReset);
  const [formData, setFormData] = useState(fieldsData);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [finalData, setFinalData] = useState(null);
  const [hideData, setHideData] = useState(true);
  const [responseStatus, setResponseStatus] = useState(false);
 
  useEffect(() => {
    const { _id, ...rest } = fieldsData;
    setFormData(rest);
  }, [fieldsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };
  const handleOnHide = () => {
    setShowModal(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Api.postCall(
        `${testapi.baseURL}/cloud_gen_ai_git/`,
        { ...formData, From: "frontend" }
      ).then((response: any) => {
        setShowModal(true);
        console.log(response, "response");
        setModalMessage(
          `Submit successfully. Ticket Details :${response?.data?.data}`
        );
      });
    } catch (error) {
      setShowModal(true);
      setModalMessage(` ${error} An error occurred while submitting the data.`);
      console.error("Error:", error);
    }
  };

  // const handleReset = (e) => {
  //   setFormData(
  //     Object.keys(formData).reduce(
  //       (acc, key) => ({
  //         ...acc,
  //         [key]: key === "OrderID" || key === "GitHubLink" ? formData[key] : "", // Keep OrderID value unchanged
  //       }),
  //       {}
  //     )
  //   );
  // };
  const [initialFormData, setInitialFormData] = useState(null);
  const handleReset = (e) => {
    // Reset ONLY the TFVars field to its initial value
    setFormData({
      ...formData,
      TFVars: initialFormData?.TFVars || "", // Use initial value or empty string if not available
    });
  };

  const handleRefresh = () => {
    onRefresh();
  };
  console.log(fieldsData, "fielddata")
  return (
    <>
      {hideData && (
        <>
          <div className="container chatbot-container">
            <h1 className="text-center chatbot-title heading">IAC deployments powered by AI</h1>

            <form
              onSubmit={handleSubmit}
              className="container d-flex flex-column"
            >
              <div className="row g-3 text-start">
                {" "}
               
              </div>
              <div className="row container d-flex mt-5">

                
                <div className="col-6">
                  <label className=" d-flex text-start">GitHubLink</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData["GitHubLink"]}
                    onChange={handleChange}
                    disabled
                  />
                  <span className="d-flex justify-content-between mt-2">
                  <label className=" d-flex text-start">Parameters</label>
                  <LuTimerResetIcon className=" mx-1 icon_font" onClick={handleReset}  /></span>
                  {/* <i className="fas fa-undo"></i> */}
                  <textarea
                    className="form-control mt-2"
                    // id={key}
                    // name={key}
                    value={formData.TFVars}
                    rows={3}
                    onChange={handleChange}
                    style={{ resize: "vertical" }} // Restrict resizing to vertical direction
                  />
               
                </div>
              </div>
              {Object?.keys(formData)?.map((key) => (
                  <div className="row" key={key}>
                    {/* {key === "ResourceDetails" && (<ResourceDetailsList resourceDetails={formData[key]} />)} */}
                  </div>
                ))}

              <p className="text-center">
                Please refresh until you get the data. Thank you for your
                patience !
              </p>
              
              <div className=" d-flex justify-content-end ">
                
                <div className="d-flex mt-3 col-md-2">
                <button
                  type="button"
                  className="btn btn-primary mx-2"
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
                <button type="submit" className="btn btn-primary mx-2">
                  Submit
                </button>
                </div>
              </div>
            </form>
          </div>
          <PopUpModal
            show={showModal}
            modalMessage={modalMessage}
            onHide={handleOnHide}
          />
        </>
      )}
    </>
  );
};
export default ChatBotForm;
