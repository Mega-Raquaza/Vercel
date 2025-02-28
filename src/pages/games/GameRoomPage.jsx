import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const GameRoomPage = () => {
  const { gameType, roomCode } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Room
      </h1>
      {roomCode && <p className="text-xl mb-6">Room Code: {roomCode}</p>}
      <p className="text-xl mb-6">
        Game coming soon! We're working hard to bring you an exciting multiplayer experience.
      </p>
      <button
        onClick={() => navigate("/games")}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
      >
        Back to Games
      </button>
    </div>
  );
};

export default GameRoomPage;
