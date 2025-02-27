import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import League from "./pages/League.jsx";
import Achievements from "./pages/Achievements.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CreateQuizPage from "./pages/CreateQuizPage.jsx";
import QuizzesListPage from "./pages/QuizzesListPage.jsx";
import AnswerQuizPage from "./pages/AnswerQuizPage.jsx";
import QuizLeaderboard from "./pages/QuizLeaderboard.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import Logout from "./pages/Logout.jsx";
import QueryList from "./pages/QueryList.jsx";
import QueryDetails from "./pages/QueryDetails.jsx";
import AskQuery from "./pages/AskQuery.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import FriendListPage from "./pages/FriendListPage.jsx";
import FriendProfilePage from "./pages/FriendProfilePage.jsx";

import LoadingPage from "./components/LoadingPage.jsx";
import GameListPage from "./pages/games/GameListPage.jsx";
import GameLobbyPage from "./pages/games/GameLobbyPage.jsx";
import GameRoomPage from "./pages/games/GameRoomPage.jsx";
import TicTacToe from "./pages/games/TicTacToe.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";

function AppContent() {
  const { loading } = useContext(AuthContext);

  return (
    <>
      {/* Navbar always visible */}
      <Navbar />
      {/* Show LoadingPage if loading, else show the routes */}
      {loading ? (
        <LoadingPage />
      ) : (
        <Routes>
          <Route path="/result" element={<ResultPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/league" element={<League />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/quizzes" element={<QuizzesListPage />} />
          <Route path="/quiz/:quizId" element={<AnswerQuizPage />} />
          <Route path="/quiz/:quizId/leaderboard" element={<QuizLeaderboard />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/queries" element={<QueryList />} />
          <Route path="/query/:queryId" element={<QueryDetails />} />
          <Route path="/query/new" element={<AskQuery />} />
          <Route path="/friends/list" element={<FriendListPage />} />
          <Route path="/profile/:userId" element={<FriendProfilePage />} />
          <Route path="/chat/:friendId" element={<ChatPage />} />
          <Route path="/games" element={<GameListPage />} />
          <Route path="/game/:gameType" element={<GameLobbyPage />} />
          <Route path="/game/:gameType/room/:roomCode" element={<GameRoomPage />} />
          <Route path="/game/tictactoe/room/:roomCode" element={<TicTacToe />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
