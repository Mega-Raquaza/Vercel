import React, { useState } from "react";

const AchievementCard = ({
  achievement,
  isUnlocked,
  isClaimed,
  isLocked,
  onClaim,
  claiming,
}) => {
  const [hovered, setHovered] = useState(false);

  // Use rarity to determine border color and background classes
  const rarityStyles = {
    loser: "border-red-500",
    common: "border-gray-500",
    uncommon: "border-indigo-500",
    rare: "border-blue-500",
    mythical: "border-purple-500",
    legendary: "border-yellow-500",
  };
  const borderClass = rarityStyles[achievement.rarity] || "border-gray-500";

  return (
    <div
      className={`p-6 rounded-lg shadow-lg transition-all duration-300 border-4 ${borderClass} ${
        hovered ? "bg-gray-900" : "bg-gray-800"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!hovered && (
        <div className="text-center">
          {isLocked ? (
            <i className="fas fa-lock text-4xl text-gray-400 mb-2"></i>
          ) : (
            <i className={`${achievement.icon} text-4xl ${isUnlocked ? "text-orange-500" : "text-gray-400"} mb-2`}></i>
          )}
          <h2 className="text-2xl font-bold text-white mb-1">{achievement.title}</h2>
          <p className="text-sm text-gray-300">{achievement.description}</p>
          {(!isUnlocked && !isLocked) && (
            <p className="mt-2 text-yellow-400 font-semibold">In Progress</p>
          )}
          {isLocked && (
            <p className="mt-2 text-red-400 font-semibold">Locked</p>
          )}
        </div>
      )}
      {hovered && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Reward Details</h2>
          <p className="text-sm text-gray-300 mb-4">
            +{achievement.rewardMedals} Medals, +{achievement.rewardAura} Aura
          </p>
          {isUnlocked ? (
            isClaimed ? (
              <p className="text-green-400 font-semibold">Reward Claimed</p>
            ) : (
              <button
                onClick={() => onClaim(achievement._id)}
                disabled={claiming}
                className="px-4 py-1 bg-blue-600 rounded hover:bg-blue-700 transition text-sm"
              >
                {claiming ? "Claiming..." : "Claim Reward"}
              </button>
            )
          ) : (
            <p className="text-gray-300 text-sm">Keep working to unlock rewards!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AchievementCard;
