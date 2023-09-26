import React, { useState } from "react";
import { useSocket } from "./socket";
import ReactPlayer from "react-player";


let peer = null;
function Room() {

    const { socket } = useSocket();
    console.log(socket);
    console.log(socket.id);
    //stream state
    const [myStream, setMyStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [remoteSocket, setRemoteSocket] = useState(null);
    const [remoteEmail, setRemoteEmail] = useState(null);
    
    //creating Peer WebRTC connection
    
    const config = {
        "iceServers" : [{ "urls" : ["stun:stun.l.google.com:19302","stun:stun2.l.google.com:19302"] }]
    };

    async function makeCall(emailID) {
        peer = new RTCPeerConnection(config);
        peer.addEventListener("track",handleTrack);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.emit("call-user", {emailID, offer});
        // const ans = await handleAcceptedCall(data);
        // await peer.setRemoteDescription(ans);
        // console.log("call got accepted",ans);
    }

    async function answerCall(offer,from) {
        peer = new RTCPeerConnection(config);
        peer.addEventListener("track",handleTrack);
        await peer.setRemoteDescription(offer);
        console.log("gublu chutiya");
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("call-accepted",{ emailID: from, answer });
        //console.log("peer1",peer);
    }

    async function handleNewUser(data) {
        const {emailID, name, id} = data;
        alert(`${name} email: ${emailID} wants to join`);
        setRemoteSocket(id);
        setRemoteEmail(emailID);
        await makeCall(emailID);
        //console.log("peer2",peer);
    }

    async function handleIncomingCall(data) {
        const { from, offer, id} = data;
        setRemoteSocket(id);
        setRemoteEmail(from);
        console.log(`incoming call from ${from}`,offer);
        await answerCall(offer,from);
    }

    async function setAnswer(answer) {
        await peer.setRemoteDescription(answer);
        console.log("abhshek chutiya");
        console.log("call got accepted",answer);
    }

    async function handleAcceptedCall(data) {
        const { answer } = data;
        await setAnswer(answer);
        //peer.onTrack()
    }

    async function getUserMediaStream() {
        // let stream = null;
        // try {
        //     stream = await navigator.mediaDevices.getUserMedia({ audio : true, video : true});
        //     setMyStream(stream);
        // } catch(err) {
        //     console.log(err);
        // }
    }

    async function sendStream() {
         myStream.getTracks().forEach(async(track) => {
            //peer.peer.addTrack(track,stream);
            peer.addTrack(track,myStream);
            console.log("stream sent",myStream);
        });
    }

    function handleSend() {
        peer.addEventListener("track",handleTrack);
        sendStream();
    }

    async function handleTrack(event) {
        console.log("recieved",event.streams[0]);
        const streams = event.streams;
        setRemoteStream(streams[0]);
    }

    async function handleNegoIncoming(data) {
        const { from, offer } = data;
        peer.setRemoteDescription(offer);
        const ans = await peer.createAnswer();
        peer.setLocalDescription(new RTCSessionDescription(ans));
        socket.emit("nego-done",{ to: from, ans });
    }

    async function handleNegoFinal(data) {
        const { ans } = data;
        // await peer.setLocalDescription(ans);
    }

    React.useEffect(()=> {
        socket.on("user-joined",handleNewUser)
        socket.on("incoming-call",handleIncomingCall);
        socket.on("call-accepted",handleAcceptedCall);
        socket.on("nego-needed",handleNegoIncoming);
        socket.on("nego-final",handleNegoFinal);

        //cleanup
        return function () {
            socket.off("user-joined",handleNewUser);
            socket.off("incoming-call",handleIncomingCall);
            socket.off("call-accepted",handleAcceptedCall);
            socket.off("nego-needed",handleNegoIncoming);
            socket.off("nego-final",handleNegoFinal);
        }

    },[socket,handleNewUser,handleIncomingCall,handleAcceptedCall,handleNegoIncoming,handleNegoFinal])

    async function peerCheck() {
        if(!remoteSocket)
        {
            document.getElementById("call").disabled = true;
            console.log("hellomf");
            //console.log("peer3",peer);
        }
        else if(remoteSocket) {
            document.getElementById("call").disabled = false;
            console.log("hellodeer");
            //console.log("peer4",peer);
        }
    }

    async function handleCall() {
        //getUserMediaStream();
        console.log("peer5",peer);
        try {
            let stream = await navigator.mediaDevices.getUserMedia({ audio : true, video : true});
            setMyStream(stream);
            console.log("hello ji kaise ho saare");
            // if(peer === null) {
            //     console.log(remoteEmail);
            //     makeCall(remoteEmail);
            //     console.log("no kaise");
            // }
            peer.addEventListener("negotiationneeded",handleNegotiation);
            //peer.addEventListener("track",handleTrack);
        } catch(err) {
            console.log(err);
        }
        
    }
    React.useEffect(()=>{
        // getUserMediaStream();
        //peer.addEventListener("track",handleTrack);
        peerCheck();
        //cleanup
        return function () {
            peerCheck();
            //peer.removeEventListener("track",handleTrack);
        }
    },[remoteSocket]);


    async function handleNegotiation() {
        const offer = await peer.createOffer();
        peer.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit("nego-needed",{ offer, to : remoteSocket});
    }

    React.useEffect(()=> {
        //peer.addEventListener("negotiationneeded",handleNegotiation);
        
        return function () {
            //peer.removeEventListener("negotiationneeded",handleNegotiation);
        }
    },[handleNegotiation]);

    return (
        <div className="room">
            <h1>call room</h1>
            <h4>{remoteSocket ? "connected" : "no one in room" }</h4>
            <div className="stream-cont">
                <div className="stream">
                <ReactPlayer url={myStream} playing muted/>
                </div>
                <div className="stream">
                <ReactPlayer url={remoteStream} playing />
                </div>
            </div>
            <button onClick={handleCall} id="call">call</button>
            <button onClick={handleSend} id="call">send</button>
        </div>
    );
}

export default Room;