import React, { useState, useEffect } from "react";
import TeachAssistInput from "../../Utilities/TeachAssistInput";
import ChatWindow from "../../Utilities/ChatWindow";
import TypingDotsStyle from "../../Utilities/TypingDotsStyle";
import HeaderBar from "../AksCluster/TitleHeader";
import fetchChatApiData from "./FetchChatApiData";
import SuggestedQuestions from "./SuggestedQuestions";

const CHAT_STORAGE_KEY = "chatbot_history";

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

const Bot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<BotMessage[]>(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  const sendMessage = async (message: string) => {
    const userMsg: BotMessage = {
      sender: "user",
      text: message,
      timestamp: Date.now(),
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const chaturl = "http://20.109.50.251:8006/smart_cost_query/";
      const response = await fetchChatApiData(chaturl, message);
      const result = response.data;

      let botText = "";
      let chartData: MetricsData | null = null;
      let tableData: TableData[] | null = null;

      const formatFieldName = (key: string): string => {
        return key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase())
          .trim();
      };

      if (typeof result.answer === "string") {
        botText = result.answer;
      } else if (Array.isArray(result.answer)) {
        botText =
          "Here's the analysis and recommendations based on your query:";

        const sourceData = result.source_docs[0];
        if (sourceData) {
          chartData = sourceData.MetricsData || null;

          const fieldsToShow = [
            "Analysis",
            "RecommendedAction",
            "Benefit_Impact",
            "CostSaved",
          ];

          // Create table data with only specific fields
          const tableRow: TableData = {};
          fieldsToShow.forEach((key) => {
            if (sourceData[key] !== null && sourceData[key] !== undefined) {
              const formattedKey = formatFieldName(key);
              tableRow[formattedKey] = sourceData[key];
            }
          });

          if (Object.keys(tableRow).length > 0) {
            tableData = [tableRow];
          }
        }
      } else {
        botText = "Here's the result:";
      }
      const botMsg: BotMessage = {
        sender: "bot",
        text: botText,
        chartData,
        tableData,
        timestamp: Date.now(),
      };

      setChatHistory((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: BotMessage = {
        sender: "bot",
        text: "Something went wrong! Please try again.",
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="custom-container rounded-top shadow-lg text-primary rounded-bottom">
      <HeaderBar content="Cost Optimization AI" position="center" />
      <div
        className="mt-2 rounded-bottom d-flex flex-column"
        style={{ minHeight: "80vh" }}
      >
        <ChatWindow chatHistory={chatHistory} isTyping={isTyping} />
        <SuggestedQuestions onSelect={sendMessage} />
        <TypingDotsStyle />
        <TeachAssistInput onSend={sendMessage} placeholder="Type your prompt" />
      </div>
    </div>
  );
};

export default Bot;
