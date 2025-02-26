import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const FriendRequestsPage = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${CONST_LINK}/api/friends/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setRequests(res.data.friendRequests);
    } catch (error) {
      console.error(error);
      alert("Error fetching friend requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (friendId) => {
    try {
      await axios.post(
        `${CONST_LINK}/api/friends/requests/${friendId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      );
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Error accepting friend request");
    }
  };

  const handleReject = async (friendId) => {
    try {
      await axios.post(
        `${CONST_LINK}/api/friends/requests/${friendId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      );
      fetchRequests();
    } catch (error) {
      console.error(error);
      alert("Error rejecting friend request");
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <p className="p-4">Loading friend requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Friend Requests</h1>
      {requests.length === 0 ? (
        <p className="p-4 text-center text-gray-400">No pending friend requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={req.userId.profilePicture || "/default-profile.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-white">{req.userId.username}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleAccept(req.userId._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(req.userId._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequestsPage;
