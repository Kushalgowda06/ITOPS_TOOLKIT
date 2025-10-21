import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartArea, faChartLine, faChartBar, faChartPie } from "@fortawesome/free-solid-svg-icons";
import Sen from "../../../assets/Send.png";
import SendI from "../../../assets/Send.png";
import rocketImg from "../../../assets/rocketImg.png";
import { useNavigate } from 'react-router-dom';

const Compliance_AI: React.FC = () => {
  const cardsData = [
    {
      title: "Ticket Audit",
      text: "Intelligent IT operations with automated incident response, service management, and knowledge assistance",
      icon: faChartArea, // Replace with your icon path or SVG
      link: "https://grafana.intelligentservicedeliveryplatform.com/d/adrsnzjsikyyod/itsm-summary-dashboard-dev?orgId=1&from=now-1y%2Ffy&to=now-1y%2Ffy%22",// new tab should be opened
      link_paht: "Explore ITOps",
    },
    {
      title: "Call Audit",
      text: "Advanced data analytics, machine learning, and business intelligence",
      icon: faChartLine, // Replace with your icon path or SVG
      link: "https://grafana.intelligentservicedeliveryplatform.com/d/be0d7md1wwdfke/call-analytics-summary-dash…",// new tab should be opened
      link_paht: "Explore Analytics",
    },

  ];
  const [highlightIndex, setHighlightIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center text-white text-center mt-3 px-3">
        {/* <span className="body_font">Transform Your DevOps_IAC with.</span> */}
        <span className="body_header_font">Compliance AI</span>
        <span className="body_sub_font mb-2">
          Harness the power of artificial intelligence to automate workflows,
          optimize operations, and drive unprecedented growth across your entire
          organization..
        </span>
         <span className="body_p_font fw-bold mt-4">Choose your Complaince AI specialist</span>
      </div>
      <div className="d-flex flex-wrap gap-5 justify-content-center glass-row">
        {cardsData.map(({ title, text, icon, link, link_paht }, index) => (
          <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="glass-card  glass-card_width mx-2" style={{ cursor: 'pointer' }}>
            <div className="d-flex align-items-center justify-content-center mb-3 image-container">
              <FontAwesomeIcon
                fontSize={"11px"}
                icon={icon}
                className="py-1 cursor-pointer card-icon"
              />
            </div>

            <h5 className="body_font">{title}</h5>
            <p className="body_p_font">{text}</p>
            {/* <a href={link} target="_blank" rel="noopener noreferrer" className="card-link text-white">
              Explore
            </a> */}
          </a>
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

export default Compliance_AI;
