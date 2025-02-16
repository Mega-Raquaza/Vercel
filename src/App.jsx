import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Hero from "./pages/Hero.jsx";
import League from "./pages/League.jsx";
import Achievements from "./pages/Achievements.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CreateQuizPage from "./pages/CreateQuizPage.jsx";
import QuizzesListPage from "./pages/QuizzesListPage.jsx";
import AnswerQuizPage from "./pages/AnswerQuizPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import { AuthProvider, AuthContext } from "./context/AuthContext.jsx";
import QueryList from "./pages/QueryList.jsx";
import AskQuery from "./pages/AskQuery.jsx";
import QueryDetails from "./pages/QueryDetails.jsx";
import AdminPanel from "./pages/AdminPanel.jsx"; // ✅ Import AdminPanel

function App() {
  return (
    <AuthProvider>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/result" element={<ResultPage />} />
            <Route path="/" element={<Hero />} />
            <Route path="/home" element={<Home />} />
            <Route path="/League" element={<League />} />
            <Route path="/Achievements" element={<Achievements />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/create-quiz" element={<CreateQuizPage />} />
            <Route path="/quizzes" element={<QuizzesListPage />} />
            <Route path="/quiz/:quizId" element={<AnswerQuizPage />} />
            <Route path="/queries" element={<QueryList />} />
            <Route path="/query/new" element={<AskQuery />} />
            <Route path="/query/:id" element={<QueryDetails />} />
            
            {/* Protected Admin Route */}
            <Route path="/admin-panel" element={<AdminRoute />} />
          </Routes>
        </>
      </Router>
    </AuthProvider>
  );
}

// ✅ Define AdminRoute as a function that returns a protected <Route>
const AdminRoute = () => {
  const { user } = useContext(AuthContext);

  // Redirect if not logged in or not an admin
  if (!user || user.role !== "god") {
    return <Navigate to="/" />;
  }

  return <AdminPanel />;
};

export default App;
