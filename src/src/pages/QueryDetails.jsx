import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const QueryDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const response = await axios.get(`${CONST_LINK}/api/queries/${id}`);
        setQuery(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching query:", error);
      }
    };

    fetchQuery();
  }, [id]);

  const handleAnswerSubmit = async () => {
    if (!user) {
      alert("You must be logged in to answer.");
      return;
    }
  
    try {
      const response = await axios.post(`${CONST_LINK}/api/queries/${id}/answer`, 
        { answer: answer }, // Ensure correct field name
        { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
      );
  
      setAnswer("");
      setQuery(prevQuery => ({
        ...prevQuery,
        answers: [...prevQuery.answers, response.data.answer], // Correctly update state
      }));
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (!query) return <p>Query not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-600">{query.title}</h1>
      <p className="text-gray-700 mb-4">{query.description}</p>
      <p className="text-sm text-gray-500">Asked by: {query.askedBy.username}</p>

      <div className="mt-6">
        <h2 className="text-lg font-bold">Answers</h2>
        {query.answers.length > 0 ? (
          query.answers.map((a, index) => (
            <div key={index} className="p-2 border rounded mt-2">
              <p>{a.answer}</p>
              <p className="text-sm text-gray-500">Answered by: {a.answeredBy.username}</p>
            </div>
          ))
        ) : (
          <p>No answers yet. Be the first to answer!</p>
        )}
      </div>

      {user && (
        <div className="mt-4">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full p-2 border rounded mb-2"
          ></textarea>
          <button onClick={handleAnswerSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default QueryDetails;
