import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SocketProvider, UserProvider } from "./socket";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Screens/Login/Login.jsx";
import JoinRoom from "./JoinRoom.jsx";
import JoinCall from "./Screens/JoinCall/JoinCall.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/joincall",
    element: <JoinCall/>
  },
  {
    path: "/joinRoom",
    element: <JoinRoom/>
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </SocketProvider>
  </React.StrictMode>
);
