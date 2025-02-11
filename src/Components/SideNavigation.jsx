import React from "react";
import { Link } from "react-router-dom";
import "./SideNavigation.css";

const SideNavigation = ({ visible }) => {
  return (
    <div className={`side-nav ${visible ? "visible" : ""}`}>
      <ul>
        <li className={location.pathname === "/home" ? "active" : ""}>
          <Link to="/home">
            <i className="fas fa-home"></i> Home
          </Link>
        </li>
        <li className={location.pathname === "/league" ? "active" : ""}>
          <Link to="/league">
            <i className="fas fa-trophy"></i> League
          </Link>
        </li>
        <li className={location.pathname === "/quizzes" ? "active" : ""}>
          <Link to="/quizzes">
            <i className="fas fa-question-circle"></i> Quizzes
          </Link>
        </li>
        <li className={location.pathname === "/achievements" ? "active" : ""}>
          <Link to="/achievements">
            <i className="fas fa-medal"></i> Achievements
          </Link>
        </li>
        <li className={location.pathname === "/profile" ? "active" : ""}>
          <Link to="/profile">
            <i className="fas fa-user"></i> Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SideNavigation;
