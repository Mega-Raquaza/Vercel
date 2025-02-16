import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const QueryCard = ({ query, refreshQueries }) => {
  const { user } = useContext(AuthContext);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Upvote
  const handleUpvote = async () => {
    if (!user) return alert("You must be logged in to upvote.");
    try {
      await axios.post(`${CONST_LINK}/api/queries/${query._id}/upvote`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      refreshQueries(); // Refresh queries after upvoting
    } catch (error) {
      console.error("Error upvoting:", error.response?.data || error.message);
    }
  };

  // Handle Answer Submission
  const submitAnswer = async (e) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to answer.");
    if (!answer.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${CONST_LINK}/api/queries/${query._id}/answer`, { answer }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setAnswer(""); // Clear input after submitting
      refreshQueries(); // Refresh to show new answer
    } catch (error) {
      console.error("Error submitting answer:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{query.title}</h3>
        <button onClick={handleUpvote} className="flex items-center space-x-1 text-blue-500 hover:text-blue-700">
          ▲ <span>{query.upvotes ? query.upvotes.length : 0}</span>
        </button>
      </div>
      <p className="text-gray-600">{query.description}</p>
      <p className="text-sm text-blue-500">Subject: {query.subject}</p>
      <p className="text-xs text-gray-400">Asked by: {query.username}</p>

      {/* Answer List */}
      <div className="mt-4">
        <h4 className="font-semibold">Answers:</h4>
        {query.answers && query.answers.length > 0 ? (
          query.answers.map((ans, index) => (
            <div key={index} className="p-2 border rounded mt-2 bg-gray-50">
              <p className="text-sm">{ans.text}</p>
              <p className="text-xs text-gray-400">By: {ans.answeredBy}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No answers yet.</p>
        )}
      </div>

      {/* Answer Form */}
      {user && (
        <form onSubmit={submitAnswer} className="mt-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Write your answer..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded mt-2 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Answer"}
          </button>
        </form>
      )}
    </div>
  );
};

export default QueryCard;
