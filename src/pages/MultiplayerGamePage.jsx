import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const MultiplayerGamePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isMatched, setIsMatched] = useState(false);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io(CONST_LINK, {
      query: { userId: user ? user._id : null },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to chat server:", newSocket.id);
    });

    newSocket.on("roomCreated", (data) => {
      setRoomCode(data.roomCode);
      setStatusMessage(`Room created: ${data.roomCode}. Waiting for an opponent...`);
    });

    newSocket.on("roomJoined", (data) => {
      setRoomCode(data.roomCode);
      setStatusMessage(`Joined room: ${data.roomCode}. Opponent found! Starting game...`);
      setIsMatched(true);
      setTimeout(() => navigate(`/game/${data.roomCode}`), 2000);
    });

    newSocket.on("randomMatchFound", (data) => {
      setRoomCode(data.roomCode);
      setStatusMessage(`Random match found in room: ${data.roomCode}. Starting game...`);
      setIsMatched(true);
      setTimeout(() => navigate(`/game/${data.roomCode}`), 2000);
    });

    newSocket.on("errorMessage", (data) => {
      setStatusMessage(data.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, navigate]);

  const handleCreateRoom = () => {
    if (socket) {
      socket.emit("createRoom");
    }
  };

  const handleJoinRoom = () => {
    if (socket && inputCode.trim().length === 4) {
      socket.emit("joinRoom", { roomCode: inputCode });
    } else {
      setStatusMessage("Please enter a valid 4-digit code.");
    }
  };

  const handleFindRandom = () => {
    if (socket) {
      socket.emit("findRandom");
      setStatusMessage("Searching for a random opponent...");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Multiplayer Games</h1>
      <div className="w-full max-w-md space-y-4 mb-6">
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
        <div className="w-full max-w-md mb-6 p-3 bg-gray-800 border border-gray-700 rounded">
          <p>{statusMessage}</p>
        </div>
      )}
      {roomCode && (
        <div className="w-full max-w-md mb-6 p-3 bg-gray-800 border border-gray-700 rounded">
          <p>Your room code: <span className="font-bold">{roomCode}</span></p>
        </div>
      )}
    </div>
  );
};

export default MultiplayerGamePage;
