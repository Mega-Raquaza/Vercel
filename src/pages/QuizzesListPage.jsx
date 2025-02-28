import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getQuizzes } from "../services/quizService";
import { AuthContext } from "../context/AuthContext";

const QuizzesListPage = () => {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [newQuizzes, setNewQuizzes] = useState([]);
  const [unansweredQuizzes, setUnansweredQuizzes] = useState([]);
  const [answeredQuizzes, setAnsweredQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getQuizzes();
        setQuizzes(data.data);

        // Filter new quizzes (created in the last 24 hours)
        const now = new Date();
        const newQuizzes = data.data.filter(
          (quiz) => (now - new Date(quiz.createdAt)) / (1000 * 60 * 60) < 24
        );
        setNewQuizzes(newQuizzes);

        // Separate quizzes into unanswered and answered
        if (user) {
          const answeredIds = user.quizHistory.map((q) => q.quizId);
          setAnsweredQuizzes(data.data.filter((quiz) => answeredIds.includes(quiz._id)));
          setUnansweredQuizzes(data.data.filter((quiz) => !answeredIds.includes(quiz._id)));
        } else {
          setUnansweredQuizzes(data.data);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
        Quizzes
      </h1>

      {/* New Quizzes Section */}
      <Section 
        title="✨ New Quizzes" 
        quizzes={newQuizzes} 
        gradient="from-orange-600 to-pink-600"
      />

      {/* Unanswered Quizzes */}
      <Section 
        title="🚀 Unanswered Quizzes" 
        quizzes={unansweredQuizzes} 
        gradient="from-blue-600 to-purple-600"
      />

      {/* Answered Quizzes */}
      <Section 
        title="✅ Answered Quizzes" 
        quizzes={answeredQuizzes} 
        gradient="from-green-600 to-teal-600"
      />

      <div className="flex justify-center mt-12">
        <Link 
          to="/leaderboard" 
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all font-bold text-lg shadow-lg"
        >
          🏆 View Leaderboard
        </Link>
      </div>
    </div>
  );
};

const Section = ({ title, quizzes, gradient }) => (
  <section className="mb-12">
    <h2 className={`text-2xl font-bold mb-6 p-2 bg-gradient-to-r ${gradient} text-white rounded-lg inline-block`}>
      {title}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => <QuizCard key={quiz._id} quiz={quiz} />)
      ) : (
        <div className="col-span-full p-6 bg-gray-800 rounded-lg border border-dashed border-gray-700">
          <p className="text-gray-400 text-center">No quizzes available.</p>
        </div>
      )}
    </div>
  </section>
);

const QuizCard = ({ quiz }) => (
  <div className="group p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl">
    <div className="flex flex-col h-full">
      <h3 className="text-xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
        {quiz.title}
      </h3>
      <p className="text-gray-300 mb-4 flex-1">{quiz.description}</p>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-2">📝</span>
          <span>{quiz.questions.length} Questions</span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-2">⏳</span>
          <span>{quiz.questions.length * 15} seconds</span>
        </div>
      </div>

      <Link
        to={`/quiz/${quiz._id}`}
        className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all font-semibold text-center shadow-md"
      >
        Start Quiz
      </Link>
    </div>
  </div>
);
export default QuizzesListPage;
