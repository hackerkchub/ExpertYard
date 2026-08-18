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
import PreferenceOnboardingModal from "../../../shared/components/Onboarding/PreferenceOnboardingModal";
import { getUserPreferencesApi } from "../../../shared/api/userApi/userPreferences.api";

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

  const showChatLauncher =
    location.pathname === "/user" || location.pathname === "/user/";

  useEffect(() => {
    let sessionToken = localStorage.getItem("chat_session");

    if (!sessionToken) {
      sessionToken = generateId();
      localStorage.setItem("chat_session", sessionToken);
    }
  }, []);

  // Check if logged in user has preferences configured; if not, trigger onboarding
  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setShowOnboarding(false);
      return;
    }

    let isMounted = true;

    const checkPreferences = async () => {
      try {
        const res = await getUserPreferencesApi();
        if (isMounted && res?.success && res?.data) {
          const pref = res.data;
          const hasCategories = Array.isArray(pref.categories) && pref.categories.length > 0;
          const hasSubcategories = Array.isArray(pref.subcategories) && pref.subcategories.length > 0;
          const hasLocation = Boolean(pref.defaultLocation?.city);

          if (!hasCategories && !hasSubcategories && !hasLocation) {
            setShowOnboarding(true);
          } else {
            setShowOnboarding(false);
          }
        }
      } catch (err) {
        console.error("Failed to check user preferences for onboarding:", err);
      }
    };

    checkPreferences();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user?.id]);

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
      <ContinueChatBanner />
      <PublicExpertProvider>
        <Outlet />
        {showChatLauncher && <ChatLauncher />}
        <PreferenceOnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onSaveSuccess={() => setShowOnboarding(false)}
        />
      </PublicExpertProvider>
    </>
  );
}

