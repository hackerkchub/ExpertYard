/* ==========================================================================
   G9EXPERT SOCIAL ACTIVITY NOTIFICATION TRIGGER HELPER
   Dispatches social activity notifications via canonical createNotification()
   ========================================================================== */

import { createNotification } from "./notification.service";
import { resolveNotificationRoute } from "./notificationRouter";

/**
 * Safely extract receiver ID from various object structures
 */
export const getReceiverIdFromObject = (item) => {
  if (!item) return null;
  if (typeof item === "number" || typeof item === "string") return item;

  return (
    item.expert_id ||
    item.expertId ||
    item.user_id ||
    item.userId ||
    item.author_id ||
    item.authorId ||
    item.expert?.id ||
    item.expert?.expert_id ||
    item.profile?.expert_id ||
    item.profile?.id ||
    null
  );
};

/**
 * Trigger social notification (like/comment on post/reel)
 */
export const sendSocialNotification = async ({
  type,
  senderUser,
  receiverId,
  receiverRole = "expert",
  resourceId,
  resourceType = "post",
  resourceTitle = "",
  allowSelfNotification = true,
}) => {
  const actualReceiverId = getReceiverIdFromObject(receiverId);

  console.log("📢 [SocialNotification] Triggered:", {
    type,
    senderUserId: senderUser?.id || senderUser?.user_id,
    receiverId: actualReceiverId,
    receiverRole,
    resourceId,
    resourceType,
    resourceTitle,
  });

  if (!senderUser || !actualReceiverId) {
    console.warn("⚠️ [SocialNotification] Skipped: Missing senderUser or receiverId", {
      senderUser,
      receiverId: actualReceiverId,
    });
    return;
  }

  const senderId = senderUser.id || senderUser.user_id;
  if (!senderId) {
    console.warn("⚠️ [SocialNotification] Skipped: Missing senderId", senderUser);
    return;
  }

  // Self-notification check
  if (!allowSelfNotification && String(senderId) === String(actualReceiverId)) {
    console.log("ℹ️ [SocialNotification] Skipped: User interacting with own content");
    return;
  }

  const senderName =
    senderUser.first_name || senderUser.name
      ? `${senderUser.first_name || senderUser.name || ""} ${senderUser.last_name || ""}`.trim()
      : "Someone";
  const senderAvatar = senderUser.profile_photo || senderUser.avatar || "";

  let title = "Social Activity";
  let message = `${senderName} interacted with your content.`;

  if (type === "reel_like") {
    title = "New Reel Like";
    message = `${senderName} liked your Reel.`;
  } else if (type === "reel_comment") {
    title = "New Reel Comment";
    message = `${senderName} commented on your Reel.`;
  } else if (type === "post_like" || type === "like") {
    title = "New Post Like";
    message = `${senderName} liked your Post.`;
  } else if (type === "post_comment" || type === "comment") {
    title = "New Post Comment";
    message = `${senderName} commented on your Post.`;
  } else if (type === "expert_follow" || type === "follow") {
    title = "New Follower";
    message = `${senderName} started following you.`;
  } else if (type === "expert_review" || type === "review") {
    title = "New Profile Review";
    message = `${senderName} submitted a review on your profile.`;
  }

  const redirectScreen = resolveNotificationRoute(
    { type, resource_id: resourceId, related_id: resourceId },
    receiverRole
  );

  return createNotification({
    type,
    category: "social",
    sender_id: senderId,
    senderId,
    sender_role: "user",
    senderRole: "user",
    sender_name: senderName,
    sender_avatar: senderAvatar,
    receiver_id: actualReceiverId,
    receiverId: actualReceiverId,
    receiver_role: receiverRole,
    receiverRole,
    title,
    message,
    related_id: resourceId,
    relatedId: resourceId,
    related_type: resourceType,
    relatedType: resourceType,
    redirect_screen: redirectScreen,
    targetUrl: redirectScreen,
    meta: {
      post_id: resourceType === "post" ? resourceId : undefined,
      reel_id: resourceType === "reel" ? resourceId : undefined,
      resource_title: resourceTitle,
      user_name: senderName,
    },
  });
};
