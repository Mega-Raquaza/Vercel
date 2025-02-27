import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import SideNavigation from "./SideNavigation";
import BottomNavigation from "./BottomNavigation";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [sideNavVisible, setSideNavVisible] = useState(false);

  const toggleSideNav = () => {
    setSideNavVisible(!sideNavVisible);
  };

  // Helper: returns active class based on current route
  const activeClass = (path) =>
    location.pathname === path
      ? "text-orange-500 border-b-2 border-orange-500"
      : "text-white hover:text-orange-500";

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <HamburgerMenu onClick={toggleSideNav} visible={sideNavVisible} />
            <Link to="/" className="ml-4 text-2xl font-bold text-orange-500 no-underline">
              Genius Clash
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex space-x-6">
              <li className={`text-lg font-medium ${activeClass("/home")}`}>
                <Link to="/home" className="no-underline">Home</Link>
              </li>
              <li className={`text-lg font-medium ${activeClass("/league")}`}>
                <Link to="/league" className="no-underline">League</Link>
              </li>
              <li className={`text-lg font-medium ${activeClass("/queries")}`}>
                <Link to="/queries" className="no-underline">Queries</Link>
              </li>
              <li className={`text-lg font-medium ${activeClass("/achievements")}`}>
                <Link to="/achievements" className="no-underline">Achievements</Link>
              </li>
              {user ? (
                <>
                  <li className={`text-lg font-medium ${activeClass("/profile")}`}>
                    <Link to="/profile" className="no-underline">Profile</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className={`text-lg font-medium ${activeClass("/login")}`}>
                    <Link to="/login" className="no-underline">Login</Link>
                  </li>
                  <li className={`text-lg font-medium ${activeClass("/signup")}`}>
                    <Link to="/signup" className="no-underline">Signup</Link>
                  </li>
                </>
              )}
            </ul>
            {/* Always visible user stats */}
            {user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-full border border-gray-600 shadow-md">
                  <i className="fas fa-fire text-blue-400 text-xl"></i>
                  <span className="text-sm font-bold text-white">{user.aura}</span>
                </div>
                <div className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-full border border-gray-600 shadow-md">
                  <i className="fas fa-medal text-yellow-500 text-xl"></i>
                  <span className="text-sm font-bold text-white">{user.medals}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
      <SideNavigation visible={sideNavVisible} onClose={() => setSideNavVisible(false)} />
      <BottomNavigation />
    </>
  );
};

export default Navbar;
