import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SocketProvider } from "./socket";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Screens/Login/Login.jsx";
import JoinCall from "./Screens/JoinCall/JoinCall.jsx";
import Room from "./room.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
        <App />
    ),
  },
  {
    path: "/login",
    element: (
        <Login />
    ),
  },
  {
    path: "/joincall",
    element: (
        <JoinCall />
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider >
      <RouterProvider router={router} />
    </SocketProvider>  
  </React.StrictMode>
);
