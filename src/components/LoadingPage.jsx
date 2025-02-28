// src/components/LoadingPage.jsx
import React from "react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-600"></div>
      <p className="mt-4 text-white text-lg">Loading...</p>
    </div>
  );
};

export default LoadingPage;
