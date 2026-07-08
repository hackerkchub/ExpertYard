import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiVideo } from "react-icons/fi";
import { getVideoCallStatusApi } from "../api/videoCall.api";
import { normalizeVideoCallPrice } from "../utils/normalizeExpertPrice";

const getExpertId = (expert) =>
  expert?.expert_id || expert?.expertId || expert?.id || expert?.user_id || expert?.userId;

export default function VideoCallButton({
  expert,
  expertId,
  sourceContext = "quick_action",
  sourceRefId = null,
  className = "",
  compact = false,
  compactLabel = "Video",
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
        if (mounted) setStatus({ enabled: false, reason: "Video call unavailable" });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [resolvedExpertId]);

  const enabled = useMemo(() => {
    if (!resolvedExpertId) return false;
    if (status) return status.enabled !== false;
    const access = expert?.effective_access || expert?.access || expert || {};
    if (access.can_video_call !== undefined) return Boolean(access.can_video_call);
    if (expert?.canVideoCall !== undefined) return Boolean(expert.canVideoCall);
    return true;
  }, [expert, resolvedExpertId, status]);

  const canStartVideoCall = Boolean(enabled && pricePerMinute);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!localStorage.getItem("user_token")) {
      navigate("/user/auth", { state: { redirectTo: window.location.pathname } });
      return;
    }

    if (!resolvedExpertId || !enabled || !pricePerMinute) return;
    navigate(`/user/video-call/${resolvedExpertId}`, {
      state: {
        expert,
        source_context: sourceContext,
        source_ref_id: sourceRefId,
        price_per_minute: pricePerMinute,
      },
    });
  };

  const label = loading
    ? "--"
    : enabled
      ? pricePerMinute
        ? `\u20B9${pricePerMinute}/min`
        : "--"
      : "--";
  const finalLabel = label;
  const titleLabel = loading
    ? "Checking video call availability"
    : enabled && pricePerMinute
      ? `Start video call at \u20B9${pricePerMinute}/min`
      : status?.reason || "Video call unavailable";

  return (
    <button
      type="button"
      className={`video-call-button ${className}`}
      onClick={handleClick}
      disabled={loading || !enabled || !pricePerMinute}
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
        background: canStartVideoCall ? "#2563eb" : "#e5e7eb",
        color: canStartVideoCall ? "#fff" : "#64748b",
        cursor: loading || !enabled || !pricePerMinute ? "not-allowed" : "pointer",
        fontWeight: 800,
        fontSize: compact ? 13 : 14,
        whiteSpace: "nowrap",
        minWidth: compact ? 0 : 112,
        lineHeight: 1,
      }}
    >
      <FiVideo />
      {finalLabel}
    </button>
  );
}
