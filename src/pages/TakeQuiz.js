import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuizzes, fetchQuizById } from "../api/quizApi";
import "./TakeQuiz.css";

export default function TakeQuiz({ setShowNavbar }) { 
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    fetchQuizzes()
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Unexpected quiz response:", data);
          setQuizzes([]);
          return;
        }

        const parsedQuizzes = data.map((quizString) => {
          const [id, title] = quizString.split(" - ");
          return { id, title };
        });

        setQuizzes(parsedQuizzes);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
        setQuizzes([]);
      });
  }, []);

  const startQuiz = async (quizId) => {
    try {
      const quiz = await fetchQuizById(quizId);
      if (!quiz.questions || quiz.questions.length === 0) {
        alert("This quiz has no questions!");
        return;
      }
      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
      setSelectedAnswers({});
      setShowNavbar(false); 
    } catch (error) {
      console.error("Error loading quiz:", error);
      alert("Failed to load quiz.");
    }
  };

  const handleSelectAnswer = (choice) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: choice,
    }));
  };

  const handleNextQuestion = () => {
    if (!currentQuiz || !currentQuiz.questions) return;

    if (currentQuestionIndex + 1 < currentQuiz.questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      let newScore = 0;
      currentQuiz.questions.forEach((q, index) => {
        if (selectedAnswers[index] === q.answer) {
          newScore++;
        }
      });
      setScore(newScore);
      setQuizCompleted(true);
      setShowNavbar(true); 
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const resetQuizAndGoBack = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswers({});
    setShowNavbar(true); 
    navigate("/take");
  };

  return (
    <div className="quiz-container">
      {currentQuiz && !quizCompleted ? (
        <div>
          <h2 className="quiz-title">{currentQuiz.title}</h2>
          <h3 className="quiz-question">
            {currentQuiz.questions?.[currentQuestionIndex]?.description || "Question not found"}
          </h3>
          <div className="quiz-choices">
            {currentQuiz.questions?.[currentQuestionIndex]?.choices?.map((choice) => (
              <button 
                key={choice} 
                onClick={() => handleSelectAnswer(choice)} 
                className={`quiz-choice ${selectedAnswers[currentQuestionIndex] === choice ? "selected" : ""}`}
              >
                {choice}
              </button>
            )) || <p>No choices available</p>}
          </div>
          <div className="quiz-navigation">
            {currentQuestionIndex > 0 && (
              <button onClick={handlePreviousQuestion} className="prev-button">
                Previous
              </button>
            )}
            <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
            <button onClick={handleNextQuestion} className="next-button">
              {currentQuestionIndex + 1 === currentQuiz.questions.length ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      ) : quizCompleted ? (
        <div className="quiz-completed">
          <h2>Quiz Completed!</h2>
          <p>Your final score: {score} / {currentQuiz.questions.length}</p>
          <button onClick={resetQuizAndGoBack} className="back-button">Back to Quizzes</button>
        </div>
      ) : (
        <div>
          <h2>Available Quizzes</h2>
          <div className="quiz-grid">
            {quizzes.length === 0 ? (
              <p>No quizzes available.</p>
            ) : (
              quizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="quiz-card" 
                  onClick={() => startQuiz(quiz.id)}
                >
                  <h3>{quiz.title}</h3>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
