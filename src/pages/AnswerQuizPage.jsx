import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "../services/quizService.js";
import { AuthContext } from "../context/AuthContext.jsx";

const AnswerQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ Correct usage
  const userId = user?._id; // Ensure userId is available

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeTaken, setTimeTaken] = useState([]);
  const [feedback, setFeedback] = useState(null); // State for feedback message

  // ✅ FIX: Prevent premature redirection before auth state is initialized
  useEffect(() => {
    if (user === undefined) return; // Wait until AuthContext loads the user state
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(quizId);
        setQuiz(data);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Timer effect (resets when question changes)
  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (optionIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: optionIndex,
    }));

    setTimeTaken((prev) => [...prev, 30 - timeLeft]);
  };

  const handleNextQuestion = () => {
    const isCorrect = quiz.questions[currentQuestion].options[answers[currentQuestion]] === quiz.questions[currentQuestion].answer;
    setFeedback(isCorrect ? "Correct!" : "Incorrect!");

    setTimeout(() => {
      setFeedback(null); // Clear feedback after a short delay
      if (currentQuestion < quiz?.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(30); // Reset timer only when moving to the next question
      } else {
        handleSubmit();
      }
    }, 2000); // 2-second delay before moving to the next question
  };

  const handleSkipQuestion = () => {
    setFeedback("Skipped!");
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: null,
    }));

    setTimeout(() => {
      setFeedback(null); // Clear feedback after a short delay
      if (currentQuestion < quiz?.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(30); // Reset timer only when moving to the next question
      } else {
        handleSubmit();
      }
    }, 2000); // 2-second delay before moving to the next question
  };

  const handleSubmit = () => {
    if (!userId) {
      console.error("User not found! Please try again.");
      console.log("User state:", user); // Log the user state to diagnose the issue
      return;
    }
  
    let totalScore = 0;
    quiz?.questions.forEach((q, index) => {
      if (q.options[answers[index]] === q.answer) {
        totalScore++;
      }
    });
  
    navigate("/result", { state: { quiz, answers, timeTaken, userId } });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl">
      {quiz ? (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {quiz.title}
          </h1>
          <p className="text-gray-500 mb-6">{quiz.description}</p>

          <div className="mb-6 p-6 border rounded-xl bg-gray-50 shadow-md">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                {quiz.questions[currentQuestion].question}
              </h2>
              <span className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-full animate-pulse">
                {timeLeft}s
              </span>
            </div>

            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  onClick={() => handleAnswerChange(oIndex)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 text-lg font-medium ${
                    answers[currentQuestion] === oIndex
                      ? "bg-blue-600 text-white scale-105 shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>

            {feedback && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 border border-green-200 rounded-lg">
                {feedback}
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={handleSkipQuestion}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              >
                Skip Question
              </button>
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {currentQuestion === quiz.questions.length - 1
                  ? "Submit Quiz"
                  : "Next Question"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-lg font-medium text-gray-600">
          Loading quiz...
        </p>
      )}
    </div>
  );
};

export default AnswerQuizPage;
