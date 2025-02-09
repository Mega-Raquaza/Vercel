import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BottomNavigation.css";

const BottomNavigation = () => {
  const location = useLocation();
  return (
    <div className="bottom-nav">
      <ul>
        <li className={location.pathname === "/home" ? "active" : ""}>
          <Link to="/home">
            <i className="fas fa-home"></i>
            <div>Home</div>
          </Link>
        </li>
        <li className={location.pathname === "/league" ? "active" : ""}>
          <Link to="/league">
            <i className="fas fa-trophy"></i>
            <div>League</div>
          </Link>
        </li>
        <li className={location.pathname === "/quizzes" ? "active" : ""}>
          <Link to="/quizzes">
            <i className="fas fa-question-circle"></i>
            <div>Quizzes</div>
          </Link>
        </li>
        <li className={location.pathname === "/achievements" ? "active" : ""}>
          <Link to="/achievements">
            <i className="fas fa-medal"></i>
            <div>Achievements</div>
          </Link>
        </li>
        <li className={location.pathname === "/profile" ? "active" : ""}>
          <Link to="/profile">
            <i className="fas fa-user"></i>
            <div>Profile</div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default BottomNavigation;
