import "./Navbar.css"; // You'll create this CSS file in the next step

function Navbar() {
  return (
    <div className="navbar">
      <div className="left-content">
        <span className="title">Screen<b>Share</b></span>
      </div>
      <div className="right-content">
        <div className="item">Join a call</div>
        <div className="item">Host a call</div>
        <button className="button">Sign Up</button>
      </div>
    </div>
  );
}

export default Navbar;
