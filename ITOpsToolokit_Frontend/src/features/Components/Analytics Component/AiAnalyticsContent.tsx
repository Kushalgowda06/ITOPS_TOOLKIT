import AnalyticsTable from "./AnalyticsTable";
import SendIcon from "../../../assets/Send.png";
import data from "../../../assets/dummyerror.json";
import { useEffect, useRef, useState } from "react";
import fetchChatApiData from "../Analytics AI/FetchChatApiData";
import fetchApiData from "../Analytics AI/FetchApiData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import TypingDotsStyle from "../../Utilities/TypingDotsStyle";
import { AnalyticsLoader } from "../../Utilities/AnalyticsContentLoader";
import useWebSocket, { ReadyState } from "react-use-websocket";
const AiAnalyticsContent = (props) => {
  const [tableVisible, setTableVisible] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatData, setChatData] = useState(null);
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const [socketUrl, setSocketUrl] = useState(props?.chaturl);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const chatEndRef = useRef(null);
  console.log(props?.apiResult, props?.case, "test for props");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (props?.url) {
          const result = await fetchApiData(props?.url);
          console.log(result, "result");
          if (result?.data?.data?.length > 0) {
            setTableData(result.data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [props?.url]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  useEffect(() => {
    console.log(connectionStatus, "WebSocket Status");
    if (connectionStatus === "Closed") {
      setIsLoading(false);
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (lastMessage) {
      const message = JSON.parse(lastMessage.data);
      console.log(message, "botreply");

      let botResponseMessage;
      if (Array.isArray(message?.answer) && message?.answer?.length > 0) {
        botResponseMessage = message?.answer;
      } else if (typeof message?.answer === "string") {
        botResponseMessage = message?.answer;
      } else {
        botResponseMessage = "Unexpected Response from AI";
      }

      setChatHistory((prev) =>
        prev.map((msg) =>
          msg.from === "bot" && msg.message === "..."
            ? { from: "bot", message: botResponseMessage }
            : msg
        )
      );

      // props.sendMessageHistory(botResponse);
      setIsWaitingResponse(false);
    }
  }, [lastMessage]);

  console.log(props?.url, props?.case, "props check");
  console.log(tableData, "tabledata");
  const handleKeyDown = (e) => {
    console.log(e, "event");
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserSubmit(e);
    }
  };
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setTableVisible(false);

    setChatHistory((prev) => [...prev, { from: "user", message: userInput }]);
    setChatHistory((prev) => [...prev, { from: "bot", message: "..." }]);

    // props.sendPrompt(userInput);
    sendMessage(JSON.stringify({ question: userInput }));

    if (userInput === "exit") {
      setIsLoading(true);
    }

    setUserInput("");
    setIsWaitingResponse(true);
    // e.preventDefault();
    // if (!userInput.trim()) return;
    // setTableVisible(false);
    // setChatHistory((prev) => [...prev, { from: "user", message: userInput }]);

    // setIsWaitingResponse(true);

    // const botPlaceholder = { from: "bot", message: "..." };
    // const placeholderIndex = chatHistory.length + 1; // +1 because user msg was just added
    // setChatHistory((prev) => [...prev, botPlaceholder]);

    // try {
    //   const response = await fetchChatApiData(props?.chaturl, userInput);
    //   const message = response.data;

    //   setChatData(message);
    //   let botResponse;
    //   // Simulate bot logic: if input contains "table", send array; else send string
    //   if (Array.isArray(message?.answer) && message?.answer?.length > 0) {
    //     botResponse = message?.answer;
    //   } else if (typeof message?.answer === "string") {
    //     botResponse = message?.answer;
    //   } else {
    //     botResponse = "Unexpected Response from AI";
    //   }
    //   // Replace placeholder with actual response
    //   setChatHistory((prev) =>
    //     prev.map((msg, index) =>
    //       index === placeholderIndex
    //         ? { from: "bot", message: botResponse }
    //         : msg
    //     )
    //   );
    // } catch (error) {
    //   console.error("Error fetching chat data:", error);
    //   // Replace placeholder with error message
    //   setChatHistory((prev) =>
    //     prev.map((msg, index) =>
    //       index === placeholderIndex
    //         ? { from: "bot", message: "Oops! Something went wrong. 😬" }
    //         : msg
    //     )
    //   );
    // } finally {
    //   setIsWaitingResponse(false);
    //   setUserInput("");
    // }
  };

  // Scroll to bottom on chat update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);
  const handleExit=()=>{
     setChatHistory([])
     setTableVisible(true)
  }
  return (
    <div className="d-flex flex-column content-height position-relative  ">
      <div className=" px-1  py-1 rounded-top text-center text-sm text-md text-lg text-xl text-xxl text-big fw-semibold mb-1 text-white box-shadow d-flex justify-content-between align-items-center istm_header_height background">
        <div className="flex-grow-1 text-center">{props?.case}</div>
        {tableVisible ? (
          <></>
        ) : (
          <button
            className="btn btn-sm create_ticket_btn_gradient  rounded-sm  py-1 px-2"
            onClick={ handleExit}
          >
            Exit/Display All
          </button>
        )}
      </div>
      <div className="flex-grow-1 overflow-auto pb-fixed-chat-offset px-3 ">
        {tableVisible ? (
          tableData && tableData.length > 0 ? (
            <AnalyticsTable data={tableData} height={400} title={props?.case} />
          ) : (
            <AnalyticsTable
              data={data?.data}
              height={400}
              title={props?.case}
            />
          )
        ) : (
          <div>
            {chatHistory.map((item, index) => (
              <div
                key={index}
                className={`mb-2 d-flex ${
                  item.from === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
                style={{ overflowY: "auto" }}
              >
                {item.from === "user" ? (
                  <div
                    className="
              text-white
              create_ticket_btn_gradient
              p-2
              rounded
              d-inline-block
              mw-75
              text-break
              f-size
            "
                  >
                    {item.message}
                  </div>
                ) : Array.isArray(item.message) ? (
                  <AnalyticsTable data={item.message} height={"auto"} />
                ) : item.message === "..." ? (
                  <div className="text-muted fst-italic d-flex align-items-center">
                    <span className="typing-dots ms-2">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </div>
                ) : (
                  <div
                    className="
              
            create_ticket_btn_gradient
              p-2
              rounded
              d-inline-block
              mw-75
              text-break
              f-size
            "
                  >
                    {item.message}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        <div className="position-absolute bottom-0 start-0 end-0 pb-1 pe-2 ps-2  z-index-1">
          <div className=" d-flex justify-content-center">
            <TypingDotsStyle />
            <div className="chat-input-wrapper position-relative w-100">
              <textarea
                className="form-control analytics_ai_chatinput rounded-3  no-resize f-size text-white"
                placeholder="Type a message..."
                rows={1}
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                onKeyDown={handleKeyDown}
              ></textarea>
              <button
                className="send-button position-absolute border-0 p-0 top-50 translate-middle-y "
                onClick={handleUserSubmit}
                disabled={isWaitingResponse}
              >
                {isWaitingResponse ? (
                  <FontAwesomeIcon
                    icon={faSpinner}
                    spin
                    size="2x"
                    title="Loading"
                     className="text-white"
                  />
                ) : (
                  <img
                    alt="Send"
                    src={SendIcon}
                    title="Send"
                    style={{ width: "30px", height: "30px", cursor: "pointer" }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <AnalyticsLoader isLoading={isLoading} />;
    </div>
  );
};

export default AiAnalyticsContent;
