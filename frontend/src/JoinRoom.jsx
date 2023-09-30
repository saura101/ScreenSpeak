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
      navigate("/joincall",{room : roomID});
    }
  }

  React.useEffect(() => {
    socket.on("joined-call", handleCallJoined);

    //cleanup
    return function () {
      socket.off("joined-call", handleCallJoined);
    };
  }, [socket, handleCallJoined]);

  return (
    <div className="card">
      <div
        className="card-image"
        style={{
          backgroundImage:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBsmqYOIahn6zlljGMCs3OQXXRw8Taan8CMygcUejv&s",
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
  const [roomData, setRoomData] = useState([]);
  //const roomData = [];

  React.useEffect(() => {
    if (roomData.length === 0) {
      socket.emit("get-rooms");
    }
    async function handleAllRooms(data) {
      const { rooms } = data;
      console.log("imcoming array", rooms);
      console.log("all-rooms triggered");
      setRoomData((prevRoomData) => [...prevRoomData, ...rooms]);
      console.log("roomdata", roomData);
    }
    socket.on("all-rooms", handleAllRooms);

    return function () {
      socket.off("all-rooms", handleAllRooms);
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
      <h1>Join a Room</h1>
      <div className="card-container">
        <span>hello</span>
        {roomData.map((room, index) => (
          <Card key={index} roomName={room} />
        ))}
      </div>
    </div>
  );
}
export default JoinRoom;
