// src/pages/League.jsx
import React, { useContext, useState, useEffect, Component } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

// Manual requirements for each league tier (all keys in lowercase)
const manualRequirements = {
  bronze: { requiredAura: 1000, costMedals: 10 },
  silver: { requiredAura: 2500, costMedals: 25 },
  gold: { requiredAura: 5000, costMedals: 50 },
  diamond: { requiredAura: 10000, costMedals: 100 },
};

// Helper to determine the next league based on the current league
const getNextLeague = (currentLeague) => {
  if (!currentLeague || currentLeague.toLowerCase() === "none") {
    return "bronze";
  }
  const tiers = ["bronze", "silver", "gold", "diamond"];
  const index = tiers.indexOf(currentLeague.toLowerCase());
  return index === -1 || index === tiers.length - 1 ? null : tiers[index + 1];
};

// Display order for league groups (highest first)
const displayOrder = ["master", "diamond", "gold", "silver", "bronze", "none"];

// Error Boundary Component to catch runtime errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Something went wrong.</h1>
          <p className="mb-4">{this.state.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const League = () => {
  const { user, setUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [loadingAdvance, setLoadingAdvance] = useState(false);
  const [leagueList, setLeagueList] = useState({});
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  // If user is not authenticated, display a fallback UI
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">User not authenticated</h2>
        <p className="mb-4">Please log in to access the League Dashboard.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Ensure the current league is lowercase for consistency
  const currentLeague = (user.league || "none").toLowerCase();
  const nextLeague = getNextLeague(currentLeague);

  // Check if the user meets the requirements to advance manually
  const eligibleForAdvance = () => {
    if (!nextLeague || !manualRequirements[nextLeague]) return false;
    const req = manualRequirements[nextLeague];
    return user.aura >= req.requiredAura && user.medals >= req.costMedals;
  };

  // Handler for manual enrollment/promotion
  const handleAdvance = async () => {
    if (!eligibleForAdvance()) {
      setMessage("You do not meet the requirements to advance.");
      return;
    }
    setLoadingAdvance(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMessage("Authentication error. Please log in again.");
        return;
      }
      const endpoint =
        currentLeague === "none" ? "/api/users/enrollLeague" : "/api/users/promoteLeague";
      const res = await axios.put(
        `${CONST_LINK}${endpoint}`,
        { league: nextLeague },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setMessage(res.data.message);
      setUser(res.data.user);
    } catch (error) {
      console.error("Error advancing league:", error);
      setMessage(
        error.response?.data?.message || "Error processing league action. Please try again."
      );
    } finally {
      setLoadingAdvance(false);
    }
  };

  // Fetch the league rankings list with error handling
  const fetchLeagueList = async () => {
    setLoadingList(true);
    setListError("");
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setListError("Authentication error. Please log in again.");
        return;
      }
      const res = await axios.get(`${CONST_LINK}/api/leagues/list`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setLeagueList(res.data.rankings);
    } catch (error) {
      console.error("Error fetching league list:", error);
      setListError("Error fetching league list");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchLeagueList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to capitalize a string for display
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="max-w-5xl mx-auto p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">League Dashboard</h1>

      {/* User Stats Section */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">Your Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xl">Aura</p>
            <p className="font-semibold text-2xl">{user.aura}</p>
          </div>
          <div className="text-center">
            <p className="text-xl">Medals</p>
            <p className="font-semibold text-2xl">{user.medals}</p>
          </div>
          <div className="text-center">
            <p className="text-xl">League</p>
            <p className="font-semibold text-2xl">{capitalize(currentLeague)}</p>
          </div>
        </div>
      </div>

      {/* Manual Enrollment/Promotion Section */}
      {nextLeague ? (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Advance to {capitalize(nextLeague)} League</h2>
          {manualRequirements[nextLeague] && (
            <p className="mb-4">
              Requires Aura:{" "}
              <span className="font-semibold">{manualRequirements[nextLeague].requiredAura}</span>{" "}
              and Cost:{" "}
              <span className="font-semibold">{manualRequirements[nextLeague].costMedals}</span> Medals.
            </p>
          )}
          <button
            onClick={handleAdvance}
            disabled={!eligibleForAdvance() || loadingAdvance}
            className={`px-6 py-2 rounded-lg transition ${
              eligibleForAdvance()
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {loadingAdvance ? "Processing..." : "Advance to Next League"}
          </button>
        </div>
      ) : (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 text-center">
          <p className="text-lg font-bold">You are at the highest league!</p>
        </div>
      )}

      {message && (
        <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700 text-center">
          <p>{message}</p>
        </div>
      )}

      {/* League Rankings Section */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">League Rankings</h2>
        {loadingList ? (
          <p className="text-center">Loading league list...</p>
        ) : listError ? (
          <p className="text-center text-red-500">{listError}</p>
        ) : (
          displayOrder.map((leagueKey) => (
            <div key={leagueKey} className="mb-6">
              <h3 className="text-xl font-bold mb-2">{capitalize(leagueKey)} League</h3>
              {leagueList[leagueKey] && leagueList[leagueKey].length > 0 ? (
                leagueList[leagueKey].map((player, index) => (
                  <div key={player._id} className="flex items-center p-4 bg-gray-700 rounded-lg mb-2">
                    <div className="w-10 h-10 flex-shrink-0 mr-4">
                      <img
                        src={player.profilePicture || "/default-profile.png"}
                        alt={player.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{player.username}</p>
                      <p className="text-sm text-gray-300">
                        Aura: {player.aura} | Medals: {player.medals}
                      </p>
                    </div>
                    <div className="text-lg font-bold">#{index + 1}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No players in this league.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Wrap League with the ErrorBoundary for extra safety
const LeagueWithErrorBoundary = () => (
  <ErrorBoundary>
    <League />
  </ErrorBoundary>
);

export default LeagueWithErrorBoundary;
