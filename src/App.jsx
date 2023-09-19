import React from "react";
import Typed from "typed.js";

function App() {
  // Create reference to store the DOM element containing the animation
  const el = React.useRef(null);

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["This is a VideoCall App","mama gadha h", "mai pro hu"],
      typeSpeed: 50,
      loop: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <div className="">
      <h1>hhdakhkhdakjh</h1>
      <span ref={el} />
    </div>
  );
}

export default App;
