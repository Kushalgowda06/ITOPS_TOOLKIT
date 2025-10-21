import axios from "axios";
import { useState, useRef, useEffect } from "react";
import ChatBotForm from "./ChatBotForm";
import { Loader } from "../../Utilities/Loader";
import { Api } from "../../Utilities/api";
import testapi from '../../../api/testapi.json'

const ChatBot = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState("");
  const usedOrderIds = useRef(new Set());
  const orderId = useRef(null);
  const [hitApi, setHitApi] = useState(false);
  const [hideData, setHideData] = useState(true);
  const [fieldsData, setFieldsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    let uniqueOrderId;
    do {
      // Generate random order ID with a higher precision (16 characters) for better uniqueness
      uniqueOrderId = Math.random().toString(36).substring(2, 18);
    } while (usedOrderIds.current.has(uniqueOrderId)); // Keep generating until unique

    usedOrderIds.current.add(uniqueOrderId);
    orderId.current = uniqueOrderId;
    console.log(orderId, "orderid");
    // Create the request body
    const requestBody = {
      OrderID: orderId.current,
      Prompt: prompt,
    };

    try {
      Api.postCall(
        `${testapi.baseURL}/cloud_gen_ai/`,
        requestBody
      ).then((response: any) => {
        setMessages("");
        setHitApi(true);
        setMessages(
          `${prompt}. Your request has been sent successfully. Please wait. `
        );
      });
    } catch (error) {
      console.error("Error:", error);
      alert(`Error fetching data : ${error.message}`);
      setMessages("Error sending prompt. Please try again");
    }

    setPrompt("");
  };
  const fetchData = async () => {
    try {
      setMessages("");
      const getResponse = await axios.get(
        `${testapi.baseURL}/cloud_gen_ai_ci/?OrderID=${orderId.current}`
      );
      setHideData(false);

      setFieldsData(getResponse.data.data[0]);
    } catch (error) {
      console.error("Error in GET request:", error);
      setMessages("Error fetching data");
    }
  };

  useEffect(() => {
    if (orderId.current && hitApi) {
      setTimeout(() => {
        fetchData();
      }, 10000);
    }
  }, [orderId.current, hitApi]);
  console.log(fieldsData, "fieldData");

  return (
      <div className="bg-white p-2 h-100">
        <Loader isLoading={isLoading} load={null} />
        {hideData && (
          <div className="container chatbot-container">
            <h1 className="text-center chatbot-title heading">
            IAC deployments powered by AI
            </h1>

            <form
              className="d-flex justify-content-center mt-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                className="form-control chatbot-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your message..."
              />
              <button
                type="submit"
                className="btn btn-primary ms-2 chatbot-send-btn"
              >
                Send
              </button>
            </form>

            <div className="mt-4 chatbot-message-container">
              <div className="chatbot-message">{messages}</div>
            </div>
          </div>
        )}
        {fieldsData !== null && (
          <ChatBotForm
            fieldsData={fieldsData}
            orderID={orderId.current}
            onRefresh={fetchData}
          />
        )}
      </div>
  
  );
};

export default ChatBot;
