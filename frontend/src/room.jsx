import React from "react";
import { useSocket } from "./socket";

function room() {

    const { socket } = useSocket();

    //creating Peer WebRTC connection

    async function makeCall(emailID) {
        const peer = RTCPeerConnection({
            "iceServers" : [{ "urls" : "stun.l.google.com:19302" }]
        });
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("call-user", {emailID, offer});
    }

    async function handleNewUser(data) {
        const {emailID, name } = data;
        makeCall(emailID);
    }

    async function handleIncomingCall(data) {
        const { from, offer } = data;
        console.log(`incoming call from ${from}`);
    }

    React.useEffect(()=> {
        socket.on("user-joined",handleNewUser)
        socket.on("incoming-call",handleIncomingCall);
    },[])
    return (
        <div className="room">
            <h1>call room</h1>
        </div>
    );
}

export default room;