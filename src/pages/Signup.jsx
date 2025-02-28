import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        `${CONST_LINK}/api/auth/signup`,
        { username, email, password },
        { withCredentials: true }
      );
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Please try again.");
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
        <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2>
        {error && (
          <div className="p-2 text-sm text-red-400 bg-red-800 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-300">Username</label>
            <input
              type="text"
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-300">Password</label>
            <input
              type="password"
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
