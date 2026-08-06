/* ==========================================================================
   G9EXPERT NOTIFICATION DISPATCHER (WRAPPER)
   Delegates system and custom notifications directly to createNotification()
   ========================================================================== */

import { createNotification } from "./notification.service";

/**
 * Dispatch system or custom notification
 * Single wrapper delegating directly to createNotification() in notification.service.js
 */
export const dispatchSystemNotification = async (notificationPayload = {}) => {
  return createNotification(notificationPayload);
};
