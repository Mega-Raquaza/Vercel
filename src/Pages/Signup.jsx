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
      const res = await axios.post(`${CONST_LINK}/api/auth/signup`, {
        username,
        email,
        password,
      });
      alert("Sign up successful");
      navigate("/login"); // Redirect to login page after successful signup
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
