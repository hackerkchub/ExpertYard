import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { connectSocket, disconnectSocket, socket } from "../../../shared/api/socket";
import UserSocketListener from "../../../shared/socket/UserSocketListener";
import ContinueChatBanner from "../../../shared/components/ContinueChatBanner";
import { useAuth } from "../../../shared/context/UserAuthContext";
import { generateToken } from "../../../firebase/generateToken";
import useFCM from "../../../hooks/useFCM";
import { PublicExpertProvider } from "../context/PublicExpertContext";
import ChatLauncher from "../components/ai-chat/ChatLauncher";
import ProfessionOnboardingModal from "../../../shared/components/Onboarding/ProfessionOnboardingModal";

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
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Invoke useFCM hook at top level of function component
  useFCM();

  const showChatLauncher =
    location.pathname === "/user" || location.pathname === "/user/";

  useEffect(() => {
    let sessionToken = localStorage.getItem("chat_session");

    if (!sessionToken) {
      sessionToken = generateId();
      localStorage.setItem("chat_session", sessionToken);
    }
  }, []);

  // Check if logged in user has profession set; if missing, trigger profession onboarding popup
  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setShowOnboarding(false);
      return;
    }

    const needsProfession = !user?.profession || !String(user.profession).trim();
    if (needsProfession) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [isLoggedIn, user?.id, user?.profession]);

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

  useEffect(() => {
    const handleResume = (data) => {
      if (data?.callId) {
        window.location.href = `/user/voice-call?channelName=${data.channelName}&token=${data.agoraToken}&callId=${data.callId}`;
      }
    };

    socket.on("call:resume_data", handleResume);
    return () => socket.off("call:resume_data", handleResume);
  }, []);

  return (
    <>
      <UserSocketListener />
      <ContinueChatBanner />
      <PublicExpertProvider>
        <Outlet />
        {showChatLauncher && <ChatLauncher />}
        <ProfessionOnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
        />
      </PublicExpertProvider>
    </>
  );
}
