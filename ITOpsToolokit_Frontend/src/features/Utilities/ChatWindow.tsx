import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ChatInBarChart from "../Components/Charts/ChatInBarChart"

interface MetricPoint {
  Date: string;
  Value: number;
  Unit: string;
}

interface MetricsData {
  [metricName: string]: MetricPoint[];
}

interface TableData {
  [key: string]: string | number;
}

interface BotMessage {
  sender: "user" | "bot";
  text: string;
  chartData?: MetricsData | null;
  tableData?: TableData[] | null;
  timestamp: number;
}

interface ChatWindowProps {
  chatHistory: BotMessage[];
  isTyping: boolean;
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatWindow: React.FC<ChatWindowProps> = ({ chatHistory, isTyping }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const pathname = location.pathname;
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);
  console.log("chatHistory", chatHistory);
  return (
    <div
      ref={containerRef}
      className={`px-1 py-4 overflow-auto flex-grow-1 ${
        pathname.includes("Iac")
          ? "prompt_engine"
          : pathname.includes("Analytics_Ai")
          ? "bot_assist"
          : "tech_assist"
      }`}
      // style={{ maxHeight: "60vh" }}
      // ref={containerRef}  
      // className={`p-4 ${pathname.includes('IAC') ? 'prompt_engine' : pathname.includes('Analytics_Ai') ? 'bot_assist': 'tech_assist' }`}
    >
      {chatHistory.map((msg, index) => (
        <div
          key={index}
          className={`d-flex flex-column mb-1 ${
            msg.sender === "user" ? "align-items-end" : "align-items-start"
          }`}
        >
          <div
            className={`   d-flex chat_window ${
              msg.sender === "user" ? "chat_msg_box" : "chat_msg"
            }`}
            style={{
              maxWidth: "95%",
              wordBreak: "break-word",
              // boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            {/* Message Text */}
            {  msg.text && <div style={{ whiteSpace: 'pre-wrap', color:"white" }}>{msg.text}</div>}
          </div>
          {/* Charts Section */}
          {msg.chartData && <ChatInBarChart chartData={msg.chartData} tableData={msg.tableData} />}
        </div>
      ))}

      {/* Typing Animation */}
      {isTyping && (
        <div className="text-white fst-italic d-flex align-items-center">
          <span className="typing-dots ms-2">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
