import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const QueryDetail = () => {
  const { queryId } = useParams();
  const { user } = useContext(AuthContext);
  const [query, setQuery] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [replyText, setReplyText] = useState({}); // keyed by answerId
  const [showReplyForm, setShowReplyForm] = useState({}); // keyed by answerId
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch query details
  useEffect(() => {
    const fetchQuery = async () => {
      try {
        const res = await axios.get(`${CONST_LINK}/api/queries/${queryId}`);
        setQuery(res.data);
      } catch (err) {
        console.error(err);
        setError("Error fetching query details");
      } finally {
        setLoading(false);
      }
    };
    fetchQuery();
  }, [queryId]);

  // Refresh query after updates
  const refreshQuery = async () => {
    try {
      const res = await axios.get(`${CONST_LINK}/api/queries/${queryId}`);
      setQuery(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for answer submission
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to answer.");
      return;
    }
    try {
      await axios.post(
        `${CONST_LINK}/api/queries/${queryId}/answer`,
        { answer: newAnswer },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      setNewAnswer("");
      refreshQuery();
    } catch (err) {
      console.error(err);
      setError("Error submitting answer");
    }
  };

  const handleSubmitReply = async (answerId) => {
    if (!user) {
      alert("You must be logged in to reply.");
      return;
    }
    try {
      await axios.post(
        `${CONST_LINK}/api/queries/${queryId}/answer/${answerId}/reply`,
        { reply: replyText[answerId] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      // Clear reply text and hide reply form
      setReplyText((prev) => ({ ...prev, [answerId]: "" }));
      setShowReplyForm((prev) => ({ ...prev, [answerId]: false }));
      refreshQuery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkFinal = async (answerId) => {
    try {
      await axios.post(
        `${CONST_LINK}/api/queries/${queryId}/finalAnswer`,
        { answerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      refreshQuery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvoteQuery = async () => {
    try {
      await axios.post(
        `${CONST_LINK}/api/queries/${queryId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      refreshQuery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvoteQuery = async () => {
    try {
      await axios.post(
        `${CONST_LINK}/api/queries/${queryId}/downvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      refreshQuery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeAnswer = async (answerId) => {
    try {
      await axios.post(
        `${CONST_LINK}/api/queries/${queryId}/answer/${answerId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      refreshQuery();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislikeAnswer = async (answerId) => {
    try {
      await axios.post(
        `${CONST_LINK}/api/queries/${queryId}/answer/${answerId}/dislike`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      refreshQuery();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        No query found.
      </div>
    );
  }

  const finalAnswerObj = query.finalAnswer
    ? query.answers.find((a) => a._id === query.finalAnswer)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
{/* Query Header Card */}
<div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl mb-8">
  <h1 className="text-4xl font-extrabold text-white mb-6">{query.title}</h1>
  {query.image && (
    <img
      src={query.image}
      alt="Query"
      className="mb-6 rounded-xl max-h-72 object-cover w-full"
    />
  )}
  <p className="text-gray-300 text-lg mb-4">{query.description}</p>
  <div className="flex flex-wrap gap-4 mb-4">
    <span className="text-gray-400">
      <strong>Subject:</strong> {query.subject}
    </span>
    <span className="text-gray-400">
      <strong>Asked by:</strong> {query.username}
    </span>
  </div>
  {!query.finalAnswer && (
    <div className="flex space-x-4 mt-6">
      <button
        onClick={handleUpvoteQuery}
        className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-500 transition"
      >
        <i className="fas fa-thumbs-up mr-2"></i>
        Upvote ({query.upvotes ? query.upvotes.length : 0})
      </button>
      {/* <button
        onClick={handleDownvoteQuery}
        className="flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-500 transition"
      >
        <i className="fas fa-thumbs-down mr-2"></i>
        Downvote ({query.downvotes ? query.downvotes.length : 0})
      </button> */}
    </div>
  )}
</div>


      {/* Answers Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Answers</h2>
        <div className="space-y-4">
          {query.answers && query.answers.length > 0 ? (
            query.answers.map((answer) => (
              <div
                key={answer._id}
                className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  {/* Answerer Avatar */}
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {answer.answeredBy
                        ? answer.answeredBy.charAt(0).toUpperCase()
                        : "U"}
                    </span>
                  </div>
                  {/* Answer Content */}
                  <div className="flex-1">
                    <p className="text-white">{answer.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-400 text-sm">
                        {answer.answeredBy}
                      </span>
                      {!query.finalAnswer && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleLikeAnswer(answer._id)}
                            className="text-green-400 hover:text-green-300 text-sm flex items-center"
                          >
                            <i className="fas fa-thumbs-up mr-1"></i>
                            {answer.likes ? answer.likes.length : 0}
                          </button>
                          <button
                            onClick={() => handleDislikeAnswer(answer._id)}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center"
                          >
                            <i className="fas fa-thumbs-down mr-1"></i>
                            {answer.dislikes ? answer.dislikes.length : 0}
                          </button>
                          {user &&
                            query.askedBy === user._id &&
                            !query.finalAnswer && (
                              <button
                                onClick={() => handleMarkFinal(answer._id)}
                                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                              >
                                <i className="fas fa-check mr-1"></i>
                                Mark as Final
                              </button>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Replies for this answer */}
                <div className="mt-4 ml-12">
                  {answer.replies && answer.replies.length > 0 ? (
                    answer.replies.map((reply) => (
                      <div
                        key={reply._id}
                        className="flex items-start space-x-3 bg-gray-700 p-2 rounded mb-2"
                      >
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {reply.repliedBy
                              ? reply.repliedBy.charAt(0).toUpperCase()
                              : "U"}
                          </span>
                        </div>
                        <div>
                          <p className="text-white text-sm">{reply.text}</p>
                          <span className="text-gray-400 text-xs">
                            {reply.repliedBy}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No replies yet.</p>
                  )}
                  {/* Reply Form Toggle */}
                  {!query.finalAnswer &&
                    (showReplyForm[answer._id] ? (
                      <div className="mt-2 ml-2">
                        <textarea
                          value={replyText[answer._id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [answer._id]: e.target.value,
                            }))
                          }
                          placeholder="Write your reply..."
                          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm mb-2 focus:ring-2 focus:ring-purple-500"
                          rows="2"
                        ></textarea>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSubmitReply(answer._id)}
                            className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-500 transition"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() =>
                              setShowReplyForm((prev) => ({
                                ...prev,
                                [answer._id]: false,
                              }))
                            }
                            className="px-3 py-1 bg-gray-600 rounded text-sm hover:bg-gray-500 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setShowReplyForm((prev) => ({
                            ...prev,
                            [answer._id]: true,
                          }))
                        }
                        className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Reply
                      </button>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No answers yet. Be the first to answer!</p>
          )}
        </div>
      </div>

      {/* Answer Submission Form */}
      {user && !query.finalAnswer && user._id !== query.askedBy && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Submit Your Answer</h2>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
            <form
              onSubmit={handleSubmitAnswer}
              className="flex-1 bg-gray-800 p-4 rounded-xl border border-gray-700"
            >
              <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Write your answer here..."
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
                rows="3"
              ></textarea>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 transition-colors text-sm"
              >
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      )}

      {query.finalAnswer && (
        <div className="mt-8 text-blue-400 font-bold text-center">
          Final answer has been selected. No further answers allowed.
        </div>
      )}
    </div>
  );
};

export default QueryDetail;
