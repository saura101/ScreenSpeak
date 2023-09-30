import React, { useState } from "react";
import "./Login.css";
import { useSocket, useUser } from "../../socket";
import { useNavigate } from "react-router-dom";
//import { useUser } from "../../socket";

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
    setUser({ name: name, email: email });
    console.log("login", User);
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
    // socket.on("joined-call", handleCallJoined);

    //cleanup
    return function () {
      // socket.off("connect", onConnect);
      // socket.off("disconnect", onDisconnect);
      // socket.off("joined-call", handleCallJoined);
    };
  }, [socket, handleCallJoined]);

  return (
    <div className="container">
      <div className="card">
        <div className="card-image">
          {/* <h2 className="card-heading">
            Get started
            <small>Let us create your account</small>
          </h2> */}
        </div>
        <form className="card-form">
          <div className="input">
            <input
              type="text"
              className="input-field"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
            />
            <label className="input-label">Full name</label>
          </div>
          <div className="input">
            <input
              type="text"
              className="input-field"
              id="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
            <label className="input-label">Email</label>
          </div>

          <div className="action">
            <button className="action-button" onClick={handleJoinCall}>
              Get started
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
