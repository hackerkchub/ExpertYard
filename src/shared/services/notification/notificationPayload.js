/* ==========================================================================
   G9EXPERT STANDARDIZED NOTIFICATION PAYLOAD GENERATOR & NORMALIZER
   ========================================================================== */

import { NOTIFICATION_TYPES, RESOURCE_TYPES } from "./notificationTypes";

/**
 * Standardized Payload Schema
 * @typedef {Object} StandardNotificationPayload
 * @property {string} notification_id
 * @property {string} type
 * @property {string} category
 * @property {string|number} sender_id
 * @property {string} sender_role
 * @property {string} sender_name
 * @property {string} [sender_avatar]
 * @property {string|number} receiver_id
 * @property {string} receiver_role
 * @property {string} title
 * @property {string} message
 * @property {string} [image_url]
 * @property {string|number} [resource_id]
 * @property {string} [resource_type]
 * @property {string} redirect_screen
 * @property {string} deep_link
 * @property {'high'|'normal'|'low'} priority
 * @property {number} created_at
 * @property {boolean} is_read
 * @property {Object} metadata
 */

/**
 * Safely parse metadata object
 */

const parseMeta = (meta) => {
  if (!meta) return {};
  if (typeof meta === "object") return meta;
  if (typeof meta === "string") {
    try {
      return JSON.parse(meta);
    } catch {
      return {};
    }
  }
  return {};
};

/**
 * Derive Category from Type
 */

export const deriveCategoryFromType = (type = "") => {
  const t = String(type).toLowerCase();
  if (t.includes("reel") || t.includes("post") || t.includes("follow") || t.includes("like") || t.includes("comment")) {
    return "social";
  }
  if (t.includes("rating") || t.includes("review")) {
    return "expert_profile";
  }
  if (t.includes("call") || (t.includes("chat") && !t.includes("workspace"))) {
    return "communication";
  }
  if (t.includes("inquiry") || t.includes("enquiry")) {
    return "inquiry";
  }
  if (t.includes("workspace")) {
    return "master_service";
  }
  if (t.includes("service") || t.includes("booking")) {
    return "service";
  }
  if (t.includes("wallet") || t.includes("payment") || t.includes("withdrawal") || t.includes("expert_")) {
    return "expert_activity";
  }
  if (t.includes("admin") || t.includes("broadcast") || t.includes("announcement") || t.includes("offer")) {
    return "admin";
  }
  return "system";
};

/**
 * Standardize any raw notification payload into a unified structure
 */
export const buildStandardPayload = (raw = {}) => {
  const meta = parseMeta(raw.meta || raw.payload || raw.data || {});
  const type = String(raw.type || meta.type || NOTIFICATION_TYPES.CHAT_MESSAGE).toLowerCase();
  const category = raw.category || meta.category || deriveCategoryFromType(type);

  const senderId = raw.sender_id || raw.senderId || meta.sender_id || meta.senderId || "";
  const senderRole = raw.sender_role || raw.senderRole || meta.sender_role || "user";
  const senderName =
    raw.sender_name ||
    raw.senderName ||
    meta.sender_name ||
    meta.senderName ||
    meta.user_name ||
    meta.userName ||
    (senderId ? `User #${senderId}` : "System Notification");
  const senderAvatar = raw.sender_avatar || raw.senderAvatar || meta.sender_avatar || meta.senderAvatar || "";

  const receiverId = raw.receiver_id || raw.receiverId || raw.user_id || raw.userId || meta.receiver_id || "";
  const receiverRole = raw.receiver_role || raw.receiverRole || raw.panel || meta.receiver_role || "user";

  const resourceId =
    raw.related_id ||
    raw.relatedId ||
    meta.related_id ||
    meta.relatedId ||
    meta.resource_id ||
    meta.resourceId ||
    meta.post_id ||
    meta.reel_id ||
    meta.chat_id ||
    meta.callId ||
    meta.call_id ||
    meta.inquiry_id ||
    meta.service_id ||
    meta.booking_id ||
    "";

  const resourceType =
    raw.related_type ||
    raw.relatedType ||
    meta.related_type ||
    meta.relatedType ||
    meta.resource_type ||
    meta.resourceType ||
    (type.includes("reel") ? RESOURCE_TYPES.REEL :
     type.includes("post") ? RESOURCE_TYPES.POST :
     type.includes("review") || type.includes("rating") ? RESOURCE_TYPES.EXPERT_REVIEWS :
     type.includes("chat") ? RESOURCE_TYPES.CHAT :
     type.includes("call") ? RESOURCE_TYPES.CALL :
     type.includes("inquiry") ? RESOURCE_TYPES.INQUIRY :
     type.includes("workspace") ? RESOURCE_TYPES.SERVICE_WORKSPACE :
     type.includes("service") || type.includes("booking") ? RESOURCE_TYPES.BOOKING :
     type.includes("wallet") || type.includes("payment") ? RESOURCE_TYPES.WALLET :
     RESOURCE_TYPES.ANNOUNCEMENT);

  const rawRedirect =
    raw.redirect_screen ||
    raw.redirectScreen ||
    raw.targetUrl ||
    raw.target_url ||
    meta.redirect_screen ||
    meta.targetUrl ||
    meta.target_url ||
    meta.url ||
    meta.click_action ||
    "";

  const notificationId =
    String(raw.notification_id || raw.notificationId || raw.id || meta.notification_id || `${type}_${Date.now()}`);

  const createdAt = raw.created_at || raw.createdAt || meta.created_at || Date.now();
  const timestamp = typeof createdAt === "number" ? createdAt : new Date(createdAt).getTime() || Date.now();

  const isRead = Boolean(raw.is_read === 1 || raw.is_read === true || raw.read === true);

  return {
    notification_id: notificationId,
    type,
    category,
    sender_id: senderId,
    sender_role: senderRole,
    sender_name: senderName,
    sender_avatar: senderAvatar,
    receiver_id: receiverId,
    receiver_role: receiverRole,
    title: raw.title || meta.title || "G9Expert Notification",
    message: raw.message || raw.body || meta.message || meta.body || "",
    image_url: raw.image_url || meta.image_url || meta.icon || "",
    resource_id: resourceId,
    resource_type: resourceType,
    redirect_screen: rawRedirect,
    deep_link: raw.deep_link || meta.deep_link || `g9expert://${resourceType}/${resourceId}`,
    priority: raw.priority || meta.priority || (type.includes("call") ? "high" : "normal"),
    created_at: timestamp,
    is_read: isRead,
    metadata: {
      ...meta,
      type,
      category,
      resourceId,
      resourceType,
      senderName,
      senderAvatar,
    },
  };
};
