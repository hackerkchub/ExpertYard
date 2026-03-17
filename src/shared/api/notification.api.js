import axios from "./axiosInstance";

/* =====================================================
   COMMON NOTIFICATION API (panel agnostic)
   Works for: user | expert | admin
===================================================== */


/* 🔔 LIST */
export const getNotifications = ({
  userId,
  panel,
  page = 1,
  limit = 20,
}) => {
  return axios.get(
    `/notifications?userId=${userId}&panel=${panel}&page=${page}&limit=${limit}`
  );
};


/* 🔴 UNREAD COUNT */
export const getUnreadCount = ({ userId }) => {
  return axios.get(
    `/notifications/unread/count?userId=${userId}`
  );
};


/* ✅ MARK READ */
export const markRead = ({ userId, id }) => {
  return axios.patch(
    `/notifications/${id}/read?userId=${userId}`
  );
};


/* =====================================================
   🆕 SAVE (HYBRID MODE)
   socket receive → save DB
===================================================== */
export const saveNotification = ({
  userId,
  panel,
  title,
  message,
  type,
  meta = {},
}) => {
  return axios.post("/notifications/save", {
    userId,
    panel,
    title,
    message,
    type,
    meta,
  });
};


export const deleteNotification = (id, userId) =>
  axios.delete(`/notifications/${id}?userId=${userId}`);


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