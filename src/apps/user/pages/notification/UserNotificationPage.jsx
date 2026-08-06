import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPhone,
  FiMessageCircle,
  FiSettings,
  FiBell,
  FiHeart,
  FiMessageSquare,
  FiUserPlus,
  FiCreditCard,
  FiBriefcase,
  FiCheck,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useNotifications } from "../../../../shared/hooks/useNotifications";
import {
  markRead,
  markAllRead,
  deleteNotification,
} from "../../../../shared/api/notification.api";
import * as S from "./UserNotificationPage.style";

const timeAgo = (time) => {
  const value = typeof time === "number" ? time : new Date(time).getTime();
  if (!Number.isFinite(value)) return "";

  const diff = Math.floor((Date.now() - value) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const getNotificationConfig = (type) => {
  const lowerType = String(type || "").toLowerCase();

  if (lowerType.includes("chat")) {
    return {
      icon: <FiMessageCircle />,
      badge: "Chat",
      bg: "#ebf5ff",
      color: "#1e40af",
    };
  }
  if (lowerType.includes("call")) {
    return {
      icon: <FiPhone />,
      badge: "Call",
      bg: "#f0fdf4",
      color: "#166534",
    };
  }
  if (lowerType.includes("like")) {
    return {
      icon: <FiHeart />,
      badge: "Social",
      bg: "#fdf2f8",
      color: "#9d174d",
    };
  }
  if (lowerType.includes("comment")) {
    return {
      icon: <FiMessageSquare />,
      badge: "Social",
      bg: "#fdf2f8",
      color: "#9d174d",
    };
  }
  if (lowerType.includes("follow")) {
    return {
      icon: <FiUserPlus />,
      badge: "Social",
      bg: "#fdf2f8",
      color: "#9d174d",
    };
  }
  if (lowerType.includes("wallet") || lowerType.includes("pay")) {
    return {
      icon: <FiCreditCard />,
      badge: "Wallet",
      bg: "#fffbeb",
      color: "#92400e",
    };
  }
  if (lowerType.includes("service")) {
    return {
      icon: <FiBriefcase />,
      badge: "Service",
      bg: "#f5f3ff",
      color: "#5b21b6",
    };
  }

  return {
    icon: <FiBell />,
    badge: "System",
    bg: "#f3f4f6",
    color: "#374151",
  };
};

import NotificationDetailModal from "../../../../shared/components/NotificationDetailModal";

export default function UserNotificationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedDetailNotif, setSelectedDetailNotif] = useState(null);

  const { notifications, unread, setUnread, setNotifications } = useNotifications({
    panel: "user",
    userId: user?.id,
  });

  const handleMarkRead = async (id) => {
    try {
      await markRead({ userId: user?.id, panel: "user", id });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
      setUnread((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (unread === 0) return;
    try {
      await markAllRead({ userId: user?.id, panel: "user" });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      setUnread(0);
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  const handleDelete = async (n) => {
    try {
      await deleteNotification(n.id, user?.id, "user");
      setNotifications((prev) => prev.filter((item) => item.id !== n.id));
      if (n.is_read !== 1 && n.is_read !== true) {
        setUnread((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleTap = (n) => {
    if (n.is_read !== 1 && n.is_read !== true) {
      handleMarkRead(n.id);
    }

    const typeStr = String(n.type || "").toLowerCase();
    const meta = typeof n.meta === "object" ? n.meta : {};
    let targetUrl = n.target_url || n.targetUrl || meta.target_url || meta.targetUrl || meta.url || meta.click_action;

    // Prevent direct auto-calling when tapping notification cards
    if (targetUrl && (targetUrl.includes("/voice-call/") || targetUrl.includes("/video-call/"))) {
      targetUrl = "/user/my-bookings";
    }

    // Direct target URL if provided
    if (targetUrl) {
      navigate(targetUrl);
      return;
    }

    // Specific notification category tab mapping
    if (typeStr.includes("chat")) {
      if (meta.room_id) {
        navigate(`/user/chat/${meta.room_id}`);
      } else {
        navigate("/user/chat-history");
      }
    } else if (typeStr.includes("video")) {
      navigate("/user/call-chat?mode=video");
    } else if (typeStr.includes("call")) {
      navigate("/user/call-chat?mode=call");
    } else if (typeStr.includes("service") || typeStr.includes("booking") || typeStr.includes("workspace")) {
      if (meta.booking_id) {
        navigate(`/user/workspace/${meta.booking_id}`);
      } else {
        navigate("/user/my-bookings");
      }
    } else {
      // Default to detail modal for system announcements
      setSelectedDetailNotif(n);
    }
  };

  const filteredNotifications = useMemo(() => {
    const list = Array.isArray(notifications) ? notifications : [];
    if (filter === "all") return list;
    if (filter === "unread") return list.filter((n) => n.is_read !== 1 && n.is_read !== true);
    if (filter === "call") return list.filter((n) => String(n.type || "").toLowerCase().includes("call"));
    if (filter === "chat") return list.filter((n) => String(n.type || "").toLowerCase().includes("chat"));
    if (filter === "social") {
      return list.filter((n) => {
        const type = String(n.type || "").toLowerCase();
        return type.includes("like") || type.includes("comment") || type.includes("follow");
      });
    }
    if (filter === "service") return list.filter((n) => String(n.type || "").toLowerCase().includes("service"));
    return list;
  }, [filter, notifications]);

  return (
    <S.Container>
      <S.HeaderRow>
        <S.Title>
          Notifications
          {unread > 0 && <span>{unread} new</span>}
        </S.Title>
        {unread > 0 && (
          <S.MarkAllReadBtn onClick={handleMarkAllRead}>
            Mark all as read
          </S.MarkAllReadBtn>
        )}
      </S.HeaderRow>

      <S.FilterTabs>
        {[
          { label: "All", value: "all" },
          { label: "Unread", value: "unread" },
          { label: "Calls", value: "call" },
          { label: "Chats", value: "chat" },
          { label: "Social", value: "social" },
          { label: "Services", value: "service" },
        ].map((tab) => (
          <S.TabButton
            key={tab.value}
            $active={filter === tab.value}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </S.TabButton>
        ))}
      </S.FilterTabs>

      {loading ? (
        <S.LoadingState>Loading notifications...</S.LoadingState>
      ) : filteredNotifications.length === 0 ? (
        <S.EmptyState>
          <div className="icon">🔔</div>
          <h3>No notifications yet</h3>
          <p>We'll notify you when something important happens.</p>
        </S.EmptyState>
      ) : (
        <S.NotificationList>
          {filteredNotifications.map((n) => {
            const isUnread = n.is_read !== 1 && n.is_read !== true;
            const config = getNotificationConfig(n.type);
            const avatar = n.sender_photo || n.sender_avatar || n.meta?.sender_avatar || n.meta?.sender_photo || n.meta?.avatar;

            return (
              <S.NotificationItem
                key={n.id}
                $unread={isUnread}
                onClick={() => handleTap(n)}
                style={{ cursor: "pointer" }}
              >
                {isUnread && <S.UnreadIndicator />}

                <S.AvatarWrapper>
                  {avatar ? (
                    <img
                      src={avatar.startsWith("http") ? avatar : `https://softmaxs.com/${avatar}`}
                      alt=""
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    config.icon
                  )}
                </S.AvatarWrapper>

                <S.ContentWrapper>
                  <S.MessageText>
                    <strong>{n.title || "Notification"}</strong>{" "}
                    {n.message || n.body || n.meta?.message || ""}
                  </S.MessageText>
                  <S.MetaRow>
                    <S.TimeText>{timeAgo(n.time || n.created_at)}</S.TimeText>
                    <S.TypeBadge $bg={config.bg} $color={config.color}>
                      {config.badge}
                    </S.TypeBadge>
                  </S.MetaRow>
                </S.ContentWrapper>

                <S.ActionsWrapper onClick={(e) => e.stopPropagation()}>
                  {isUnread && (
                    <S.ActionButton
                      onClick={() => handleMarkRead(n.id)}
                      title="Mark as read"
                    >
                      <FiCheck size={16} />
                    </S.ActionButton>
                  )}
                  <S.ActionButton
                    $danger
                    onClick={() => handleDelete(n)}
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </S.ActionButton>
                </S.ActionsWrapper>
              </S.NotificationItem>
            );
          })}
        </S.NotificationList>
      )}

      {selectedDetailNotif && (
        <NotificationDetailModal
          notification={selectedDetailNotif}
          onClose={() => setSelectedDetailNotif(null)}
          onNavigate={(url) => {
            setSelectedDetailNotif(null);
            navigate(url);
          }}
        />
      )}
    </S.Container>
  );
}
