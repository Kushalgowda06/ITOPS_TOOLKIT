import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import TypingDotsStyle from "../../Utilities/TypingDotsStyle";
import { AnalyticsLoader } from "../../Utilities/AnalyticsContentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import SendIcon from "../../../assets/Send.png";


const ScenarioChat = ({
  initialMessage,
  initialConv = [],
  articlesNumber = "",
  setScenarioResponse,
}) => {
  const [messages, setMessages] = useState([
    { text: initialMessage, sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [convHistory, setConvHistory] = useState(initialConv);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { text: input, sender: "user" }]);
      setInput("");
      setIsLoading(true);
      const payload = {
        articles_number: articlesNumber,
        prompt: input,
        conv_history: convHistory,
        previous_question: [],
      };
      try {
        const response = await axios.post(
          "https://predemo_backend.autonomousitopstoolkit.com/train_assist/api/v1/generate_scenarios/",
          payload,
          {
            auth: {
              username: "rest",
              password: "!fi$5*4KlHDdRwdbup%ix",
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const botReply = response.data.output.data.response || "(No response)";
        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
        setConvHistory(response.data.output.data.conv_history || []);
      } catch (error) {
        setMessages((prev) => [...prev, { text: "API Error", sender: "bot" }]);
      }
      setIsLoading(false);
    }
  };

  const formatBotMessage = (text) => {
    // Extract scenario/question/options as before
    const scenarioMatch = text.match(
      /\*\*Scenario:\*\*([\s\S]*?)\*\*Question:\*\*/
    );
    const questionMatch = text.match(/\*\*Question:\*\*([\s\S]*?)(A\.|$)/);
    let scenario = "";
    let question = "";
    let options = [];

    if (scenarioMatch) scenario = scenarioMatch[1].trim();
    if (questionMatch) question = questionMatch[1].trim();
    if (text.includes("A.")) {
      options = text
        .split(/(?=A\.|B\.|C\.|D\.)/)
        .filter((opt) => /^[A-D]\./.test(opt.trim()));
    }

    // Helper to format lines with \n, -, and numbered lists
    const formatLines = (str) => {
      if (!str) return null;
      const lines = str.split(/\n+/);
      const bullets = lines.filter((line) => /^\s*-/.test(line));
      const numbers = lines.filter((line) => /^\s*\d+\./.test(line));
      if (bullets.length === lines.length) {
        // All lines are bullets
        return (
          <ul>
            {lines.map((l, i) => (
              <li key={i}>{l.replace(/^\s*-\s*/, "")}</li>
            ))}
          </ul>
        );
      }
      if (numbers.length === lines.length) {
        // All lines are numbers
        return (
          <ol>
            {lines.map((l, i) => (
              <li key={i}>{l.replace(/^\s*\d+\.\s*/, "")}</li>
            ))}
          </ol>
        );
      }
      // Mixed or plain text: show each line as a paragraph or with <br />
      return lines.map((l, i) => (
        <span key={i}>
          {l}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ));
    };

    // Fallback: plain text with line breaks
    return <span>{formatLines(text)}</span>;
  };

  return (
    <div className="d-flex flex-column content-height">
      <div className="d-flex justify-content-end">
        <FontAwesomeIcon
          fontSize={"25px"}
          icon={faCircleXmark}
          className="text-white p-2 cursor-pointer"
          onClick={() => setScenarioResponse("")}
        />
      </div>

      <div className="flex-grow-1 overflow-auto pb-fixed-chat-offset px-3">
        <div>
          {messages.map((item, index) => (
            <div
              key={index}
              className={`mb-2 d-flex ${
                item.sender === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
              style={{ overflowY: "auto" }}
            >
              {item.sender === "user" ? (
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
                  {item.text}
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
                  {formatBotMessage(item.text)}
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="pb-1 pe-2 ps-2 z-index-1">
        <div className="ps-2 f-size my-1">
          <span
            className="text-decoration-underline text-white cursor-pointer"
            onClick={() => {
              setInput("Generate New Scenario");
              handleSend();
            }}
          >
            Generate New Scenario
          </span>
        </div>
        <div className="d-flex justify-content-center">
          <TypingDotsStyle />
          <div className="chat-input-wrapper w-100 position-relative">
            <textarea
              className="form-control analytics_ai_chatinput rounded-3 no-resize f-size text-white"
              placeholder="Type a message..."
              rows={1}
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            ></textarea>
            <button
              className="send-button position-absolute border-0 p-0 top-50 translate-middle-y"
              onClick={handleSend}
              disabled={isLoading}
            >
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm text-white"
                  title="Loading"
                ></span>
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
      <AnalyticsLoader isLoading={isLoading} />
    </div>
  );
};

export default ScenarioChat;
