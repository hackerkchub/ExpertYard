/* ==========================================================================
   G9EXPERT CENTRAL NOTIFICATION ROUTER & DEEP LINK ENGINE
   ========================================================================== */

import { NOTIFICATION_TYPES } from "./notificationTypes";
import { buildStandardPayload } from "./notificationPayload";

/**
 * Compute exact destination URL for any given notification payload
 * @param {Object} rawPayload - Raw or standardized notification payload
 * @param {'user'|'expert'|'admin'} currentPanel - Active app panel context
 * @returns {string} Target Route Path
 */
export const resolveNotificationRoute = (rawPayload, currentPanel = "user") => {
  const payload = buildStandardPayload(rawPayload);
  const { type, resource_id, resource_type, redirect_screen, metadata } = payload;

  // 1. Explicit redirect screen takes priority if valid
  if (redirect_screen && typeof redirect_screen === "string" && redirect_screen.startsWith("/")) {
    return redirect_screen;
  }

  const role = currentPanel || payload.receiver_role || "user";
  const isExpert = role === "expert";
  const isAdmin = role === "admin";

  // ------------------------------------------------------------------------
  // 1. Social Activity Notifications
  // ------------------------------------------------------------------------
  if (type === NOTIFICATION_TYPES.REEL_LIKE || type === NOTIFICATION_TYPES.REEL_COMMENT) {
    if (resource_id) {
      return isExpert ? `/expert/my-content?reel_id=${resource_id}` : `/user/reels/${resource_id}`;
    }
    return isExpert ? "/expert/my-content" : "/user/reels";
  }

  if (type === NOTIFICATION_TYPES.POST_LIKE || type === NOTIFICATION_TYPES.POST_COMMENT) {
    if (resource_id) {
      return isExpert ? `/expert/my-content?post_id=${resource_id}` : `/user?post_id=${resource_id}`;
    }
    return isExpert ? "/expert/my-content" : "/user";
  }

  if (type === NOTIFICATION_TYPES.EXPERT_FOLLOW) {
    if (resource_id) {
      return isExpert ? "/expert/profile" : `/user/experts/${resource_id}`;
    }
    return isExpert ? "/expert/notifications" : "/user/call-chat?page=1";
  }

  // ------------------------------------------------------------------------
  // 2. Expert Profile Notifications (Ratings & Reviews)
  // ------------------------------------------------------------------------
  if (type === NOTIFICATION_TYPES.EXPERT_RATING || type === NOTIFICATION_TYPES.EXPERT_REVIEW) {
    if (isExpert) {
      return "/expert/profile?tab=reviews";
    }
    return resource_id ? `/user/experts/${resource_id}` : "/user/call-chat?page=1";
  }

  // ------------------------------------------------------------------------
  // 3. Communication Notifications (Voice/Video Call, Chat, Inquiry)
  // ------------------------------------------------------------------------
  if (type === NOTIFICATION_TYPES.VOICE_CALL || type === NOTIFICATION_TYPES.VIDEO_CALL) {
    const mode = type === NOTIFICATION_TYPES.VIDEO_CALL ? "video" : "call";
    if (isExpert) {
      return `/expert/home?tab=${mode}`;
    }
    return resource_id ? `/user/call-chat?page=1&mode=${mode}&call_id=${resource_id}` : `/user/call-chat?page=1&mode=${mode}`;
  }

  if (type === NOTIFICATION_TYPES.CHAT_MESSAGE || type === NOTIFICATION_TYPES.CHAT_REQUEST) {
    if (isExpert) {
      return "/expert/home?tab=chat";
    }
    return resource_id ? `/user/chat/${resource_id}` : "/user/chat-history";
  }

  // ------------------------------------------------------------------------
  // 4. Inquiry Notifications
  // ------------------------------------------------------------------------
  if (
    type === NOTIFICATION_TYPES.INQUIRY_NEW ||
    type === NOTIFICATION_TYPES.INQUIRY_FIRST_REPLY ||
    type === NOTIFICATION_TYPES.INQUIRY_BACKGROUND_REPLY ||
    type === NOTIFICATION_TYPES.INQUIRY_STATUS_CHANGE ||
    type === NOTIFICATION_TYPES.COMMUNICATION_INQUIRY
  ) {
    if (isExpert) {
      return resource_id ? `/expert/inquiries/${resource_id}` : "/expert/inquiries";
    }
    return resource_id ? `/user/inquiries/${resource_id}` : "/user/inquiries";
  }

  // ------------------------------------------------------------------------
  // 5. Service & 6. Master Service Workspace Notifications
  // ------------------------------------------------------------------------
  if (
    type.startsWith("service_") ||
    type.startsWith("workspace_") ||
    resource_type === "service_workspace" ||
    resource_type === "booking"
  ) {
    if (isExpert) {
      return resource_id ? `/expert/my-services/${resource_id}` : "/expert/my-services";
    }
    return resource_id ? `/user/service-details/${resource_id}` : "/user/all-services";
  }

  // ------------------------------------------------------------------------
  // 7. Expert Activity Notifications
  // ------------------------------------------------------------------------
  if (type.startsWith("expert_")) {
    if (type.includes("booking")) {
      return resource_id ? `/expert/bookings/${resource_id}` : "/expert/bookings";
    }
    if (type.includes("wallet") || type.includes("payment") || type.includes("withdrawal")) {
      return "/expert/wallet";
    }
    return "/expert/notifications";
  }

  // ------------------------------------------------------------------------
  // 8. Admin Broadcast Notifications
  // ------------------------------------------------------------------------
  if (type.startsWith("admin_broadcast_")) {
    if (type.includes("expert")) {
      return "/expert/notifications";
    }
    if (metadata?.offer_id || resource_type === "offer") {
      return "/user/my-offers";
    }
    return "/user/notification";
  }

  // Fallback default paths
  if (isAdmin) return "/admin/dashboard";
  if (isExpert) return "/expert/notifications";
  return "/user/notification";
};

/**
 * Handle notification tap event from UI, Service Worker, FCM, or Socket
 * @param {Object} rawNotification
 * @param {Function} navigateFn - React Router navigate function
 * @param {'user'|'expert'|'admin'} [panel]
 */
export const handleNotificationClick = (rawNotification, navigateFn, panel = "user") => {
  if (!rawNotification) return;

  const targetPath = resolveNotificationRoute(rawNotification, panel);
  if (navigateFn && typeof navigateFn === "function") {
    navigateFn(targetPath);
  } else if (typeof window !== "undefined" && window.location) {
    window.location.href = targetPath;
  }
};
