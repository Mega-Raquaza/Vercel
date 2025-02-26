import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined distinguishes loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const res = await axios.get(`${CONST_LINK}/api/auth/refresh`, {
          withCredentials: true,
        });

        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setUser(res.data.user);
          console.log("User refreshed:", res.data.user);
        } else {
          console.error("Access token not received");
          setUser(null);
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    refreshAccessToken();
  }, []);

  const login = (userData, accessToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
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

  // Function to refresh user data from the backend
  const refreshUserData = async () => {
    try {
      const res = await axios.get(`${CONST_LINK}/api/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUserData, loading }}>
      {!loading ? children : <p>Loading...</p>}
    </AuthContext.Provider>
  );
};
