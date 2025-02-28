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

  // Update claim timer: reset every 20 minutes and enable claim at the 20-min mark
  useEffect(() => {
    const updateClaimTimer = () => {
      const now = new Date();
      const nextClaim = new Date();
      nextClaim.setMinutes(now.getMinutes() + 20 - (now.getMinutes() % 20), 0, 0);
      const diff = nextClaim - now;
      setClaimCountdown(diff);
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
      // Optionally refresh user data here
    } catch (error) {
      console.error("Error claiming medals:", error);
      alert("Error claiming medals");
    }
  };

  // Feature cards data
  const features = [
    {
      title: "Queries",
      description: "Ask questions and get answers from the community.",
      icon: "fas fa-comment-dots",
      link: "/queries",
      buttonText: "View Queries",
    },
    {
      title: "Friends",
      description: "Connect with others, view profiles, and chat.",
      icon: "fas fa-user-friends",
      link: "/friends/list",
      buttonText: "Find Friends",
    },
    {
      title: "Games",
      description: "Play fun multiplayer games with your friends.",
      icon: "fas fa-gamepad",
      link: "/games",
      buttonText: "Game Lobby",
    },
  ];

  // Additional feature cards for Achievements and League
  const extraFeatures = [
    {
      title: "Achievements",
      description: "Unlock and claim rewards as you progress.",
      icon: "fas fa-trophy",
      link: "/achievements",
      buttonText: "View Achievements",
    },
    {
      title: "League",
      description: "See your ranking and advance your league.",
      icon: "fas fa-chess-king",
      link: "/league",
      buttonText: "View League",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
{/* Revamped Hero Section */}
<header
  className="relative flex items-center justify-center h-screen bg-cover bg-center"
  style={{
    backgroundImage:
      'url("https://source.unsplash.com/1600x900/?technology,abstract")',
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black opacity-50"></div>

  {/* Main Content */}
  <div className="relative z-10 text-center px-6 max-w-3xl">
    <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-4 animate-fadeInDown">
      QueryVerse
    </h1>
    <p className="text-2xl md:text-3xl text-gray-200 mb-6 animate-fadeInDown delay-150">
      Ask, Answer &amp; Rise to the Top!
    </p>
    <p className="text-s md:text-lg text-gray-300 leading-relaxed mb-8 animate-fadeInDown delay-300">
      🚀 <span className="text-white">QueryVerse</span> is an interactive Q&amp;A platform where you can:
      <br />
      ✅ <span className="text-white">Ask Queries</span> ➡️ <span className="text-white">Answer Them</span> ➡️ <span className="text-white">Earn Aura</span>
      <br />
      🎯 Compete with friends while ranking up in leagues:
      <br />
      <span className="text-yellow-400 font-semibold">Bronze</span> → <span className="text-gray-300">Silver</span> → <span className="text-orange-400">Gold</span> → <span className="text-blue-400">Diamond</span>
      <br />
      👥 Make friends, chat, play, and aim for the <span className="text-purple-400 font-semibold">Master League</span>!
    </p>
    <div className="flex justify-center gap-6 animate-fadeInDown delay-450">
      {user ? (
        <Link
          to="/profile"
          className="px-8 py-4 bg-green-600 hover:bg-green-700 transition rounded-full text-lg font-semibold"
        >
          Go to Your Profile
        </Link>
      ) : (
        <>
          <Link
            to="/login"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 transition rounded-full text-lg font-semibold"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 transition rounded-full text-lg font-semibold"
          >
            Sign Up
          </Link>
        </>
      )}
    </div>
  </div>
</header>





      <div className="p-4 md:p-8">
        {/* User Details Section */}
        {user && (
          <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8 flex flex-col md:flex-row items-center transition transform hover:scale-105">
            <img
              src={user?.userDetails?.profilePicture || ""}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500 mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold">{user.username}</h1>
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

        {/* Feature Cards Section */}
        <section className="max-w-5xl mx-auto p-8">
          <h2 className="text-4xl font-bold text-center mb-8">Explore Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-2xl transition transform hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <i className={`${feature.icon} text-5xl text-orange-400 mb-4`}></i>
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-center mb-4">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.link}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-full text-white font-semibold"
                  >
                    {feature.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Feature Cards for Achievements & League */}
        <section className="max-w-5xl mx-auto p-8">
          <h2 className="text-4xl font-bold text-center mb-8">
            More About Our Platform
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {extraFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-2xl transition transform hover:scale-105"
              >
                <div className="flex flex-col items-center">
                  <i className={`${feature.icon} text-5xl text-orange-400 mb-4`}></i>
                  <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-center mb-4">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.link}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-full text-white font-semibold"
                  >
                    {feature.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Queries Section */}
        <section className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 my-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Latest Queries</h2>
          {latestQueries.length > 0 ? (
            <div className="space-y-4">
              {latestQueries.map((query) => (
                <div
                  key={query._id}
                  className="p-4 bg-gray-700 rounded-lg shadow hover:scale-105 transition transform"
                >
                  <h3 className="text-xl font-bold text-white">{query.title}</h3>
                  <p className="text-gray-300">
                    {query.description.length > 100
                      ? query.description.substring(0, 100) + "..."
                      : query.description}
                  </p>
                  <Link
                    to={`/query/${query._id}`}
                    className="text-blue-400 hover:underline text-sm"
                  >
                    View Query
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No queries available.</p>
          )}
        </section>

        {/* About the Website Section */}
        <section className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 my-8">
          <h2 className="text-3xl font-bold mb-4 text-center">About Quiz & Social Hub</h2>
          <p className="text-gray-300 text-center leading-relaxed">
            Quiz & Social Hub is your ultimate destination to challenge your knowledge, connect with friends, and track your progress.
            Engage in exciting quizzes, ask questions, earn rewards, and unlock achievements as you compete with others.
            Our platform seamlessly blends learning with social interaction, providing a dynamic experience that evolves with you.
          </p>
        </section>
      </div>

            {/* Footer Section with Quick Links and Social Media */}
            <footer className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 my-8 text-center">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Quick Links</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/home" className="text-blue-400 hover:underline">
              Home
            </Link>
            <Link to="/queries" className="text-blue-400 hover:underline">
              Queries
            </Link>
            <Link to="/friends/list" className="text-blue-400 hover:underline">
              Friends
            </Link>
            <Link to="/games" className="text-blue-400 hover:underline">
              Games
            </Link>
            <Link to="/achievements" className="text-blue-400 hover:underline">
              Achievements
            </Link>
            <Link to="/league" className="text-blue-400 hover:underline">
              League
            </Link>
          </div>
        </div>
        <div className="mb-4 flex flex-col items-center">
          <p className="text-lg font-bold mb-2">Contact me via:</p>
          <div className="flex gap-4">
            <a
              href="https://discord.com/channels/@me/1344743482744377385/1344777681199169546"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-500 text-2xl"
            >
              <i className="fab fa-discord"></i>
            </a>
            <a
              href="https://instagram.com/vishnugawas07"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-500 text-2xl"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://telegram.me/vishnugawas07"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 text-2xl"
            >
              <i className="fab fa-telegram"></i>
            </a>
            <a
              href="https://github.com/vishnugawaso7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500 text-2xl"
            >
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Created By Vishnu Gawas
        </p>
      </footer>
    </div>
  );
};

export default Home;
