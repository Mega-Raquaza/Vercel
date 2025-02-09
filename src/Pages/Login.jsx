import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "https://render-5az4.onrender.com/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      // Assuming the response includes a success flag or token
      if (response.status === 200) {
        // Handle successful login, e.g., redirect to dashboard
        alert("Successful");
        console.log("Login successful:", response.data);
        navigate("/home");
      } else {
        setError("Login failed, please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred, please try again.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
