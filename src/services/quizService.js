import axios from "axios";
const CONST_LINK = import.meta.env.VITE_CONST_LINK + "/api/quizzes";

// Create a new quiz
export const postQuiz = (quizData) => {
  return axios.post(`${CONST_LINK}/postQuiz`, quizData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
};

// Get all quizzes
export const getQuizzes = async () => {
  try {
    const response = await axios.get(`${CONST_LINK}/getQuizzes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Fetch a quiz by ID
export const getQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${CONST_LINK}/getQuiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};
