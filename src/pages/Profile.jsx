import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const Profile = () => {
  const { user, loading, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.userDetails?.firstName || "",
    lastName: user?.userDetails?.lastName || "",
    description: user?.userDetails?.description || "",
    profilePicture: user?.userDetails?.profilePicture || "",
  });
  const [profileData, setProfileData] = useState(null);
  const [queries, setQueries] = useState([]);
  const navigate = useNavigate();

  // Fetch the full profile and queries for the logged in user
  const fetchProfileData = async () => {
    try {
      const res = await axios.get(`${CONST_LINK}/api/profile/${user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setProfileData(res.data.profile);
      setQueries(res.data.queries);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchProfileData();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You are not authenticated. Please log in again.");
        return;
      }
      const response = await fetch(`${CONST_LINK}/api/users/update`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({ ...user, userDetails: data.userDetails });
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        User not logged in. Please <Link to="/login">login</Link>.
      </div>
    );
  if (!profileData)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Profile not found.
      </div>
    );

  // Calculate number of accepted friends if available in profileData
  const numFriends = profileData.friends
    ? profileData.friends.filter((f) => f.status === "accepted").length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Profile Header */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <img
            src={profileData.userDetails?.profilePicture || "/default-profile.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white">{profileData.username}</h2>
            <p className="text-gray-300">{profileData.email}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-2">
              <span className="text-lg text-gray-400 flex items-center">
                <i className="fas fa-fire text-lightBlue-400 mr-1"></i>
                {profileData.aura} Aura
              </span>
              <span className="text-lg text-gray-400 flex items-center">
                <i className="fas fa-medal text-yellow-400 mr-1"></i>
                {profileData.medals} Medals
              </span>
              <span className="text-lg text-gray-400 flex items-center">
                <i className="fas fa-user-friends text-green-400 mr-1"></i>
                {numFriends} Friends
              </span>
              <span className="text-lg text-gray-400">🏆 {profileData.league}</span>
            </div>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded hover:from-green-500 hover:to-teal-500 transition"
          >
            Edit Profile
          </button>
          <button
            onClick={() => navigate("/friends/list")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            My Friends
          </button>
          <button
            onClick={() => navigate("/queries?status=my")}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
          >
            My Queries
          </button>
        </div>
      </div>

      {/* Profile Details / Bio */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
        {isEditing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Bio"
              className="w-full mt-4 p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              placeholder="Profile Picture URL"
              className="w-full mt-4 p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleUpdate}
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded hover:from-purple-500 hover:to-blue-500 transition"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 bg-gray-600 text-gray-100 rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-300 italic border-l-4 border-purple-500 pl-4">
            {profileData.userDetails?.description ||
              "This user prefers to keep an air of mystery..."}
          </p>
        )}
      </div>

      {/* Queries Section */}
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <h2 className="text-xl font-bold mb-2">Queries by {profileData.username}</h2>
        {queries.length === 0 ? (
          <p className="text-gray-400">No queries posted yet.</p>
        ) : (
          <ul className="space-y-2">
            {queries.map((q) => (
              <li key={q._id}>
                <Link
                  to={`/query/${q._id}`}
                  className="text-blue-400 hover:underline text-sm"
                >
                  {q.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile;
