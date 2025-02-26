// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const Home = () => {
  const { user } = useContext(AuthContext);
  const [latestQueries, setLatestQueries] = useState([]);
  const [claimAvailable, setClaimAvailable] = useState(false);
  const [claimCountdown, setClaimCountdown] = useState(0);

  // Fetch latest queries (limit 3)
  useEffect(() => {
    const fetchLatestQueries = async () => {
      try {
        const res = await axios.get(`${CONST_LINK}/api/queries?page=1&limit=3`);
        if (res.data.queries) {
          setLatestQueries(res.data.queries);
        }
      } catch (error) {
        console.error("Error fetching latest queries:", error);
      }
    };
    fetchLatestQueries();
  }, []);

  // Update claim timer: reset every 20 minutes and enable manual claim only at that time
  useEffect(() => {
    const updateClaimTimer = () => {
      const now = new Date();
      const nextClaim = new Date();
      // Set next claim time to the next 20-minute interval (e.g., 0, 20, 40 minutes)
      nextClaim.setMinutes(now.getMinutes() + 20 - (now.getMinutes() % 20), 0, 0);
      const diff = nextClaim - now;
      setClaimCountdown(diff);
      // Enable claim only if we are exactly at the 20-minute mark (this check is very brief)
      if (now.getMinutes() % 20 === 0 && now.getSeconds() === 0) {
        setClaimAvailable(true);
      } else {
        setClaimAvailable(false);
      }
    };
    updateClaimTimer();
    const timerId = setInterval(updateClaimTimer, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleClaimMedals = async () => {
    try {
      const res = await axios.post(
        `${CONST_LINK}/api/medals/claim`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      alert("Medals claimed successfully!");
      // Optionally, refresh user data here if needed
    } catch (error) {
      console.error("Error claiming medals:", error);
      alert("Error claiming medals");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <header
        className="relative flex items-center justify-center h-screen bg-cover bg-center"
        style={{ backgroundImage: `url("https://source.unsplash.com/1600x900/?technology,abstract")` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500 animate-pulse">
            Genius Clash
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-gray-300">
            Challenge your mind, connect with friends, and earn rewards.
          </p>
          {user ? (
            <Link
              to="/profile"
              className="mt-8 inline-block px-8 py-4 bg-green-600 hover:bg-green-700 transition rounded-full text-lg font-semibold"
            >
              Go to Your Profile
            </Link>
          ) : (
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/login"
                className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 transition rounded-full text-lg font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-block px-8 py-4 bg-purple-600 hover:bg-purple-700 transition rounded-full text-lg font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="p-4 md:p-8">
        {/* User Details Section */}
        {user && (
          <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8 flex flex-col md:flex-row items-center transition transform hover:scale-105">
            <img
              src={user?.userDetails?.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-bold">{user.username}</h2>
              <p className="text-gray-300">{user.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-2">
                <span className="text-lg flex items-center text-gray-400">
                  <i className="fas fa-fire text-lightBlue-400 mr-1"></i>
                  {user.aura} Aura
                </span>
                <span className="text-lg flex items-center text-gray-400">
                  <i className="fas fa-medal text-yellow-400 mr-1"></i>
                  {user.medals} Medals
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Latest Queries Section */}
        <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-center">Latest Queries</h2>
            <Link
              to="/queries"
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded hover:from-green-500 hover:to-teal-500 transition"
            >
              View All Queries
            </Link>
          </div>
          {latestQueries.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {latestQueries.map((query) => (
                <div key={query._id} className="p-4 bg-gray-700 rounded-lg shadow transform hover:scale-105 transition">
                  <h3 className="text-xl font-bold text-white">{query.title}</h3>
                  <p className="text-gray-300">
                    {query.description.length > 100
                      ? query.description.substring(0, 100) + "..."
                      : query.description}
                  </p>
                  <Link to={`/query/${query._id}`} className="text-blue-400 hover:underline text-sm">
                    View Query
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No queries available.</p>
          )}
        </div>

        {/* About the Website Section */}
        <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
          <h2 className="text-3xl font-bold mb-4 text-center">About Quiz & Social Hub</h2>
          <p className="text-gray-300 text-center leading-relaxed">
            Quiz & Social Hub is your ultimate destination to challenge your knowledge, connect with friends, and track your progress.
            Engage in fun quizzes, ask questions, earn rewards, and unlock achievements as you climb the leaderboards.
            Our platform combines learning with social interaction to create a dynamic experience that grows with you.
          </p>
          <div className="mt-4 flex justify-center">
            <Link
              to="/queries"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Go to Query Page
            </Link>
          </div>
        </div>

        {/* Medal Claim Section */}
        <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Medal Claim</h2>
          {claimAvailable ? (
            <button
              onClick={handleClaimMedals}
              className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition transform hover:scale-105"
            >
              Claim Medals
            </button>
          ) : (
            <p className="text-gray-400">
              Next claim available in {Math.floor(claimCountdown / 60000)}m{" "}
              {Math.floor((claimCountdown % 60000) / 1000)}s.
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto text-center py-4 text-gray-400">
        © {new Date().getFullYear()} Quiz & Social Hub. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
