import React from "react";
import "./HamburgerMenu.css";

const HamburgerMenu = ({ toggleMenu, menuVisible }) => {
  return (
    <i
      className={menuVisible ? "fas fa-times" : "fas fa-bars"}
      onClick={toggleMenu}
    ></i>
  );
};

export default HamburgerMenu;
