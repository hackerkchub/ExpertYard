class NotificationDeduplicationService {
  constructor() {
    this.processedKeys = new Map(); // key -> timestamp
  }

  generateKey(notificationData = {}) {
    const meta = notificationData.meta || notificationData.payload || notificationData.data || {};
    const type = String(notificationData.type || meta.type || "generic").toLowerCase();
    
    if (type === "chat_request") {
      const reqId = meta.request_id || meta.requestId || notificationData.request_id || notificationData.requestId || notificationData.related_id || notificationData.relatedId;
      if (reqId) {
        return `notif:chat_request:${reqId}`;
      }
    }

    const roomId = meta.room_id || meta.roomId || meta.request_id || meta.requestId || notificationData.related_id || notificationData.relatedId || "global";
    const msgId = meta.message_id || meta.client_id || notificationData.notification_id || notificationData.id || meta.notification_id || "msg";

    return `notif:${type}:${roomId}:${msgId}`;
  }

  /**
   * Returns true if notification key was already processed within 15 seconds
   */
  isDuplicate(notificationData = {}) {
    const key = this.generateKey(notificationData);
    const now = Date.now();
    const prevTime = this.processedKeys.get(key);

    if (prevTime && now - prevTime < 15000) {
      return true; // Duplicate detected within 15s window
    }

    this.processedKeys.set(key, now);
    this.cleanup(now);
    return false;
  }

  cleanup(now = Date.now()) {
    for (const [key, timestamp] of this.processedKeys.entries()) {
      if (now - timestamp > 15000) {
        this.processedKeys.delete(key);
      }
    }
  }
}

export const deduplicationService = new NotificationDeduplicationService();
