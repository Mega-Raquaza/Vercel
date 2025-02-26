import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
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

  // Initialize Socket.IO and join the game room
  useEffect(() => {
    const newSocket = io(CONST_LINK, {
      query: { roomCode, gameType: "tictactoe", userId: user ? user._id : null },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to Tic Tac Toe room:", newSocket.id);
      // Join the room explicitly
      newSocket.emit("joinGameRoom", { roomCode });
    });

    // Listen for moves from opponent
    newSocket.on("ticTacToeMove", (data) => {
      console.log("Received move:", data);
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[data.index] = data.player;
        return newBoard;
      });
      setXIsNext(data.player !== "X");
    });

    // Listen for reset events
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

  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
    }
  }, [board]);

  const handleClick = (index) => {
    if (winner || board[index]) return;
    const currentPlayer = xIsNext ? "X" : "O";
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    if (socket) {
      socket.emit("ticTacToeMove", { index, player: currentPlayer, roomCode });
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

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Tic Tac Toe</h1>
      <p className="mb-4 text-xl">
        {winner ? `Winner: ${winner}` : `Next: ${xIsNext ? "X" : "O"}`}
      </p>
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
