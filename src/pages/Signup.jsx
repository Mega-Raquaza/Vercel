import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${CONST_LINK}/api/auth/signup`,
        { username, email, password },
        { withCredentials: true } // Ensures cookies are sent
      );
      alert("Sign up successful");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Username</label>
            <input
              type="text"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Email</label>
            <input
              type="email"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Password</label>
            <input
              type="password"
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
