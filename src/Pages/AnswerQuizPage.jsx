import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "../services/quizService";

const AnswerQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeTaken, setTimeTaken] = useState([]);

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

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion(); // Auto move to next question when time runs out
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleNextQuestion = () => {
    setTimeTaken([...timeTaken, 30 - timeLeft]); // Store time taken for current question
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30); // Reset timer
    } else {
      handleSubmit();
    }
  };

  const handleSkipQuestion = () => {
    setAnswers({ ...answers, [currentQuestion]: null }); // Mark as skipped
    handleNextQuestion();
  };

  const handleSubmit = () => {
    let totalScore = 0;
    quiz.questions.forEach((q, index) => {
      if (q.options[answers[index]] === q.answer) {
        totalScore++;
      }
    });

    // Navigate to Result Page with all required data
    navigate("/result", { state: { quiz, answers, timeTaken } });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-2xl">
      {quiz ? (
        <>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
          <p className="text-gray-500 mb-6">{quiz.description}</p>

          <div className="mb-6 p-6 border rounded-xl bg-gray-50 shadow-md">
            {/* Timer */}
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                {quiz.questions[currentQuestion].question}
              </h2>
              <span className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-full animate-pulse">
                {timeLeft}s
              </span>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {quiz.questions[currentQuestion].options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  onClick={() => handleAnswerChange(oIndex)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 text-lg font-medium
                    ${
                    answers[currentQuestion] === oIndex
                      ? "bg-blue-600 text-white scale-105 shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
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
        <p className="text-center text-lg font-medium text-gray-600">Loading quiz...</p>
      )}
    </div>
  );
};

export default AnswerQuizPage;
