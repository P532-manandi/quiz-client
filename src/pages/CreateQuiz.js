import React, { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { fetchQuestions, fetchQuizzes, saveQuiz } from "../api/quizApi";
import "./CreateQuiz.css";

export default function CreateQuiz() {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [existingQuizId, setExistingQuizId] = useState(null);
  const [allQuizzes, setAllQuizzes] = useState([]);

  useEffect(() => {
    fetchQuestions()
      .then(setQuestions)
      .catch((error) => {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      });

    fetchQuizzes()
      .then(setAllQuizzes)
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  const handleSelectQuestion = (question) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.some((q) => q.id === question.id)) {
        return prevSelected.filter((q) => q.id !== question.id);
      }
      return [...prevSelected, question];
    });
  };

  const handleQuizTitleChange = (e) => {
    const title = e.target.value.trim();
    setQuizTitle(title);

    const quizFound = allQuizzes.find((q) => q.split(" - ")[1] === title);
    if (quizFound) {
      const [quizId] = quizFound.split(" - ");
      setExistingQuizId(quizId);
      fetch(`https://quiz-service-bb46.onrender.com/quizzes/${quizId}`)
        .then((res) => res.json())
        .then((data) => {
          setSelectedQuestions(data.questions || []);
        })
        .catch((error) => console.error("Error loading quiz:", error));
    } else {
      setExistingQuizId(null);
      setSelectedQuestions([]);
    }
  };

  const handleSaveQuiz = async () => {
    console.log("Quiz Title:", quizTitle);
    console.log("Existing Quiz ID:", existingQuizId);
    console.log("Selected Questions:", selectedQuestions);

    if (!quizTitle.trim() && !existingQuizId) {
      alert("Please enter a quiz title.");
      return;
    }

    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }

    const quizData = {
      title: quizTitle,
      questionIds: selectedQuestions.map((q) => Number(q.id)),
    };

    console.log("Saving quiz:", quizData);

    const success = await saveQuiz(quizData, existingQuizId);
    if (success) {
      fetchQuizzes().then(setAllQuizzes);

      setQuizTitle("");
      setSelectedQuestions([]);
      setExistingQuizId(null);
    }
  };

  const handleSaveAndNewQuiz = async () => {
    const success = await handleSaveQuiz();
    if (success) {
      setQuizTitle("");
      setSelectedQuestions([]);
      setExistingQuizId(null);
    }
  };

  return (
    <div className="create-quiz">
      <h3>Create or Edit a Quiz</h3>
      <input
        type="text"
        placeholder="Enter Quiz Title or Search Existing"
        value={quizTitle}
        onChange={handleQuizTitleChange}
        className="input-field"
      />

      <h3>Questions Bank</h3>
      <div className="question-grid">
        {questions.length === 0 ? (
          <p>No questions available. Add some questions first.</p>
        ) : (
          questions.map((q) => (
            <div
              key={q.id}
              className={`question-card ${
                selectedQuestions.some((sq) => sq.id === q.id) ? "selected" : ""
              }`}
              onClick={() => handleSelectQuestion(q)}
            >
              {q.imageUrl && (
                <img
                  src={q.imageUrl}
                  alt="Question"
                  className="question-image"
                />
              )}
              {!q.imageUrl && (
                <img
                  src={`https://quiz-service-bb46.onrender.com/questions/${q.id}/image`}
                  alt="Question"
                  className="question-image"
                />
              )}
              <h4>{q.description}</h4>
              <ul className="choices-list">
                {q.choices.map((choice, index) => (
                  <li key={index}>{choice}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      <h3>Selected Questions ({selectedQuestions.length})</h3>
      <div className="selected-question-list">
        {selectedQuestions.map((q) => (
          <div key={q.id} className="selected-card">
            {q.imageUrl && (
              <img
                src={q.imageUrl}
                alt="Selected Question"
                className="question-image"
              />
            )}
            {!q.imageUrl && (
              <img
                src={`https://quiz-service-bb46.onrender.com/questions/${q.id}/image`}
                alt="Selected Question"
                className="question-image"
              />
            )}
            <h4>{q.description}</h4>
            <ul>
              {q.choices.map((choice, index) => (
                <li key={index}>{choice}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="button-container">
        <Button onClick={handleSaveQuiz}>
          {existingQuizId ? "Save Changes" : "Create Quiz"}
        </Button>
        <Button onClick={handleSaveAndNewQuiz}>
          Save This Quiz and Start a New One
        </Button>
      </div>
    </div>
  );
}
