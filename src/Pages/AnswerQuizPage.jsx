import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizById } from "../services/quizService";

const AnswerQuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

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

  const handleAnswerChange = (questionIndex, optionIndex) => {
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const handleSubmit = () => {
    let totalScore = 0;
    quiz.questions.forEach((q, index) => {
      if (q.options[answers[index]] === q.answer) {
        totalScore++;
      }
    });
    setScore(totalScore);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      {quiz ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
          <p className="text-gray-600 mb-6">{quiz.description}</p>

          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border rounded bg-gray-50">
              <h2 className="text-lg font-semibold mb-2">{q.question}</h2>
              {q.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="radio"
                    name={`question-${qIndex}`}
                    checked={answers[qIndex] === oIndex}
                    onChange={() => handleAnswerChange(qIndex, oIndex)}
                    className="cursor-pointer"
                  />
                  <label className="text-sm">{option}</label>
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Answers
          </button>

          {score !== null && (
            <div className="mt-6 p-4 bg-green-100 text-green-700 rounded">
              <h2 className="text-lg font-semibold">
                Your Score: {score} / {quiz.questions.length}
              </h2>
            </div>
          )}
        </>
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
};

export default AnswerQuizPage;
