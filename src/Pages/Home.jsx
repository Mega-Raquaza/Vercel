import React, { useState, useEffect } from "react";
import axios from "axios";

const CONST_LINK = import.meta.env.VITE_CONST_LINK;

const Home = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${CONST_LINK}/api/auth/userdata`, {
          withCredentials: true,
        });
        setEmail(response.data[0]);
      } catch (error) {
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
