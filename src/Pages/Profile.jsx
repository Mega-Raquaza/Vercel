import { useContext, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>; // ✅ Prevents crash while loading

  if (!user) return <p>User not logged in. Please <a href="/login">login</a>.</p>; // ✅ Prevents crash

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">Welcome, {user.name}!</h2>
        <p className="text-lg text-center text-gray-700">Email: {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
