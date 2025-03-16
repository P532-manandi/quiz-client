const BASE_URL = "https://quiz-service-bb46.onrender.com"; // Replace with actual backend URL

export const fetchQuestions = async () => {
    const response = await fetch("https://quiz-service-bb46.onrender.com/questions");
    const data = await response.json();
  
    if (Array.isArray(data.questions)) {
      return data.questions.map((q) => ({
        id: q.id,
        description: q.description,
        choices: q.choices,
        answer: q.answer,
        imageUrl: q.imageUrl || "", 
      }));
    }
  
    console.error("Unexpected API response:", data);
    return [];
  };
  

export const fetchQuestionById = async (id) => {
  const response = await fetch(`${BASE_URL}/questions/${id}`);
  if (!response.ok) throw new Error("Question not found");
  return response.json();
};


export const searchQuestions = async (query) => {
  const response = await fetch(`${BASE_URL}/questions/search?name=${query}`);
  return response.json();
};


export const addQuestion = async (questionData) => {
  const response = await fetch(`${BASE_URL}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(questionData),
  });
  return response.json();
};



export const fetchQuizzes = async () => {
    const response = await fetch("https://quiz-service-bb46.onrender.com/quizzes");
    const data = await response.json();
  
    if (!Array.isArray(data)) {
      console.error("Unexpected quiz API response:", data);
      return [];
    }
  
    return data; 
  };
  

  export const fetchQuizById = async (id) => {
    const response = await fetch(`https://quiz-service-bb46.onrender.com/quizzes/${id}`);
    return response.json();
  };
  
  export const saveQuiz = async (quiz, existingQuizId = null) => {
    const isUpdate = Boolean(existingQuizId); 
    const method = isUpdate ? "PUT" : "POST"; 
    const endpoint = isUpdate
      ? `https://quiz-service-bb46.onrender.com/quizzes/${existingQuizId}`
      : "https://quiz-service-bb46.onrender.com/quizzes";
  
    
    const requestBody = isUpdate
      ? { questionIds: quiz.questionIds.map(Number) } 
      : { title: quiz.title, questionIds: quiz.questionIds.map(Number) }; 
  
    try {
      console.log(`Making ${method} request to:`, endpoint);
      console.log("Request Body:", requestBody);
  
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        alert(`Error saving quiz: ${errorText}`);
        return false;
      }
  
      const data = await response.json();
      alert(isUpdate ? "Quiz updated successfully!" : "Quiz created successfully!");
      return true;
    } catch (error) {
      console.error("Failed to fetch:", error);
      alert("Failed to save quiz. Check console for details.");
      return false;
    }
  };
  

  


export const updateQuiz = async (id, quiz) => {
  const response = await fetch(`${BASE_URL}/quizzes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quiz),
  });
  return response.json();
};

