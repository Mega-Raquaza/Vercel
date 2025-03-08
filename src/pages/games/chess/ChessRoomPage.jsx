import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import io from 'socket.io-client';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { AuthContext } from '../../../context/AuthContext';

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const ChessRoomPage = () => {
  const { roomCode: routeRoomCode } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize playerColor from query parameters if available.
  const [roomCode, setRoomCode] = useState(routeRoomCode || "");
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState(searchParams.get('playerColor') || "");
  const [statusMessage, setStatusMessage] = useState("");
  const [socket, setSocket] = useState(null);

  // Log the game instance.
  useEffect(() => {
    console.log("Game instance:", game);
    console.log("game.isGameOver():", game.isGameOver());
  }, [game]);

  // Update status message based on game state.
  useEffect(() => {
    if (!playerColor || !game || typeof game.isGameOver !== 'function') return;
    let message = "";
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        message = game.turn() === playerColor[0]
          ? "You lost by checkmate."
          : "You won by checkmate!";
      } else if (game.isStalemate()) {
        message = "Draw by stalemate.";
      } else if (game.isInsufficientMaterial()) {
        message = "Draw by insufficient material.";
      } else {
        message = "Game over.";
      }
    } else {
      message = game.turn() === playerColor[0]
        ? "Your turn."
        : "Opponent's turn.";
    }
    console.log("Status message updated:", message);
    setStatusMessage(message);
  }, [game, playerColor]);

  // Create socket connection once.
  useEffect(() => {
    console.log("Creating socket connection...");
    const newSocket = io(CONST_LINK, {
      query: { gameType: "chess", userId: user ? user._id : null },
    });
    setSocket(newSocket);

    // Check if this is a join or create situation.
    if (routeRoomCode) {
      console.log("Joining existing room:", routeRoomCode);
      newSocket.emit("joinChessRoom", { roomCode: routeRoomCode });
      setRoomCode(routeRoomCode);
    } else {
      console.log("Creating new room...");
      newSocket.emit("createChessRoom");
    }

    // Listen for roomCreated event (for friend games).
    newSocket.on("roomCreated", (data) => {
      console.log("ROOM CREATED event received:", data);
      setRoomCode(data.roomCode);
      setPlayerColor(data.color);
    });

    // Listen for assignColor event.
    newSocket.on("assignColor", (data) => {
      console.log("ASSIGN COLOR event received:", data);
      setPlayerColor(data.color);
    });

    // Listen for botGameStarted event.
    newSocket.on("botGameStarted", (data) => {
      console.log("botGameStarted event received:", data);
      if (data && data.roomCode) {
        setRoomCode(data.roomCode);
        setPlayerColor(data.color);
        setStatusMessage(`Bot game started in room: ${data.roomCode}`);
        // Navigate to the ChessRoomPage with query parameters.
        setTimeout(() => {
          navigate(`/game/chess/room/${data.roomCode}?botGame=true&playerColor=${data.color}`);
        }, 2000);
      }
    });

    // Listen for chessMove event.
    newSocket.on("chessMove", (data) => {
      console.log("chessMove event received:", data);
      if (data && data.fen) {
        console.log("Updating board with new FEN:", data.fen);
        setGame(new Chess(data.fen));
      }
    });

    newSocket.on("startGame", (data) => {
      console.log("startGame event received:", data);
      if (data && data.roomCode) {
        setStatusMessage("Game started!");
      }
    });

    newSocket.on("errorMessage", (data) => {
      console.log("errorMessage event received:", data);
      setStatusMessage(data.message || "An error occurred.");
    });

    newSocket.on("resetGame", () => {
      console.log("resetGame event received");
      setGame(new Chess());
      setStatusMessage("Game has been reset.");
    });

    newSocket.on("playerDisconnected", (data) => {
      console.log("playerDisconnected event received:", data);
      setStatusMessage(data.message || "Opponent disconnected.");
    });

    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, [user, routeRoomCode, navigate]);

  // onDrop uses a temporary instance to validate the move.
  const onDrop = (sourceSquare, targetSquare) => {
    console.log(`onDrop called: ${sourceSquare} -> ${targetSquare}`);
    console.log("Current game instance:", game);
    console.log("Type of game.isGameOver:", typeof game.isGameOver);
    if (!game || typeof game.isGameOver !== 'function') {
      console.log("Game not ready");
      return false;
    }
    if (game.turn() !== playerColor[0]) {
      console.log("Not your turn. Game turn:", game.turn(), "Player color:", playerColor);
      return false;
    }
    const tempGame = new Chess(game.fen());
    const move = tempGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    });
    if (move === null) {
      console.log("Invalid move attempted:", sourceSquare, "to", targetSquare);
      return false;
    }
    console.log("Valid move detected:", move.san);
    if (socket) {
      console.log("Emitting move to server:", move.san);
      socket.emit("chessMove", { roomCode, move: move.san });
    } else {
      console.log("Socket not available");
    }
    return true;
  };

  // Allow dragging only if the piece belongs to your color.
  const onPieceDragStart = (piece) => {
    console.log("Attempting to drag piece:", piece);
    const allowed = piece[0] === playerColor[0].toLowerCase();
    console.log("onPieceDragStart allowed?", allowed);
    return allowed;
  };

  const handleReset = () => {
    console.log("Reset button clicked");
    if (socket) {
      socket.emit("resetChessGame", { roomCode });
    }
  };

  // (Optional) Handler to start a bot game from the UI.
  const startBotGame = () => {
    if (socket) {
      console.log("Requesting to start bot game");
      socket.emit("startBotGame");
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
          onPieceDragStart={onPieceDragStart}
          boardOrientation={playerColor || "white"}
          boardWidth={Math.min(window.innerWidth, window.innerHeight) * 0.8}
        />
      </main>
      <footer className="p-4 flex justify-center space-x-4 bg-gray-800">
        <button
          onClick={startBotGame}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition font-semibold"
        >
          Play with Bot
        </button>
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

export default ChessRoomPage;
