import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { wrapIcon } from "../../Utilities/WrapIcons";


const FaExclamationCircleIcon = wrapIcon(FaExclamationCircle);
function getTimeRemaining(endTime) {

  const end = new Date(endTime.replace(/-/g, "/")).getTime();
  const now = new Date().getTime();
  const diff = end - now;
  if (diff <= 0) return "00:00:00";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

const getTodayDate = () => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = today.toLocaleString("default", { month: "short" });
  const year = today.getFullYear();
  return `${day} ${month} ${year}`;
};

const TrainQuiz = ({
  endTime,
  quizData,
  userId,
  selectedCategory,
  quizId,
  setIsLoading,
  setToastMessage,
  setToastOpen,
  setToastSeverity,
  setShowCommonPopup,
  setTitleBody,
  setTitleMessage,
}) => {
  const [updateQuizData, setQuizData] = useState(quizData);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState(
    quizData.map((q) => q.user_response)
  );
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(endTime);
      setTimeLeft(remaining);
      if (remaining === "00:00:00") {
        clearInterval(timer);
        handleSubmit();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOptionChange = (idx) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = quizData[currentQuestion].choices[idx];
    setResponses(newResponses);

    // Update user_response in updateQuizData
    const updatedQuiz = [...updateQuizData];
    updatedQuiz[currentQuestion] = {
      ...updatedQuiz[currentQuestion],
      user_response: quizData[currentQuestion].choices[idx],
    };
    setQuizData(updatedQuiz);
  };

  const handleNext = () => {
    setCurrentQuestion((q) => Math.min(q + 1, quizData.length - 1));
  };

  const handleSaveForLater = async () => {
    const payload = {
      user_id: userId,
      quiz_code: quizId,
      type_of_submit: "resume",
      questions: updateQuizData,
    };

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://backend.autonomousitopstoolkit.com/train_assist/api/v1/submit_quiz/",
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
      setIsLoading(false);
      setShowCommonPopup(true);
      setTitleMessage("Quiz Is Saved Successfuly");
      setTitleBody(`Using Quiz ID ${quizId} you can resume the quiz later`);
      console.log("quizresposne", response.data.output);
    } catch (error) {
      console.error("API Error:", error);
      setIsLoading(false);
      setToastMessage("API Error");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      user_id: userId,
      quiz_code: quizId,
      type_of_submit: "submit",
      questions: updateQuizData,
    };

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://backend.autonomousitopstoolkit.com/train_assist/api/v1/submit_quiz/",
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
      console.log("quizresposne", response.data.output);

      setIsLoading(false);
      setShowCommonPopup(true);
      setTitleMessage("Quiz Completed Successfuly");
      setTitleBody(`Your Score is ${response.data.output.data}`);
    } catch (error) {
      console.error("API Error:", error);
      setIsLoading(false);
      setToastMessage("API Error");
      setToastSeverity("error");
      setToastOpen(true);
    }
  };

  return (
    <div className="container-fluid min-vh-100 py-2">
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-center align-items-center">
          <span className="body_header_font text-white ">Train Assist</span>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-3 d-flex flex-column align-items-start">
          <div className="mb-2 text-white body_font_bold">
            Category: <span>{selectedCategory}</span>
          </div>
          <div className="text-white body_font_bold">
            User ID: <span className="fw-bold">{userId}</span>
          </div>
        </div>
        <div className="col-md-3 offset-md-6 d-flex flex-column align-items-end">
          <div className="mb-2 text-white body_font_bold">
            Date: <span className="fw-bold">{getTodayDate()}</span>
          </div>
          <div className="text-white body_font_bold">
            Time Remaining:{" "}
            <span className="fw-bold text-danger">{timeLeft}</span>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <FaExclamationCircleIcon className="text-white mb-0 me-2" size={16} />
          <span className="text-white body_font_bold mb-0">
            Choose an option and press next to move to next question:
          </span>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 trainassit_glass rounded shadow p-4">
          <div className="mb-3 body_font_bold text-white">
            {currentQuestion + 1}. {quizData[currentQuestion].question}
          </div>
          <form>
            {quizData[currentQuestion].choices.map((choice, idx) => (
              <div className="form-check mb-2" key={idx}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="quizOption"
                  id={`option${idx}`}
                  checked={responses[currentQuestion] === choice}
                  onChange={() => handleOptionChange(idx)}
                />
                <label
                  className="form-check-label body_p_font text-white"
                  htmlFor={`option${idx}`}
                >
                  {choice}
                </label>
              </div>
            ))}
          </form>
          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn create_ticket_btn_gradient"
              onClick={handleSaveForLater}
            >
              Save for later
            </button>
            {currentQuestion === quizData.length - 1 ? (
              <button
                type="button"
                className="btn create_ticket_btn_gradient"
                onClick={handleSubmit}
              >
                Submit
              </button>
            ) : (
              <button
                type="button"
                className="btn create_ticket_btn_gradient"
                onClick={handleNext}
                disabled={currentQuestion === quizData.length - 1}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainQuiz;
