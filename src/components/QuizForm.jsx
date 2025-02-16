import { useState } from "react";

const QuizForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("Title not set");
  const [description, setDescription] = useState("Description not set");
  const [subject, setSubject] = useState("Math");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answer = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, subject, questions });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <h1 className="text-2xl font-bold mb-4">Create a Quiz</h1>
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <h2 className="text-xl font-semibold mb-2">Questions</h2>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6 p-4 border rounded bg-gray-50">
          <input
            type="text"
            placeholder={`Question ${qIndex + 1}`}
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          {q.options.map((option, oIndex) => (
            <div key={oIndex} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, e.target.value)
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="radio"
                name={`correct-answer-${qIndex}`}
                checked={q.answer === option}
                onChange={() => handleAnswerChange(qIndex, option)}
              />
              <label className="text-sm">Correct</label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => removeQuestion(qIndex)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Question
      </button>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Create Quiz
      </button>
    </form>
  );
};

export default QuizForm;
