import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const AskQuery = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    title: "",
    description: "",
    subject: "", // ✅ Added default subject value
    image: null, // ✅ Store image separately for preview
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setQuery({ ...query, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setQuery({ ...query, image: file });
      setImagePreview(URL.createObjectURL(file)); // ✅ Image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to ask a question.");
      return;
    }
  
    setLoading(true);
    setErrorMessage("");
  
    console.log("User Data:", user); // Debugging
    console.log("Username being sent:", user.username); // ✅ Ensure username exists
  
    const formData = new FormData();
    formData.append("title", query.title);
    formData.append("description", query.description);
    formData.append("subject", query.subject);
    formData.append("askedBy", user._id);
    formData.append("username", user.username); // ✅ Ensure username is sent as a string
  
    if (query.image) {
      formData.append("image", query.image);
    }
  
    try {
      await axios.post(`${CONST_LINK}/api/queries/ask`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      });
  
      navigate("/queries");
    } catch (error) {
      console.error("Error posting query:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Ask a Question</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 shadow rounded"
        encType="multipart/form-data" // ✅ Ensures proper file handling
      >
        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}

        <select
          name="subject"
          value={query.subject}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select Subject</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Physics">Physics</option>
          <option value="Biology">Biology</option>
          <option value="Chemistry">Chemistry</option>
        </select>

        <input
          type="text"
          name="title"
          placeholder="Enter question title"
          value={query.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        />

        <textarea
          name="description"
          placeholder="Describe your question..."
          value={query.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-4"
        ></textarea>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded mb-4"
        />

        {imagePreview && (
          <div className="mb-4">
            <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded" />
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 text-white"}`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AskQuery;
