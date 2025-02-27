import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const navItems = [
    { path: "/home", icon: "fas fa-home", label: "Home" },
    { path: "/league", icon: "fas fa-trophy", label: "League" },
    { path: "/queries", icon: "fas fa-comments", label: "Queries" },
    { path: "/achievements", icon: "fas fa-medal", label: "Achievements" },
    { path: "/profile", icon: "fas fa-user", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-700 z-50 md:hidden">
      <ul className="grid grid-cols-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path} className="flex flex-col items-center justify-center py-3">
              <Link
                to={item.path}
                className="flex flex-col items-center transition-colors duration-200"
              >
                <i
                  className={`${item.icon} text-2xl mb-1 ${
                    isActive ? "text-orange-500" : "text-white"
                  }`}
                ></i>
                <span className={`text-xs ${isActive ? "text-orange-500" : "text-gray-300"}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BottomNavigation;
