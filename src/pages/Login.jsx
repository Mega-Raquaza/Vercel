import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${CONST_LINK}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Login successful");
        console.log("Login successful:", response.data);
        // Ensure that the login function correctly updates your AuthContext.
        // The user object should contain all required properties (e.g., _id) that Profile relies on.
        login(response.data.user, response.data.accessToken);
        // Optionally, a slight delay helps ensure the context updates before navigation.
        setTimeout(() => {
          navigate("/profile");
        }, 500);
      } else {
        setError("Login failed, please try again.");
        toast.error("Login failed, please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred, please try again.");
      toast.error("An error occurred, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg transform transition duration-300 hover:scale-105">
        <h2 className="text-2xl font-bold text-center text-white">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-white transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <div className="p-2 text-sm text-red-400 bg-red-800 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
