import React from "react";
import "./joinRoom.css";
import { useSocket } from "./socket";
// Card component



function Card({ backgroundImage, roomName }) {
  async function join_call(roomName) {
    if (User) {
      console.log(User);
      if (!socket.connected) {
        await socket.connect();
        socket.emit("join-call", {
          roomID: roomName,
          emailID: User.email,
          name: User.name,
        });
      }
      console.log(socket);
    } else {
      console.log("no user");
    }
  }
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
        <h2>{roomName}</h2>
        <button className="joinRoomButton" onClick={()=>{
            join_call(roomName);
        }} >
          Join Room
        </button>
      </div>
    </div>
  );
}

function JoinRoom() {
  const { socket } = useSocket();
  socket.emit("get-rooms");

  const roomData = [];
  function handleAllRooms(data) {
    data.forEach((values, keys) => {
      roomData.push(keys);
      console.log(keys);
    });
  }
  React.useEffect(() => {
    socket.on("all-rooms", handleAllRooms);
  }, []);
  return (
    <div className="join-room-container">
      <h1>Join a Room</h1>
      <div className="card-container">
        {roomData.map((room, index) => (
          <Card
            key={index}
            roomName={room}
          />
        ))}
      </div>
    </div>
  );
}
export default JoinRoom;
