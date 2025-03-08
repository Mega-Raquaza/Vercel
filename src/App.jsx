// App.jsx
import React, { useContext, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./components/Navbar.jsx";
import LoadingPage from "./components/LoadingPage.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home.jsx"));
const League = lazy(() => import("./pages/League.jsx"));
const Achievements = lazy(() => import("./pages/Achievements.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const CreateQuizPage = lazy(() => import("./pages/CreateQuizPage.jsx"));
const QuizzesListPage = lazy(() => import("./pages/QuizzesListPage.jsx"));
const AnswerQuizPage = lazy(() => import("./pages/AnswerQuizPage.jsx"));
const QuizLeaderboard = lazy(() => import("./pages/QuizLeaderboard.jsx"));
const ResultPage = lazy(() => import("./pages/ResultPage.jsx"));
const Logout = lazy(() => import("./pages/Logout.jsx"));
const QueryList = lazy(() => import("./pages/QueryList.jsx"));
const QueryDetails = lazy(() => import("./pages/QueryDetails.jsx"));
const AskQuery = lazy(() => import("./pages/AskQuery.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const FriendListPage = lazy(() => import("./pages/FriendListPage.jsx"));
const FriendProfilePage = lazy(() => import("./pages/FriendProfilePage.jsx"));
const GameListPage = lazy(() => import("./pages/games/GameListPage.jsx"));
const GameLobbyPage = lazy(() => import("./pages/games/GameLobbyPage.jsx"));
const GameRoomPage = lazy(() => import("./pages/games/GameRoomPage.jsx"));
const TicTacToe = lazy(() => import("./pages/games/TicTacToe.jsx"));
const ChessLobbyPage = lazy(() => import("./pages/games/chess/ChessLobbyPage.jsx"));
const ChessRoomPage = lazy(() => import("./pages/games/chess/ChessRoomPage.jsx"));
const ChessGamePage = lazy(() => import("./pages/games/chess/ChessGamePage.jsx"));

function AppContent() {
  const { loading } = useContext(AuthContext);

  return (
    <>
      {/* Navbar always visible */}
      <Navbar />
      {loading ? (
        <LoadingPage />
      ) : (
        <Suspense fallback={<LoadingPage />}>
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

            {/* Game Routes */}
            <Route path="/games" element={<GameListPage />} />
            <Route path="/game/:gameType" element={<GameLobbyPage />} />
            <Route path="/game/:gameType/room/:roomCode" element={<GameRoomPage />} />
            <Route path="/game/tictactoe/room/:roomCode" element={<TicTacToe />} />
            <Route path="/game/chess" element={<ChessLobbyPage />} />
            <Route path="/game/chess/room/:roomCode" element={<ChessRoomPage />} />
            <Route path="/game/chess/play/:roomCode" element={<ChessGamePage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
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
