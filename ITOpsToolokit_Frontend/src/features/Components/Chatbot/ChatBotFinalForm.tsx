import { useState } from "react";
import { Api } from "../../Utilities/api";
import { PopUpModal } from "../../Utilities/PopUpModal";
import testapi from "../../../api/testapi.json"

const ChatBotFinalForm = ({ finalData, onFinalRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const handleOnHide = () => {
    setShowModal(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      Api.postCall(
        `${testapi.baseURL}/cloud_gen_ai_git/`,
        finalData
      ).then((response: any) => {
        setShowModal(true);
        console.log(response, "response");
        setModalMessage(
          `Submit successfully. Ticket Details :${response?.data?.data?.result?.number}`
        );
      });
    } catch (error) {
      setShowModal(true);
      setModalMessage(` ${error} An error occurred while submitting the data.`);
      console.error("Error:", error);
    }
  };
  const handleRefresh2 = () => {
    onFinalRefresh();
  };

  return (
    <>
      <div>
        <div className="container chatbot-container">
          <h1 className="text-center chatbot-title heading">IAC deployments powered by AI</h1>
          <div className="row  pt-3">
            {Object.entries(finalData).map(([key, value]) => (
              <div className="col-md-6 mb-3" key={key}>
                <div className=" ">
                  <strong className="pe-2 text-muted">{key}:</strong>
                  {key === "ResourceDetails" && Array.isArray(value) ? (
                    <ul className=" pt-2">
                      {value?.map((resource) => (
                        <li key={resource.name}>
                          <span className="text-color fw-bold">
                            {resource?.name}
                          </span>
                          <br />
                          <span className="text-muted">
                            Resource Type: {resource?.resourceType}
                          </span>
                          <br />
                          <span className="text-muted">
                            Hourly Cost: {` $ ${Number(resource?.hourlyCost).toFixed(3)}`}
                          </span>
                          <br />
                          <span className="text-muted">
                            Monthly Cost: {`$ ${Number(resource?.monthlyCost).toFixed(3)}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-color fw-bold cursor-pointer ps-1">{`${value}`}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex me-5 pe-5 justify-content-center">
            <button
              type="submit"
              className="btn btn-warning mx-2 "
              onClick={handleRefresh2}
            >
              Refresh
            </button>
            <button
              type="submit"
              className="btn btn-primary mx-2 "
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <PopUpModal
        show={showModal}
        modalMessage={modalMessage}
        onHide={handleOnHide}
      />
    </>
  );
};
export default ChatBotFinalForm;
