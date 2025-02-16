import { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [queries, setQueries] = useState([]);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    let isMounted = true; // Prevent state update if component unmounts

    const fetchQueries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/queries/admin/all", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (isMounted) setQueries(response.data);
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [accessToken]); // Ensure effect runs when `accessToken` changes

  const deleteQuery = async (queryId) => {
    try {
      await axios.delete(`http://localhost:5000/api/queries/admin/${queryId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setQueries((prevQueries) => prevQueries.filter(q => q._id !== queryId));
    } catch (error) {
      console.error("Error deleting query:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      {queries.length > 0 ? (
        queries.map((query) => (
          <div key={query._id} className="border p-3 my-2">
            <h2>{query.title}</h2>
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={() => deleteQuery(query._id)}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No queries available.</p>
      )}
    </div>
  );
};

export default AdminPanel;
