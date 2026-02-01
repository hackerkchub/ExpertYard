// src/apps/user/layout/MainLayout.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import UserSocketListener from "../../../shared/socket/UserSocketListener";

import { useAuth } from "../../../shared/context/UserAuthContext";
import { socket } from "../../../shared/api/socket";

export default function MainLayout() {
  const { user } = useAuth();
  // const userId = user?.id;

  /* ----------------------------------
     🔌 USER SOCKET REGISTER (ONLY HERE)
  ---------------------------------- */
useEffect(() => {
  if (!user?.id) return;

  const onConnect = () => {
    console.log("🔌 Socket connected → registering user", user.id);

    socket.emit("register", {
      userId: Number(user.id),
      role: "user",
    });
  };

  socket.on("connect", onConnect);

  if (!socket.connected) {
    socket.connect();
  }

  return () => {
    socket.off("connect", onConnect);
  };
}, [user?.id]);



  return (
    <>
      {/* 🔔 user events listener (NO register here) */}
      <UserSocketListener />

      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
