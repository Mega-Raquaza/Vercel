import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const FriendSearchPage = () => {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch users using the search endpoint.
  // If searchTerm is empty, all users will be returned.
  const fetchUsers = async (term = "") => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${CONST_LINK}/api/friends/search?username=${term}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        }
      );
      setResults(res.data.users);
    } catch (err) {
      console.error(err);
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  // On mount, load all users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Trigger search when the form is submitted
  const handleSearch = async (e) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  // Send friend request to a selected user
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
      // Optionally refresh the user list after sending a request
      fetchUsers(searchTerm);
    } catch (err) {
      console.error(err);
      alert("Error sending friend request");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Search Friends</h1>
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
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {results.map((friend) => (
          <div
            key={friend._id}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <img
                src={friend.profilePicture || "/default-profile.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-bold text-white">{friend.username}</p>
                <p className="text-sm text-gray-400">
                  {friend.userDetails
                    ? `${friend.userDetails.firstName} ${friend.userDetails.lastName}`
                    : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSendRequest(friend._id)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
            >
              Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSearchPage;
