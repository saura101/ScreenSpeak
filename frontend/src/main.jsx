import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SocketProvider } from "./socket";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Screens/Login/Login.jsx";
import JoinCall from "./Screens/JoinCall/JoinCall.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <SocketProvider>
        <App />
      </SocketProvider>
    ),
  },
  {
    path: "/login",
    element: (
      <SocketProvider>
        <Login />
      </SocketProvider>
    ),
  },
  {
    path: "/joincall",
    element: (
      <SocketProvider>
        <JoinCall />
      </SocketProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
