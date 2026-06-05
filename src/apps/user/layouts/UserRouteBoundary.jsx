import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { connectSocket, disconnectSocket, socket } from "../../../shared/api/socket";
import UserSocketListener from "../../../shared/socket/UserSocketListener";
import { useAuth } from "../../../shared/context/UserAuthContext";
import { generateToken } from "../../../firebase/generateToken";
import useFCM from "../../../hooks/useFCM";
import { PublicExpertProvider } from "../context/PublicExpertContext";
import ChatLauncher from "../components/ai-chat/ChatLauncher";

const generateId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return uuidv4();
};

export default function UserRouteBoundary() {
  const { user } = useAuth();
  const location = useLocation();

  const showChatLauncher =
    location.pathname === "/user" || location.pathname === "/user/";

  useEffect(() => {
    let sessionToken = localStorage.getItem("chat_session");

    if (!sessionToken) {
      sessionToken = generateId();
      localStorage.setItem("chat_session", sessionToken);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    connectSocket({
      userId: Number(user.id),
      role: "user",
    });

    socket.emit("register", {
      userId: Number(user.id),
      role: "user",
    });

    return () => {
      disconnectSocket();
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    generateToken("user");
  }, [user?.id]);

  useFCM((data) => {
    if (data.type === "VOICE_CALL") {
      window.dispatchEvent(new CustomEvent("incoming_call", { detail: data }));
    }

    if (data.type === "CHAT_REQUEST") {
      window.dispatchEvent(new CustomEvent("incoming_chat", { detail: data }));
    }
  });

  useEffect(() => {
    const handleResume = (data) => {
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
      <PublicExpertProvider>
        <Outlet />
        {showChatLauncher && <ChatLauncher />}
      </PublicExpertProvider>
    </>
  );
}
