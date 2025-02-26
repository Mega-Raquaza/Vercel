import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "../services/quizService.js";
import { AuthContext } from "../context/AuthContext.jsx";

const AnswerQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const userId = user?._id;

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeTaken, setTimeTaken] = useState([]);
  const [feedback, setFeedback] = useState(null);

  // Prevent redirection until auth state is initialized
  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch quiz details
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

  // Timer effect that counts down each second
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

  // Trigger feedback without sound or confetti
  const triggerFeedback = (isCorrect) => {
    if (isCorrect) {
      setFeedback("Correct!");
    } else {
      setFeedback("Incorrect!");
    }
  };

  const handleNextQuestion = () => {
    const current = quiz.questions[currentQuestion];
    const selectedOption = answers[currentQuestion];
    const isCorrect = current.options[selectedOption] === current.answer;
    triggerFeedback(isCorrect);

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(30);
      } else {
        handleSubmit();
      }
    }, 2000);
  };

  const handleSkipQuestion = () => {
    setFeedback("Skipped!");
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion]: null,
    }));
    setTimeout(() => {
      setFeedback(null);
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(30);
      } else {
        handleSubmit();
      }
    }, 2000);
  };

  const handleSubmit = () => {
    if (!userId) {
      console.error("User not found! Please try again.");
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

  // Calculate quiz progress
  const progressPercentage = quiz ? ((currentQuestion) / quiz.questions.length) * 100 : 0;

  // Themed background (e.g., jungle, space, underwater)
  // Using a playful jungle gradient
  const themedBackgroundClass = "bg-gradient-to-r from-green-300 via-yellow-300 to-green-500";
    return (
      <div className={`${themedBackgroundClass} min-h-screen flex flex-col items-center p-4 md:p-6`}>
        {/* Header with responsive text size */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-white drop-shadow-lg">
            Quiz Time!
          </h1>
        </div>
  
        {quiz ? (
          <div className="w-full max-w-3xl bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2 md:h-4">
                <div
                  className="bg-blue-500 h-2 md:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs md:text-sm text-gray-600 mt-1">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
  
            <div className="mb-6 p-4 md:p-6 border rounded-lg md:rounded-xl bg-gray-50 shadow-md">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                <h2 className="text-lg md:text-2xl font-semibold text-gray-800 flex-1">
                  {quiz.questions[currentQuestion].question}
                </h2>
                <span className="bg-red-500 text-white px-3 md:px-4 py-1 md:py-2 text-sm md:text-lg font-bold rounded-full animate-pulse">
                  {timeLeft}s
                </span>
              </div>
  
              <div className="space-y-2 md:space-y-4">
                {quiz.questions[currentQuestion].options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    onClick={() => handleAnswerChange(oIndex)}
                    className={`p-3 md:p-5 border-2 rounded-md md:rounded-lg cursor-pointer transition-all duration-300 text-base md:text-xl font-semibold ${
                      answers[currentQuestion] === oIndex
                        ? "bg-blue-600 text-white scale-[1.02] md:scale-105 shadow-md md:shadow-xl border-blue-700"
                        : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
  
              {feedback && (
                <div className="mt-4 p-2 md:p-4 bg-green-100 text-green-800 border border-green-300 rounded-lg text-lg md:text-xl font-bold text-center animate-bounce">
                  {feedback}
                </div>
              )}
  
              <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-2 md:gap-0">
                <button
                  onClick={handleSkipQuestion}
                  className="w-full md:w-1/2 md:mr-2 py-2 md:py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-base md:text-xl font-bold"
                >
                  Skip
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="w-full md:w-1/2 md:ml-2 py-2 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-base md:text-xl font-bold"
                >
                  {currentQuestion === quiz.questions.length - 1 ? "Submit" : "Next"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg md:text-2xl font-bold text-white mt-8">
            Loading quiz...
          </p>
        )}
      </div>
    );
  };

export default AnswerQuizPage;
