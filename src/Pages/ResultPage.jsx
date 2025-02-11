import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, answers, timeTaken } = location.state || {};

  if (!quiz || !answers || !timeTaken) {
    return <p className="text-center text-red-500">Invalid Quiz Data</p>;
  }

  // Calculate Score & Accuracy
  let correctAnswers = 0;
  const totalQuestions = quiz.questions.length;
  const questionAnalysis = quiz.questions.map((q, index) => {
    const isCorrect = q.options[answers[index]] === q.answer;
    if (isCorrect) correctAnswers++;

    return {
      question: q.question,
      selectedAnswer: q.options[answers[index]] || "No Answer",
      correctAnswer: q.answer,
      isCorrect,
      timeTaken: timeTaken[index] || 0, // Time taken per question
    };
  });

  const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Quiz Results</h1>

      {/* Score & Accuracy */}
      <div className="p-4 bg-gray-100 rounded-lg mb-6 text-center">
        <p className="text-lg font-semibold">
          Score: {correctAnswers} / {totalQuestions}
        </p>
        <p className="text-green-600 font-semibold">Accuracy: {accuracy}%</p>
      </div>

      {/* Question Analysis */}
      <div>
        {questionAnalysis.map((qa, index) => (
          <div
            key={index}
            className={`p-4 rounded mb-4 ${qa.isCorrect ? "bg-green-100" : "bg-red-100"}`}
          >
            <h2 className="text-lg font-semibold">
              {index + 1}. {qa.question}
            </h2>
            <p className="text-sm">
              <strong>Your Answer:</strong> {qa.selectedAnswer}
            </p>
            <p className="text-sm text-green-700">
              <strong>Correct Answer:</strong> {qa.correctAnswer}
            </p>
            <p className="text-sm text-blue-600">
              <strong>Time Taken:</strong> {qa.timeTaken} sec
            </p>
          </div>
        ))}
      </div>

      {/* Go Back Button */}
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
