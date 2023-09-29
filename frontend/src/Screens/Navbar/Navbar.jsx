import "./Navbar.css"; // You'll create this CSS file in the next step
import { useSocket } from "../../socket";
import React from "react";
import { useUser } from "../../socket";
import { useNavigate } from "react-router-dom";

function Navbar() {


   const {socket} = useSocket();
   const {User} = useUser(); 

    //use navigate
    const navigate = useNavigate();

  async function join_call() {
    if(User) {
      console.log(User);
      if(!socket.connected) {
        await socket.connect();
        socket.emit("join-call",{ roomID: "1", emailID: User.email, name: User.name });
      }
      console.log(socket);
    } else {
      console.log("no user");
    }
    // socket.emit("join-call",{roomID: "1",emailID : "piyushgarg@toph.com"});
    // console.log("hello");
  }

  async function host_call() {
    if(User) {
      console.log(User);
      if(!socket.connected) {
        await socket.connect();
        socket.emit("join-call",{ roomID: "1", emailID: User.email, name: User.name });
      }
      console.log(socket);
    } else {
      console.log("no user");
    }
  }

  function disconnect() {
    socket.disconnect();
  }

  function handleCallJoined({ roomID }) {
    console.log("user joined room");
    //redirect user to the videocall page
    console.log(socket.connected);
    if(socket.connected) {
      navigate("/joincall");
    }
  }

  React.useEffect(()=> {
    socket.on("joined-call", handleCallJoined);

    //cleanup
    return function () {
      socket.off("joined-call", handleCallJoined);
    };

  },[socket,handleCallJoined]);



  return (
    <div className="navbar">
      <div className="left-content">
        <span className="title">
          Screen<b>Share</b>
        </span>
      </div>
      <div className="right-content">
        <div className="item" onClick={join_call}>
          Join a call
        </div>
        <div className="item" onClick={host_call}>
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
