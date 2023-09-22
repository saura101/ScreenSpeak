import React, { useMemo } from "react";
import { io } from "socket.io-client";
    
const socketContext = React.createContext(null);
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';
// export const socket = io(URL,{
//     autoConnect: false
// });

export const useSocket = () => {
    return React.useContext(socketContext);
};
export const SocketProvider = (props) => {

    const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';
    const name = "aditya";
    // const socket = useMemo(()=> {
    //     io(URL,{
    //         autoConnect: false
    //     })
    // }, []);

    const socket = io(URL,{
        autoConnect: false
    });

    // console.log(socket);

    return (
        <socketContext.Provider value={{socket, name}}>
            {props.children}
        </socketContext.Provider>
    )
}