import "./Navbar.css"; // You'll create this CSS file in the next step
import { useSocket } from "../../socket";
import React from "react";
import { useUser } from "../../socket";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { socket } = useSocket();
  const { User, setUser } = useUser();
  console.log(User);
  const navigate = useNavigate();
  function joinCall() {
    if (User) {
      socket.connect();
      console.log(User);
      socket.emit("join-call", { roomID: "1", emailID: "piyushgarg@toph.com" });
    } else {
      navigate("/login");
    }
  }

  function disconnect() {
    socket.disconnect();
  }

  // function handleRoomJoined({ roomID }) {
  //   console.log("user joined room");
  //   //redirect user to the videocall page
  // }

  // React.useEffect(()=> {
  //   socket.on("joined-room",handleRoomJoined)
  // },[socket]);

  return (
    <div className="navbar">
      <div className="left-content">
        <span className="title">
          Screen<b>Share</b>
        </span>
      </div>
      <div className="right-content">
        <div className="item" onClick={joinCall}>
          Join a call
        </div>
        <div className="item" onClick={disconnect}>
          Host a call
        </div>

        <a className="button" href="/login">
          Getting Started
        </a>
      </div>
    </div>
  );
}

export default Navbar;
