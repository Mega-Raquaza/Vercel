import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Chessboard } from 'react-chessboard';
import {Chess} from 'chess.js';
import { AuthContext } from '../../../context/AuthContext';

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const ChessGamePage = () => {
  const { roomCode: routeRoomCode } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Use local state for roomCode so that it can be set when a room is created.
  const [roomCode, setRoomCode] = useState(routeRoomCode || "");
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // Update status message based on game state and turn
  useEffect(() => {
    if (!playerColor) return;

    let message = "";
    if (game.game_over()) {
      if (game.in_checkmate()) {
        message = game.turn() === playerColor[0]
          ? "You lost by checkmate."
          : "You won by checkmate!";
      } else if (game.in_stalemate()) {
        message = "Draw by stalemate.";
      } else if (game.insufficient_material()) {
        message = "Draw by insufficient material.";
      } else {
        message = "Game over.";
      }
    } else {
      message = game.turn() === playerColor[0]
        ? "Your turn."
        : "Opponent's turn.";
    }
    setStatusMessage(message);
  }, [game, playerColor]);

  useEffect(() => {
    const newSocket = io(CONST_LINK, {
      query: { gameType: "chess", userId: user ? user._id : null },
    });
    setSocket(newSocket);

    // If a roomCode is already provided (joiner), emit join.
    // Otherwise, create a new room.
    if (roomCode) {
      newSocket.emit("joinChessRoom", { roomCode });
    } else {
      newSocket.emit("createChessRoom");
    }

    // Listen for roomCreated event (for room creators)
    newSocket.on("roomCreated", (data) => {
      console.log("Room created:", data.roomCode, "Assigned color:", data.color);
      setRoomCode(data.roomCode);
      setPlayerColor(data.color);
    });

    // Listen for color assignment (for joiners)
    newSocket.on("assignColor", (data) => {
      console.log("Assigned color:", data.color);
      setPlayerColor(data.color);
    });

    // Listen for chess moves and updated FEN from the server
    newSocket.on("chessMove", (data) => {
      if (data && data.fen) {
        console.log("Received updated FEN:", data.fen);
        setGame(new Chess(data.fen));
      }
    });

    newSocket.on("startGame", (data) => {
      if (data && data.roomCode) {
        setStatusMessage("Game started!");
      }
    });

    newSocket.on("errorMessage", (data) => {
      setStatusMessage(data.message || "An error occurred.");
    });

    newSocket.on("resetGame", (data) => {
      setGame(new Chess());
      setStatusMessage("Game has been reset.");
    });

    newSocket.on("playerDisconnected", (data) => {
      setStatusMessage(data.message || "Opponent disconnected.");
    });

    return () => {
      newSocket.disconnect();
      console.log("Disconnected from chess game room");
    };
  }, [roomCode, user]);

  const onDrop = (sourceSquare, targetSquare) => {
    if (game.turn() !== playerColor[0]) {
      console.log("Not your turn");
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });

    if (move === null) return false;

    if (socket) {
      socket.emit("chessMove", { roomCode, move: move.san });
    }
    return true;
  };

  const handleReset = () => {
    if (socket) {
      socket.emit("resetChessGame", { roomCode });
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col">
      <header className="flex flex-col items-center justify-center p-4 bg-gray-800 shadow-md">
        <h1 className="text-3xl font-bold mb-2">Chess Game</h1>
        <p className="text-lg">
          Room Code: <span className="font-semibold">{roomCode}</span>
        </p>
        {playerColor && (
          <p className="text-lg">
            You are playing as <span className="font-semibold">{playerColor}</span>
          </p>
        )}
        <p className="mt-2 text-md">{statusMessage}</p>
      </header>

      <main className="h-full w-full flex-grow flex items-center justify-center">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={playerColor || "white"}
          boardWidth={Math.min(window.innerWidth, window.innerHeight) * 0.8}
        />
      </main>

      <footer className="p-4 flex justify-center space-x-4 bg-gray-800">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition font-semibold"
        >
          Reset Game
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition font-semibold"
        >
          Back
        </button>
      </footer>
    </div>
  );
};

export default ChessGamePage;
