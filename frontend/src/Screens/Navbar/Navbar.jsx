import "./Navbar.css"; // You'll create this CSS file in the next step
import { useSocket } from "../../socket";
import React from "react";
import { useUser } from "../../socket";
import { useNavigate } from "react-router-dom";

function haiku() {
  var adjs = [
      "autumn",
      "hidden",
      "bitter",
      "misty",
      "silent",
      "empty",
      "dry",
      "dark",
      "summer",
      "icy",
      "delicate",
      "quiet",
      "white",
      "cool",
      "spring",
      "winter",
      "patient",
      "twilight",
      "dawn",
      "crimson",
      "wispy",
      "weathered",
      "blue",
      "billowing",
      "broken",
      "cold",
      "damp",
      "falling",
      "frosty",
      "green",
      "long",
      "late",
      "lingering",
      "bold",
      "little",
      "morning",
      "muddy",
      "old",
      "red",
      "rough",
      "still",
      "small",
      "sparkling",
      "throbbing",
      "shy",
      "wandering",
      "withered",
      "wild",
      "black",
      "young",
      "holy",
      "solitary",
      "fragrant",
      "aged",
      "snowy",
      "proud",
      "floral",
      "restless",
      "divine",
      "polished",
      "ancient",
      "purple",
      "lively",
      "nameless",
    ],
    nouns = [
      "waterfall",
      "river",
      "breeze",
      "moon",
      "rain",
      "wind",
      "sea",
      "morning",
      "snow",
      "lake",
      "sunset",
      "pine",
      "shadow",
      "leaf",
      "dawn",
      "glitter",
      "forest",
      "hill",
      "cloud",
      "meadow",
      "sun",
      "glade",
      "bird",
      "brook",
      "butterfly",
      "bush",
      "dew",
      "dust",
      "field",
      "fire",
      "flower",
      "firefly",
      "feather",
      "grass",
      "haze",
      "mountain",
      "night",
      "pond",
      "darkness",
      "snowflake",
      "silence",
      "sound",
      "sky",
      "shape",
      "surf",
      "thunder",
      "violet",
      "water",
      "wildflower",
      "wave",
      "water",
      "resonance",
      "sun",
      "wood",
      "dream",
      "cherry",
      "tree",
      "fog",
      "frost",
      "voice",
      "paper",
      "frog",
      "smoke",
      "star",
    ];

  return (
    adjs[Math.floor(Math.random() * (adjs.length - 1))] +
    "_" +
    nouns[Math.floor(Math.random() * (nouns.length - 1))]
  );
}

function Navbar() {
  const { socket } = useSocket();
  const { User } = useUser();

  //use navigate
  const navigate = useNavigate();

  async function join_call() {
    if (User) {
      console.log(User);
      await socket.connect();
      navigate("/joinRoom");
    } else {
      console.log("no user");
    } 
  }

  async function host_call() {
    if (User) {
      console.log(User);
      if (!socket.connected) {
        await socket.connect();
        socket.emit("join-call", {
          roomID: haiku(),
          emailID: User.email,
          name: User.name,
        });
      }
      console.log(socket);
    } else {
      console.log("no user");
    }
  }

  function disconnect() {
    socket.disconnect();
  }

  function handleCallJoined({ roomID }) {
    console.log("user joined room");
    //redirect user to the videocall page
    console.log(socket.connected);
    if (socket.connected) {
      //navigate("/joincall",{room : roomID});
      navigate("/joincall", { state: { roomID } });
    }
  }

  React.useEffect(() => {
    socket.on("joined-call", handleCallJoined);

    //cleanup
    return function () {
      socket.off("joined-call", handleCallJoined);
    };
  }, [socket, handleCallJoined]);

  return (
    <div className="navbar">
      <div className="left-content">
        <span className="title">
          Screen<b>Speaks</b>
        </span>
      </div>
      <div className="right-content">
        <a className="item" onClick={join_call}>
          Join a call
        </a>
        <div className="item" onClick={host_call}>
          Host a call
        </div>
        <a className="button" href="/login">
          Getting Started
        </a>
      </div>
    </div>
  );
}

export default Navbar;
