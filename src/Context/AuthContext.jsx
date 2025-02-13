import { createContext, useState, useEffect } from "react";
import axios from "axios";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${CONST_LINK}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Auto-login on page refresh
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    setUser(storedUser); // ✅ Restore user even if token refresh fails
  }

  const refreshAccessToken = async () => {
    try {
      const res = await axios.get(`${CONST_LINK}/api/auth/refresh`, { withCredentials: true });
      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        setUser(storedUser);
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      localStorage.removeItem("accessToken");
      // ❌ Don't log out immediately; let the user stay signed in
    } finally {
      setLoading(false);
    }
  };

  refreshAccessToken();
}, []);



  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
