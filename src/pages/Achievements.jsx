import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AchievementCard from "../components/AchievementCard";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const Achievements = () => {
  const { user, refreshUserData } = useContext(AuthContext);
  const [catalog, setCatalog] = useState([]);
  const [unlocked, setUnlocked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [sortOption, setSortOption] = useState("rarity");



  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const [catalogRes, unlockedRes] = await Promise.all([
          axios.get(`${CONST_LINK}/api/achievements`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
          axios.get(`${CONST_LINK}/api/achievements/unlocked`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }),
        ]);
        setCatalog(catalogRes.data.achievements);
        setUnlocked(unlockedRes.data.unlockedAchievements);
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError("Error fetching achievements");
        setCatalog(defaultAchievements);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAchievements();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Create sets of achievement IDs (as strings)
  const unlockedIds = new Set(unlocked.map((ach) => ach._id.toString()));
  const claimedIds = new Set(user?.claimedAchievements?.map((id) => id.toString()) || []);
  const progressIds = new Set(user?.achievementProgress?.map((id) => id.toString()) || []);

  // Sorting logic – default by rarity (descending order)
  const rarityOrder = {
    loser: 0,
    common: 1,
    uncommon: 2,
    rare: 3,
    mythical: 4,
    legendary: 5,
  };

  const sortedCatalog = [...catalog].sort((a, b) => {
    if (sortOption === "title-asc") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "title-desc") {
      return b.title.localeCompare(a.title);
    } else if (sortOption === "rarity") {
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    } else {
      return 0;
    }
  });

  // Categorize achievements into sections:
  const completedAchievements = sortedCatalog.filter((ach) =>
    unlockedIds.has(ach._id.toString())
  );
  const ongoingAchievements = sortedCatalog.filter(
    (ach) => !unlockedIds.has(ach._id.toString()) && progressIds.has(ach._id.toString())
  );
  const lockedAchievements = sortedCatalog.filter(
    (ach) => !unlockedIds.has(ach._id.toString()) && !progressIds.has(ach._id.toString())
  );

  const handleClaim = async (achievementId) => {
    setClaiming(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `${CONST_LINK}/api/achievements/claim`,
        { achievementId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      await refreshUserData();
    } catch (err) {
      console.error("Error claiming achievement:", err);
      alert("Error claiming achievement");
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading achievements...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Please log in to view achievements.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">Achievements</h1>
      <div className="mb-6 flex justify-center">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring focus:ring-purple-500"
        >
          <option value="rarity">Sort by Rarity</option>
          <option value="title-asc">Sort by Title (A-Z)</option>
          <option value="title-desc">Sort by Title (Z-A)</option>
        </select>
      </div>

      {/* Completed Achievements Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-green-400 text-center">
          Completed Achievements
        </h2>
        {completedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {completedAchievements.map((ach) => (
              <AchievementCard
                key={ach._id}
                achievement={ach}
                isUnlocked={true}
                isClaimed={claimedIds.has(ach._id.toString())}
                onClaim={handleClaim}
                claiming={claiming}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No achievements completed yet.
          </p>
        )}
      </div>

      {/* Ongoing Achievements Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4 text-yellow-400 text-center">
          Ongoing Achievements
        </h2>
        {ongoingAchievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {ongoingAchievements.map((ach) => (
              <AchievementCard
                key={ach._id}
                achievement={ach}
                isUnlocked={false}
                isClaimed={false}
                onClaim={() => {}}
                claiming={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No ongoing achievements.
          </p>
        )}
      </div>

      {/* Locked Achievements Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4 text-red-500 text-center">
          Locked Achievements
        </h2>
        {lockedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {lockedAchievements.map((ach) => (
              <AchievementCard
                key={ach._id}
                achievement={ach}
                isUnlocked={false}
                isClaimed={false}
                isLocked={true}
                onClaim={() => {}}
                claiming={false}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No locked achievements.
          </p>
        )}
      </div>
    </div>
  );
};

export default Achievements;
