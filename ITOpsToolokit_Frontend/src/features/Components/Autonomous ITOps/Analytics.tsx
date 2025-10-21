import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartArea, faChartLine,faChartBar,faChartPie } from "@fortawesome/free-solid-svg-icons";
import Sen from "../../../assets/Send.png";
import SendI from "../../../assets/Send.png";
import rocketImg from "../../../assets/rocketImg.png";
import { useNavigate } from 'react-router-dom';

const Analytics: React.FC = () => {
  const cardsData = [
    {
      title: "Finops",
      text: "Intelligent IT operations with automated incident response, service management, and knowledge assistance",
      icon: faChartArea, // Replace with your icon path or SVG
      link: "/Analytics_AI/cost-optimization-agent",
      link_paht: "Explore ITOps",
    },
    {
      title: "Log Analytics",
      text: "Advanced data analytics, machine learning, and business intelligence",
      icon: faChartLine, // Replace with your icon path or SVG
      link: "/Analytics_AI/log-analytics-agent",
      link_paht: "Explore Analytics",
    }
   
  ];
  const [highlightIndex, setHighlightIndex] = useState(null);
  const navigate = useNavigate();
  
  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center text-white text-center mt-3 px-3">
        <span className="body_font">Transform Your ITOps with</span>
        <span className="body_header_font">Autonomous Analytics Toolkit</span>
        <span className="body_sub_font mb-2">
          Harness the power of artificial intelligence to automate workflows,
          optimize operations, and drive unprecedented growth across your entire
          organization..
        </span>
         <span className="body_p_font fw-bold mt-4">Choose your Analytics AI specialist</span>
      </div>
      <div className="d-flex flex-wrap gap-5 justify-content-center glass-row">
        {cardsData.map(({ title, text, icon, link, link_paht }, index) => (
          <div key={index} className="glass-card glass-card_width mx-2" onClick={() => navigate(link)}  style={{ cursor: 'pointer' }}>
            <div className="d-flex align-items-center justify-content-center mb-3 image-container">
              <FontAwesomeIcon
                fontSize={"11px"}
                icon={icon}
                className="py-1 cursor-pointer card-icon"
              />
            </div>

            <h5 className="body_font">{title}</h5>
            <p className="body_p_font">{text}</p>
            {/* <a href={link} className="card-link text-white">
              {link_paht}
            </a> */}
          </div>
        ))}
      </div>
      <div className="f-flex  align-content-center mt-4 mb-2 ">
        {/* <div className="cards-row"> */}
        {/* {cardsData.map((card, index) => (
        <div
          key={index}
          className={`card ${highlightIndex === index ? "highlight" : ""}`}
          onMouseEnter={() => setHighlightIndex(index)}
          onMouseLeave={() => setHighlightIndex(null)}
        >
          <img src={card.icon} alt={card.title} className="card-icon" width={56} height={56} />
          <h3>{card.title}</h3>
          <p>{card.text}</p>
          <a href={card.link}>Explore Agentic Network</a>
        </div>
            ))} */}
        {/* {cardsData.map((card, index) => (
          <Card className="ticket-card  text-white mb-1 p-2">
            <img src={card.icon} alt={card.title} className="card-icon" />
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <a href={card.link}>Explore Agentic Network</a>
          </Card>
        ))} */}
      </div>
      {/* </div> */}
    </>
  );
};

export default Analytics;
