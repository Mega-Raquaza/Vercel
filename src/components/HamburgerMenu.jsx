import React from "react";

const HamburgerMenu = ({ onClick, visible }) => {
  return (
    <button onClick={onClick} className="md:hidden focus:outline-none">
      <i className={`text-2xl text-orange-500 ${visible ? "fas fa-times" : "fas fa-bars"}`}></i>
    </button>
  );
};

export default HamburgerMenu;
