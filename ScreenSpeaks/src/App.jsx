import React from "react";
import Typed from "typed.js";

function App() {
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["This is a VideoCall App"],
      typeSpeed: 50,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <div className="App">
      <span ref={el} />
      <h1>hhdakhkhdakjh</h1>
    </div>
  );
}

export default App;
