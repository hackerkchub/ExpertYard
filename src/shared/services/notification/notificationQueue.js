/* ==========================================================================
   G9EXPERT NOTIFICATION QUEUE, DEDUPLICATION & RETRY ENGINE
   ========================================================================== */

import { buildStandardPayload } from "./notificationPayload";

const STORAGE_KEY_QUEUE = "g9_notification_offline_queue";
const STORAGE_KEY_LOGS = "g9_notification_delivery_logs";

/**
 * Deduplicate notification by ID
 * @param {Array} existingList
 * @param {Object} newNotification
 * @returns {Array} Updated notification list without duplicates
 */
export const deduplicateNotifications = (existingList = [], newNotification) => {
  if (!newNotification) return existingList;
  const standardNew = buildStandardPayload(newNotification);
  
  const filtered = existingList.filter(
    (item) => String(item.notification_id || item.id) !== String(standardNew.notification_id)
  );

  return [standardNew, ...filtered];
};

/**
 * Save notification to offline retry queue
 */
export const queueOfflineNotification = (notification) => {
  if (typeof window === "undefined") return;
  try {
    const rawQueue = localStorage.getItem(STORAGE_KEY_QUEUE);
    const queue = rawQueue ? JSON.parse(rawQueue) : [];
    const updated = deduplicateNotifications(queue, notification);
    localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(updated.slice(0, 50)));
  } catch (err) {
    console.error("Error queuing notification offline:", err);
  }
};

/**
 * Get all pending offline queued notifications
 */
export const getOfflineQueue = () => {
  if (typeof window === "undefined") return [];
  try {
    const rawQueue = localStorage.getItem(STORAGE_KEY_QUEUE);
    return rawQueue ? JSON.parse(rawQueue) : [];
  } catch {
    return [];
  }
};

/**
 * Clear offline retry queue after successful sync
 */
export const clearOfflineQueue = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY_QUEUE);
  } catch (err) {
    console.error("Error clearing notification queue:", err);
  }
};

/**
 * Append delivery log entry
 */
export const logNotificationEvent = (notification, status = "delivered") => {
  if (typeof window === "undefined") return;
  try {
    const rawLogs = localStorage.getItem(STORAGE_KEY_LOGS);
    const logs = rawLogs ? JSON.parse(rawLogs) : [];
    const entry = {
      id: notification.notification_id || notification.id || Date.now(),
      type: notification.type || "system",
      status,
      timestamp: Date.now(),
    };
    const updated = [entry, ...logs].slice(0, 100);
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(updated));
  } catch (err) {
    console.error("Error logging notification:", err);
  }
};
