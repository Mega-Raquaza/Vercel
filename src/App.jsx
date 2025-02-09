import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Navbar from "./Components/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import Hero from "./Pages/Hero.jsx";
import League from "./Pages/League.jsx";
import Achievements from "./Pages/Achievements.jsx";
import Profile from "./Pages/Profile.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/Signup.jsx";
import CreateQuizPage from "./pages/CreateQuizPage.jsx";
import QuizzesListPage from "./Pages/QuizzesListPage.jsx";
import AnswerQuizPage from "./pages/AnswerQuizPage.jsx";

function App() {
  return (
    <Router>
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/home" element={<Home />} />
          <Route path="/League" element={<League />} />
          <Route path="/Achievements" element={<Achievements />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-quiz" element={<CreateQuizPage />} />
          <Route path="/quizzes" element={<QuizzesListPage />} />
          <Route path="quiz/:quizId" element={<AnswerQuizPage />} />
        </Routes>
      </>
    </Router>
  );
}
export default App;
