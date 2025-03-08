import React from "react";
import { Link } from "react-router-dom";

const QueryCard = ({ query, refreshQueries }) => {
  // Extract the first answer if available
  const firstAnswer =
    query.answers && query.answers.length > 0 ? query.answers[0] : null;

  return (
    <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center space-x-4">
        {/* Question Asker's Avatar using userDetails.profilePicture */}
        <div className="w-12 h-12 rounded-full overflow-hidden">
          {query.userDetails?.profilePicture ? (
            <img
              src={query.userDetails.profilePicture}
              alt={`${query.username}'s avatar`}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="bg-gray-600 flex items-center justify-center w-full h-full">
              <span className="text-lg text-white font-bold">
                {query.username ? query.username.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          )}
        </div>
        {/* Query Content */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">{query.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Asked by: {query.username}
          </p>
          <p className="mt-1 text-gray-300 text-sm">
            {query.description.length > 100
              ? query.description.substring(0, 100) + "..."
              : query.description}
          </p>
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
            <span>
              <i className="fas fa-book-open mr-1"></i> {query.subject}
            </span>
            <span>
              <i className="fas fa-thumbs-up mr-1"></i> {query.upvotes ? query.upvotes.length : 0}
            </span>
            <span>
              <i className="fas fa-thumbs-down mr-1"></i> {query.downvotes ? query.downvotes.length : 0}
            </span>
          </div>
          {/* Answer snippet section */}
          {firstAnswer && (
            <div className="mt-3 p-3 bg-gray-600 rounded-md">
              <div className="flex items-center space-x-2">
                {/* Answerer's Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-500">
                  {firstAnswer.profilePicture ? (
                    <img
                      src={firstAnswer.profilePicture}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-200 text-xs">
                        {firstAnswer.answeredBy
                          ? firstAnswer.answeredBy.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    </div>
                  )}
                </div>
                {/* Answer snippet and username */}
                <div>
                  <p className="text-gray-100 text-xs">
                    {firstAnswer.text.length > 80
                      ? firstAnswer.text.substring(0, 80) + "..."
                      : firstAnswer.text}
                  </p>
                  <p className="text-gray-300 text-xs">
                    {firstAnswer.answeredBy}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="mt-3">
            <Link
              to={`/query/${query._id}`}
              className="inline-block text-blue-400 hover:underline text-sm transition-colors"
            >
              View All Answers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryCard;
