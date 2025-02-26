import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideNavigation = ({ visible, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: "/home", icon: "fas fa-home", label: "Home" },
    { path: "/league", icon: "fas fa-trophy", label: "League" },
    { path: "/queries", icon: "fas fa-comments", label: "Queries" },
    { path: "/achievements", icon: "fas fa-medal", label: "Achievements" },
    { path: "/profile", icon: "fas fa-user", label: "Profile" },
    { path: "/friends/list", icon: "fas fa-users", label: "Friends" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full bg-gray-900 z-50 transform transition-transform duration-300 ${
        visible ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl focus:outline-none">
        <i className="fas fa-times"></i>
      </button>
      <ul className="mt-16">
        {navItems.map((item) => (
          <li key={item.path} className="px-6 py-4 border-b border-gray-800">
            <Link
              to={item.path}
              onClick={onClose}
              className={`flex items-center text-lg no-underline ${
                location.pathname === item.path ? "text-orange-500" : "text-white hover:text-orange-500"
              }`}
            >
              <i className={`${item.icon} mr-4`}></i>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideNavigation;
