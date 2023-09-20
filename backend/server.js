import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app=express();
const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
    // options
    cors: {
        origin: "http://localhost:5173"
      }
  });

io.on("connection", (socket) => {
    console.log(socket.connected);
    console.log("a new user has connected",socket.id);
});
  

httpServer.listen(PORT,()=> {
    console.log(`server running on port ${PORT}`);
})