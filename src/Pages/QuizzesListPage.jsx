import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuizzes } from "../services/quizService";

const QuizzesListPage = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">All Quizzes</h1>
      {quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz._id} className="p-4 border rounded bg-gray-50 mb-4">
            <h2 className="text-xl font-semibold">{quiz.title}</h2>
            <p className="text-sm text-gray-600">{quiz.description}</p>
            <p className="text-sm text-gray-500">Subject: {quiz.subject}</p>
            <p className="text-sm text-gray-500">
              Questions: {quiz.questions.length}
            </p>

            {/* Start Quiz Button */}
            <Link
              to={`/quiz/${quiz._id}`}
              className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Quiz
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default QuizzesListPage;
