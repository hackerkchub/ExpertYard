import axios from "./axiosInstance";

/* =====================================================
   COMMON NOTIFICATION API (panel agnostic)
   Works for: user | expert | admin
===================================================== */


/* 🔔 LIST */
export const getNotifications = ({
  userId,
  panel,
  receiverId,
  receiverRole,
  page = 1,
  limit = 20,
}) => {
  const id = receiverId || userId;
  const role = receiverRole || panel;
  return axios.get(
    `/notifications?receiverId=${id}&receiverRole=${role}&page=${page}&limit=${limit}`
  );
};


/* 🔴 UNREAD COUNT */
export const getUnreadCount = ({ userId, panel, receiverId, receiverRole }) => {
  const id = receiverId || userId;
  const role = receiverRole || panel;
  return axios.get(
    `/notifications/unread-count?receiverId=${id}&receiverRole=${role || ""}`
  );
};


/* ✅ MARK READ */
export const markRead = ({ userId, panel, receiverId, receiverRole, id }) => {
  const rid = receiverId || userId;
  const role = receiverRole || panel;
  return axios.patch(
    `/notifications/${id}/read?receiverId=${rid}&receiverRole=${role || ""}`
  );
};

export const markAllRead = ({ userId, panel, receiverId, receiverRole }) => {
  return axios.patch("/notifications/read-all", {
    receiverId: receiverId || userId,
    receiverRole: receiverRole || panel,
  });
};


/* =====================================================
   🆕 SAVE (HYBRID MODE)
   socket receive → save DB
===================================================== */
export const saveNotification = ({
  userId,
  panel,
  receiverId,
  receiverRole,
  senderId,
  senderRole,
  title,
  message,
  body,
  type,
  targetUrl,
  relatedId,
  relatedType,
  meta = {},
}) => {
  return axios.post("/notifications", {
    receiverId: receiverId || userId,
    receiverRole: receiverRole || panel,
    userId: receiverId || userId,
    panel: receiverRole || panel,
    senderId,
    senderRole,
    title,
    message,
    body,
    type,
    targetUrl,
    relatedId,
    relatedType,
    meta,
  });
};


export const deleteNotification = (id, userId, panel) =>
  axios.delete(`/notifications/${id}?receiverId=${userId}&receiverRole=${panel || ""}`);


/* 🔄 UPDATE STATUS */
export const updateNotificationStatus = ({
  requestId,
  type,
  status,
}) => {
  return axios.patch("/notifications/status", {
    requestId,
    type,
    status,
  });
};
