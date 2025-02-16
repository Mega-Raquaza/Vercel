import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext.jsx";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const ResultPage = () => {
  const { user } = useContext(AuthContext); // ✅ Correct usage
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, answers, timeTaken } = location.state || {};

  const userId = user ? user._id : null;

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect if user is not logged in
    }
  }, [userId, navigate]);

  if (!quiz || !answers || !timeTaken) {
    return <p className="text-center text-red-500">Invalid Quiz Data</p>;
  }

  let correctAnswers = 0;
  const totalQuestions = quiz.questions.length;
  let totalScore = 0;

  const questionAnalysis = quiz.questions.map((q, index) => {
    const isCorrect = q.options[answers[index]] === q.answer;
    if (isCorrect) {
      correctAnswers++;
      totalScore += 10;
    } else {
      totalScore -= 5;
    }

    return {
      question: q.question,
      selectedAnswer: q.options[answers[index]] || "No Answer",
      correctAnswer: q.answer,
      isCorrect,
      timeTaken: timeTaken[index] || 0,
    };
  });

  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  const [updatedScore, setUpdatedScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateScore = async () => {
      if (!userId) return;

      const token = localStorage.getItem("accessToken"); // Retrieve the token from local storage

      try {
        const response = await axios.post(
          `${CONST_LINK}/api/users/update-score`,
          {
            userId,
            scoreChange: totalScore,
            quizId: quiz._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          }
        );

        setUpdatedScore(response.data.updatedScore);
        setLoading(false);
      } catch (err) {
        console.error("Error updating score:", err);
        setError("Failed to update score");
        setLoading(false);
      }
    };

    updateScore();
  }, [userId, totalScore, quiz._id]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Quiz Results</h1>

      <div className="p-4 bg-gray-100 rounded-lg mb-6 text-center">
        <p className="text-lg font-semibold">Score: {correctAnswers} / {totalQuestions}</p>
        <p className="text-green-600 font-semibold">Accuracy: {accuracy}%</p>
        {loading ? (
          <p className="text-blue-500">Updating score...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-green-600">Updated Score: {updatedScore}</p>
        )}
      </div>

      <button
        onClick={() => navigate("/quizzes")}
        className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back to Quizzes
      </button>
    </div>
  );
};

export default ResultPage;
