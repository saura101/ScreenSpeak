import React, { useState } from "react";
import { useSocket, useUser } from "./socket";
import ReactPlayer from "react-player";
import "./room.css";

let peer = null;
// let remoteVideo = document.getElementById("remoteVideo");
function Room(props) {
  const { socket } = useSocket();
  const { User } = useUser();

  console.log(socket);
  console.log(socket.id);
  //stream state
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  const [remoteSocket, setRemoteSocket] = useState(null);
  const [remoteName, setRemoteName] = useState(null);

  //creating Peer WebRTC connection

  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      },
    ],
  };

  async function makeCall(emailID) {
    peer = new RTCPeerConnection(config);
    peer.addEventListener("track", handleTrack);
    const offer = await peer.createOffer();
    await peer.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit("call-user", { emailID, offer });
  }

  async function answerCall(offer, from) {
    peer = new RTCPeerConnection(config);
    peer.addEventListener("track", handleTrack);
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("offer accepted");
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(new RTCSessionDescription(answer));
    socket.emit("call-accepted", { emailID: from, answer });
  }

  async function handleNewUser(data) {
    const { emailID, name, id } = data;
    alert(`${name} email: ${emailID} wants to join`);
    setRemoteSocket(id);
    //setRemoteEmail(emailID);
    setRemoteName(name);
    await makeCall(emailID);
  }

  async function handleIncomingCall(data) {
    const { from, offer, id, myName } = data;
    setRemoteSocket(id);
    //setRemoteEmail(from);
    setRemoteName(myName);
    console.log(`incoming call from ${from}`, offer);
    await answerCall(offer, from);
  }

  async function setAnswer(answer) {
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("answwer Accepted");
    console.log("call got accepted", answer);
  }

  async function handleAcceptedCall(data) {
    const { answer } = data;
    await setAnswer(answer);
  }

  async function getUserMediaStream() {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
    } catch (err) {
      console.log(err);
    }
  }

  async function sendStream() {
    myStream.getTracks().forEach(async (track) => {
      await peer.addTrack(track, myStream);
      console.log("stream sent", myStream);
    });
  }

  async function handleSend() {
    peer.addEventListener("negotiationneeded", handleNegotiation);
    await sendStream();
    peer.addEventListener("track", handleTrack);
  }

  async function handleTrack(event) {
    const streams = event.streams;
    console.log("recieved", streams[0]);
    setRemoteStream(streams[0]);
    console.log("remote", remoteStream);
  }

  async function handleNegoIncoming(data) {
    const { from, offer } = data;
    peer.setRemoteDescription(new RTCSessionDescription(offer));
    const ans = await peer.createAnswer();
    peer.setLocalDescription(new RTCSessionDescription(ans));
    socket.emit("nego-done", { to: from, ans });
  }

  async function handleNegoFinal(data) {
    const { ans } = data;
    await peer.setRemoteDescription(new RTCSessionDescription(ans));
  }

  React.useEffect(() => {
    socket.on("user-joined", handleNewUser);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleAcceptedCall);
    socket.on("nego-needed", handleNegoIncoming);
    socket.on("nego-final", handleNegoFinal);

    //cleanup
    return function () {
      socket.off("user-joined", handleNewUser);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleAcceptedCall);
      socket.off("nego-needed", handleNegoIncoming);
      socket.off("nego-final", handleNegoFinal);
    };
  }, [
    socket,
    handleNewUser,
    handleIncomingCall,
    handleAcceptedCall,
    handleNegoIncoming,
    handleNegoFinal,
  ]);

  async function peerCheck() {
    if (!remoteSocket) {
      document.getElementById("call").disabled = true;
      console.log("hellomf");
      //console.log("peer3",peer);
    } else if (remoteSocket) {
      document.getElementById("call").disabled = false;
      console.log("hellodeer");
      //console.log("peer4",peer);
    }
  }

  async function handleCall() {
    getUserMediaStream();
    console.log("hello ji kaise ho saare");
    //peer.addEventListener("negotiationneeded",handleNegotiation);
  }

  function handleDisconnect() {
    if (myStream) {
      const tracks = myStream.getTracks();
      tracks.forEach((track) => track.stop());
      setMyStream(null); // Clear the stream state
      console.log("Room Disconnected");
      socket.emit("room-diconnect",{ room : props.roomID, email : User.email });
      socket.disconnect();
    }
  }

  React.useEffect(() => {
    peerCheck();
    //cleanup
    return function () {
      peerCheck();
    };
  }, [remoteSocket]);

  async function handleNegotiation() {
    const offer = await peer.createOffer();
    peer.setLocalDescription(new RTCSessionDescription(offer));
    socket.emit("nego-needed", { offer, to: remoteSocket });
  }

  return (
    <div className="room">
      <span>Room: {props.roomID}</span>
      <span>{remoteSocket ? "connected" : "no one in room"}</span>
      <div className="video-call-container" style={{ position: "relative" }}>
        {myStream && (
          <div
            className="outgoing-video vid"
            style={{ width: "80%", height: "80%", margin: "10px" }}
          >
            <ReactPlayer
              url={myStream}
              width="100%"
              height="100%"
              playing
              muted
            />
            <span className="user-name">{User.name}</span>
          </div>
        )}
        {remoteStream && (
          <div
            className="incoming-video vid"
            style={{ width: "80%", height: "80%", margin: "10px" }}
          >
            <ReactPlayer
              url={remoteStream}
              width="100%"
              height="100%"
              playing
            />
            <span className="user-name">{remoteName}</span>
          </div>
        )}
        {/* <video id="remoteVideo" autoPlay></video> */}
      </div>
      <div>
        <button onClick={handleCall} id="call">
          send video
        </button>
        <button onClick={handleSend} id="call">
          recieve video
        </button>
        <button onClick={handleDisconnect} id="call">
          Disconnect video
        </button>
      </div>
    </div>
  );
}

export default Room;
