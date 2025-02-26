import React from "react";
import { Link } from "react-router-dom";

const games = [
  { name: "Chess", type: "chess" },
  { name: "Ludo", type: "ludo" },
  { name: "Snake & Ladders", type: "snake" },
  { name: "Checkers", type: "checkers" },
  { name: "Tic Tac Toe", type: "tictactoe" },
  { name: "Memory Card", type: "memory" },
];

const GameListPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Game Lobby</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {games.map((game) => (
          <Link
            key={game.type}
            to={`/game/${game.type}`}
            className="flex flex-col items-center p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
          >
            <h2 className="text-2xl font-bold">{game.name}</h2>
            <p className="mt-2 text-gray-400">Play Multiplayer</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GameListPage;
