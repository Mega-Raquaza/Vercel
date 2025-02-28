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
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
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

  // Calculate only the claimed achievements and sort them by rarity
  const rarityOrder = {
    legendary: 5,
    mythical: 4,
    rare: 3,
    uncommon: 2,
    common: 1,
    loser: 0,
  };

  const sortedAchievements =
    profile.claimedAchievements && Array.isArray(profile.claimedAchievements)
      ? [...profile.claimedAchievements].sort(
          (a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]
        )
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Profile Header & Chat Entry */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={profile.userDetails?.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-purple-500"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">{profile.username}</h2>
            <p className="text-gray-300">{profile.email}</p>
            <div className="flex justify-center md:justify-start mt-4 space-x-6">
              <div className="text-center">
                <span className="font-bold text-white">{profile.aura}</span>
                <p className="text-xs text-gray-400">Aura</p>
              </div>
              <div className="text-center">
                <span className="font-bold text-white">{profile.medals}</span>
                <p className="text-xs text-gray-400">Medals</p>
              </div>
              <div className="text-center">
                <span className="font-bold text-white">{numFriends}</span>
                <p className="text-xs text-gray-400">Friends</p>
              </div>
              <div className="text-center">
                <span className="font-bold text-white">{profile.league}</span>
                <p className="text-xs text-gray-400">League</p>
              </div>
            </div>
            <div className="mt-4">
              {/* Chat Button: Ensure that the ChatPage route uses friendId */}
              <button
                onClick={() => navigate(`/chat/${userId}`)}
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
              >
                Chat
              </button>
            </div>
          </div>
        </div>
        {/* Divider & Bio */}
        {profile.userDetails && (
          <div className="mt-8 border-t border-gray-700 pt-6 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white">
              {profile.userDetails.firstName} {profile.userDetails.lastName}
            </h3>
            <p className="mt-2 text-base text-gray-300">
              {profile.userDetails.description}
            </p>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      {sortedAchievements.length > 0 && (
        <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 mb-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">
            Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {sortedAchievements.map((achievement, index) => (
              <div
                key={index}
                className="p-6 bg-gray-700 rounded-xl border-2 border-gray-600 shadow-md hover:shadow-2xl transition-transform transform hover:scale-105"
              >
                <div className="flex justify-center mb-4">
                  <i
                    className={`${achievement.icon} text-5xl ${
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
                <h3 className="text-xl font-semibold text-center text-white mb-2">
                  {achievement.title}
                </h3>
                <p className="text-center text-sm text-gray-300">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Queries Section */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Queries by {profile.username}
        </h2>
        {queries.length === 0 ? (
          <p className="text-center text-gray-400">No queries posted yet.</p>
        ) : (
          <div className="space-y-4">
            {queries.map((q) => (
              <Link
                key={q._id}
                to={`/query/${q._id}`}
                className="block p-4 bg-gray-700 rounded-lg border border-gray-600 hover:bg-gray-600 transition-colors"
              >
                <h3 className="text-lg font-semibold text-blue-300">
                  {q.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendProfilePage;
