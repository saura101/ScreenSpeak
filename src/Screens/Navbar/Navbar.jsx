import "./Navbar.css"; // You'll create this CSS file in the next step
import { socket } from "../../socket";

function Navbar() {

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className="navbar">
      <div className="left-content">
        <span className="title">Screen<b>Share</b></span>
      </div>
      <div className="right-content">
        
        <div className="item" onClick={ connect }>Join a call</div>
        <div className="item" onClick={ disconnect }>Host a call</div>
        <button className="button">Sign Up</button>
      </div>
    </div>
  );
}

export default Navbar;
