
import { useEffect, useState } from "react";
import { Api } from "../../Utilities/api";
import { PopUpModal } from "../../Utilities/PopUpModal";
import ChatBotFinalForm from "./ChatBotFinalForm";
import testapi from '../../../api/testapi.json'

const ChatBotForm = ({ fieldsData, orderID, onRefresh }) => {
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
        `${testapi.baseURL}/cloud_gen_ai_ci`,
        { ...formData, From: "frontend" }
      ).then((response: any) => {
        setShowModal(true);
        setModalMessage(" Data sent successfully. Please wait. !!");
        setResponseStatus(true);
      });
    } catch (error) {
      setShowModal(true);
      setModalMessage(` ${error} An error occurred while submitting the data.`);

      console.error("Error:", error);
    }
  };

  const fetchFinalData = () => {
    try {
      Api.getCall(
        `${testapi.baseURL}/cloud_gen_ai_git/?OrderID=${orderID}`
      ).then((response: any) => {
        const { _id, ...dataWithoutId } = response?.data?.data[0];
        setFinalData(dataWithoutId);
        setTimeout(() => {
          setHideData(false);
        }, 500);
      });
    } catch (error) {
      console.error("Error in GET request:", error);
    }
  };

  useEffect(() => {
    if (responseStatus) {
      setTimeout(() => {
        fetchFinalData();
      }, 10000);
    }
  }, [responseStatus]);

  const handleReset = (e) => {
    setFormData(
      Object.keys(formData).reduce(
        (acc, key) => ({
          ...acc,
          [key]: key === "OrderID" || key === "GitHubLink" ? formData[key] : "", // Keep OrderID value unchanged
        }),
        {}
      )
    );
  };
  const handleRefresh = () => {
    onRefresh();
  };

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
              <div className="row g-3">
                {" "}
                {Object?.keys(formData)?.map((key) => (
                  <div className="col-md-6" key={key}>
                    <label htmlFor={key}>{key}</label>
                    {key === "TFVars" ? (
                      <textarea
                        className="form-control"
                        id={key}
                        name={key}
                        value={formData[key]}
                        rows={3}
                        onChange={handleChange}
                        style={{ resize: "vertical" }} // Restrict resizing to vertical direction
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        id={key}
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        disabled={key === "OrderID" || key === "GitHubLink"}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center">
                Please refresh until you get the data. Thank you for your
                patience !
              </p>
              <div className="d-flex mt-3 col-md-2">
                <button
                  type="reset"
                  className="btn btn-danger mx-2"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-warning mx-2"
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
                <button type="submit" className="btn btn-primary mx-2">
                  Submit
                </button>
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
      {finalData !== null && (
        <ChatBotFinalForm
          finalData={finalData}
          onFinalRefresh={fetchFinalData}
        />
      )}
    </>
  );
};
export default ChatBotForm;
