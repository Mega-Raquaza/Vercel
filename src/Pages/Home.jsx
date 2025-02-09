import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data");
        const response = await axios.get(
          "https://render-5az4.onrender.com/api/auth/userdata",
          { withCredentials: true },
        );
        console.log(response);
        setEmail(response.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>
        Welcome to the Quiz Application <br />
        {email ? email.username : "Loading"}
      </h2>
      {error && <p>{error}</p>}
      Home
    </div>
  );
};

export default Home;
