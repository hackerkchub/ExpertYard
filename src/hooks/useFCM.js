import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase/firebase";

const channel = new BroadcastChannel("call_channel");

const useFCM = (openCallPopup) => {
 useEffect(() => {
  if (!messaging) return;

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("FCM FULL PAYLOAD:", payload);

    if (payload.data?.type === "VOICE_CALL") {
      openCallPopup(payload.data);
      channel.postMessage(payload.data);
    }
  });

  return () => {
    unsubscribe();
    channel.close(); // cleanup
  };
}, [openCallPopup]);
}

export default useFCM;