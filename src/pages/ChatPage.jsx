const VITE_CONST_LINK = import.meta.env.VITE_CONST_LINK;


import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";



const ChatPage = () => {
  const { friendId } = useParams();
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [friendOnline, setFriendOnline] = useState(false);
  const [friendProfile, setFriendProfile] = useState(null);
  const navigate = useNavigate();

  // Fetch friend's profile to show their name in the header
  useEffect(() => {
    const fetchFriendProfile = async () => {
      try {
        const res = await axios.get(`${VITE_CONST_LINK}/api/profile/${friendId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        });
        setFriendProfile(res.data.profile);
      } catch (error) {
        console.error("Error fetching friend's profile:", error);
      }
    };
    fetchFriendProfile();
  }, [friendId]);

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io(VITE_CONST_LINK, {
      query: { friendId },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to chat server:", newSocket.id);
      // Notify server of current user's connection
      if (user && user._id) {
        newSocket.emit("userConnected", { userId: user._id });
      }
      // Check friend's online status initially
      newSocket.emit("checkOnline", { friendId });
    });

    newSocket.on("onlineStatus", (statusData) => {
      if (statusData.friendId === friendId) {
        setFriendOnline(statusData.online);
      }
    });

    newSocket.on("message", (message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    // Periodically check online status every 10 seconds
    const intervalId = setInterval(() => {
      if (newSocket && friendId) {
        newSocket.emit("checkOnline", { friendId });
      }
    }, 10000);

    return () => {
      clearInterval(intervalId);
      newSocket.disconnect();
      console.log("Disconnected from chat server");
    };
  }, [friendId, user]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() && socket && user) {
      socket.emit("message", { text: input, to: friendId, sender: user.username });
      setInput("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-white hover:text-gray-300"
        >
          Back
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold">
            Chat with {friendProfile ? friendProfile.username : "Friend"}
          </h1>
          <span className="text-sm">
            {friendOnline ? (
              <span className="text-green-400">Online</span>
            ) : (
              <span className="text-gray-400">Offline</span>
            )}
          </span>
        </div>
        <div></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto mb-4 bg-gray-800 rounded-lg border border-gray-700">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">No messages yet.</p>
        ) : (
          messages.map((msg, index) => {
            const isSelf = msg.sender === user.username;
            return (
              <div key={index} className={`flex mb-2 ${isSelf ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg max-w-xs break-words ${
                    isSelf ? "bg-green-600 text-white" : "bg-gray-700 text-white shadow"
                  }`}
                >
                  {!isSelf && (
                    <div className="text-xs font-bold mb-1">{msg.sender}</div>
                  )}
                  <div className="text-sm">{msg.text}</div>
                  <div className="text-xs text-gray-300 mt-1 text-right">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="flex items-center p-4 bg-gray-800 border-t border-gray-700">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-white"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="px-4 py-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
