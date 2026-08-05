import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiVideo } from "react-icons/fi";
import { getVideoCallStatusApi } from "../api/videoCall.api";
import { normalizeVideoCallPrice } from "../utils/normalizeExpertPrice";

const isEnabledFlag = (value) => {
  if (value === undefined || value === null) return null;
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    String(value).toLowerCase() === "true"
  );
};

const getExpertId = (expert) =>
  expert?.expert_id || expert?.expertId || expert?.id || expert?.user_id || expert?.userId || expert?._id;

export default function VideoCallButton({
  expert,
  expertId,
  sourceContext = "quick_action",
  sourceRefId = null,
  className = "",
  compact = false,
  compactLabel = "Video",
  iconOnly = false,
}) {
  const navigate = useNavigate();
  const resolvedExpertId = Number(expertId || getExpertId(expert) || 0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(Boolean(resolvedExpertId));
  const pricePerMinute = normalizeVideoCallPrice(status) ?? normalizeVideoCallPrice(expert);

  useEffect(() => {
    let mounted = true;
    if (!resolvedExpertId) {
      setLoading(false);
      return undefined;
    }

    getVideoCallStatusApi(resolvedExpertId)
      .then((res) => {
        if (mounted) setStatus(res?.data?.data || res?.data || null);
      })
      .catch(() => {
        if (!mounted) return;
        setStatus(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [resolvedExpertId]);

  const enabled = useMemo(() => {
    const isEnabled = () => {
      if (!resolvedExpertId) return false;

      // 1. If status API explicitly returned an enabled status
      if (status) {
        const rawStatus =
          status.enabled ??
          status.video_call_enabled ??
          status.videoCallEnabled ??
          status.allow_video_call ??
          status.allowVideoCall ??
          status.show_video_button ??
          status.showVideoButton;

        if (rawStatus !== undefined && rawStatus !== null) {
          return isEnabledFlag(rawStatus);
        }
      }

      // 2. Check Admin toggle flags directly on expert & profile objects
      const adminFlag =
        expert?.show_video_button_on_profile_page ??
        expert?.showVideoButtonOnProfilePage ??
        expert?.profile?.show_video_button_on_profile_page ??
        expert?.profile?.showVideoButtonOnProfilePage ??
        expert?.show_video_call_button ??
        expert?.showVideoCallButton ??
        expert?.show_video_button ??
        expert?.showVideoButton ??
        expert?.allow_video_call ??
        expert?.allowVideoCall ??
        expert?.video_call_enabled_by_admin ??
        expert?.admin_video_call_enabled ??
        expert?.profile?.show_video_call_button ??
        expert?.profile?.show_video_button ??
        expert?.profile?.allow_video_call ??
        expert?.profile?.video_call_enabled;

      if (adminFlag !== undefined && adminFlag !== null) {
        return isEnabledFlag(adminFlag);
      }

      // 3. Check access object fallback
      const access = expert?.access || expert?.effective_access || {};
      const accessFlag =
        access.show_video_button_on_profile_page ??
        access.showVideoButtonOnProfilePage ??
        access.show_video_call_button ??
        access.showVideoCallButton ??
        access.show_video_button ??
        access.showVideoButton ??
        access.allow_video_call ??
        access.allowVideoCall ??
        access.video_call_enabled_by_admin ??
        access.video_call_enabled ??
        access.videoCallEnabled ??
        access.can_video_call ??
        access.canVideoCall;

      if (accessFlag !== undefined && accessFlag !== null) {
        return isEnabledFlag(accessFlag);
      }

      return true;
    };
    const res = isEnabled();
    console.log("🔍 [VIDEO BUTTON LOG] expertId:", resolvedExpertId, "status:", status, "enabled:", res);
    return res;
  }, [expert, resolvedExpertId, status]);

  const activePrice =
    pricePerMinute !== null && pricePerMinute !== undefined && Number(pricePerMinute) > 0
      ? pricePerMinute
      : (expert?.video_call_per_minute || expert?.videoCallPerMinute || expert?.call_per_minute || expert?.callPerMinute || expert?.chat_per_minute || 50);
  const canStartVideoCall = Boolean(enabled);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!localStorage.getItem("user_token")) {
      navigate("/user/auth", { state: { redirectTo: window.location.pathname } });
      return;
    }

    if (!resolvedExpertId || !enabled) return;

    navigate(`/user/video-call/${resolvedExpertId}`, {
      state: {
        expert: expert || status?.expert || { id: resolvedExpertId, name: status?.expert_name },
        source_context: sourceContext,
        source_ref_id: sourceRefId,
        price_per_minute: activePrice,
      },
    });
  };

  const label = loading
    ? "--"
    : enabled
      ? `\u20B9${activePrice}/min`
      : "--";
  const finalLabel = label;
  const titleLabel = loading
    ? "Checking video call availability"
    : enabled
      ? `Start video call at \u20B9${activePrice}/min`
      : status?.reason || "Video call unavailable";

  return (
    <button
      type="button"
      className={`video-call-button ${className}`}
      onClick={handleClick}
      disabled={loading || !enabled}
      title={titleLabel}
      aria-label={titleLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        minHeight: compact ? 38 : 42,
        padding: compact ? "8px 11px" : "10px 14px",
        borderRadius: 999,
        border: "1px solid rgba(37,99,235,.28)",
        background: canStartVideoCall ? "#2563eb" : "#94a3b8",
        color: "#ffffff",
        cursor: loading || !enabled ? "not-allowed" : "pointer",
        fontWeight: 800,
        fontSize: compact ? 13 : 14,
        whiteSpace: "nowrap",
        minWidth: compact ? 0 : (iconOnly ? "100%" : 112),
        lineHeight: 1,
      }}
    >
      <FiVideo size={iconOnly ? 20 : 16} />
      {!iconOnly && finalLabel}
    </button>
  );
}
