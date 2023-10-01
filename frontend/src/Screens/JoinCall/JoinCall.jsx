// VideoCall.js
import Room from "../../room";
import { SocketProvider } from "../../socket";
import React, { useState } from "react";
import { useSocket } from "../../socket";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPause,
  FaPlay,
  FaPhone,
} from "react-icons/fa";
import "./JoinCall.css";
import { useLocation } from "react-router-dom";

const JoinCall = () => {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const { state } = useLocation();

  console.log(state);
  const toggleAudio = () => {
    //setIsAudioMuted(!isAudioMuted);
  };

  const togglePause = () => {
    // setIsPaused(!isPaused);
  };

  const endCall = () => {
    alert("Call ended");
  };

  return (
    <div className="video-call">
      <div className="video-screen">
        <span className="roomName">{state.roomID}</span>
        <Room />
      </div>
      {/* <div className="controls">
        <button
          onClick={toggleAudio}
          className={`control-button ${isAudioMuted ? "muted" : ""}`}
        >
          {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button onClick={endCall} className="control-button hang-up">
          <FaPhone />
        </button>
        <button
          onClick={togglePause}
          className={`control-button ${isPaused ? "paused" : ""}`}
        >
          {isPaused ? <FaPlay /> : <FaPause />}
        </button>
      </div> */}
    </div>
  );
};

export default JoinCall;
