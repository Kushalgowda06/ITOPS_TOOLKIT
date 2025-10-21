import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Loader } from "../../Utilities/Loader";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import {
  faUndoAlt,
  faCircleChevronRight,
  faLaptop, faDatabase, faHdd, faNetworkWired
} from "@fortawesome/free-solid-svg-icons";
import { LuUndo, LuUndo2, LuUndoDot } from "react-icons/lu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PopUpModal } from "../../Utilities/PopUpModal";
import { TbFlagSearch } from "react-icons/tb";
import { TextField } from "@mui/material";
import Grid from '@mui/material/Grid';

import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
// import TeachAssistInput from "./TeachAssistInput";
// import ChatWindow from "./ChatWindow";
// import TypingDotsStyle from "./TypingDotsStyle";
import TeachAssistInput from "../../Utilities/TeachAssistInput";
import ChatWindow from "../../Utilities/ChatWindow";
import TypingDotsStyle from "../../Utilities/TypingDotsStyle";

const CHAT_STORAGE_KEY = "chatbot_history";

interface BotResponse {
  data: {
    message: string;
  };
}
interface Window {
  fetch: typeof fetch;
}
const PromptEngine = () => {
    const [chatHistory, setChatHistory] = useState(() => {
        const saved = localStorage.getItem(CHAT_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      });
    
      const [isTyping, setIsTyping] = useState(false);
    
      useEffect(() => {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
      }, [chatHistory]);
    
      
      // const sendMessage = async (message) => {
      //   const userMsg = { sender: "user", text: message, timestamp: Date.now() };
      //   setChatHistory((prev) => [...prev, userMsg]);
      //   setIsTyping(true);
      
      //   try {
      //     const response = await fetch("https://your-api-endpoint.com/chat", {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({ message }),
      //     });
      
      //     const data = await response.json();
      
      //     const botMsg = { sender: "bot", text: data.message, timestamp: Date.now() };
      //     setChatHistory((prev) => [...prev, botMsg]);
      //   } catch (error) {
      //     const errorMsg = {
      //       sender: "bot",
      //       text: "Something went wrong!",
      //       timestamp: Date.now(),
      //     };
      //     setChatHistory((prev) => [...prev, errorMsg]);
      //   } finally {
      //     setIsTyping(false);
      //   }
      // };
     
    const mockFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
     
      const requestBody = init?.body ? JSON.parse(init.body.toString()) : {};
      const userMessage = requestBody.message ? requestBody.message.toLowerCase() : '';
    
      let botResponseText: string;
    
     
      if (userMessage === 'hi') {
        botResponseText = "Hi user! How can I help you today?";
      } else if (userMessage.includes('product')) {
        botResponseText = "We have a wide range of products! What category are you interested in?";
      } else if (userMessage.includes('support')) {
        botResponseText = "You've reached our support team. Please describe your issue in detail.";
      } else if (userMessage.includes('order')) {
        botResponseText = "To check your order, please provide your order number.";
      } else if (userMessage.includes('thank')) {
        botResponseText = "You're welcome! Glad I could assist.";
      } else {
        
        botResponseText = "I'm not sure how to respond to that. Can you rephrase?";
      }
     
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
    
      return new Response(JSON.stringify({ message: botResponseText }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    };
    
    window.fetch = mockFetch;
    
    
    const sendMessage = async (message: string) => { 
      const userMsg = { sender: "user", text: message, timestamp: Date.now() };
      setChatHistory((prev) => [...prev, userMsg]);
      setIsTyping(true);
    
      try {
        // This fetch call will now be intercepted by your mockFetch function
        const response = await fetch("https://api-endpoint.com/chat", {  
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });
    
        const data = await response.json();
    
        const botMsg = { sender: "bot", text: data.message, timestamp: Date.now() };
        setChatHistory((prev) => [...prev, botMsg]);
      } catch (error) {
        
        const errorMsg = {
          sender: "bot",
          text: "Something went wrong!",  
          timestamp: Date.now(),
        };
        setChatHistory((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    };
    
    
  // console.log("Items",Items)
  return (
    <div className="bg-white rounded-top shadow-lg text-dark custom-rounded me-2" >
      <div className="d-flex align-items-center justify-content-center px-3 py-2 rounded-top background istm_header_height box-shadow text-primary">
        <div  className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold ">
        Prompt Engine
        </div>
      </div>

      <div className="mt-1 rounded-bottom">
       <TypingDotsStyle />
      <ChatWindow chatHistory={chatHistory} isTyping={isTyping} />
      <TeachAssistInput onSend={sendMessage} placeholder="Ask" />
    </div>




         </div>

  );
};

export default PromptEngine;
