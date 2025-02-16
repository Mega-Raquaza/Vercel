import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Welcome to the Quiz Application</h2>
      hero
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/");
        }}
      >
        Hero
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/home");
        }}
      >
        Home
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/league");
        }}
      >
        league
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/quizzes");
        }}
      >
        quizzes
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/achievements");
        }}
      >
        achievements
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/profile");
        }}
      >
        profile
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/login");
        }}
      >
        login
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/signup");
        }}
      >
        signup
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/create-quiz");
        }}
      >
        create quiz
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/userdata");
        }}
      >
        userdata
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/logout");
        }}
      >
        logout
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/queries");
        }}
      >
        Query
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/Query/new");
        }}
      >
        Query/new
      </button>
      <button
        className="block p-1 m-2 bg-orange-500 text-white"
        onClick={() => {
          navigate("/logout");
        }}
      >
        logout
      </button>
    </div>
  );
};

export default Hero;
