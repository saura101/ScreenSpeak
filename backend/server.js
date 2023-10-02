import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
//import bodyParser from "body-parser";
import cors from "cors";

const app=express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    // options
    cors: {
        origin: "https://extraordinary-crumble-2b10dc.netlify.app",
        methods: ["GET", "POST"]
      }
  });

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();
const emailToNameMapping = new Map();
const roomidToUserMapping = new Map();

io.on("connection", (socket) => {
    console.log(socket.connected);
    console.log("a new user has connected",socket.id);

    socket.on("join-call",(data) => {
        const { roomID, emailID, name } = data;
        emailToNameMapping.set(emailID,name);
        if(roomidToUserMapping.has(roomID)) {
            if(roomidToUserMapping.get(roomID) === 2) {
                //room full
                return;
            }
            roomidToUserMapping.set(roomID,2);
        }
        roomidToUserMapping.set(roomID,1);
        console.log(`user ${name} and ${emailID} joined the room ${roomID}`);
        emailToSocketMapping.set(emailID, socket.id);
        socketToEmailMapping.set(socket.id, emailID);
        socket.join(roomID);
        socket.emit("joined-call", {roomID});
        console.log(socket.connected);
        let id = socket.id;
        //except the sender itself
        socket.broadcast.to(roomID).emit("user-joined",{ name, emailID, id});
    });

    socket.on("call-user",(data)=> {
        const {emailID, offer } = data;
        const socketID = emailToSocketMapping.get(emailID);
        const fromEmail = socketToEmailMapping.get(socket.id);
        const myName = emailToNameMapping.get(fromEmail);
        let id = socket.id;
        socket.to(socketID).emit("incoming-call", { from : fromEmail , offer, id, myName });
    });

    socket.on("call-accepted",(data) => {
        const { emailID, answer } = data;
        const socketID = emailToSocketMapping.get(emailID);
        socket.to(socketID).emit("call-accepted",{ answer })
    });

    socket.on("nego-needed",(data) => {
        const { offer , to } = data;
        socket.to(to).emit("nego-needed",{ from : socket.id, offer}); 
    });

    socket.on("nego-done",(data) => {
        const { to , ans } = data;
        socket.to(to).emit("nego-final",{ ans }); 
    });

    socket.on("get-rooms",()=>{
        const data = [];
        roomidToUserMapping.forEach((values, keys) => {
            data.push(keys);
            console.log(keys);
        });
        console.log(data);
        //console.log("get-rooms triggered");
        console.log(socket.id);
        io.to(socket.id).emit("all-rooms",{ rooms : data });
    });

});
  

httpServer.listen(PORT,()=> {
    console.log(`server running on port ${PORT}`);
})