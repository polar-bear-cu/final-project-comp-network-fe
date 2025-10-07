import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import { UserProvider } from "./context/userContext";
import { SocketProvider } from "./context/socketContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/chat",
    element: (
      <UserProvider>
        <SocketProvider>
          <ChatPage />
        </SocketProvider>
      </UserProvider>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
