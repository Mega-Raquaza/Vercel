import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const TicTacToe = () => {
  const { roomCode } = useParams(); // from route: /game/tictactoe/room/:roomCode
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [socket, setSocket] = useState(null);
  const [playerSymbol, setPlayerSymbol] = useState(null); // Store assigned symbol

  // Initialize Socket.IO and join the game room
  useEffect(() => {
    const newSocket = io(CONST_LINK, {
      query: { roomCode, gameType: "tictactoe", userId: user ? user._id : null },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Tic Tac Toe room:", newSocket.id);
      // Request to join the game room; the server will assign a symbol.
      newSocket.emit("joinGameRoom", { roomCode });
    });

    // Receive your assigned symbol from the server
    newSocket.on("assignSymbol", (data) => {
      console.log("Assigned symbol:", data.symbol);
      setPlayerSymbol(data.symbol);
    });

    // Listen for moves from your opponent
    newSocket.on("ticTacToeMove", (data) => {
      console.log("Received move:", data);
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[data.index] = data.player;
        return newBoard;
      });
      // Update turn based on the move received
      setXIsNext(data.player !== "X");
    });

    // Listen for game reset events
    newSocket.on("resetGame", () => {
      setBoard(Array(9).fill(null));
      setWinner(null);
      setXIsNext(true);
    });

    return () => {
      newSocket.disconnect();
      console.log("Disconnected from Tic Tac Toe room");
    };
  }, [roomCode, user]);

  // Calculate if there is a winner
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  // Check for a winner whenever the board updates
  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
    }
  }, [board]);

  // Handle a cell click
  const handleClick = (index) => {
    // Do not allow moves if the cell is already occupied or if there's a winner.
    if (winner || board[index]) return;

    // If symbol assignment is still pending, do nothing.
    if (!playerSymbol) {
      console.log("Symbol not assigned yet. Please wait...");
      return;
    }

    const currentTurnSymbol = xIsNext ? "X" : "O";
    // Only allow moves if it's your turn
    if (playerSymbol !== currentTurnSymbol) {
      console.log("Not your turn!");
      return;
    }
    const newBoard = [...board];
    newBoard[index] = currentTurnSymbol;
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    if (socket) {
      socket.emit("ticTacToeMove", { index, player: currentTurnSymbol, roomCode });
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setXIsNext(true);
    if (socket) {
      socket.emit("resetGame", { roomCode });
    }
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : board.every(cell => cell !== null)
      ? "Draw"
      : `Next: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Tic Tac Toe</h1>
      <p className="mb-2 text-xl">Your symbol: {playerSymbol || "..."}</p>
      <p className="mb-4 text-xl">{statusText}</p>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button 
            key={index}
            onClick={() => handleClick(index)}
            className="w-20 h-20 border border-gray-600 bg-gray-700 text-white text-3xl font-bold flex items-center justify-center"
          >
            {cell}
          </button>
        ))}
      </div>
      <div className="mt-6 flex space-x-4">
        {(winner || board.every(cell => cell !== null)) && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Reset Game
          </button>
        )}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
