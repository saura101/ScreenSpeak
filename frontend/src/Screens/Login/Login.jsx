import React, { useState } from "react";
import "./Login.css";
import { useSocket } from "../../socket";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../socket";
// import user, { setUser } from "../User/User";

function Login() {
  const { socket } = useSocket();
  const { User, setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [roomid, setRoomid] = useState("");
  const [isConnected, setIsConnected] = React.useState(socket.connected);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  //use navigate
  const navigate = useNavigate();

  const handleJoinCall = async () => {
    console.log(name);
    console.log(email);
    setUser({
      name,
      email,
    });
    console.log("login",User);
    navigate("/");
    // await socket.connect();
    // socket.emit("join-call", { roomID: "1", emailID: email, name: name });
  };

  function handleCallJoined({ roomID }) {
    console.log("user joined room");
    //redirect user to the videocall page
    console.log(socket.connected);
    if (socket.connected) {
      // navigate("/joincall");
    }
  }

  React.useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // socket.on("connect", onConnect);
    // socket.on("disconnect", onDisconnect);
    socket.on("joined-call", handleCallJoined);

    //cleanup
    return function () {
      // socket.off("connect", onConnect);
      // socket.off("disconnect", onDisconnect);
      socket.off("joined-call", handleCallJoined);
    };
  }, [socket, handleCallJoined]);

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
        Onboard
      </a>
    </div>
  );
}

export default Login;
