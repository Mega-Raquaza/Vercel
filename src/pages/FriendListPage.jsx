import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const FriendListPage = () => {
  const { user } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch accepted friends
  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${CONST_LINK}/api/friends/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setFriends(res.data.acceptedFriends);
    } catch (error) {
      console.error(error);
      alert("Error fetching friend list");
    } finally {
      setLoadingFriends(false);
    }
  };

  // Fetch all available users (excluding current user)
  const fetchAllUsers = async () => {
    try {
      // Using an empty search term to return all users; backend should filter out current user.
      const res = await axios.get(`${CONST_LINK}/api/friends/search?username=`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setAllUsers(res.data.users);
    } catch (error) {
      console.error(error);
      alert("Error fetching users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchAllUsers();
  }, []);

  // Helper: Check if a user is already a friend
  const isFriend = (userId) => {
    return friends.some((f) => f.userId._id === userId);
  };

  // Send friend request
  const handleSendRequest = async (friendId) => {
    try {
      await axios.post(
        `${CONST_LINK}/api/friends/request`,
        { friendId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      );
      alert("Friend request sent!");
      // Refresh the user list to update statuses if needed.
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      alert("Error sending friend request");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Friends</h1>

      {/* My Friends Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">My Friends</h2>
        {loadingFriends ? (
          <p className="text-center">Loading friends...</p>
        ) : friends.length === 0 ? (
          <p className="text-center">You have no friends yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      friend.userId.userDetails?.profilePicture ||
                      "/default-profile.png"
                    }
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                  />
                  <div>
                    <p className="font-bold text-white">{friend.userId.username}</p>
                    <p className="text-sm text-gray-300">
                      Aura: {friend.userId.aura} | Medals: {friend.userId.medals}
                    </p>
                    <p className="text-sm text-gray-300">League: {friend.userId.league}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link
                    to={`/profile/${friend.userId._id}`}
                    className="text-blue-400 hover:underline text-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All Available Users Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">All Available Users</h2>
        {loadingUsers ? (
          <p className="text-center">Loading users...</p>
        ) : allUsers.length === 0 ? (
          <p className="text-center">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {allUsers
              .filter((usr) => usr._id !== user._id) // Exclude current user
              .map((usr) => (
                <div
                  key={usr._id}
                  className="p-4 bg-gray-800 rounded-xl border border-gray-700 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        usr.userDetails?.profilePicture || "/default-profile.png"
                      }
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div>
                      <p className="font-bold text-white">{usr.username}</p>
                      <p className="text-sm text-gray-300">
                        Aura: {usr.aura} | Medals: {usr.medals}
                      </p>
                      <p className="text-sm text-gray-300">League: {usr.league}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to={`/profile/${usr._id}`}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      View Profile
                    </Link>
                    {!isFriend(usr._id) && (
                      <button
                        onClick={() => handleSendRequest(usr._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition text-sm"
                      >
                        Add Friend
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default FriendListPage;
