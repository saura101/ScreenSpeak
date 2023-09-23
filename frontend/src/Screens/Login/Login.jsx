import React, { useState } from "react";
import "./Login.css"

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleJoinCall = () => {
    console.log(name);
    console.log(email);
  };
  return (
    <div className="login-container">
      <h1>Enter Your Details</h1>
      <div className="input-container">
        <label >Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
        />
      </div>
      <div className="input-container">
        <label >Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
        />
      </div>
      <button className="join-button" onClick={handleJoinCall}>
        Join Call
      </button>
    </div>
  );
}

export default Login;
