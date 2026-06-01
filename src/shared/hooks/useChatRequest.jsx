// useChatRequest.js
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiUserCheck, FiX } from "react-icons/fi";
import { useAuth } from "../context/UserAuthContext";
import { useWallet } from "../context/WalletContext";
import { socket } from "../api/socket";

const MIN_CHAT_MINUTES = 5;
const REQUEST_LOCK_TIMEOUT_MS = 10000;

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
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  padding: 32px;
  border-radius: 24px;
  width: min(90vw, 420px);
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
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
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: ${props => props.$color || "#0f172a"};
  font-size: 1.5rem;
  font-weight: 600;
`;

const ModalText = styled.p`
  margin-top: 12px;
  margin-bottom: 0;
  color: #475569;
  line-height: 1.5;
`;

const SpinnerWrapper = styled.div`
  margin-top: 20px;
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
`;

const AIContainer = styled(motion.div)`
  background: #fff;
  padding: 32px;
  border-radius: 24px;
  width: min(92vw, 440px);
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
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
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e2e8f0;
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
  
  // Refs for stale closure prevention
  const currentRequestIdRef = useRef(null);
  const showWaitingRef = useRef(false);
  const aiOfferRef = useRef(null);
  const showAiOfferRef = useRef(false);

  const [chatRequestId, setChatRequestId] = useState(null);
  const [showWaiting, setShowWaiting] = useState(false);
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
    };
  }, []);

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
  }, []);

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
      const room_id = data.room_id;
      
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
      
      navigate(`/user/chat/${room_id}`, { replace: true });
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
      if (!data.room_id) {
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

      navigate(`/user/chat/${data.room_id}`, {
        state: {
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
    socket.on("chat_cancelled", cancelled);
    socket.on("ai_fallback_offer", aiOfferHandler);
    socket.on("ai_fallback_accepted", aiAccepted);
    socket.on("ai_fallback_failed", aiFailed);

    // Cleanup
    return () => {
      socket.off("request_pending", pending);
      socket.off("chat_accepted", accepted);
      socket.off("chat_rejected", rejected);
      socket.off("chat_cancelled", cancelled);
      socket.off("ai_fallback_offer", aiOfferHandler);
      socket.off("ai_fallback_accepted", aiAccepted);
      socket.off("ai_fallback_failed", aiFailed);
    };
  }, [navigate, userId]);

  // Helper to get AI price display
  const getAiPriceDisplay = useCallback((offer) => {
    if (!offer) return "";
    
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
            <IconWrapper $bgColor="#eff6ff">
              <FiUserCheck size={28} color="#3b82f6" />
            </IconWrapper>
            <ModalTitle>Request Sent</ModalTitle>
            <ModalText>{waitingText}</ModalText>
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
            <IconWrapper $bgColor="#fef3c7">
              <span style={{ fontSize: 28 }}>🤖</span>
            </IconWrapper>
            <ModalTitle>Expert Unavailable</ModalTitle>
            <ModalText>Continue instantly with AI Expert</ModalText>

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
                {isStartingAi ? "Starting..." : "Start AI Chat"}
              </PrimaryButton>
              <SecondaryButton onClick={keepWaiting}>
                Keep Waiting
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
            <IconWrapper $bgColor="#fef2f2">
              <FiX size={28} color="#ef4444" />
            </IconWrapper>
            <ModalTitle $color="#dc2626">Request Declined</ModalTitle>
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
            <IconWrapper $bgColor="#f1f5f9">
              <FiX size={28} color="#64748b" />
            </IconWrapper>
            <ModalTitle $color="#475569">Request Cancelled</ModalTitle>
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
            <IconWrapper $bgColor="#fef2f2">
              <FiX size={28} color="#ef4444" />
            </IconWrapper>
            <ModalTitle $color="#dc2626">AI Chat Error</ModalTitle>
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
