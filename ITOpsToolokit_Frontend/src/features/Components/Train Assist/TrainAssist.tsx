import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegPenToSquare, FaArrowLeft } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdCategory } from "react-icons/md";
import { FaPenClip } from "react-icons/fa6";
import serviceNowAxios from "../../../api/ServicenowAxios";
import { Loader } from "../../Utilities/Loader";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { Alert, Snackbar } from "@mui/material";
import axios from "axios";
import TrainPopupModal from "./TrainPopupModal";
import TrainQuiz from "./TrainQuiz";
import TrainCommonPopup from "./TrainCommonPopup";
import ProblemPopUpModal from "../ProblemAssist/ProblemPopUpModal";
import ScenarioChat from "./ScenarioChat";
import { wrapIcon } from "../../Utilities/WrapIcons";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";

const TrainAssist: React.FC = () => {

  const FaRegPenToSquareIcon = wrapIcon(FaRegPenToSquare);
  const FaArrowLeftIcon = wrapIcon(FaArrowLeft);
  const IoMdCheckmarkCircleOutlineIcon = wrapIcon(IoMdCheckmarkCircleOutline);
  const MdCategoryIcon = wrapIcon(MdCategory);
  const FaPenClipIcon = wrapIcon(FaPenClip);


  const cardsData = [
    {
      title: "Take a new quiz",
      text: "Create a new customized quiz and evaluate yourself",
      icon: FaRegPenToSquareIcon,
    },
    {
      title: "Resume Quiz",
      text: "Catch up with pre-existing quiz",
      icon: IoMdCheckmarkCircleOutlineIcon,
    },
    {
      title: "Practice Scenarios",
      text: "Practice with mock live responsive scenarios",
      icon: FaPenClipIcon,
    },
  ];
  const [showQuizOptions, setShowQuizOptions] = useState(false);
  const [selectedQuizCard, setSelectedQuizCard] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "info"
  >("info");
  const [quizId, setQuizId] = useState("");
  const [quizData, setQuizData] = useState([]);
  const [endTime, setEndTime] = useState(null);
  const [showResumeQuizModal, setResumeQuizModal] = useState(false);
  const [titleMessage, setTitleMessage] = useState("");
  const [titleBody, setTitleBody] = useState("");
  const [showcommonPopup, setShowCommonPopup] = useState(false);
  const [resumeQuizID, setresumeQuizID] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [scenarioResponse, setScenarioResponse] = useState("");
  const [initialConv, setInitialConv] = useState([]);
  const [showArticlesModal, setShowArticlesModal] = useState(false);
  
  const navigate = useNavigate();
  const currentUsers: any = useAppSelector(selectCommonConfig);
  const userId = currentUsers.loginDetails.currentUser
  useEffect(() => {
    fetchProblemTasks();
  }, []);

  const fetchProblemTasks = async () => {
    setIsLoading(true);
    try {
      const response = await serviceNowAxios.get(
        `/api/now/table/kb_knowledge?&sysparm_query=workflow_state=published^kb_knowledge_baseLIKEITOpsToolkit&sysparm_fields=number,kb_category,short_description&sysparm_display_value=true
`
      );

      const category = response?.data?.result || [];
      setCategory(category);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching problem tasks: ", error);
      setIsLoading(false);

      return [];
    }
  };
  // Filter and group categories after hooks
  const filteredCategories = category?.filter(
    (item) =>
      item?.kb_category &&
      item?.kb_category.display_value &&
      item?.kb_category.display_value.trim() !== ""
  );
  const categoryMap = {};
  filteredCategories?.forEach((item) => {
    const cat = item.kb_category.display_value;
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(item);
  });
  const quizCards = Object?.keys(categoryMap).map((cat) => ({
    title: cat,
    icon: <MdCategoryIcon size={36} className="mb-2 card-icon" />,
  }));

  const filteredQuizCards = searchTerm
    ? quizCards.filter((card) =>
      card.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : quizCards;

  const kbArticles =
    selectedQuizCard && categoryMap[selectedQuizCard.title]
      ? categoryMap[selectedQuizCard.title].map((article) => ({
        id:
          article.number ||
          article.kb_category.display_value +
          Math.random().toString(36).substr(2, 5),
        title: article.number,
        description: article.short_description,
      }))
      : [];
  const handleQuizCardClick = (card) => {
    setSelectedQuizCard(card);
    setSelectedArticles([]);
    setShowArticlesModal(true);
  };

  const handleArticleSelect = (id) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter((a) => a !== id));
    } else if (selectedArticles.length < (isPracticeMode ? 1 : 3)) {
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  const handleClearSelection = () => {
    setSelectedArticles([]);
  };

  const postData = async () => {
    const payload = {
      articles_number: selectedArticles,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://predemo_backend.autonomousitopstoolkit.com/train_assist/api/v1/generate_mcqs/",
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
      setQuizId(response.data.output.data);
      setShowModal(true);
      setShowArticlesModal(false);
      setIsLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setIsLoading(false);
      setToastMessage("API Error");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };
  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleCloseCommonPopup = () => {
    setShowCommonPopup(false);
    setShowQuizOptions(false);
    setSelectedQuizCard(null);
    setQuizData([]);
  };

  const handleCloseSaveQuiz = () => {
    setResumeQuizModal(false);
  };
  const handleResumeQuiz = async () => {
    const payload = {
      user_id: userId,
      quiz_code: quizId,
      type_of_submit: "resume",
    };

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://predemo_backend.autonomousitopstoolkit.com/train_assist/api/v1/get_mcqs/",
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
      console.log("quizresposne", response);
      setIsLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setIsLoading(false);
      setToastMessage("API Error");
      setToastSeverity("error");
      setToastOpen(true);
    }
    setShowModal(false);
  };

  const handleStartQuiz = async () => {
    const payload = {
      user_id: userId,
      quiz_code: quizId,
      type_of_submit: "start",
    };

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://predemo_backend.autonomousitopstoolkit.com/train_assist/api/v1/get_mcqs/",
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
      console.log("quizresposne", response);
      setQuizData(response.data.output.data.questions);
      setEndTime(response.data.output.data.end_time);
      setIsLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setIsLoading(false);
      setToastMessage("API Error");
      setToastSeverity("error");
      setToastOpen(true);
    }
    setShowModal(false);
  };
  const handleResumeSaveQuiz = async () => {
    const payload = {
      user_id: userId,
      quiz_code: resumeQuizID,
      type_of_submit: "resume",
    };

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://predemo_backend.autonomousitopstoolkit.com/train_assist/api/v1/get_mcqs/",
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
      console.log("quizresposne", response);
      setQuizData(response.data.output.data.questions);
      setEndTime(response.data.output.data.end_time);
      setQuizId(resumeQuizID);
      setIsLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setIsLoading(false);
      setToastMessage("API Error");
      setToastSeverity("error");
      setToastOpen(true);
    }
    setResumeQuizModal(false);
  };
  const handleGenerateQuiz = async () => {
    const payload = {
      articles_number: selectedArticles[0],
      prompt: "",
      conv_history: [],
      previous_question: [],
    };
    setIsLoading(true);
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
      setScenarioResponse(response.data.output.data.response);
      setInitialConv(response.data.output.data.conv_history);
      console.log(response.data.output.data, "testing ");
      setShowArticlesModal(false);
      setIsLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setIsLoading(false);
      setToastMessage("API Error");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };
  console.log(scenarioResponse, "scenarioResponse");
  return (
    <>
      {scenarioResponse ? (
        <ScenarioChat
          initialMessage={scenarioResponse}
          initialConv={initialConv}
          setScenarioResponse={setScenarioResponse}
        />
      ) : (
        <>
          {quizData && quizData.length > 0 ? (
            <TrainQuiz
              endTime={endTime}
              quizData={quizData}
              userId={userId}
              selectedCategory={selectedQuizCard?.title}
              quizId={quizId}
              setIsLoading={setIsLoading}
              setToastMessage={setToastMessage}
              setToastOpen={setToastOpen}
              setToastSeverity={setToastSeverity}
              setShowCommonPopup={setShowCommonPopup}
              setTitleMessage={setTitleMessage}
              setTitleBody={setTitleBody}
            />
          ) : (
            <>
              <div className="d-flex flex-column align-items-center justify-content-center text-white text-center px-3">
                <span className="body_header_font">Train Assist</span>
                <span className="body_sub_font ">
                  Create customized quiz & get evaluated
                </span>
                <span className="body_p_font">Choose your path</span>
              </div>
              <div className="container-fluid">
                {/* <nav aria-label="breadcrumb">
                  <ol className="breadcrumb bg-transparent">
                    <li
                      className={`breadcrumb-item text-white ${!showQuizOptions ? "active" : ""
                        }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShowQuizOptions(false);
                        setSelectedQuizCard(null);
                      }}
                    >
                      <FaArrowLeftIcon className="me-2" />
                      Train Assist
                    </li>
                  </ol>
                </nav> */}
              </div>
              {!showQuizOptions && (
                <div className="d-flex flex-wrap gap-5 justify-content-center glass-row">
                  {cardsData.map(({ title, text, icon }, index) => (
                    <div
                      key={index}
                      className="glass-card trainassist_card_width mx-2 "
                      onClick={() => {
                        if (title === "Take a new quiz") {
                          setShowQuizOptions(true);
                          setIsPracticeMode(false);
                        }
                        if (title === "Resume Quiz") setResumeQuizModal(true);
                        if (title === "Practice Scenarios") {
                          setShowQuizOptions(true);
                          setIsPracticeMode(true);
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center justify-content-center mb-3 ">
                        {React.createElement(icon, {
                          size: 36,
                          className: "py-1 cursor-pointer",
                        })}
                      </div>
                      <h5 className="body_font">{title}</h5>
                      <p className="body_p_font">{text}</p>
                    </div>
                  ))}
                </div>
              )}
              {showQuizOptions && (
                <div className="mt-2 w-100 d-flex flex-column align-items-center">
                  <input
                    type="text"
                    className="form-control w-50 mb-4 quiz_search  text-white"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div
                    className={`d-flex flex-wrap justify-content-center gap-3 mb-2`}
                  >
                    {filteredQuizCards.map((card, idx) => (
                      <div
                        key={idx}
                        className={`glass-card trainassist_innercard_width py-4 mx-2 text-center p-3 ${selectedQuizCard &&
                            selectedQuizCard.title === card.title
                            ? "border border-primary"
                            : ""
                          }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleQuizCardClick(card)}
                      >
                        {card.icon}
                        <h5 className="body_font mt-2">
                          {capitalizeFirstLetter(card.title)}
                        </h5>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!showQuizOptions && (
                <>
                  <div className="d-flex align-content-center  mb-2"></div>
                  <hr
                    className="bg-white mt-5 "
                    style={{ height: "2px", border: "none" }}
                  />
                  <div
                    className="text-center text-white "
                    style={{ letterSpacing: "0.5px" }}
                  >
                    <span className="body_p_font">
                      Autonomous ITOps Toolkit - Powered by
                      next-generation artificial intelligence
                    </span>
                  </div>
                </>
              )}
              {showArticlesModal && (
                <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                  <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header" data-bs-theme="dark">
                        <h5 className="modal-title text-white">{selectedQuizCard?.title}</h5>
                        <button type="button" className="btn-close btn-close-custom text-white" onClick={() => setShowArticlesModal(false)}></button>
                      </div>
                      <div className="modal-body">
                        <div className="d-flex align-items-center justify-content-start mb-2">
                          <span className="body_p_font text-white me-3">
                            {isPracticeMode
                              ? "Choose 1 article to begin the scenario"
                              : "Choose minimum 1 & maximum 3 articles to begin the quiz"}
                          </span>
                        </div>
                        <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: "400px" }}>
                          {kbArticles.map((article) => (
                            <div
                              key={article.id}
                              className="prb_incident-card prb_card_hover p-3 d-flex align-items-center cursor-pointer flex-row"
                              onClick={() => handleArticleSelect(article.id)}
                            >
                              <input
                                type="checkbox"
                                className="prb_incident-checkbox-train-assist me-2"
                                checked={selectedArticles.includes(article.id)}
                                
                                disabled={
                                  isPracticeMode
                                    ? selectedArticles.length >= 1 &&
                                      !selectedArticles.includes(article.id)
                                    : selectedArticles.length >= 3 &&
                                      !selectedArticles.includes(article.id)
                                }
                              />
                              <div
                                className="prb_incident-number text-truncate"
                                title={article.description}
                              >
                                {article.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          className="btn create_ticket_btn_gradient"
                          onClick={handleClearSelection}
                        >
                          Clear Selection
                        </button>
                        <button
                          className="btn create_ticket_btn_gradient"
                          disabled={selectedArticles.length < 1}
                          onClick={
                            isPracticeMode ? handleGenerateQuiz : postData
                          }
                        >
                          {isPracticeMode ? "Start Scenario" : "Generate Quiz"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <Snackbar
            open={toastOpen}
            autoHideDuration={6000000}
            onClose={handleToastClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleToastClose}
              severity={toastSeverity}
              className="glass-notice-card"
              variant="filled"
              sx={{
                top: "50px",
                padding: "16px 24px",
                borderRadius: "8px",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                width: "400px",
              }}
            >
              {toastMessage}
            </Alert>
          </Snackbar>
          <Loader isLoading={isLoading} load={null} />
          <TrainPopupModal
            show={showModal}
            onClose={handleResumeQuiz}
            onSave={handleStartQuiz}
            id={quizId}
          />
          <TrainCommonPopup
            titleMessage={titleMessage}
            titleBody={titleBody}
            showcommonPopup={showcommonPopup}
            onSave={handleCloseCommonPopup}
          />
          <ProblemPopUpModal
            show={showResumeQuizModal}
            onClose={handleCloseSaveQuiz}
            onSave={handleResumeSaveQuiz}
            reason={resumeQuizID}
            setReason={setresumeQuizID}
            saveButtonName={"Start"}
            title={"Enter Quiz ID to Resume"}
          />
        </>
      )}
    </>
  );
};

export default TrainAssist