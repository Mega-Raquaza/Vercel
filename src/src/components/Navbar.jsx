import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import SideNavigation from "./SideNavigation";
import BottomNavigation from "./BottomNavigation";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <nav>
        <div className="brand">
          <HamburgerMenu toggleMenu={toggleMenu} menuVisible={menuVisible} />
          <a href="/">QUIZ LEAGUE</a>
        </div>
        <ul className="nav-links">
          <li className={location.pathname === "/home" ? "active" : ""}>
            <Link to="/home">Home</Link>
          </li>
          <li className={location.pathname === "/league" ? "active" : ""}>
            <Link to="/league">League</Link>
          </li>
          <li className={location.pathname === "/quizzes" ? "active" : ""}>
            <Link to="/quizzes">Quizzes</Link>
          </li>
          <li className={location.pathname === "/achievements" ? "active" : ""}>
            <Link to="/achievements">Achievements</Link>
          </li>
          <li className={location.pathname === "/profile" ? "active" : ""}>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
      <SideNavigation visible={menuVisible} />
      <BottomNavigation />
    </>
  );
};

export default Navbar;
