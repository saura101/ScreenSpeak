import React, { useState } from "react";
import { io } from "socket.io-client";

const socketContext = React.createContext(null);
const UserContext = React.createContext(null);
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';
// export const socket = io(URL,{
//     autoConnect: false
// });

export const useSocket = () => {
  return React.useContext(socketContext);
};

export const useUser = () => {
  return React.useContext(UserContext);
};

export const UserProvider = (props) => {

    const [User,setUser] = useState(null);
    return (
        <UserContext.Provider value={{ User, setUser}}>
            {props.children}
        </UserContext.Provider>
    )
}

export const SocketProvider = (props) => {
  const URL =
    process.env.NODE_ENV === "production" ? "https://screenspeaks-server.onrender.com" : "https://screenspeaks-server.onrender.com";
  const name = "aditya";
  const socket = io(URL, {
    autoConnect: false,
  });


  return (
    <socketContext.Provider value={{ socket, name }}>
      {props.children}
    </socketContext.Provider>
  );
};
