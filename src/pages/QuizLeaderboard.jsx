import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const QuizLeaderboard = () => {
  const { quizId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/leaderboard/${quizId}`);
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Error fetching quiz leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [quizId]);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Quiz Leaderboard</h1>
      {leaderboard.length === 0 ? (
        <p>No attempts for this quiz yet.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-orange-200">
              <th className="border px-4 py-2">Rank</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">League</th>
              <th className="border px-4 py-2">Score</th>
              <th className="border px-4 py-2">Time Taken (s)</th>
              <th className="border px-4 py-2">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry._id} className="hover:bg-orange-100">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{entry.username}</td>
                <td className="border px-4 py-2">{entry.league}</td>
                <td className="border px-4 py-2">{entry.score}</td>
                <td className="border px-4 py-2">{entry.timeTaken}</td>
                <td className="border px-4 py-2">{entry.attempts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizLeaderboard;