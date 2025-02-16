import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.userDetails?.firstName || "",
    lastName: user?.userDetails?.lastName || "",
    birthdate: user?.userDetails?.birthdate || "",
    description: user?.userDetails?.description || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Get the JWT token
      if (!token) {
        alert("You are not authenticated. Please log in again.");
        return;
      }
  
      const response = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        credentials: "include", // Ensure cookies are sent
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Include the JWT token
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
  

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not logged in. Please <a href="/login">login</a>.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">Welcome, {user.username}!</h2>
        <p className="text-lg text-center text-gray-700">Email: {user.email}</p>
        <p className="text-lg text-center text-gray-700">Role: {user.role}</p>
        <p className="text-lg text-center text-gray-700">Score: {user.score}</p>
        <p className="text-lg text-center text-gray-700">Medals: {user.medals}</p>
        
        {/* Profile Picture */}
        {user.userDetails?.profilePicture && (
          <div className="flex justify-center">
            <img src={user.userDetails.profilePicture} alt="Profile" className="w-24 h-24 rounded-full" />
          </div>
        )}

        {/* Editable Fields */}
        {isEditing ? (
          <>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded" />
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded" />
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className="w-full p-2 border rounded" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded"></textarea>
            <button onClick={handleUpdate} className="w-full p-2 text-white bg-blue-500 rounded">Save</button>
            <button onClick={() => setIsEditing(false)} className="w-full p-2 mt-2 text-white bg-gray-500 rounded">Cancel</button>
          </>
        ) : (
          <>
            <p><strong>First Name:</strong> {user.userDetails?.firstName || "N/A"}</p>
            <p><strong>Last Name:</strong> {user.userDetails?.lastName || "N/A"}</p>
            <p><strong>Birthdate:</strong> {user.userDetails?.birthdate ? new Date(user.userDetails.birthdate).toLocaleDateString() : "N/A"}</p>
            <p><strong>Description:</strong> {user.userDetails?.description || "N/A"}</p>
            <button onClick={() => setIsEditing(true)} className="w-full p-2 text-white bg-green-500 rounded">Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
