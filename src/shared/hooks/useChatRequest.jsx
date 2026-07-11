import { APP_CONFIG } from "../../config/appConfig";
// useChatRequest.js
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiUserCheck, FiX, FiZap } from "react-icons/fi";
import { useAuth } from "../context/UserAuthContext";
import { useWallet } from "../context/WalletContext";
import { socket } from "../api/socket";
import { getChatRoomCandidates, getChatRoomId } from "../utils/chatRoom";

const MIN_CHAT_MINUTES = 5;
const REQUEST_LOCK_TIMEOUT_MS = 10000;
const WAITING_TIMEOUT_SECONDS = 30;

/* ================= ANIMATIONS ================= */
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/* ================= STYLED COMPONENTS ================= */

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;

  @media (max-width: 768px) {
    align-items: flex-end;
    justify-content: center;
    z-index: 20060;
    padding: 0;
    background: rgba(15, 23, 42, 0.62);
    backdrop-filter: blur(4px);
  }
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  padding: 32px;
  border-radius: 24px;
  width: min(90vw, 420px);
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    max-width: 100%;
    max-height: 86dvh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 22px 16px calc(18px + env(safe-area-inset-bottom, 0px));
    border-radius: 26px 26px 0 0;
    box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.26);
  }

  @media (max-width: 768px) {
    &::before {
      content: "";
      position: absolute;
      top: 9px;
      left: 50%;
      width: 44px;
      height: 4px;
      border-radius: 999px;
      background: #cbd5e1;
      transform: translateX(-50%);
    }
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background: ${props => props.$bgColor || "#eff6ff"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  @media (max-width: 768px) {
    width: 52px;
    height: 52px;
    margin-bottom: 12px;
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: ${props => props.$color || "#0f172a"};
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 1.25;
    font-weight: 800;
  }
`;

const ModalText = styled.p`
  margin-top: 12px;
  margin-bottom: 0;
  color: #475569;
  line-height: 1.5;

  @media (max-width: 768px) {
    margin-top: 8px;
    font-size: 13.5px;
    line-height: 1.45;
  }
`;

const SpinnerWrapper = styled.div`
  margin-top: 20px;

  @media (max-width: 768px) {
    margin-top: 14px;
  }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1.2s linear infinite;
  margin: 0 auto;
`;

const Button = styled.button`
  margin-top: ${props => props.$marginTop || 24}px;
  padding: 12px 28px;
  border-radius: 40px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: ${props => props.$color || "#0f172a"};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-height: 46px;
    margin-top: ${props => Math.min(Number(props.$marginTop || 24), 16)}px;
    padding: 11px 18px;
    font-size: 14px;
  }
`;

const AIContainer = styled(motion.div)`
  background: #fff;
  padding: 32px;
  border-radius: 24px;
  width: min(92vw, 440px);
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    max-width: 100%;
    max-height: 88dvh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 22px 16px calc(18px + env(safe-area-inset-bottom, 0px));
    border-radius: 26px 26px 0 0;
    box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.26);

    &::before {
      content: "";
      position: absolute;
      top: 9px;
      left: 50%;
      width: 44px;
      height: 4px;
      border-radius: 999px;
      background: #cbd5e1;
      transform: translateX(-50%);
    }
  }
`;

const PriceRow = styled.div`
  margin-top: ${props => props.$marginTop || 0}px;
  font-size: ${props => props.$large ? "1.25rem" : "1rem"};
  font-weight: ${props => props.$bold ? "600" : "400"};
  color: ${props => props.$color || "#475569"};
`;

const DiscountBadge = styled.div`
  margin-top: 12px;
  color: #16a34a;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: center;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 9px;
    margin-top: 16px;
  }
`;

const PrimaryButton = styled.button`
  padding: 12px 24px;
  border-radius: 40px;
  border: none;
  background: #3b82f6;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    min-height: 46px;
    padding: 11px 18px;
    border-radius: 999px;
    font-size: 14px;
  }
`;

const SecondaryButton = styled.button`
  padding: 12px 24px;
  border-radius: 40px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background: #f8fafc;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    min-height: 46px;
    padding: 11px 18px;
    border-radius: 999px;
    font-size: 14px;
  }
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e2e8f0;
`;

const CountdownWrap = styled.div`
  margin-top: 14px;
`;

const CountdownText = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 5px 11px;
  border-radius: 999px;
  background: #eef2ff;
  color: #000080;
  font-size: 13px;
  font-weight: 800;
`;

const CountdownTrack = styled.div`
  width: 100%;
  height: 7px;
  margin-top: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #e2e8f0;
`;

const CountdownFill = styled.div`
  width: ${({ $progress }) => `${Math.max(0, Math.min(100, $progress))}%`};
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, #000080, #2563eb);
  transition: width 0.3s ease;
`;

const SheetCloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
  }

  @media (max-width: 768px) {
    top: 18px;
    right: 14px;
    width: 36px;
    height: 36px;
  }
`;

/* ================= HELPER ================= */
const ensureSocketConnected = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

/* ================= HOOK ================= */

export default function useChatRequest() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { balance } = useWallet();

  const userId = user?.id;
  const mountedRef = useRef(true);
  const requestLockTimeoutRef = useRef(null);
  const waitingCountdownRef = useRef(null);
  
  // Refs for stale closure prevention
  const currentRequestIdRef = useRef(null);
  const showWaitingRef = useRef(false);
  const aiOfferRef = useRef(null);
  const showAiOfferRef = useRef(false);

  const [chatRequestId, setChatRequestId] = useState(null);
  const [showWaiting, setShowWaiting] = useState(false);
  const [waitingSecondsLeft, setWaitingSecondsLeft] = useState(WAITING_TIMEOUT_SECONDS);
  const [waitingText, setWaitingText] = useState("Waiting for expert to accept...");
  const [rejectedMsg, setRejectedMsg] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  
  // AI states
  const [aiOffer, setAiOffer] = useState(null);
  const [showAiOffer, setShowAiOffer] = useState(false);
  const [aiError, setAiError] = useState("");
  const [isStartingAi, setIsStartingAi] = useState(false);

  /* ================= SYNC STATE TO REFS (prevent stale closures) ================= */
  useEffect(() => {
    currentRequestIdRef.current = chatRequestId;
    showWaitingRef.current = showWaiting;
    aiOfferRef.current = aiOffer;
    showAiOfferRef.current = showAiOffer;
  }, [chatRequestId, showWaiting, aiOffer, showAiOffer]);

  /* ================= CLEANUP ON UNMOUNT ================= */
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
      }
      if (waitingCountdownRef.current) {
        clearInterval(waitingCountdownRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const hasOpenPopup = showWaiting || showAiOffer || Boolean(rejectedMsg) || showCancelled || Boolean(aiError);
    if (!hasOpenPopup || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showWaiting, showAiOffer, rejectedMsg, showCancelled, aiError]);

  useEffect(() => {
    if (!showWaiting || !chatRequestId) {
      if (waitingCountdownRef.current) {
        clearInterval(waitingCountdownRef.current);
        waitingCountdownRef.current = null;
      }
      return undefined;
    }

    setWaitingSecondsLeft(WAITING_TIMEOUT_SECONDS);

    if (waitingCountdownRef.current) {
      clearInterval(waitingCountdownRef.current);
    }

    waitingCountdownRef.current = setInterval(() => {
      setWaitingSecondsLeft((current) => {
        if (current <= 1) {
          if (waitingCountdownRef.current) {
            clearInterval(waitingCountdownRef.current);
            waitingCountdownRef.current = null;
          }

          if (mountedRef.current && showWaitingRef.current) {
            setShowWaiting(false);
            setAiOffer((existingOffer) => existingOffer || {
              request_id: currentRequestIdRef.current,
              pricing_mode: "per_minute",
              fallback_reason: "timeout",
              ai_price: null,
              human_price: null,
            });
            setShowAiOffer(true);
            setIsRequesting(false);
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      if (waitingCountdownRef.current) {
        clearInterval(waitingCountdownRef.current);
        waitingCountdownRef.current = null;
      }
    };
  }, [showWaiting, chatRequestId]);

  /* ================= START CHAT ================= */
  const startChat = useCallback(
    ({ expertId, chatPrice, pricingMode = "per_minute", sessionPrice = null, sessionDuration = null }) => {
      if (isRequesting) return;
      
      if (!isLoggedIn) {
        navigate("/user/auth", { state: { from: location } });
        return;
      }

      const perMinute = Number(chatPrice || 0);
      
      if (pricingMode !== "subscription") {
        let requiredAmount;
        
        if (pricingMode === "session") {
          requiredAmount = Number(sessionPrice || perMinute);
        } else {
          requiredAmount = perMinute * MIN_CHAT_MINUTES;
        }

        if (Number(balance) < requiredAmount) {
          navigate("/user/wallet");
          return;
        }
      }
      
      setIsRequesting(true);

      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
      }
      
      requestLockTimeoutRef.current = setTimeout(() => {
        if (mountedRef.current) {
          console.warn("Request lock timeout - resetting isRequesting");
          setIsRequesting(false);
        }
      }, REQUEST_LOCK_TIMEOUT_MS);

      ensureSocketConnected();

      const requestData = {
        expert_id: expertId,
        pricing_mode: pricingMode,
      };

      if (pricingMode === "session" && sessionPrice && sessionDuration) {
        requestData.session_price = sessionPrice;
        requestData.session_duration = sessionDuration;
      }

      socket.emit("request_chat", requestData, (ack) => {
        console.log("SERVER ACK:", ack);
      });
    },
    [isLoggedIn, balance, navigate, isRequesting, location]
  );

  /* ================= CANCEL REQUEST ================= */
  const cancelRequest = useCallback(() => {
    if (!chatRequestId) return;

    ensureSocketConnected();

    socket.emit("cancel_chat_request", {
      request_id: chatRequestId,
    });

    if (mountedRef.current) {
      setShowWaiting(false);
setChatRequestId(null);
setShowAiOffer(false);
setAiOffer(null);
setAiError("");
setIsStartingAi(false);
    }
  }, [chatRequestId]);

  /* ================= AI CHAT FUNCTIONS ================= */
  const startAiChat = useCallback(() => {
    if (!aiOffer?.request_id || isStartingAi) return;

    setIsStartingAi(true);
    ensureSocketConnected();

    socket.emit("accept_ai_fallback", {
      request_id: aiOffer.request_id,
    });
  }, [aiOffer, isStartingAi]);

  const keepWaiting = useCallback(() => {
    setShowAiOffer(false);
    setAiOffer(null);
    setIsStartingAi(false);
    if (currentRequestIdRef.current) {
      setWaitingText("Waiting for expert to accept...");
      setShowWaiting(true);
    }
  }, []);

  const dismissAiOffer = useCallback(() => {
    setShowAiOffer(false);
    setAiOffer(null);
    setIsStartingAi(false);
    setIsRequesting(false);
  }, []);

  const tryAnotherExpert = useCallback(() => {
    dismissAiOffer();
    navigate("/user/call-chat?page=1&mode=chat");
  }, [dismissAiOffer, navigate]);

  useEffect(() => {
    const hasOpenPopup = showWaiting || showAiOffer || Boolean(rejectedMsg) || showCancelled || Boolean(aiError);
    if (!hasOpenPopup || typeof window === "undefined") return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (showWaiting) {
        cancelRequest();
        return;
      }

      if (showAiOffer) {
        dismissAiOffer();
        return;
      }

      if (rejectedMsg) {
        setRejectedMsg("");
        return;
      }

      if (showCancelled) {
        setShowCancelled(false);
        return;
      }

      if (aiError) {
        setAiError("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showWaiting, showAiOffer, rejectedMsg, showCancelled, aiError, cancelRequest, dismissAiOffer]);

  /* ================= SOCKET EVENTS ================= */
  useEffect(() => {
    // ========== PENDING HANDLER (with duplicate prevention) ==========
    const pending = (data = {}) => {
      const request_id = data.request_id;
      
      if (!request_id || !mountedRef.current) return;
      
      // SAME REQUEST ALREADY SHOWING -> IGNORE (prevents blinking)
      if (currentRequestIdRef.current === request_id && showWaitingRef.current) {
        console.log("Duplicate pending event ignored for request:", request_id);
        return;
      }
      
      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
        requestLockTimeoutRef.current = null;
      }
      
      setChatRequestId(request_id);
      setWaitingText(data.message || "Waiting for expert to accept...");
      setShowWaiting(true);
      setIsRequesting(false);
    };

    // ========== ACCEPTED HANDLER ==========
    const accepted = (data = {}) => {
      const room_id = getChatRoomId(data);
      
      console.log("chat_accepted received", room_id);
      
      if (!room_id) {
        console.warn("accepted event missing room_id", data);
        return;
      }
      
      if (!mountedRef.current) return;
      
      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
        requestLockTimeoutRef.current = null;
      }
      
      setShowWaiting(false);
      setChatRequestId(null);
      setIsRequesting(false);
      setShowAiOffer(false);
      setAiOffer(null);
      setAiError("");
      setIsStartingAi(false);
      
      navigate(`/user/chat/${room_id}`, {
        replace: true,
        state: { roomCandidates: getChatRoomCandidates(data) },
      });
    };

    // ========== REJECTED HANDLER ==========
    const rejected = (data = {}) => {
      const user_id = data.user_id;
      const message = data.message;
      
      console.log("chat_rejected received", { user_id, message });
      
      if (user_id && Number(user_id) !== Number(userId)) return;
      if (!mountedRef.current) return;
      
      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
        requestLockTimeoutRef.current = null;
      }
      
      setShowWaiting(false);
      setRejectedMsg(message || "Chat request was declined");
      setIsRequesting(false);
      setShowAiOffer(false);
      setAiOffer(null);
      setAiError("");
      setIsStartingAi(false);
    };

    const blocked = (data = {}) => {
      if (!mountedRef.current) return;

      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
        requestLockTimeoutRef.current = null;
      }

      setShowWaiting(false);
      setChatRequestId(null);
      setRejectedMsg(data?.message || "Chat is currently unavailable for this expert.");
      setIsRequesting(false);
      setShowAiOffer(false);
      setAiOffer(null);
      setAiError("");
      setIsStartingAi(false);
    };

    // ========== CANCELLED HANDLER ==========
    const cancelled = (data = {}) => {
      const user_id = data.user_id;
      
      if (user_id && Number(user_id) !== Number(userId)) return;
      if (!mountedRef.current) return;
      
      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
        requestLockTimeoutRef.current = null;
      }
      
      setShowWaiting(false);
      setShowCancelled(true);
      setIsRequesting(false);
    };

    // ========== AI OFFER HANDLER (with duplicate prevention) ==========
    const aiOfferHandler = (data = {}) => {
      console.log("ai_fallback_offer received", data);
      
      if (!data.request_id || !mountedRef.current) return;
      
      // SAME AI POPUP ALREADY OPEN -> IGNORE
      if (aiOfferRef.current?.request_id === data.request_id && showAiOfferRef.current) {
        console.log("Duplicate AI offer event ignored for request:", data.request_id);
        return;
      }
      
      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
        requestLockTimeoutRef.current = null;
      }
      
      setShowWaiting(false);
      setChatRequestId(null);
      setAiOffer(data);
      setShowAiOffer(true);
      setIsRequesting(false);
    };

    // ========== AI ACCEPTED HANDLER ==========
    const aiAccepted = (data = {}) => {
      const room_id = getChatRoomId(data);

      if (!room_id) {
        console.warn("ai_fallback_accepted missing room_id", data);
        return;
      }
      
      if (!mountedRef.current) return;
      
      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
        requestLockTimeoutRef.current = null;
      }
      
      setShowAiOffer(false);
      setAiOffer(null);
      setChatRequestId(null);
      setIsStartingAi(false);
      setIsRequesting(false);

      navigate(`/user/chat/${room_id}`, {
        state: {
          roomCandidates: getChatRoomCandidates(data),
          aiOrderId: data.ai_order_id || null,
          session_id: data.session_id || null,
          pricing_mode: data.pricing_mode,
          pricePerMinute: data.pricePerMinute,
          sessionPrice: data.sessionPrice,
          sessionDuration: data.sessionDuration,
          remainingMinutes: data.remainingMinutes ?? data.maxMinutes,
          endTime: data.endTime,
          is_ai_chat: true,
        },
        replace: true,
      });
    };

    // ========== AI FAILED HANDLER ==========
    const aiFailed = (data = {}) => {
      if (!mountedRef.current) return;
      
      if (requestLockTimeoutRef.current) {
        clearTimeout(requestLockTimeoutRef.current);
        requestLockTimeoutRef.current = null;
      }
      
      setAiError(data?.message || "Unable to start AI chat. Please try again.");
      setShowAiOffer(false);
      setAiOffer(null);
      setIsStartingAi(false);
      setIsRequesting(false);
    };

    // Register all socket event listeners
    socket.on("request_pending", pending);
    socket.on("chat_accepted", accepted);
    socket.on("chat_rejected", rejected);
    socket.on("chat_blocked", blocked);
    socket.on("chat_cancelled", cancelled);
    socket.on("ai_fallback_offer", aiOfferHandler);
    socket.on("ai_fallback_accepted", aiAccepted);
    socket.on("ai_fallback_failed", aiFailed);

    // Cleanup
    return () => {
      socket.off("request_pending", pending);
      socket.off("chat_accepted", accepted);
      socket.off("chat_rejected", rejected);
      socket.off("chat_blocked", blocked);
      socket.off("chat_cancelled", cancelled);
      socket.off("ai_fallback_offer", aiOfferHandler);
      socket.off("ai_fallback_accepted", aiAccepted);
      socket.off("ai_fallback_failed", aiFailed);
    };
  }, [navigate, userId]);

  // Fallback polling for chat request status
  useEffect(() => {
    if (!showWaiting || !chatRequestId) return undefined;

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("user_token");
        const res = await fetch(`${APP_CONFIG.API_BASE_URL}/chat/requests/${chatRequestId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) return;
        const data = await res.json();
        
        if (data && data.status) {
          console.log("Polled chat request status:", data.status);
          
          if (data.status === "accepted") {
            clearInterval(interval);
            setShowWaiting(false);
            setChatRequestId(null);
            setIsRequesting(false);
            setShowAiOffer(false);
            setAiOffer(null);
            setAiError("");
            setIsStartingAi(false);
            
            navigate(`/user/chat/${data.room_id}`, {
              replace: true,
              state: {
                roomCandidates: [data.user_id, data.expert_id],
                pricing_mode: data.pricing_mode,
                pricePerMinute: data.pricePerMinute,
                sessionPrice: data.sessionPrice,
                sessionDuration: data.sessionDuration,
                remainingMinutes: data.maxMinutes,
                endTime: data.endTime,
              },
            });
          } else if (data.status === "rejected" || data.status === "declined") {
            clearInterval(interval);
            setShowWaiting(false);
            setRejectedMsg("Chat request was declined");
            setIsRequesting(false);
          } else if (data.status === "cancelled") {
            clearInterval(interval);
            setShowWaiting(false);
            setShowCancelled(true);
            setIsRequesting(false);
          } else if (data.status === "pending_ai_offer") {
            clearInterval(interval);
            setShowWaiting(false);
            setChatRequestId(null);
            setAiOffer({
              request_id: chatRequestId,
              pricing_mode: "per_minute",
              fallback_reason: "expert_rejected",
            });
            setShowAiOffer(true);
            setIsRequesting(false);
          }
        }
      } catch (err) {
        console.error("Polling status error:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [showWaiting, chatRequestId, navigate]);

  // Helper to get AI price display
  const getAiPriceDisplay = useCallback((offer) => {
    if (!offer) return "";
    if (offer.ai_price == null) return "Available instantly";
    
    if (offer.pricing_mode === "per_minute") {
      return `₹${offer.ai_price}/min`;
    }
    
    if (offer.pricing_mode === "session") {
      return `${offer.session_duration} min session • ₹${offer.ai_price}`;
    }
    
    if (offer.pricing_mode === "subscription") {
      return "Use subscription";
    }
    
    return `₹${offer.ai_price}`;
  }, []);

  // Helper to get human price display
  const getHumanPriceDisplay = useCallback((offer) => {
    if (!offer) return "";
    if (offer.human_price == null) return "Human expert did not respond in time";
    
    if (offer.pricing_mode === "per_minute") {
      return `Human Chat: ₹${offer.human_price}/min`;
    }
    
    if (offer.pricing_mode === "session") {
      return `Human Chat: ₹${offer.human_price}`;
    }
    
    if (offer.pricing_mode === "subscription") {
      return "Human Chat: Subscription";
    }
    
    return `Human Chat: ₹${offer.human_price}`;
  }, []);

  /* ================= POPUPS COMPONENT (with smoother animations) ================= */
  const ChatPopups = () => (
    <AnimatePresence mode="wait" initial={false}>
      {/* WAITING MODAL */}
      {showWaiting && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-waiting-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.28,
                ease: "easeOut"
              }
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              transition: {
                duration: 0.18
              }
            }}
          >
            <SheetCloseButton type="button" aria-label="Cancel chat request" onClick={cancelRequest}>
              <FiX size={18} />
            </SheetCloseButton>
            <IconWrapper $bgColor="#eff6ff">
              <FiUserCheck size={28} color="#3b82f6" />
            </IconWrapper>
            <ModalTitle id="chat-waiting-title">Request Sent</ModalTitle>
            <ModalText>{waitingText}</ModalText>
            <CountdownWrap>
              <CountdownText>
                Waiting for expert response... {waitingSecondsLeft}s
              </CountdownText>
              <CountdownTrack aria-hidden="true">
                <CountdownFill $progress={(waitingSecondsLeft / WAITING_TIMEOUT_SECONDS) * 100} />
              </CountdownTrack>
            </CountdownWrap>
            <SpinnerWrapper>
              <Spinner />
            </SpinnerWrapper>
            <Button onClick={cancelRequest} $marginTop={24}>
              Cancel Request
            </Button>
          </ModalContent>
        </Overlay>
      )}

      {/* AI FALLBACK OFFER MODAL */}
      {showAiOffer && aiOffer && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AIContainer
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-connect-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.28,
                ease: "easeOut"
              }
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              transition: {
                duration: 0.18
              }
            }}
          >
            <SheetCloseButton type="button" aria-label="Close AI connect popup" onClick={dismissAiOffer}>
              <FiX size={18} />
            </SheetCloseButton>
            <IconWrapper $bgColor="#fef3c7">
              <FiZap size={28} color="#000080" />
            </IconWrapper>
            <ModalTitle id="ai-connect-title">Expert Unavailable</ModalTitle>
            <ModalText>Expert is currently unavailable. You can continue with AI assistance.</ModalText>

            <Divider />

            <PriceRow $color="#64748b" $large={false}>
              {getHumanPriceDisplay(aiOffer)}
            </PriceRow>
            
            <PriceRow $marginTop={8} $bold $large $color="#0f172a">
              {getAiPriceDisplay(aiOffer)}
            </PriceRow>
            
            {aiOffer.discount_percent && (
              <DiscountBadge>
                🎉 {aiOffer.discount_percent}% cheaper than human expert
              </DiscountBadge>
            )}

            <ButtonGroup>
              <PrimaryButton 
                onClick={startAiChat}
                disabled={isStartingAi}
              >
                {isStartingAi ? "Connecting..." : "Connect with AI"}
              </PrimaryButton>
              <SecondaryButton onClick={tryAnotherExpert}>
                Try another expert
              </SecondaryButton>
              <SecondaryButton onClick={dismissAiOffer}>
                Cancel
              </SecondaryButton>
            </ButtonGroup>
          </AIContainer>
        </Overlay>
      )}

      {/* REJECTED MODAL */}
      {rejectedMsg && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-rejected-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.28,
                ease: "easeOut"
              }
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              transition: {
                duration: 0.18
              }
            }}
          >
            <SheetCloseButton type="button" aria-label="Close request declined popup" onClick={() => setRejectedMsg("")}>
              <FiX size={18} />
            </SheetCloseButton>
            <IconWrapper $bgColor="#fef2f2">
              <FiX size={28} color="#ef4444" />
            </IconWrapper>
            <ModalTitle id="chat-rejected-title" $color="#dc2626">Request Declined</ModalTitle>
            <ModalText>{rejectedMsg}</ModalText>
            <Button 
              onClick={() => setRejectedMsg("")} 
              $marginTop={24}
              $color="#dc2626"
            >
              Got it
            </Button>
          </ModalContent>
        </Overlay>
      )}

      {/* CANCELLED MODAL */}
      {showCancelled && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-cancelled-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.28,
                ease: "easeOut"
              }
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              transition: {
                duration: 0.18
              }
            }}
          >
            <SheetCloseButton type="button" aria-label="Close request cancelled popup" onClick={() => setShowCancelled(false)}>
              <FiX size={18} />
            </SheetCloseButton>
            <IconWrapper $bgColor="#f1f5f9">
              <FiX size={28} color="#64748b" />
            </IconWrapper>
            <ModalTitle id="chat-cancelled-title" $color="#475569">Request Cancelled</ModalTitle>
            <ModalText>Your chat request has been cancelled.</ModalText>
            <Button 
              onClick={() => setShowCancelled(false)} 
              $marginTop={24}
            >
              OK
            </Button>
          </ModalContent>
        </Overlay>
      )}

      {/* AI ERROR MODAL */}
      {aiError && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ModalContent
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-error-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.28,
                ease: "easeOut"
              }
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              transition: {
                duration: 0.18
              }
            }}
          >
            <SheetCloseButton type="button" aria-label="Close AI error popup" onClick={() => setAiError("")}>
              <FiX size={18} />
            </SheetCloseButton>
            <IconWrapper $bgColor="#fef2f2">
              <FiX size={28} color="#ef4444" />
            </IconWrapper>
            <ModalTitle id="ai-error-title" $color="#dc2626">AI Chat Error</ModalTitle>
            <ModalText>{aiError}</ModalText>
            <Button 
              onClick={() => setAiError("")} 
              $marginTop={24}
              $color="#dc2626"
            >
              OK
            </Button>
          </ModalContent>
        </Overlay>
      )}
    </AnimatePresence>
  );

  return {
    startChat,
    ChatPopups,
    cancelRequest,
    isWaiting: showWaiting,
    startAiChat,
    keepWaiting,
    showAiOffer,
    aiOffer,
    isRequesting,
  };
}
