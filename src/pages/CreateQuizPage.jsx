import QuizForm from "../components/QuizForm";
import { postQuiz } from "../services/quizService";

const CreateQuizPage = () => {
  const handleQuizSubmit = async (quizData) => {
    try {
      await postQuiz(quizData);
      alert("Quiz Created Successfully!");
    } catch (error) {
      alert("Error creating quiz. Check console for details.");
      console.error(error);
    }
  };

  return <QuizForm onSubmit={handleQuizSubmit} />;
};

export default CreateQuizPage;
