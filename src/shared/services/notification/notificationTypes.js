/* ==========================================================================
   G9EXPERT NOTIFICATION TYPES & CATEGORIES (PANEL AGNOSTIC)
   ========================================================================== */

export const NOTIFICATION_CATEGORIES = {
  SOCIAL: "social",
  EXPERT_PROFILE: "expert_profile",
  COMMUNICATION: "communication",
  INQUIRY: "inquiry",
  SERVICE: "service",
  MASTER_SERVICE: "master_service",
  EXPERT_ACTIVITY: "expert_activity",
  ADMIN: "admin",
};

export const NOTIFICATION_TYPES = {
  // 1. Social Activity Notifications
  REEL_LIKE: "reel_like",
  REEL_COMMENT: "reel_comment",
  POST_LIKE: "post_like",
  POST_COMMENT: "post_comment",
  EXPERT_FOLLOW: "expert_follow",

  // 2. Expert Profile Notifications
  EXPERT_RATING: "expert_rating",
  EXPERT_REVIEW: "expert_review",

  // 3. Communication Notifications
  VOICE_CALL: "voice_call",
  VIDEO_CALL: "video_call",
  CHAT_MESSAGE: "chat_message",
  CHAT_REQUEST: "chat_request",
  COMMUNICATION_INQUIRY: "communication_inquiry",

  // 4. Inquiry Notifications
  INQUIRY_NEW: "inquiry_new",
  INQUIRY_FIRST_REPLY: "inquiry_first_reply",
  INQUIRY_BACKGROUND_REPLY: "inquiry_background_reply",
  INQUIRY_STATUS_CHANGE: "inquiry_status_change",

  // 5. Service Notifications
  SERVICE_BOOKED: "service_booked",
  SERVICE_ACCEPTED: "service_accepted",
  SERVICE_REJECTED: "service_rejected",
  SERVICE_STARTED: "service_started",
  SERVICE_COMPLETED: "service_completed",
  SERVICE_DELIVERED: "service_delivered",
  SERVICE_CANCELLED: "service_cancelled",
  SERVICE_ADMIN_COMPLETED: "service_admin_completed",

  // 6. Master Service Communication
  WORKSPACE_MESSAGE: "workspace_message",
  WORKSPACE_CALL: "workspace_call",
  WORKSPACE_USER_REPLY: "workspace_user_reply",
  WORKSPACE_ATTACHMENT: "workspace_attachment",
  WORKSPACE_MILESTONE: "workspace_milestone",

  // 7. Expert Activity Notifications
  EXPERT_NEW_BOOKING: "expert_new_booking",
  EXPERT_NEW_INQUIRY: "expert_new_inquiry",
  EXPERT_NEW_MESSAGE: "expert_new_message",
  EXPERT_PAYMENT: "expert_payment",
  EXPERT_WALLET: "expert_wallet",
  EXPERT_WITHDRAWAL_APPROVED: "expert_withdrawal_approved",
  EXPERT_WITHDRAWAL_REJECTED: "expert_withdrawal_rejected",

  // 8. Admin Broadcast Notifications
  ADMIN_BROADCAST_ALL_EXPERTS: "admin_broadcast_all_experts",
  ADMIN_BROADCAST_SELECTED_EXPERTS: "admin_broadcast_selected_experts",
  ADMIN_BROADCAST_SINGLE_EXPERT: "admin_broadcast_single_expert",
  ADMIN_BROADCAST_ALL_USERS: "admin_broadcast_all_users",
  ADMIN_BROADCAST_SELECTED_USERS: "admin_broadcast_selected_users",
  ADMIN_BROADCAST_SINGLE_USER: "admin_broadcast_single_user",
};

export const RESOURCE_TYPES = {
  REEL: "reel",
  POST: "post",
  EXPERT_PROFILE: "expert_profile",
  EXPERT_REVIEWS: "expert_reviews",
  CHAT: "chat",
  CALL: "call",
  INQUIRY: "inquiry",
  SERVICE_WORKSPACE: "service_workspace",
  ANNOUNCEMENT: "announcement",
  OFFER: "offer",
  WALLET: "wallet",
  BOOKING: "booking",
};
