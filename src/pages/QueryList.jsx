import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import QueryCard from "../components/QueryCard.jsx";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const QueryList = () => {
  const [queries, setQueries] = useState([]); // Ensure initial state is an empty array
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState({ subject: "", sortBy: "latest" });

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`${CONST_LINK}/api/queries?page=${page}&limit=5`);
      const data = response.data;

      if (Array.isArray(data)) {
        setQueries(data);
      } else {
        console.error("Unexpected API response:", data);
        setQueries([]); // Ensure queries is always an array
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
      setQueries([]); // Fallback to empty array on error
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [page]);

  const refreshQueries = () => {
    fetchQueries(); // Function to refresh queries after upvote or answer submission
  };

  const filteredQueries = (Array.isArray(queries) ? queries : []) // Ensure queries is always iterable
    .filter((query) =>
      filter.subject ? query.subject === filter.subject : true
    )
    .sort((a, b) =>
      filter.sortBy === "upvotes"
        ? b.upvotes - a.upvotes
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  return (
    <div>
      <select onChange={(e) => setFilter({ ...filter, subject: e.target.value })}>
        <option value="">All Subjects</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Physics">Physics</option>
      </select>

      <select onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}>
        <option value="latest">Latest</option>
        <option value="upvotes">Most Upvoted</option>
      </select>

      <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
        Previous
      </button>
      <button onClick={() => setPage(page + 1)}>Next</button>

      {filteredQueries.length > 0 ? (
        filteredQueries.map((query) => <QueryCard key={query._id} query={query} refreshQueries={refreshQueries} />)
      ) : (
        <p>No queries found.</p>
      )}
    </div>
  );
};

export default QueryList;
