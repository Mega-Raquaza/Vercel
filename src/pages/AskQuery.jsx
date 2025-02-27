import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const AskQuery = () => {
  const { user, refreshUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    title: "",
    description: "",
    subject: "",
    medalsUsed: "", // Number of medals the user wants to spend
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">User not authenticated</h2>
        <p className="mb-4">Please log in to access the League Dashboard.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to ask a question.");
      return;
    }
    setLoading(true);
    setErrorMessage("");

    try {
      await axios.post(
        `${CONST_LINK}/api/queries/ask`,
        {
          title: query.title,
          description: query.description,
          subject: query.subject,
          askedBy: user._id,
          username: user.username,
          medalsUsed: query.medalsUsed,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      refreshUserData();
      navigate("/queries");
    } catch (error) {
      console.error("Error posting query:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Ask a Question</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-800 p-6 shadow rounded-xl border border-gray-700"
      >
        {errorMessage && (
          <p className="text-red-500 text-center mb-4">{errorMessage}</p>
        )}

        {/* Subject Input with Datalist */}
        <div className="mb-4">
          <input
            list="subjects"
            name="subject"
            value={query.subject}
            onChange={handleChange}
            placeholder="Select or enter subject"
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <datalist id="subjects">
            <option value="Physics" />
            <option value="Chemistry" />
            <option value="Mathematics" />
            <option value="Biology" />
            <option value="Computer Science" />
            <option value="Trivia" />
            <option value="Others" />
          </datalist>
        </div>

        <input
          type="text"
          name="title"
          placeholder="Enter question title"
          value={query.title}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <textarea
          name="description"
          placeholder="Describe your question..."
          value={query.description}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows="4"
        ></textarea>

        <input 
          type="number"
          name="medalsUsed"
          placeholder="Medals to spend"
          value={query.medalsUsed}
          onChange={handleChange}
          required
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold hover:from-green-500 hover:to-teal-500 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};


export default AskQuery;
