import React, { useState } from "react";
import Navbar from "./Screens/Navbar/Navbar";
import "./App.css";
import { useSocket } from "./socket";
import JoinCall from "./Screens/JoinCall/JoinCall";
import HomePage from "./Screens/HomePage/HomePage";
import Login from "./Screens/Login/Login";

function App() {
  const { socket } = useSocket();

  //useState hook
  const [isConnected, setIsConnected] = React.useState(socket.connected);
  const [email, setemail] = useState();
  const [roomid, setRoomid] = useState();

  React.useEffect(() => {
    //socket
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <>
      <Navbar />
      <HomePage />
      <Login />
      <JoinCall />
    </>
  );
}

export default App;
