import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const FriendProfilePage = () => {
  const { userId } = useParams();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${CONST_LINK}/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setProfile(res.data.profile);
      setQueries(res.data.queries);
    } catch (err) {
      console.error(err);
      setError("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Profile not found.
      </div>
    );

  // Calculate number of accepted friends if available in profile
  const numFriends = profile.friends
    ? profile.friends.filter((f) => f.status === "accepted").length
    : 0;

  // Sort achievements by rarity (rarest first)
  const rarityOrder = {
    legendary: 5,
    mythical: 4,
    rare: 3,
    uncommon: 2,
    common: 1,
    loser: 0,
  };

  const sortedAchievements = profile.achievements
    ? [...profile.achievements].sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Profile Header */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <img
            src={profile.userDetails?.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">{profile.username}</h2>
            <p className="text-gray-300">{profile.email}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-2">
              <span className="text-lg text-gray-400 flex items-center">
                <i className="fas fa-fire text-lightBlue-400 mr-1"></i>
                {profile.aura} Aura
              </span>
              <span className="text-lg text-gray-400 flex items-center">
                <i className="fas fa-medal text-yellow-400 mr-1"></i>
                {profile.medals} Medals
              </span>
              <span className="text-lg text-gray-400 flex items-center">
                <i className="fas fa-user-friends text-green-400 mr-1"></i>
                {numFriends} Friends
              </span>
              <span className="text-lg text-gray-400">🏆 {profile.league}</span>
            </div>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <button
            onClick={() => navigate(`/chat/${userId}`)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            Chat
          </button>
        </div>
      </div>

      {/* User Details */}
      {profile.userDetails && (
        <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8 text-center">
          <p className="font-semibold text-xl">
            {profile.userDetails.firstName} {profile.userDetails.lastName}
          </p>
          <p className="mt-2 text-sm text-gray-400">{profile.userDetails.description}</p>
        </div>
      )}

      {/* Achievements Section */}
      {profile.achievements && profile.achievements.length > 0 && (
        <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sortedAchievements.map((achievement, index) => (
              <div
                key={index}
                className="p-4 bg-gray-700 rounded-lg border-2 border-gray-600 shadow hover:shadow-xl transition transform hover:scale-105"
              >
                <div className="text-center mb-2">
                  <i
                    className={`${achievement.icon} text-3xl ${
                      achievement.rarity === "legendary"
                        ? "text-yellow-500"
                        : achievement.rarity === "mythical"
                        ? "text-purple-500"
                        : achievement.rarity === "rare"
                        ? "text-blue-500"
                        : achievement.rarity === "uncommon"
                        ? "text-indigo-500"
                        : achievement.rarity === "common"
                        ? "text-gray-300"
                        : "text-red-500"
                    }`}
                  ></i>
                </div>
                <h3 className="text-lg font-bold text-center text-white">
                  {achievement.title}
                </h3>
                <p className="text-center text-sm text-gray-400">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries Section */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-xl font-bold mb-2">Queries by {profile.username}</h2>
        {queries.length === 0 ? (
          <p className="text-gray-400">No queries posted yet.</p>
        ) : (
          <ul className="space-y-2">
            {queries.map((q) => (
              <li key={q._id}>
                <Link
                  to={`/query/${q._id}`}
                  className="text-blue-400 hover:underline text-sm"
                >
                  {q.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendProfilePage;
