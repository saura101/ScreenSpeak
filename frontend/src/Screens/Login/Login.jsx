import React, { useState } from "react";
import "./Login.css";
import { useSocket } from "../../socket";
import { useNavigate } from "react-router-dom";

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roomid, setRoomid] = useState("");

  const { socket } = useSocket();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  //use navigate
  const navigate = useNavigate();

  const handleJoinCall = () => {
    console.log(name);
    console.log(email);
    socket.connect();
    socket.emit("join-call", { roomID: "1", emailID: email, name: name });
  };

  function handleCallJoined({ roomID }) {
    console.log("user joined room");
    //redirect user to the videocall page
    // navigate("/joincall");
  }

  function disconnect() {
    socket.disconnect();
  }

  React.useEffect(() => {
    socket.on("joined-call", handleCallJoined);

    //cleanup
    return function () {
      socket.off("joined-call", handleCallJoined);
    };
  }, [socket]);

  return (
    <div className="login-container">
      <h1>Enter Your Details</h1>
      <div className="input-container">
        <label>Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          placeholder="Enter your name"
        />
      </div>
      <div className="input-container">
        <label>Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email"
        />
      </div>
      <a className="join-button" onClick={handleJoinCall}>
        Join Call
      </a>
    </div>
  );
}

export default Login;
