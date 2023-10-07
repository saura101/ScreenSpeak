import React, { useState } from "react";
import { useSocket, useUser } from "./socket";
import ReactPlayer from "react-player";
import "./room.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneVolume,
  faPhoneSlash,
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

let peer = null;
// let remoteVideo = document.getElementById("remoteVideo");

function Room(props) {
  const { socket } = useSocket();
  const { User } = useUser();

  const navigate = useNavigate();

  console.log(socket);
  console.log(socket.id);
  //stream state
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  const [remoteSocket, setRemoteSocket] = useState(null);
  const [remoteEmail,setRemoteEmail] = useState(null);
  const [remoteName, setRemoteName] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const toggleVideo = async() => {
    setVideoEnabled(!videoEnabled);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioEnabled,
      video: videoEnabled,
    });
    setMyStream(stream);
    // handleCall();
    // Add code to enable/disable video as needed
  };

  const toggleAudio = async() => {
    setAudioEnabled(!audioEnabled);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: audioEnabled,
      video: videoEnabled,
    });
    setMyStream(stream);
    // handleCall();
    // Add code to enable/disable audio as needed
  };

  //creating Peer WebRTC connection

  const config = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302", "stun:stun2.l.google.com:19302","stun:stun.ekiga.net"],
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
    setRemoteEmail(emailID);
    await makeCall(emailID);
  }

  async function handleIncomingCall(data) {
    const { from, offer, id, myName } = data;
    setRemoteSocket(id);
    //setRemoteEmail(from);
    setRemoteName(myName);
    setRemoteEmail(from);
    console.log(`incoming call from ${from}`, offer);
    await answerCall(offer, from);
  }

  async function setAnswer(answer) {
    await peer.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("answwer Accepted");
    console.log("call got accepted", answer);
    // let aud = new Audio("Call_Connected.mp3")
    // aud.play();
  }

  async function handleAcceptedCall(data) {
    const { answer } = data;
    await setAnswer(answer);
  }

  async function getUserMediaStream() {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: audioEnabled,
        video: videoEnabled,
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
    // peer.addEventListener("negotiationneeded", handleNegotiation);
    // await sendStream();
    //peer.addEventListener("track", handleTrack);
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


    //window close
    window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
      e.returnValue = '';
    });
    window.addEventListener("unload", (event) => {
      setMyStream(null); // Clear the stream state
      setRemoteStream(null);
      setRemoteName(null);
      socket.emit("room-diconnect", { room: props.roomID, email: User.email });
      socket.disconnect();
      //peer.removeTrack();
      peer.close();
    });


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

  async function handleCall() {
    // const state = peer.connectionState;
    // console.log(state);
    // if(state === "closed") {
    //   await makeCall(remoteEmail);
    //   console.log("reconnect");
    // }
    
    getUserMediaStream();
    
    peer.addEventListener("connectionstatechange", (event) => {
      console.log("state change");
      const state = peer.connectionState;
      if(state === "connected") {
        let aud = new Audio("Call_Connected.mp3")
        aud.play();
        const btn = document.getElementById("call");
        btn.disabled = true;
        btn.classList.add("disabled");
      }
      if(state === "closed"|| state === "disconnected") {
        setMyStream(null); // Clear the stream state
        setRemoteStream(null);
        setRemoteName(null);
        setRemoteSocket(null);
        //peer.removeTrack();
        peer.close();
        console.log(peer);
        peer = null;
        let aud = new Audio("Hang_Up_Call.mp3");
        aud.play();
      }
    });
    peer.addEventListener("negotiationneeded", handleNegotiation);
    //await sendStream();
    console.log("hello ji kaise ho saare");
    //peer.addEventListener("negotiationneeded",handleNegotiation);
  }

  function handleDisconnect() {
    if (myStream) {
      const tracks = myStream.getTracks();
      tracks.forEach((track) => track.stop());
      setMyStream(null); // Clear the stream state
      setRemoteStream(null);
      setRemoteName(null);
      console.log("Room Disconnected");
      socket.emit("room-diconnect", { room: props.roomID, email: User.email });
      socket.disconnect();
      //peer.removeTrack();
      peer.close();
      peer = null;
      navigate("/");
      console.log("peer after disconnect",peer);
    }
  }

  React.useEffect(() => {

    async function peerCheck() {
      if (!remoteSocket) {
        const btn = document.getElementById("call");
        btn.disabled = true;
        btn.classList.add("disabled");
        console.log("hellomf");
        //console.log("peer3",peer);
      } else if (remoteSocket) {
        const btn = document.getElementById("call");
        btn.disabled = false;
        btn.classList.remove("disabled");
        console.log("hellodeer");
        //console.log("peer4",peer);
      }
    }

    peerCheck();

    if (myStream) {
      console.log("stream changed");
      sendStream();
    }
    //cleanup
    return function () {
      peerCheck();
    };
  }, [remoteSocket, myStream]);

  React.useEffect(() => {
    console.log("unmounted");
  },[])

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
            style={{  margin: "10px" }}
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
            style={{  margin: "10px" }}
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
          <FontAwesomeIcon icon={faPhoneVolume} />
        </button>
        {/* <button onClick={handleSend} id="call">
          recieve videosssssssssssss
        </button> */}

        <button onClick={toggleAudio} className="buttoncircle">
          {audioEnabled ? (
            <FontAwesomeIcon icon={faMicrophone} />
          ) : (
            <FontAwesomeIcon icon={faMicrophoneSlash} />
          )}
        </button>

        <button onClick={toggleVideo} className="buttoncircle">
          {videoEnabled ? (
            <FontAwesomeIcon icon={faVideo} />
          ) : (
            <FontAwesomeIcon icon={faVideoSlash} />
          )}
        </button>

        <button onClick={handleDisconnect} id="call">
          <FontAwesomeIcon icon={faPhoneSlash} />
        </button>
      </div>
    </div>
  );
}

export default Room;
