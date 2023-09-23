import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";

const app=express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    // options
    cors: {
        origin: "http://localhost:5173"
      }
  });

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();

io.on("connection", (socket) => {
    console.log(socket.connected);
    console.log("a new user has connected",socket.id);

    socket.on("join-call",(data) => {
        const { roomID, emailID, name } = data;
        console.log(`user ${emailID} joined the room ${roomID}`);
        emailToSocketMapping.set(emailID,socket.id);
        socketToEmailMapping.set(socket.id,emailID);
        socket.join(roomID);
        socket.emit("joined-room", {roomID});
        socket.broadcast.to(roomID).emit("user-joined",{ name,emailID});
    });
    socket.on("call-user",()=> {
        const {emailID, offer } = data;
        const socketID = emailToSocketMapping.get(emailID);
        const fromEmail = socketToEmailMapping.get(socket.id);
        socket.to(socketID).emit("incoming-call", { from : fromEmail , offer});
    });

});
  

httpServer.listen(PORT,()=> {
    console.log(`server running on port ${PORT}`);
})