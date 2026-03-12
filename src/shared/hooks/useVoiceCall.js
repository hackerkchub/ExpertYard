import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "@/shared/api/socket";
import { CALL_EVENTS } from "@/shared/constants/call.constants";

export function useVoiceCall({ role }) {
  /* =====================
     STATE
  ===================== */
  const [callState, setCallState] = useState("idle");
  // idle | incoming | connected | ended | busy | offline

  const [callId, setCallId] = useState(null);
  const [incoming, setIncoming] = useState(null);
  const [endReason, setEndReason] = useState(null);

  /* =====================
     GUARD (VERY IMPORTANT)
  ===================== */
  const attachedRef = useRef(false);

  /* =====================
     SOCKET LISTENERS
  ===================== */
  useEffect(() => {
    // ❌ prevent multiple attachment
    if (attachedRef.current) return;
    attachedRef.current = true;

    console.log("🔌 useVoiceCall listeners attached");

    /* ---------- HANDLERS ---------- */

    const onIncoming = (data) => {
      if (role !== "expert") return;

      console.log("📞 Incoming call:", data);
      setIncoming(data);
      setCallState("incoming");
    };

    const onConnected = ({ callId }) => {
      console.log("✅ Call connected:", callId);
      setCallId(callId);
      setCallState("connected");
    };

    const onEnded = ({ reason }) => {
      console.log("❌ Call ended:", reason);
      setCallState("ended");
      setEndReason(reason || null);
      setIncoming(null);
      setCallId(null);
    };

    const onBusy = () => {
      console.log("🚫 Expert busy");
      setCallState("busy");
    };

    const onOffline = () => {
      console.log("🔴 Expert offline");
      setCallState("offline");
    };

    /* ---------- ATTACH ---------- */
    socket.on(CALL_EVENTS.INCOMING, onIncoming);
    socket.on(CALL_EVENTS.CONNECTED, onConnected);
    socket.on(CALL_EVENTS.ENDED, onEnded);
    socket.on(CALL_EVENTS.BUSY, onBusy);
    socket.on(CALL_EVENTS.OFFLINE, onOffline);

    /* ---------- CLEANUP ---------- */
    return () => {
      console.log("🧹 useVoiceCall listeners removed");

      socket.off(CALL_EVENTS.INCOMING, onIncoming);
      socket.off(CALL_EVENTS.CONNECTED, onConnected);
      socket.off(CALL_EVENTS.ENDED, onEnded);
      socket.off(CALL_EVENTS.BUSY, onBusy);
      socket.off(CALL_EVENTS.OFFLINE, onOffline);

      attachedRef.current = false;
    };
  }, [role]);

  /* =====================
     ACTIONS
  ===================== */

  // 👨‍💼 EXPERT accepts call
  const acceptCall = useCallback(() => {
    if (!incoming?.callId) return;

    console.log("✅ Accepting call:", incoming.callId);
    socket.emit(CALL_EVENTS.ACCEPT, {
      callId: incoming.callId,
    });
  }, [incoming]);

  // 🔚 End call (user or expert)
  const endCall = useCallback(() => {
    if (!callId) return;

    console.log("🔚 Ending call:", callId);
    socket.emit(CALL_EVENTS.END, { callId });
  }, [callId]);

  /* =====================
     RETURN API
  ===================== */
  return {
    callState,
    callId,
    incoming,
    endReason,
    acceptCall,
    endCall,
  };
}
