import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useAuth } from "../context/UserAuthContext";
import { useWallet } from "../context/WalletContext";
import { socket } from "../api/socket";

const MIN_CHAT_MINUTES = 5;

/* ================= SPINNER (Option 3 - Styled) ================= */

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto;
`;

/* ================= HOOK ================= */

export default function useChatRequest() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { balance } = useWallet();

  const userId = user?.id;

  const [chatRequestId, setChatRequestId] = useState(null);
  const [showWaiting, setShowWaiting] = useState(false);
  const [rejectedMsg, setRejectedMsg] = useState("");
  const [showCancelled, setShowCancelled] = useState(false);

  /* ================= START CHAT ================= */

  const startChat = useCallback(
    ({ expertId, chatPrice }) => {
      if (!isLoggedIn) {
        navigate("/user/auth");
        return;
      }

      const perMinute = Number(chatPrice || 0);
      const minRequired = perMinute * MIN_CHAT_MINUTES;

      if (Number(balance) < minRequired) {
        navigate("/user/wallet");
        return;
      }

      socket.emit("request_chat", {
        user_id: userId,
        expert_id: expertId,
        user_name: user?.name || "User",
      });
    },
    [isLoggedIn, balance, userId, user, navigate]
  );

  /* ================= SOCKET EVENTS ================= */

  useEffect(() => {
    const pending = ({ request_id }) => {
      setChatRequestId(request_id);
      setShowWaiting(true);
    };

    const accepted = ({ room_id }) => {
      setShowWaiting(false);
      setChatRequestId(null);
      navigate(`/user/chat/${room_id}`, { replace: true });
    };

    const rejected = ({ user_id, message }) => {
      if (Number(user_id) !== Number(userId)) return;
      setShowWaiting(false);
      setRejectedMsg(message || "Chat rejected");
    };

    const cancelled = ({ user_id }) => {
      if (Number(user_id) !== Number(userId)) return;
      setShowWaiting(false);
      setShowCancelled(true);
    };

    socket.on("request_pending", pending);
    socket.on("chat_accepted", accepted);
    socket.on("chat_rejected", rejected);
    socket.on("chat_cancelled", cancelled);

    return () => {
      socket.off("request_pending", pending);
      socket.off("chat_accepted", accepted);
      socket.off("chat_rejected", rejected);
      socket.off("chat_cancelled", cancelled);
    };
  }, [navigate, userId]);

  /* ================= CANCEL ================= */

  const cancelRequest = () => {
    if (!chatRequestId) return;

    socket.emit("cancel_chat_request", {
      request_id: chatRequestId,
    });

    setShowWaiting(false);
    setChatRequestId(null);
  };

  /* ================= POPUPS ================= */

  const ChatPopups = () => (
    <>
      {/* WAITING */}
      {showWaiting && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 28,
              borderRadius: 18,
              width: "min(90vw, 420px)",
              textAlign: "center",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: 0 }}>Request Sent</h3>

            <p style={{ marginTop: 12 }}>
              Waiting for expert to accept...
            </p>

            <div style={{ marginTop: 18 }}>
              <Spinner />
            </div>

            <button
              onClick={cancelRequest}
              style={{
                marginTop: 22,
                padding: "10px 18px",
                borderRadius: 999,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
                cursor: "pointer",
              }}
            >
              Cancel Request
            </button>
          </div>
        </div>
      )}

      {/* REJECTED */}
      {rejectedMsg && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: 12 }}>Request Declined</h3>
            <p>{rejectedMsg}</p>

            <button onClick={() => setRejectedMsg("")}>OK</button>
          </div>
        </div>
      )}

      {/* CANCELLED */}
      {showCancelled && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              textAlign: "center",
            }}
          >
            <h3>Request Cancelled</h3>
            <button onClick={() => setShowCancelled(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );

  return {
    startChat,
    ChatPopups,
  };
}
