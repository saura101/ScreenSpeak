// VideoCall.js
import Room from "../../room";
import React, { useState } from "react";
import "./JoinCall.css";
import { useLocation } from "react-router-dom";

const JoinCall = () => {
  const { state } = useLocation();

  return <Room roomID={state.roomID} />;
};

export default JoinCall;
