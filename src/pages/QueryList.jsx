import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import QueryCard from "../components/QueryCard.jsx";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const QueryList = () => {
  const { user } = useContext(AuthContext);
  const [queries, setQueries] = useState([]); // All loaded queries
  const [page, setPage] = useState(1);
  // Filter state now includes subject, sortBy, and status
  const [filter, setFilter] = useState({ subject: "", sortBy: "latest", status: "all" });
  const [hasMore, setHasMore] = useState(true);
  const limit = 5; // Number of queries per page

  const fetchQueries = async () => {
    try {
      const response = await axios.get(
        `${CONST_LINK}/api/queries?page=${page}&limit=${limit}`
      );
      const data = response.data;
      // Check if the response contains queries and possibly a totalPages property
      if (data.queries && Array.isArray(data.queries)) {
        if (page === 1) {
          setQueries(data.queries);
        } else {
          setQueries((prevQueries) => [...prevQueries, ...data.queries]);
        }
        // If API provides totalPages, we could use that; otherwise, assume more if exactly `limit` items were returned.
        if (data.totalPages) {
          // Optionally, you can update hasMore based on totalPages and page
          setHasMore(page < data.totalPages);
        } else {
          setHasMore(data.queries.length === limit);
        }
      } else if (Array.isArray(data)) {
        // Fallback: if data is an array
        if (page === 1) {
          setQueries(data);
        } else {
          setQueries((prevQueries) => [...prevQueries, ...data]);
        }
        setHasMore(data.length === limit);
      } else {
        console.error("Unexpected API response:", data);
        setQueries([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      setQueries([]);
      setHasMore(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">User not authenticated</h2>
        <p className="mb-4">Please log in to access the queries.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  useEffect(() => {
    fetchQueries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const refreshQueries = () => {
    // Reset page to 1 and fetch queries
    setPage(1);
    fetchQueries();
  };

  // Apply subject filter and sort by latest/upvotes
  let filteredQueries = (Array.isArray(queries) ? queries : [])
    .filter((query) => (filter.subject ? query.subject === filter.subject : true))
    .sort((a, b) =>
      filter.sortBy === "upvotes"
        ? b.upvotes.length - a.upvotes.length
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  // Separate "my queries" and "other queries"
  const myQueries = user ? filteredQueries.filter((q) => q.askedBy === user._id) : [];
  const otherQueries = user
    ? filteredQueries.filter((q) => q.askedBy !== user._id)
    : filteredQueries;

  // Further break down other queries by status
  const newQueries = otherQueries.filter((q) => !q.answers || q.answers.length === 0);
  const ongoingQueries = otherQueries.filter((q) => q.answers && q.answers.length > 0 && !q.finalAnswer);
  const completedQueries = otherQueries.filter((q) => q.finalAnswer);

  // When a specific status filter is active, override our display of other queries
  let statusFilteredQueries = [];
  if (filter.status !== "all") {
    if (filter.status === "new") {
      statusFilteredQueries = newQueries;
    } else if (filter.status === "ongoing") {
      statusFilteredQueries = ongoingQueries;
    } else if (filter.status === "completed") {
      statusFilteredQueries = completedQueries;
    }
  }

  // Helper to capitalize
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="max-w-5xl mx-auto p-3 sm:p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
          Study Queries
        </h1>
        <Link
          to="/query/new"
          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded hover:from-green-500 hover:to-teal-500 transition-all font-semibold"
        >
          <i className="fas fa-plus-circle mr-2"></i> Ask New Question
        </Link>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6 bg-gray-800 p-2 rounded border border-gray-700">
        <select
          onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
          className="p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring focus:ring-purple-500"
        >
          <option value="">All Subjects</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Biology">Biology</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Trivia">Trivia</option>
          <option value="Others">Others</option>
        </select>
        <select
          onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
          className="p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring focus:ring-purple-500"
        >
          <option value="latest">Latest</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
        <select
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          className="p-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:ring focus:ring-purple-500"
        >
          <option value="all">All Queries</option>
          <option value="new">New</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        {/* Empty grid cell for spacing */}
        <div></div>
      </div>

      {/* Display queries based on filter status */}
      {filter.status === "all" ? (
        <>
          {/* My Questions Section */}
          {user && myQueries.length > 0 && (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 text-indigo-300 flex items-center gap-2">
                <i className="fas fa-user"></i> My Questions
              </h2>
              <div className="space-y-4">
                {myQueries.map((query) => (
                  <QueryCard key={query._id} query={query} refreshQueries={refreshQueries} />
                ))}
              </div>
            </div>
          )}

          {/* New Queries Section (asked by others) */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300 flex items-center gap-2">
              <i className="fas fa-star"></i> New Queries
            </h2>
            {newQueries.length > 0 ? (
              <div className="space-y-4">
                {newQueries.map((query) => (
                  <QueryCard key={query._id} query={query} refreshQueries={refreshQueries} />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center bg-gray-800 rounded border-2 border-dashed border-gray-700">
                <p className="text-lg text-gray-400">No new queries found.</p>
              </div>
            )}
          </div>

          {/* Ongoing Queries Section (asked by others) */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-green-300 flex items-center gap-2">
              <i className="fas fa-sync-alt"></i> Ongoing Queries
            </h2>
            {ongoingQueries.length > 0 ? (
              <div className="space-y-4">
                {ongoingQueries.map((query) => (
                  <QueryCard key={query._id} query={query} refreshQueries={refreshQueries} />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center bg-gray-800 rounded border-2 border-dashed border-gray-700">
                <p className="text-lg text-gray-400">No ongoing queries found.</p>
              </div>
            )}
          </div>

          {/* Completed Queries Section (asked by others) */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 text-blue-300 flex items-center gap-2">
              <i className="fas fa-check-circle"></i> Completed Queries
            </h2>
            {completedQueries.length > 0 ? (
              <div className="space-y-4">
                {completedQueries.map((query) => (
                  <QueryCard key={query._id} query={query} refreshQueries={refreshQueries} />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center bg-gray-800 rounded border-2 border-dashed border-gray-700">
                <p className="text-lg text-gray-400">No completed queries found.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        // When a specific status filter is active, show a single section for filtered queries
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4 text-white flex items-center gap-2">
            {capitalize(filter.status)} Queries
          </h2>
          {statusFilteredQueries.length > 0 ? (
            <div className="space-y-4">
              {statusFilteredQueries.map((query) => (
                <QueryCard key={query._id} query={query} refreshQueries={refreshQueries} />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center bg-gray-800 rounded border-2 border-dashed border-gray-700">
              <p className="text-lg text-gray-400">No queries found matching your criteria.</p>
              <p className="text-gray-500 mt-1">Be the first to ask a question!</p>
            </div>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center my-4">
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded hover:from-purple-500 hover:to-blue-500 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default QueryList;
