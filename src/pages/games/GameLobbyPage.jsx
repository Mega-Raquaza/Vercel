import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const GameLobbyPage = () => {
  const { gameType } = useParams();
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(CONST_LINK, {
      query: { gameType, userId: user ? user._id : null },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to game lobby:", newSocket.id);
    });

    newSocket.on("roomCreated", (data) => {
      console.log("roomCreated event received:", data);
      if (data && data.roomCode) {
        setRoomCode(data.roomCode);
        setStatusMessage(`Room created: ${data.roomCode}. Waiting for players...`);
      } else {
        console.error("Invalid roomCreated payload", data);
      }
    });

    newSocket.on("roomJoined", (data) => {
      console.log("roomJoined event received:", data);
      if (data && data.roomCode) {
        setRoomCode(data.roomCode);
        setStatusMessage(`Joined room: ${data.roomCode}. Opponent found! Starting game...`);
        setTimeout(() => {
          console.log("Redirecting to game page with roomCode:", data.roomCode);
          navigate(`/game/${gameType}/room/${data.roomCode}`);
        }, 2000);
      } else {
        console.error("Invalid roomJoined payload", data);
      }
    });

    newSocket.on("randomMatchFound", (data) => {
      console.log("randomMatchFound event received:", data);
      if (data && data.roomCode) {
        setRoomCode(data.roomCode);
        setStatusMessage(`Random match found in room: ${data.roomCode}. Starting game...`);
        setTimeout(() => {
          console.log("Redirecting to game page with roomCode:", data.roomCode);
          navigate(`/game/${gameType}/room/${data.roomCode}`);
        }, 2000);
      } else {
        console.error("Invalid randomMatchFound payload", data);
      }
    });

    newSocket.on("errorMessage", (data) => {
      console.log("errorMessage event received:", data);
      setStatusMessage(data.message || "An error occurred");
    });

    return () => {
      newSocket.disconnect();
      console.log("Disconnected from game lobby");
    };
  }, [gameType, user, navigate]);

  const handleCreateRoom = () => {
    if (socket) {
      console.log("Emitting createRoom event for game:", gameType);
      socket.emit("createRoom", { gameType });
    }
  };

  const handleJoinRoom = () => {
    if (socket && inputCode.trim().length === 4) {
      console.log("Emitting joinRoom event with code:", inputCode);
      socket.emit("joinRoom", { roomCode: inputCode, gameType });
    } else {
      setStatusMessage("Please enter a valid 4-digit code.");
    }
  };

  const handleFindRandom = () => {
    if (socket) {
      console.log("Emitting findRandom event for game:", gameType);
      socket.emit("findRandom", { gameType });
      setStatusMessage("Searching for a random opponent...");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Lobby
      </h1>
      <div className="w-full max-w-md space-y-4 mb-6 mx-auto">
        <button
          onClick={handleCreateRoom}
          className="w-full p-3 bg-green-600 rounded hover:bg-green-500 transition font-semibold"
        >
          Create Room
        </button>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="4-digit code"
            className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={handleJoinRoom}
            className="px-4 py-3 bg-blue-600 rounded-r hover:bg-blue-500 transition font-semibold"
          >
            Join Room
          </button>
        </div>
        <button
          onClick={handleFindRandom}
          className="w-full p-3 bg-purple-600 rounded hover:bg-purple-500 transition font-semibold"
        >
          Play Random
        </button>
      </div>
      {statusMessage && (
        <div className="w-full max-w-md mx-auto mb-6 p-3 bg-gray-800 border border-gray-700 rounded">
          <p>{statusMessage}</p>
        </div>
      )}
      {roomCode && (
        <div className="w-full max-w-md mx-auto mb-6 p-3 bg-gray-800 border border-gray-700 rounded">
          <p>
            Your room code: <span className="font-bold">{roomCode}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default GameLobbyPage;
