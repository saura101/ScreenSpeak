import React, { useState } from "react";
import "./joinRoom.css";
import { useUser, useSocket } from "./socket";
import { useNavigate } from "react-router-dom";

// Card component
function Card(props) {
  const { User } = useUser();
  const { socket } = useSocket();
  const navigate = useNavigate();

  async function join_call(roomName) {
    if (User) {
      console.log(User);
      //await socket.connect();
      socket.emit("join-call", {
        roomID: roomName,
        emailID: User.email,
        name: User.name,
      });
      console.log(socket);
    } else {
      console.log("no user");
    }
  }

  function handleCallJoined({ roomID }) {
    console.log("user joined room");
    //redirect user to the videocall page
    console.log(socket.connected);
    if (socket.connected) {
      //navigate("/joincall",{room : roomID});
      navigate("/joincall", { state: { roomID } });
    }
  }

  function getBgImage() {
    let n = 1+ Math.floor(Math.random()*6);
    return "url('bg"+n+".jpg')";
  }

  React.useEffect(() => {
    socket.on("joined-call", handleCallJoined);

    //cleanup
    return function () {
      socket.off("joined-call", handleCallJoined);
    };
  }, [socket, handleCallJoined]);

  return (
    <div className="room_card">
      <div
        className="room_card-image"
        style={{ 
          backgroundImage : getBgImage()
        }}
      ></div>
      <div className="card-info">
        <h2>{props.roomName}</h2>
        <button
          className="joinRoomButton"
          onClick={() => {
            join_call(props.roomName);
          }}
        >
          Join Room
        </button>
      </div>
    </div>
  );
}

function JoinRoom() {
  const { socket } = useSocket();
  console.log(socket);

  //room info
  const [roomData, setRoomData] = useState(null);//use state
  const [err,setErr] = useState(null);
  //const roomData = [];

  function handleRoomFull() {
    console.log("room full!");
    setErr("ROOM FULL!");
  }

  React.useEffect(() => {
    if (!roomData) {
      socket.emit("get-rooms");
    }
    async function handleAllRooms(data) {
      const { rooms } = data;
      console.log("imcoming array", rooms);
      console.log("all-rooms triggered");
      setRoomData((prevRoomData) => [...rooms]);
      console.log("roomdata", roomData);
    }
    socket.on("all-rooms", handleAllRooms);
    socket.on("room-full",handleRoomFull);
    return function () {
      socket.off("all-rooms", handleAllRooms);
      socket.off("room-full",handleRoomFull);
    };
  }, [socket, roomData]);

  // React.useEffect(() => {
  //   socket.on("all-rooms", handleAllRooms);

  //   return function () {
  //     socket.off("all-rooms", handleAllRooms);
  //   }
  // }, [handleAllRooms]);

  return (
    <div className="join-room-container">
      <h1 className="JoinRoomHeading">Join a Room</h1>
      <h2>{err}</h2>
      <div className="card-container">
        {roomData && roomData.map((room, index) => (
          <Card key={index} roomName={room} />
        ))}
      </div>
    </div>
  );
}
export default JoinRoom;
