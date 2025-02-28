import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const FriendListPage = () => {
  const { user } = useContext(AuthContext);
  
  // Tab state: "friends", "requests", or "search"
  const [activeTab, setActiveTab] = useState("friends");

  // States for "My Friends" section
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);

  // States for "Friend Requests" section
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // States for "Search Friends" section
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState("");

  // New state: Pending friend requests sent by current user
  const [pendingSent, setPendingSent] = useState([]);
  const [loadingPendingSent, setLoadingPendingSent] = useState(true);

  // Fetch accepted friends
  const fetchFriends = async () => {
    setLoadingFriends(true);
    try {
      const res = await axios.get(`${CONST_LINK}/api/friends/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setFriends(res.data.acceptedFriends);
    } catch (error) {
      console.error("Error fetching friend list:", error);
      alert("Error fetching friend list");
    } finally {
      setLoadingFriends(false);
    }
  };

  // Fetch friend requests (received)
  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const res = await axios.get(`${CONST_LINK}/api/friends/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setRequests(res.data.friendRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      alert("Error fetching friend requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch pending friend requests sent by current user
  const fetchPendingSent = async () => {
    setLoadingPendingSent(true);
    try {
      const res = await axios.get(`${CONST_LINK}/api/friends/requests/sent`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      // Assuming res.data.pendingRequests is an array of user IDs.
      setPendingSent(res.data.pendingRequests);
    } catch (error) {
      console.error("Error fetching sent friend requests:", error);
    } finally {
      setLoadingPendingSent(false);
    }
  };

  // Fetch search results (if searchTerm is empty, it returns all users)
  const fetchSearchResults = async (term = "") => {
    setLoadingSearch(true);
    setErrorSearch("");
    try {
      const res = await axios.get(`${CONST_LINK}/api/friends/search?username=${term}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setResults(res.data.users);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setErrorSearch("Error fetching users");
    } finally {
      setLoadingSearch(false);
    }
  };

  // Load all data on mount
  useEffect(() => {
    fetchFriends();
    fetchRequests();
    fetchSearchResults();
    fetchPendingSent();
  }, []);

  // Helper: Check if a user is already a friend
  const isFriend = (userId) => {
    return friends.some((f) => f.userId._id === userId);
  };

  // Helper: Check if a pending request has been sent to this user
  const isPending = (userId) => {
    return pendingSent.includes(userId);
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
      fetchSearchResults(searchTerm); // refresh search results to update statuses if needed
      fetchPendingSent(); // update the list of pending sent requests
    } catch (err) {
      console.error("Error sending friend request:", err);
      alert("Error sending friend request");
    }
  };

  // Accept a friend request
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
      fetchFriends(); // update friends list after accepting
      fetchPendingSent(); // update pending if needed
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Error accepting friend request");
    }
  };

  // Reject a friend request
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
      console.error("Error rejecting friend request:", error);
      alert("Error rejecting friend request");
    }
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    fetchSearchResults(searchTerm);
  };

  // Render the tab buttons
  const renderTabs = () => {
    return (
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "friends" ? "bg-orange-500" : "bg-gray-700"
          } text-white`}
          onClick={() => setActiveTab("friends")}
        >
          My Friends
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "requests" ? "bg-orange-500" : "bg-gray-700"
          } text-white`}
          onClick={() => setActiveTab("requests")}
        >
          Friend Requests
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "search" ? "bg-orange-500" : "bg-gray-700"
          } text-white`}
          onClick={() => setActiveTab("search")}
        >
          Search Friends
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Friends</h1>
      {renderTabs()}

      {/* My Friends Tab */}
      {activeTab === "friends" && (
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
            My Friends
          </h2>
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
                        "https://i.pinimg.com/originals/a8/da/22/a8da222be70a71e7858bf752065d5cc3.jpg"
                      }
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div>
                      <p className="font-bold text-white">
                        {friend.userId.username}
                      </p>
                      <p className="text-sm text-gray-300">
                        Aura:{" "}
                        {friend.userId.aura}
                        | Medals:{"sfds "}
                        {friend.userId.medals}
                      </p>
                      <p className="text-sm text-gray-300">
                        League:{" "}
                        {friend.userId.league}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      to={`/profile/${friend.userId._id}`}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/chat/${friend.userId._id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition text-sm"
                    >
                      Chat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Friend Requests Tab */}
      {activeTab === "requests" && (
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
            Friend Requests
          </h2>
          {loadingRequests ? (
            <p className="text-center">Loading friend requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-center text-gray-400">
              No pending friend requests.
            </p>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        req.userId.profilePicture || "https://i.pinimg.com/originals/a8/da/22/a8da222be70a71e7858bf752065d5cc3.jpg"
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">
                        {req.userId.username}
                      </p>
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
        </section>
      )}

      {/* Search Friends Tab */}
      {activeTab === "search" && (
        <section>
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
            Search Friends
          </h2>
          <form onSubmit={handleSearch} className="flex mb-4">
            <input
              type="text"
              placeholder="Enter username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-l focus:ring focus:ring-purple-500"
            />
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-r hover:bg-blue-500 transition"
            >
              Search
            </button>
          </form>
          {loadingSearch && <p>Loading...</p>}
          {errorSearch && <p className="text-red-500">{errorSearch}</p>}
          {results.length === 0 ? (
            <p className="text-center">No users found.</p>
          ) : (
            <div className="space-y-4">
              {results
                .filter((usr) => usr._id !== user._id)
                .map((usr) => (
                  <div
                    key={usr._id}
                    className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          usr.userDetails?.profilePicture ||
                          "https://i.pinimg.com/originals/a8/da/22/a8da222be70a71e7858bf752065d5cc3.jpg"
                        }
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-bold text-white">
                          {usr.username}
                        </p>
                        <p className="text-sm text-gray-400">
                          {usr.userDetails
                            ? `${usr.userDetails.firstName} ${usr.userDetails.lastName}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isFriend(usr._id) ? (
                        <span className="px-4 py-2 bg-gray-600 text-white rounded text-sm">
                          Friend
                        </span>
                      ) : isPending(usr._id) ? (
                        <span className="px-4 py-2 bg-yellow-600 text-white rounded text-sm">
                          Pending
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendRequest(usr._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition text-sm"
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
      )}
    </div>
  );
};

export default FriendListPage;
