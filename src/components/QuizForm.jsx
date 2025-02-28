import { useState } from "react";
import axios from "axios";

// Ensure the environment variable is correctly set
const CONST_LINK = import.meta.env.VITE_CONST_LINK + "/api/quizzes";

// Default values arrays
const topics = [
"Random"
];
const subjects = ["Random"];
const descriptions = [
"Random"
];

// Helper function to get a random value from an array
const getRandomValue = (arr) => arr[Math.floor(Math.random() * arr.length)];

const QuizForm = ({ onSubmit }) => {
  const [quiz, setQuiz] = useState({
    title: "Random",
    description: "Random",
    subject: "Random",
    randomizeQuestions: true,
    difficulty: "easy",
    questions: [],
  });
  const [numQuestions, setNumQuestions] = useState(5);
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => ({ ...prevQuiz, [name]: value }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[index][name] = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const handleOptionChange = (qIndex, oIndex, e) => {
    const value = e.target.value;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      updatedQuestions[qIndex].options[oIndex] = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  const handleCorrectAnswerChange = (qIndex, e) => {
    const value = e.target.value;
    setQuiz((prevQuiz) => {
      const updatedQuestions = [...prevQuiz.questions];
      if (!updatedQuestions[qIndex].options.includes(value)) {
        setErrors("Correct answer must be one of the options.");
        return prevQuiz;
      }
      updatedQuestions[qIndex].correctAnswer = value;
      return { ...prevQuiz, questions: updatedQuestions };
    });
  };

  // Function to add a new blank question manually
  const addQuestion = () => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: [
        ...prevQuiz.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    }));
  };

  const removeQuestion = (index) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      questions: prevQuiz.questions.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!quiz.title || !quiz.description || !quiz.subject) {
      setErrors("All fields (title, description, subject) must be filled!");
      return false;
    }
    if (quiz.questions.length === 0) {
      setErrors("Please generate or add at least one question.");
      return false;
    }
    for (const q of quiz.questions) {
      if (!q.question || q.options.some((opt) => !opt) || !q.correctAnswer) {
        setErrors("Each question must have text, four options, and a correct answer.");
        return false;
      }
    }
    setErrors("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalQuiz = {
      ...quiz,
      title: quiz.title || getRandomValue(topics),
      description: quiz.description || getRandomValue(descriptions),
      subject: quiz.subject || getRandomValue(subjects),
      questions: quiz.questions.map((q) => ({
        question: q.question,
        options: q.options,
        answer: q.correctAnswer, // Backend expects "answer" instead of "correctAnswer"
      })),
    };

    console.log("Quiz Submitted:", finalQuiz);
    axios
      .post(`${CONST_LINK}/postQuiz`, finalQuiz, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        console.log("Quiz successfully posted:", response.data);
        onSubmit(finalQuiz);
      })
      .catch((error) => {
        console.error("Error creating quiz:", error);
        setErrors("Failed to create quiz on the server.");
      });
  };

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setErrors("");
    try {
      const response = await axios.post(`${CONST_LINK}/generateQuiz`, {
        subject: quiz.subject,
        topic: quiz.title,
        description: quiz.description,
        numQuestions: numQuestions,
        difficulty: quiz.difficulty,
      });
      const generatedQuestions = response.data.questions;
      if (!generatedQuestions || !Array.isArray(generatedQuestions)) {
        setErrors("AI did not return questions in the expected format.");
        return;
      }
      // Provide a default for options if undefined
      const formattedQuestions = generatedQuestions.map((q) => ({
        question: q.question,
        options: q.options || ["", "", "", ""],
        correctAnswer: q.answer,
      }));
      setQuiz((prevQuiz) => ({ ...prevQuiz, questions: formattedQuestions }));
    } catch (error) {
      console.error("Error generating AI quiz:", error);
      setErrors("Failed to generate AI quiz questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Quiz</h2>
      {errors && <p className="text-red-500 mb-4">{errors}</p>}
      <div className="mb-4">
        <label className="block font-medium">Title (Topic)</label>
        <input
          type="text"
          name="title"
          value={quiz.title}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={quiz.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block font-medium">Subject</label>
        <input
          type="text"
          name="subject"
          value={quiz.subject}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Difficulty</label>
        <select
          name="difficulty"
          value={quiz.difficulty}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium">Number of Questions</label>
        <input
          type="number"
          min="5"
          max="10"
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={handleGenerateQuiz}
          className="bg-purple-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate AI Quiz Questions"}
        </button>
        <button
          onClick={addQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Question Manually
        </button>
      </div>
      {quiz.questions.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-2">Questions</h3>
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="border p-4 rounded mb-4">
              <label className="block font-medium">Question {qIndex + 1}</label>
              <input
                type="text"
                name="question"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e)}
                className="w-full p-2 border rounded mb-2"
              />
              <h4 className="font-medium">Options</h4>
              {q.options.map((option, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                  className="w-full p-2 border rounded mb-1"
                />
              ))}
              <label className="block font-medium mt-2">Correct Answer</label>
              <select
                value={q.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(qIndex, e)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Correct Answer</option>
                {q.options.map((option, oIndex) => (
                  <option key={oIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeQuestion(qIndex)}
                className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
              >
                Remove Question
              </button>
            </div>
          ))}
        </>
      )}
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Submit Quiz
      </button>
    </div>
  );
};

export default QuizForm;
