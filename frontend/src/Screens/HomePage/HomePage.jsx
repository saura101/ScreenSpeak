import React from "react";
import "./HomePage.css";
import Typed from "typed.js";

const HomePage = () => {
  // strings: [
  //   ,
  // ],
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "This is a VideoCall App",
        "Bringing hearts closer",
        "one call at a time.",
      ],
      typeSpeed: 50,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <div className="mainScreen">
      <div className="leftSide">
        <h4>
          Unlock the power of face-to-face connections, no matter the distance.
          Our video calls bridge gaps and build bonds, connecting you with loved
          ones, colleagues, and friends as if youre right there beside them. Say
          hello to a world where miles fade into pixels, and conversations
          become moments to treasure.
        </h4>
        <span ref={el} />
      </div>
      <div className="rightSide"></div>
    </div>
  );
};

export default HomePage;
