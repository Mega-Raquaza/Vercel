import { createContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingPage from "../components/LoadingPage";

export const AuthContext = createContext();

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : undefined;
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      return undefined;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const source = axios.CancelToken.source();

    const refreshAccessToken = async () => {
      try {
        const res = await axios.get(`${CONST_LINK}/api/auth/refresh`, {
          withCredentials: true,
          cancelToken: source.token,
        });

        if (res.data.accessToken) {
          try {
            localStorage.setItem("accessToken", res.data.accessToken);
            localStorage.setItem("user", JSON.stringify(res.data.user));
          } catch (storageError) {
            console.error("Error saving to localStorage:", storageError);
          }
          setUser(res.data.user);
          console.log("User refreshed:", res.data.user);
        } else {
          console.error("Access token not received");
          setUser(null);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Token refresh canceled:", err.message);
        } else {
          console.error("Token refresh failed:", err);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    refreshAccessToken();

    // Cleanup: cancel the request if the component unmounts
    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, []);

  const login = (userData, accessToken) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("accessToken", accessToken);
      setUser(userData);
    } catch (error) {
      console.error("Error during login:", error);
    }
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
      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        console.error("No user data returned from /me endpoint");
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const contextValue = {
    user,
    setUser,
    login,
    logout,
    refreshUserData,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : <LoadingPage />}
    </AuthContext.Provider>
  );
};
