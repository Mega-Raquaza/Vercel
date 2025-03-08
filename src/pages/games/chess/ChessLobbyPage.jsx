import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext"; // adjust path as needed

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const ChessLobbyPage = () => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [botDifficulty, setBotDifficulty] = useState("easy"); // default difficulty
  // Added missing state for playerColor
  const [playerColor, setPlayerColor] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Creating socket connection for lobby...");
    const newSocket = io(CONST_LINK, {
      query: { gameType: "chess", userId: user ? user._id : null },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to chess lobby:", newSocket.id);
    });

    newSocket.on("roomCreated", (data) => {
      console.log("roomCreated event received:", data);
      if (data && data.roomCode) {
        setRoomCode(data.roomCode);
        setStatusMessage(`Room created: ${data.roomCode}. Waiting for opponent...`);
      }
    });

    newSocket.on("roomJoined", (data) => {
      console.log("roomJoined event received:", data);
      if (data && data.roomCode) {
        setRoomCode(data.roomCode);
        setStatusMessage(`Joined room: ${data.roomCode}. Waiting for game to start...`);
      }
    });

    newSocket.on("randomMatchFound", (data) => {
      console.log("randomMatchFound event received:", data);
      if (data && data.roomCode) {
        setRoomCode(data.roomCode);
        setStatusMessage(`Random match found: ${data.roomCode}. Game will start soon...`);
        setTimeout(() => {
          navigate(`/game/chess/room/${data.roomCode}?botGame=false`);
        }, 2000);
      }
    });

    newSocket.on("botGameStarted", (data) => {
      console.log("botGameStarted event received:", data);
      if (data && data.roomCode) {
        setRoomCode(data.roomCode);
        setPlayerColor(data.color); // Update the local state (if you want to show it in the lobby)
        setStatusMessage(`Bot game started in room: ${data.roomCode}`);
        // Navigate to the ChessRoomPage with query parameters.
        setTimeout(() => {
          navigate(`/game/chess/room/${data.roomCode}?botGame=true&playerColor=${data.color}`);
        }, 2000);
      }
    });
    

    newSocket.on("startGame", (data) => {
      console.log("startGame event received:", data);
      if (data && data.roomCode) {
        setStatusMessage(`Game starting in room: ${data.roomCode}`);
        setTimeout(() => {
          navigate(`/game/chess/room/${data.roomCode}?botGame=false`);
        }, 2000);
      }
    });

    newSocket.on("errorMessage", (data) => {
      console.error("errorMessage event received:", data);
      setStatusMessage(data.message || "An error occurred.");
    });

    return () => {
      newSocket.disconnect();
      console.log("Disconnected from chess lobby");
    };
  }, [user, navigate]);

  const handleCreateRoom = () => {
    if (socket) {
      console.log("Creating chess room (for friend play)");
      socket.emit("createChessRoom");
    }
  };

  const handleJoinRoom = () => {
    if (socket && inputCode.trim().length === 4) {
      console.log("Joining chess room with code:", inputCode);
      socket.emit("joinChessRoom", { roomCode: inputCode });
    } else {
      setStatusMessage("Please enter a valid 4-digit room code.");
    }
  };

  const handleFindRandom = () => {
    if (socket) {
      console.log("Finding a random chess match");
      socket.emit("findRandomChessMatch");
      setStatusMessage("Searching for a random opponent...");
    }
  };

  const handlePlayWithBot = () => {
    if (socket) {
      console.log("Starting a chess game with bot at difficulty:", botDifficulty);
      // Do not set any manual room code here.
      socket.emit("startBotGame", { difficulty: botDifficulty });
      setStatusMessage("Starting game with bot...");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Chess Lobby</h1>
      <div className="space-y-4 max-w-md mx-auto">
        <button
          onClick={handleFindRandom}
          className="w-full p-3 bg-purple-600 rounded hover:bg-purple-500 transition font-semibold"
        >
          Play Random
        </button>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="4-digit room code"
            className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-l focus:outline-none"
          />
          <button
            onClick={handleJoinRoom}
            className="px-4 py-3 bg-blue-600 rounded-r hover:bg-blue-500 transition font-semibold"
          >
            Join Room
          </button>
        </div>
        <button
          onClick={handleCreateRoom}
          className="w-full p-3 bg-green-600 rounded hover:bg-green-500 transition font-semibold"
        >
          Create Room (Play with Friend)
        </button>
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Bot Difficulty:</label>
          <select
            value={botDifficulty}
            onChange={(e) => setBotDifficulty(e.target.value)}
            className="p-2 bg-gray-700 rounded"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            onClick={handlePlayWithBot}
            className="w-full p-3 bg-yellow-600 rounded hover:bg-yellow-500 transition font-semibold"
          >
            Play with Bot
          </button>
        </div>
      </div>
      {statusMessage && (
        <div className="mt-6 max-w-md mx-auto p-3 bg-gray-800 border border-gray-700 rounded">
          <p>{statusMessage}</p>
        </div>
      )}
      {roomCode && (
        <div className="mt-4 max-w-md mx-auto p-3 bg-gray-800 border border-gray-700 rounded">
          <p>
            Room Code: <span className="font-bold">{roomCode}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ChessLobbyPage;
