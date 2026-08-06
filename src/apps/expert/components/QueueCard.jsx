import React, { useState, useMemo, useEffect, useRef } from "react";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";

import {
  QueueCardWrap,
  QueueTabs,
  QueueItem,
  ActionBtn,
  RedDot,
  StatusBadge,
} from "../styles/Dashboard.styles";
import { useNavigate } from "react-router-dom";
import { Phone, MessageSquare, Video, Users, Mail, Calendar, ChevronRight } from "lucide-react";
import styled from "styled-components";

const MobileGrid = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 16px;
    background: #ffffff;
    border-bottom: 1px solid #efefef;
  }
`;

const MobileCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  padding: 14px 16px;
  background: ${props => props.$highlighted ? 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)' : props.$active ? 'linear-gradient(135deg, #ffffff 0%, #f4f6ff 100%)' : '#ffffff'};
  border: ${props => props.$highlighted ? '2.5px solid #10b981' : props.$active ? '1.5px solid #000080' : '1.5px solid #e2e8f0'};
  border-radius: 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.$highlighted ? '0 0 14px rgba(16, 185, 129, 0.45)' : props.$active ? '0 8px 20px rgba(0, 0, 128, 0.08)' : '0 2px 6px rgba(0, 0, 0, 0.02)'};
  animation: ${props => props.$highlighted ? 'subtleGreenPulse 2s infinite ease-in-out' : 'none'};
  position: relative;
  -webkit-tap-highlight-color: transparent;

  @keyframes subtleGreenPulse {
    0% {
      box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
      border-color: #10b981;
    }
    50% {
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.75);
      border-color: #059669;
    }
    100% {
      box-shadow: 0 0 4px rgba(16, 185, 129, 0.4);
      border-color: #10b981;
    }
  }
  
  &:active {
    transform: scale(0.97);
    background: #f8fafc;
  }
  
  &:focus-visible {
    outline: 2px solid #000080;
    outline-offset: 2px;
  }
`;

const CardTopRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: ${props => props.$bg || 'rgba(0, 0, 128, 0.06)'};
  color: ${props => props.$color || '#000080'};
  transition: all 0.2s ease;
`;

const Badge = styled.span`
  background: ${props => props.$active ? '#000080' : '#f1f5f9'};
  color: ${props => props.$active ? '#ffffff' : '#475569'};
  font-weight: 700;
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 999px;
  min-width: 18px;
  text-align: center;
  display: inline-block;
`;

const CardLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$active ? '#000080' : '#334155'};
  line-height: 1.2;
`;

const CardSubLabel = styled.span`
  font-size: 11px;
  color: #64748b;
  margin-top: 4px;
`;

const PulsingDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  display: inline-block;
  animation: pulseDot 1.5s infinite;

  @keyframes pulseDot {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    }
  }
`;

export default function QueueCard({
  initialTab = "call",
  highlightedSections = {},
  clearHighlight = () => {},
}) {
  const navigate = useNavigate();
  const {
    notifications = [],
    acceptNotification,
    rejectNotification,
    removeById,
  } = useExpertNotifications();

  const [activeTab, setActiveTab] = useState(initialTab);
  const listRef = useRef(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getStatusBadgeConfig = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "missed" || s === "timeout") {
      return { label: "MISSED", color: "#ef4444", text: "You missed this request" };
    }
    if (s === "cancelled" || s === "canceled") {
      return { label: "USER CANCELLED", color: "#6b7280", text: "User cancelled request" };
    }
    if (s === "rejected" || s === "declined") {
      return { label: "DECLINED", color: "#dc2626", text: "You declined this request" };
    }
    if (s === "accepted" || s === "connected") {
      return { label: "ACCEPTED", color: "#22c55e", text: "Request accepted" };
    }
    if (s === "ended") {
      return { label: "ENDED", color: "#3b82f6", text: "Session ended" };
    }
    if (s === "ringing") {
      return { label: "RINGING", color: "#22c55e", text: "Ringing..." };
    }
    if (s === "accepting") {
      return { label: "ACCEPTING", color: "#f59e0b", text: "Accepting..." };
    }

    return { label: "PENDING", color: "#f59e0b", text: "Pending response..." };
  };

  const chatRequests = useMemo(
    () =>
      notifications
        .filter((n) => n.type === "chat_request")
        .sort((a, b) => b.createdAt - a.createdAt),
    [notifications]
  );

  const callRequests = useMemo(
    () =>
      notifications
        .filter((n) => n.type === "voice_call")
        .sort((a, b) => b.createdAt - a.createdAt),
    [notifications]
  );

  const videoCallRequests = useMemo(
    () =>
      notifications
        .filter((n) => n.type === "video_call")
        .sort((a, b) => b.createdAt - a.createdAt),
    [notifications]
  );

  const queueTabs = [
    {
      key: "call",
      label: "Call",
      count: callRequests.length,
      hasAlert: callRequests.some((c) => c.status === "ringing"),
    },
    {
      key: "chat",
      label: "Chat",
      count: chatRequests.length,
      hasAlert: chatRequests.some((c) => c.status === "pending"),
    },
    {
      key: "video",
      label: "Video Call",
      count: videoCallRequests.length,
      hasAlert: videoCallRequests.some((c) => c.status === "ringing"),
    },
  ];

  const linkTabs = [
    { label: "Leads", path: "/expert/leads" },
    { label: "Enquiry", path: "/expert/inquiries" },
    { label: "My Booking", path: "/expert/mybookings" },
  ];

  const activeLists = {
    chat: chatRequests,
    call: callRequests,
    video: videoCallRequests,
  };

  const emptyLabels = {
    chat: "chat",
    call: "call",
    video: "video call",
  };

  const activeList = activeLists[activeTab] || [];

  useEffect(() => {
    if (activeList.length > prevCountRef.current) {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevCountRef.current = activeList.length;
  }, [activeList]);

  return (
    <QueueCardWrap>
      <QueueTabs>
        {queueTabs.map((tab) => {
          const isHighlighted = Boolean(highlightedSections?.[tab.key]);
          return (
            <button
              key={tab.key}
              className={[
                activeTab === tab.key ? "active" : "",
                isHighlighted ? "highlighted" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => {
                setActiveTab(tab.key);
                if (clearHighlight) clearHighlight(tab.key);
              }}
              type="button"
            >
              {tab.label} ({tab.count})
              {tab.hasAlert && <RedDot />}
            </button>
          );
        })}

        {linkTabs.map((tab) => {
          const sectionKey = tab.label === "Leads" ? "leads" : tab.label === "Enquiry" ? "inquiries" : "mybookings";
          const isHighlighted = Boolean(highlightedSections?.[sectionKey]);
          return (
            <button
              key={tab.path}
              className={["link-tab", isHighlighted ? "highlighted" : ""].filter(Boolean).join(" ")}
              onClick={() => {
                if (clearHighlight) clearHighlight(sectionKey);
                navigate(tab.path);
              }}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </QueueTabs>

      <MobileGrid>
        {queueTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const isHighlighted = Boolean(highlightedSections?.[tab.key]);
          const icon = tab.key === "call" ? <Phone size={18} /> : tab.key === "chat" ? <MessageSquare size={18} /> : <Video size={18} />;
          const iconBg = tab.key === "call" ? "rgba(59, 130, 246, 0.1)" : tab.key === "chat" ? "rgba(249, 115, 22, 0.1)" : "rgba(168, 85, 247, 0.1)";
          const iconColor = tab.key === "call" ? "#3b82f6" : tab.key === "chat" ? "#f97316" : "#a855f7";

          return (
            <MobileCard
              key={tab.key}
              $active={isActive}
              $highlighted={isHighlighted}
              onClick={() => {
                setActiveTab(tab.key);
                if (clearHighlight) clearHighlight(tab.key);
              }}
              type="button"
            >
              <CardTopRow>
                <IconContainer $bg={iconBg} $color={iconColor}>
                  {icon}
                </IconContainer>
                {tab.hasAlert ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <PulsingDot />
                    <Badge $active={isActive}>{tab.count}</Badge>
                  </div>
                ) : (
                  <Badge $active={isActive}>{tab.count}</Badge>
                )}
              </CardTopRow>
              <CardLabel $active={isActive}>{tab.label}</CardLabel>
              <CardSubLabel>Requests ({tab.count})</CardSubLabel>
            </MobileCard>
          );
        })}

        {linkTabs.map((tab) => {
          const sectionKey = tab.label === "Leads" ? "leads" : tab.label === "Enquiry" ? "inquiries" : "mybookings";
          const isHighlighted = Boolean(highlightedSections?.[sectionKey]);
          const icon = tab.label === "Leads" ? <Users size={18} /> : tab.label === "Enquiry" ? <Mail size={18} /> : <Calendar size={18} />;
          const iconBg = tab.label === "Leads" ? "rgba(16, 185, 129, 0.1)" : tab.label === "Enquiry" ? "rgba(20, 184, 166, 0.1)" : "rgba(236, 72, 153, 0.1)";
          const iconColor = tab.label === "Leads" ? "#10b981" : tab.label === "Enquiry" ? "#14b8a6" : "#ec4899";

          return (
            <MobileCard
              key={tab.path}
              $active={false}
              $highlighted={isHighlighted}
              onClick={() => {
                if (clearHighlight) clearHighlight(sectionKey);
                navigate(tab.path);
              }}
              type="button"
            >
              <CardTopRow>
                <IconContainer $bg={iconBg} $color={iconColor}>
                  {icon}
                </IconContainer>
                <ChevronRight size={16} color="#94a3b8" />
              </CardTopRow>
              <CardLabel $active={false}>{tab.label}</CardLabel>
              <CardSubLabel>View details</CardSubLabel>
            </MobileCard>
          );
        })}
      </MobileGrid>

      <div ref={listRef} style={{ maxHeight: 400, overflowY: "auto" }}>
        {activeList.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
            No {emptyLabels[activeTab] || "queue"} requests found
          </div>
        ) : (
          activeList.map((req) => {
            const statusConfig = getStatusBadgeConfig(req.status);
            const isPendingOrRinging =
              req.status === "pending" || req.status === "ringing" || req.status === "accepting";

            return (
              <QueueItem key={req.id} className={req.status || "pending"}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0, width: "100%" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b", wordBreak: "break-word" }}>
                      {req.title}
                    </strong>
                    <StatusBadge
                      style={{
                        background: statusConfig.color,
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        padding: "3px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {statusConfig.label}
                    </StatusBadge>
                  </div>

                  <div style={{ fontSize: "12px", color: "#64748b", wordBreak: "break-word" }}>
                    {req.meta} -{" "}
                    <span
                      style={{
                        fontWeight: "600",
                        color: req.status === "ringing" || req.status === "missed" ? "#ef4444" : "#64748b",
                      }}
                    >
                      {statusConfig.text} ({getTimeAgo(req.createdAt)})
                    </span>
                  </div>
                </div>

                <div className="queue-item-actions">
                  {/* Show Accept button ONLY if request is active */}
                  {req.type === "chat_request" && isPendingOrRinging && (
                    <ActionBtn
                      className="accept"
                      disabled={req.status === "accepting"}
                      onClick={() => acceptNotification(req)}
                    >
                      {req.status === "accepting" ? "Accepting..." : "Accept"}
                    </ActionBtn>
                  )}

                  {req.type === "voice_call" && isPendingOrRinging && (
                    <ActionBtn
                      className="accept"
                      onClick={() => {
                        navigate(`/expert/voice-call/${req.payload?.callId || req.relatedId}`);
                      }}
                    >
                      Tap to Answer
                    </ActionBtn>
                  )}

                  {req.type === "video_call" && isPendingOrRinging && (
                    <ActionBtn
                      className="accept"
                      onClick={() => {
                        navigate(`/expert/video-call/${req.payload?.callId || req.relatedId}`);
                      }}
                    >
                      Tap to Answer
                    </ActionBtn>
                  )}

                  {/* Show Decline button ONLY if request is active */}
                  {isPendingOrRinging && (
                    <ActionBtn
                      className="decline"
                      onClick={() => rejectNotification(req)}
                    >
                      Decline
                    </ActionBtn>
                  )}

                  {/* Hide Accept/Decline and show Close button for resolved states (missed, cancelled, rejected, ended) */}
                  {!isPendingOrRinging && (
                    <ActionBtn
                      className="decline"
                      onClick={() => removeById(req)}
                    >
                      Close
                    </ActionBtn>
                  )}
                </div>
              </QueueItem>
            );
          })
        )}
      </div>
    </QueueCardWrap>
  );
}
