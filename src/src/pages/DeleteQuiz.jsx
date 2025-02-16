import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const DeleteQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${CONST_LINK}/api/getQuizzes`);
        const data = await response.json();
        setQuizzes(data.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://render-5az4.onrender.com/api/deleteQuiz/${id}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setQuizzes(quizzes.filter((quiz) => quiz._id !== id));
        alert("Quiz deleted successfully!");
      } else {
        alert("Error deleting quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Error deleting quiz");
    }
  };

  return (
    <div>
      <h2>Delete Quizzes</h2>
      {quizzes.map((quiz) => (
        <div key={quiz._id}>
          <h3>{quiz.subject}</h3>
          <button onClick={() => handleDelete(quiz._id)}>Delete Quiz</button>
        </div>
      ))}
      <Link to="/">Go Back Home</Link>
    </div>
  );
};

export default DeleteQuiz;
