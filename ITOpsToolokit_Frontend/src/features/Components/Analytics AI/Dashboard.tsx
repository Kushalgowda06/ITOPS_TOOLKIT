import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import MyCardList from "./CardItem";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { FaChartLine, FaLock } from "react-icons/fa";
import { FaGear, FaRoute, FaUserGear } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { AnalyticsLoader } from "../../Utilities/AnalyticsContentLoader";
import Analytics_Layout from "./Analytics_Layout";
import SideCards from "./SideCards";
import Bot from "./Bot";
import AiAnalyticsContent from "../Analytics Component/AiAnalyticsContent";
import LogDataAnalysis from "../Analytics Component/LogDataAnalysis";

interface Card {
  id: number;
  title: string;
  description: string;
  iconType: string;
  category: string;
}

const categories = [
  "All Categories",
  "Cost Optimization Agent",
  "Log Analytics Agent",
  "DB Agent",
  "Unix Agent",
  "DB Complaince Agent",
  // "Documentation",
];

const mockCards: Card[] = [
  {
    id: 1,
    title: "Cost Optimization Agent",
    description: "Recommendation for optimizing the resources",
    iconType: "briefcase",
    category: "Cost Optimization Agent",
  },
  {
    id: 2,
    title: "Log Analytics Agent",
    description:
      "Analyzing, and visualizing log data generated to gain operational insightst",
    iconType: "settings",
    category: "Log Analytics Agent",
  },
  {
    id: 3,
    title: "Unix Agent",
    description: "Agent for Unix File Permission machine",
    iconType: "cloud",
    category: "Unix Agent",
  },
  {
    id: 4,
    title: "DB Agent",
    description: "AI agent for drive space optimization",
    iconType: "security",
    category: "DB Agent",
  },
  {
    id: 5,
    title: "DB Complaince Agent",
    description: "AI agent for drive configuration management",
    iconType: "security",
    category: "DB Complaince Agent",
  },

  // {
  //   id: 5,
  //   title: "Incident Resolution",
  //   description: "NextGen ITPA use case",
  //   iconType: "document",
  //   category: "Documentation",
  // },
];

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const iconsList = [FaLock, FaChartLine, FaGear, FaUserGear, FaRoute];
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const [activeCardData, setActiveCardData] = useState(null);
  const selectedCategory = categories[activeTab];
  const { cardTitle } = useParams();
  const [loadingFromURL, setLoadingFromURL] = useState(!!cardTitle);
  const [isLoading, setIsLoading] = useState(!!cardTitle);

  const navigate = useNavigate();

  const [hasSwitchedLayout, setHasSwitchedLayout] = useState(false);
  const [orderedCards, setOrderedCards] = useState<Card[]>(mockCards);
  const [MainContentComponent, setMainContentComponent] = useState(null);
  const [RightSidebarComponent, setRightSidebarComponent] = useState(null);

  const handleCardClick = (card: Card, index: number) => {
    setIsLoading(true);
    setActiveCardData(card);
    const safeTitle = card.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/Analytics_AI/${safeTitle}`);

    if (!hasSwitchedLayout) {
      const newOrder = [card, ...mockCards.filter((c) => c.id !== card.id)];
      setOrderedCards(newOrder);
      setHasSwitchedLayout(true);
    }
  };
  useEffect(() => {
    if (cardTitle) {
      const formattedTitle = cardTitle.replace(/-/g, " ").toLowerCase();
      const matchedCard = mockCards.find(
        (card) => card.title.toLowerCase() === formattedTitle
      );

      if (matchedCard) {
        handleCardClick(matchedCard, matchedCard.id);
      }
      setIsLoading(false); // loading complete
    } else {
      setIsLoading(false); // no cardTitle, just normal dashboard
    }
  }, [cardTitle]);

  // const handleCardClick = (card: Card, index: number) => {
  //   console.log("card", card)
  //   setActiveCardIndex(index);
  //   setActiveCardData(card)
  // };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredCards = mockCards.filter((card) => {
    const matchSearch = card.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchCategory =
      selectedCategory === "All Categories" ||
      card.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  const handleBackToDashboard = () => {
    setHasSwitchedLayout(false);
    setActiveCardData(null);
    navigate("/Analytics_AI");
  };

  useEffect(() => {
    let tempMainContentComponent = null;
    let tempRightSidebarComponent = null;
    switch (activeCardData?.title) {
      case "Cost Optimization Agent":
        tempMainContentComponent = <Bot />;
        tempRightSidebarComponent = <LogDataAnalysis />;
        break;
      case "Log Analytics Agent":
        tempMainContentComponent = (
          <AiAnalyticsContent
            url={
              "http://3.97.232.96:8006/log_analysis_error_detection_autogen/"
            }
            case={"Log Analytics Agent"}
            chaturl={"ws://20.109.50.251:8006/ws/smart_log_query"}
            // chaturl={"http://20.109.50.251:8006/smart_query/"}
          />
        );
        tempRightSidebarComponent = <LogDataAnalysis />;
        break;
      case "DB Agent":
        tempMainContentComponent = (
          <AiAnalyticsContent
            url={"http://56.155.15.80:8081/drive_space_opt"}
            case={"DB Agent"}
            chaturl={"ws://56.155.15.80:8081/ws/drive_space_opt/"}
            // chaturl={"http://56.155.15.80:8081/drive_space_opt/RAG"}
          />
        );
        tempRightSidebarComponent = <LogDataAnalysis />;
        break;
      case "Unix Agent":
        tempMainContentComponent = (
          <AiAnalyticsContent
            url={"http://3.211.29.69:8000/get_all_file_perm"}
            case={"Unix Agent"}
            chaturl={"ws://3.211.29.69:8000/ws/file_permission_chroma_query/"}
            // chaturl={
            //   "http://3.211.29.69:8000/file_permission_chroma_query/"
            // }
          />
        );
        tempRightSidebarComponent = <LogDataAnalysis />;
        break;
      case "DB Complaince Agent":
        tempMainContentComponent = (
          <AiAnalyticsContent
            url={"http://3.211.29.69:8000/get_all_db_config"}
            case={"DB Complaince Agent"}
            // chaturl={
            //   "http://3.211.29.69:8000/db_config_chroma_query/"
            // }
            chaturl={"ws://3.211.29.69:8000/ws/db_config_chroma_query/"}
          />
        );
        tempRightSidebarComponent = <LogDataAnalysis />;
        break;

      // default:
      //   tempMainContentComponent = <AiAnalyticsContent url={"http://3.97.232.96:8006/log_analysis_error_detection_autogen/"} chaturl={"http://20.109.50.251:8006/smart_query/"}/>;
      //   tempRightSidebarComponent = <LogDataAnalysis />;
      //   break;
    }

    setMainContentComponent(tempMainContentComponent);
    setRightSidebarComponent(tempRightSidebarComponent);
  }, [activeCardData?.title]);

  if (activeCardData) {
    return (
      <div className=" d-flex flex-column mt-1 ">
        <Analytics_Layout
          leftSidebar={
            <SideCards
              cardsData={orderedCards}
              activeCardIndex={activeCardData?.id}
              handleClick={handleCardClick}
              handleBack={handleBackToDashboard}
            />
          }
          mainContent={MainContentComponent}
          rightSidebar={RightSidebarComponent}
        />
      </div>
    );
  } else {
    <AnalyticsLoader isLoading={isLoading} />;
  }

  return (
    <div className="bg-white mt-1 Analytics_Ai Itsm_bg_image shadow-lg  me-2">
      <div className="container-fluid  text-center">
        <div className="banner-title fw-bold text-white fs-1 pt-3">
          Analytics AI
        </div>
        <div className="banner-subtitle fs-6 text-white mt-2">
          Transforms complex data into clear, actionable insights to drive
          smarter decisions and optimization recommendation.
        </div>

        <div className="genai-tabs mt-3 py-3">
          <Tabs
            sx={{ minHeight: "32px" }}
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            className="genai-tabs-wrapper tab_bg text-white"
          >
            {categories.map((category, index) => (
              <Tab key={index} label={category} />
            ))}
          </Tabs>
        </div>
        <div className="pb-3">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: "100%",
              maxWidth: "300px",
              border: "0.5px solid",
             
              borderImageSource:
                "linear-gradient(90.43deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.025) 100%)",
              boxShadow: "0px 2px 4px 3px rgba(255, 255, 255, 0.2) inset",
              borderRadius: "27px 27px",
              backdropFilter: "blur(10px)",
    "& input::placeholder": {
      color: "white",
      opacity: 1, // Ensures full visibility
    },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  sx={{
                    borderRadius: "32px",
                    fontSize: "0.8rem",
                    padding: "16px",
                     color: "white",
                  }}
                  position="end"
                >

                  <SearchIcon className="text-light" />
                </InputAdornment>
              )
            }}
          />
        </div>
      </div>

      <MyCardList
        mockCards={filteredCards}
        active={activeCardIndex}
        handleClick={handleCardClick}
      />
    </div>
  );
};

export default Dashboard;
