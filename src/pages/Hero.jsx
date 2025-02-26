import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">
          Genius Clash
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Your hub for quizzes, queries, friends, and multiplayer games.
        </p>
      </header>

      {/* Quick Navigation Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/home")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/league")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            League
          </button>
          <button
            onClick={() => navigate("/leagues/rankings")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Rankings
          </button>
          <button
            onClick={() => navigate("/achievements")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Achievements
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            My Profile
          </button>
          <button
            onClick={() => navigate("/userdata")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            User Data
          </button>
        </div>
      </section>

      {/* Authentication Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Authentication</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/login")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Signup
          </button>
          <button
            onClick={() => navigate("/logout")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Logout
          </button>
        </div>
      </section>

      {/* Quizzes Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Quizzes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/create-quiz")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Create Quiz
          </button>
          <button
            onClick={() => navigate("/quizzes")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Quizzes
          </button>
          <button
            onClick={() => navigate("/quiz/123")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Answer Quiz
          </button>
          <button
            onClick={() => navigate("/quiz/123/leaderboard")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Leaderboard
          </button>
        </div>
      </section>

      {/* Queries Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Queries</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/queries")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Query List
          </button>
          <button
            onClick={() => navigate("/query/new")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Ask Query
          </button>
          <button
            onClick={() => navigate("/query/123")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Query Details
          </button>
        </div>
      </section>

      {/* Friends Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Friends</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/friends/search")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Friend Search
          </button>
          <button
            onClick={() => navigate("/friends/requests")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Friend Requests
          </button>
          <button
            onClick={() => navigate("/friends/list")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Friend List
          </button>
        </div>
      </section>

      {/* Multiplayer Games Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-bold mb-4">Multiplayer Games</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/games")}
            className="p-3 bg-orange-500 rounded hover:bg-orange-600 transition"
          >
            Game Lobby
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
