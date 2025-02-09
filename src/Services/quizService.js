import axios from "axios";

const API_URL = "https://render-5az4.onrender.com/api/quizzes";

// Create a new quiz
export const postQuiz = async (quizData) => {
  try {
    const response = await axios.post(`${API_URL}/postQuiz`, quizData);
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

// Get all quizzes
export const getQuizzes = async () => {
  try {
    const response = await axios.get(`${API_URL}/getQuizzes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

// Fetch a quiz by ID
export const getQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${API_URL}/getQuiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz:", error);
    throw error;
  }
};
