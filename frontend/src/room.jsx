import React, { useState } from "react";
import { useSocket } from "./socket";
import ReactPlayer from "react-player";

function Room() {

    const { socket } = useSocket();

    //creating Peer WebRTC connection

    //stream state
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [remoteSocket, setRemoteSocket] = useState(null);
    let peer = null;

    async function makeCall(emailID) {
        peer = new RTCPeerConnection({
            "iceServers" : [{ "urls" : ["stun:stun.l.google.com:19302","stun:stun2.l.google.com:19302"] }]
        });
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("call-user", {emailID, offer});
        // const ans = await handleAcceptedCall(data);
        // await peer.setRemoteDescription(ans);
        // console.log("call got accepted",ans);
    }

    async function answerCall(offer,from) {
        const peer = new RTCPeerConnection({
            "iceServers" : [{ "urls" : ["stun:stun.l.google.com:19302","stun:stun2.l.google.com:19302"] }]
        });
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("call-accepted",{ emailID: from, answer });
    }

    async function handleNewUser(data) {
        const {emailID, name, id} = data;
        alert(`${name} email: ${emailID} wants to join`);
        setRemoteSocket(id);
        await makeCall(emailID);
    }

    async function handleIncomingCall(data) {
        const { from, offer } = data;
        console.log(`incoming call from ${from}`,offer);
        await answerCall(offer,from);
    }

    async function setAnswer(answer) {
        await peer.setRemoteDescription(answer);
        console.log("call got accepted",answer);
    }

    async function handleAcceptedCall(data) {
        const { answer } = data;
        await setAnswer(answer);
    }

    async function getUserMediaStream() {
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio : true, video : true});
            setMyStream(stream);
            sendStream(stream);
        } catch(err) {
            console.log(err);
        }
    }

    async function sendStream(stream) {
        stream.getTracks().forEach((track) => {
            //peer.peer.addTrack(track,stream);
            peer.addTrack(track,stream);
        });
    }

    async function handleTrack(event) {
        const streams = event.streams;
        setRemoteStream(streams[0]);
    }

    React.useEffect(()=> {
        socket.on("user-joined",handleNewUser)
        socket.on("incoming-call",handleIncomingCall);
        socket.on("call-accepted",handleAcceptedCall);

        //cleanup
        return function () {
            socket.off("user-joined",handleNewUser);
            socket.off("incoming-call",handleIncomingCall);
            socket.off("call-accepted",handleAcceptedCall);
        }

    },[socket])

    // React.useEffect(()=>{
    //     getUserMediaStream();
    //     peer.addEventListener("track",handleTrack);

    //     //cleanup
    //     return function () {
    //         peer.removeEventListener("track",handleTrack);
    //     }
    // },[getUserMediaStream,peer,handleTrack]);
    
    return (
        <div className="room">
            <h1>call room</h1>
            <h4>{remoteSocket ? "connected" : "no one in room" }</h4>
            <ReactPlayer url={myStream} playing muted/>
            <ReactPlayer url={remoteStream} playing />
        </div>
    );
}

export default Room;