import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

// Helper: Generate a room id based on user IDs (sorted for consistency)
const generateRoomId = (id1, id2) => {
  if (!id1 || !id2) {
    console.error("Missing IDs for room generation:", id1, id2);
    return "default";
  }
  return [id1, id2].sort().join("_");
};

const ChatPage = () => {
  const { friendId } = useParams();
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [friendProfile, setFriendProfile] = useState(null);
  const navigate = useNavigate();

  // Fetch friend's profile to display in header.
  useEffect(() => {
    if (!friendId) return;
    const fetchFriendProfile = async () => {
      try {
        const res = await axios.get(`${CONST_LINK}/api/profile/${friendId}`, {
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

  // Fetch historical messages from the backend so that they persist after refresh.
  useEffect(() => {
    if (!user || !friendId) return;
    const room = generateRoomId(user._id, friendId);
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${CONST_LINK}/api/messages?room=${room}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        });
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Error fetching message history:", error);
      }
    };
    fetchHistory();
  }, [friendId, user]);

  // Initialize socket connection and set up event listeners.
  useEffect(() => {
    if (!user || !friendId) return;
    const room = generateRoomId(user._id, friendId);
    const newSocket = io(CONST_LINK, {
      query: { userId: user._id, friendId, room },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to chat server:", newSocket.id);
      newSocket.emit("userConnected", { userId: user._id });
    });

    newSocket.on("message", (msg) => {
      console.log("Received message:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on("messageRead", ({ messageId, reader }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "read" } : msg
        )
      );
    });

    return () => {
      newSocket.disconnect();
      console.log("Disconnected from chat server");
    };
  }, [friendId, user]);

  // Send message without optimistic update (we rely on the server's broadcast)
  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket || !user) return;
    const room = generateRoomId(user._id, friendId);
    const messagePayload = {
      room,
      sender: user._id,
      receiver: friendId,
      text: input,
      status: "sent",
    };
    socket.emit("message", messagePayload);
    setInput("");
  };

  // Mark messages as read when they are received (only for incoming messages)
  useEffect(() => {
    if (!socket || !user) return;
    const room = generateRoomId(user._id, friendId);
    messages.forEach((msg) => {
      if (msg.receiver === user._id && msg.status !== "read") {
        socket.emit("messageRead", { messageId: msg._id, room, reader: user._id });
      }
    });
  }, [messages, socket, user, friendId]);

  // Render individual message bubble with status indicators.
  const renderMessage = (msg, index) => {
    const isSelf = msg.sender === user._id || msg.sender === user.username;
    return (
      <div key={index} className={`flex mb-2 ${isSelf ? "justify-end" : "justify-start"}`}>
        <div
          className={`p-3 rounded-lg max-w-xs break-words relative ${
            isSelf ? "bg-green-600 text-white" : "bg-gray-700 text-white shadow"
          }`}
        >
          {!isSelf && <div className="text-xs font-bold mb-1">{msg.sender}</div>}
          <div className="text-sm">{msg.text}</div>
          <div className="text-xs text-gray-300 mt-1 text-right">
            {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isSelf && (
              <span className="ml-2">
                {msg.status === "read" ? (
                  <i className="fas fa-check-double text-blue-400"></i>
                ) : msg.status === "delivered" ? (
                  <i className="fas fa-check-double text-gray-400"></i>
                ) : (
                  <i className="fas fa-check text-gray-300"></i>
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
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
        </div>
        <div></div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto mb-4 bg-gray-800 rounded-lg border border-gray-700">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">No messages yet.</p>
        ) : (
          messages.map((msg, index) => renderMessage(msg, index))
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
