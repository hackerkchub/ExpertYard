import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import UserSocketListener from "../../../shared/socket/UserSocketListener";

import { useAuth } from "../../../shared/context/UserAuthContext";
import { connectSocket, disconnectSocket, socket} from "../../../shared/api/socket";
import { PublicExpertProvider } from "../context/PublicExpertContext";
import useFCM from "../../../hooks/useFCM";
import { generateToken } from "../../../firebase/generateToken";

export default function MainLayout() {
  const { user } = useAuth();

  /* ----------------------------------
     🔌 CONNECT SOCKET AFTER LOGIN
  ---------------------------------- */
 useEffect(() => {
  if (!user?.id) return;

  connectSocket({
    userId: Number(user.id),
    role: "user",
  });

  // ✅ IMPORTANT: register emit karo
  socket.emit("register", {
    userId: Number(user.id),
    role: "user",
  });

  return () => {
    disconnectSocket();
  };
}, [user?.id]);
  /* ----------------------------------
   🔔 GENERATE FCM TOKEN
---------------------------------- */
useEffect(() => {
  if (!user?.id) return;

  generateToken("user");
}, [user?.id]);


useFCM((data) => {
  console.log("User FCM:", data);

  if (data.type === "VOICE_CALL") {
    window.dispatchEvent(
      new CustomEvent("incoming_call", { detail: data })
    );
  }

  if (data.type === "CHAT_REQUEST") {
    window.dispatchEvent(
      new CustomEvent("incoming_chat", { detail: data })
    );
  }
});

  /* ----------------------------------
     📞 RESUME CALL LISTENER
  ---------------------------------- */
  useEffect(() => {
    const handleResume = (data) => {
      console.log("📞 Resume call मिला:", data);

      window.dispatchEvent(
        new CustomEvent("go_to_call_page", {
          detail: data.callId,
        })
      );
    };

    socket.on("call:resume_data", handleResume);

    return () => socket.off("call:resume_data", handleResume);
  }, []);

  return (
    <>
      <UserSocketListener />
      <Navbar />
      <PublicExpertProvider>
      <Outlet />
       </PublicExpertProvider>
      <Footer />
   </>
  );
}