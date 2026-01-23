import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "@/shared/api/socket";
import { CALL_EVENTS } from "@/shared/constants/call.constants";

export function useVoiceCall({ role }) {
  const [callState, setCallState] = useState("idle");
  const [callId, setCallId] = useState(null);
  const [incoming, setIncoming] = useState(null);
  const [endReason, setEndReason] = useState(null);

  const listenersAttachedRef = useRef(false);

  useEffect(() => {
  if (listenersAttachedRef.current) return;
  listenersAttachedRef.current = true;

  const onIncoming = (data) => {
    if (role === "expert") {
      setIncoming(data);
      setCallState("incoming");
    }
  };

  const onConnected = ({ callId }) => {
    setCallId(callId);
    setCallState("connected");
  };

  const onEnded = ({ reason }) => {
    setCallState("ended");
    setEndReason(reason || null);
    setIncoming(null);
    setCallId(null);
  };

  const onBusy = () => setCallState("busy");
  const onOffline = () => setCallState("offline");

  socket.on(CALL_EVENTS.INCOMING, onIncoming);
  socket.on(CALL_EVENTS.CONNECTED, onConnected);
  socket.on(CALL_EVENTS.ENDED, onEnded);
  socket.on(CALL_EVENTS.BUSY, onBusy);
  socket.on(CALL_EVENTS.OFFLINE, onOffline);

  return () => {
    socket.off(CALL_EVENTS.INCOMING, onIncoming);
    socket.off(CALL_EVENTS.CONNECTED, onConnected);
    socket.off(CALL_EVENTS.ENDED, onEnded);
    socket.off(CALL_EVENTS.BUSY, onBusy);
    socket.off(CALL_EVENTS.OFFLINE, onOffline);
    listenersAttachedRef.current = false;
  };
}, [role]);

  // const startCall = useCallback((expertId) => {
  //   setCallState("calling");
  //   socket.emit(CALL_EVENTS.START, { expertId });
  // }, []);

  const acceptCall = useCallback(() => {
    if (!incoming) return;
    socket.emit(CALL_EVENTS.ACCEPT, { callId: incoming.callId });
  }, [incoming]);

  const endCall = useCallback(() => {
    if (!callId) return;
    socket.emit(CALL_EVENTS.END, { callId });
  }, [callId]);

  return {
    callState,
    callId,
    incoming,
    endReason,
    // startCall,
    acceptCall,
    endCall,
  };
}
