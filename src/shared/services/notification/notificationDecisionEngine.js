import { presenceService } from "../presence/presenceService";
import { deduplicationService } from "./deduplicationService";
import { createNotification } from "./notification.service";

/**
 * Single Canonical Notification Decision Engine
 * 
 * Flow:
 * evaluateAndDispatchChatNotification() -> presenceService -> Decision (SKIP_PUSH | SEND_PUSH) -> createNotification()
 */
export const evaluateAndDispatchChatNotification = async ({
  roomId,
  receiverId,
  senderId,
  senderName,
  message,
  meta = {},
  socketCount = 0,
  isOnline = false,
  activeRoom = null,
  visibility = "visible",
}) => {
  const incomingRoom = String(roomId || meta.room_id || meta.request_id || meta.booking_id || "");
  const targetReceiverId = String(receiverId || meta.receiver_id || meta.user_id || meta.expert_id || "");

  // 1. Deduplication Check
  const notifPayload = {
    type: "chat_message",
    id: meta.message_id || meta.client_id || meta.id,
    message,
    meta: { ...meta, room_id: incomingRoom },
  };

  if (deduplicationService.isDuplicate(notifPayload)) {
    console.log(`[Presence] receiverId=${targetReceiverId} decision=SKIP_PUSH reason=DUPLICATE_EVENT`);
    return { status: "skipped", decision: "SKIP_PUSH", reason: "DUPLICATE_EVENT" };
  }

  // 2. Evaluate recipient active status from presenceService
  const isViewingRoom =
    presenceService.isRecipientActiveInRoom(incomingRoom, targetReceiverId) ||
    (activeRoom && String(activeRoom) === incomingRoom && visibility === "visible");

  const recipientOnline = isOnline || socketCount > 0 || (isViewingRoom && visibility === "visible");

  // 🟢 Case 1: Recipient Online & Actively Viewing Chat Room
  if (recipientOnline && isViewingRoom) {
    console.log(
      `[Presence] receiverId=${targetReceiverId} socketCount=${socketCount || 1} activeRoom=${activeRoom || incomingRoom} incomingRoom=${incomingRoom} visibility=${visibility} isOnline=true isViewingRoom=true decision=SKIP_PUSH`
    );
    return { status: "skipped", decision: "SKIP_PUSH", reason: "RECIPIENT_ONLINE_VIEWING_CHAT" };
  }

  // 🟡 Case 2: Recipient Online but Viewing Different Screen in App
  if (recipientOnline && !isViewingRoom && visibility === "visible") {
    console.log(
      `[Presence] receiverId=${targetReceiverId} socketCount=${socketCount || 1} activeRoom=${activeRoom || "other"} incomingRoom=${incomingRoom} visibility=visible isOnline=true isViewingRoom=false decision=SKIP_PUSH reason=APP_OPEN_ON_OTHER_SCREEN`
    );
    return { status: "socket_only", decision: "SKIP_PUSH", reason: "APP_OPEN_ON_OTHER_SCREEN" };
  }

  // 🔴 Case 3: Recipient Offline / Disconnected / Background / Hidden
  console.log(
    `[Presence] receiverId=${targetReceiverId} socketCount=${socketCount || 0} activeRoom=${activeRoom || "none"} incomingRoom=${incomingRoom} visibility=${visibility} isOnline=${recipientOnline} isViewingRoom=false decision=SEND_PUSH reason=USER_OFFLINE`
  );

  // Delegate notification creation and push dispatch ONCE to createNotification()
  const result = await createNotification({
    receiverId: targetReceiverId,
    receiverRole: meta.receiver_role || "user",
    senderId,
    senderRole: meta.sender_role || "user",
    title: senderName || "New Message",
    message: message || "",
    type: "chat_message",
    relatedId: meta.message_id || meta.client_id,
    relatedType: "chat",
    meta: {
      ...meta,
      room_id: incomingRoom,
      from_push_decision_engine: true,
    },
  });

  return { status: result.status, decision: "SEND_PUSH", data: result.data };
};
