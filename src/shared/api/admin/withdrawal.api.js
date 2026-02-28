import adminApi  from "./axiosInstance";

/* PENDING LIST */
export const getPendingWithdrawalsApi = () =>
  adminApi.get("/admin/withdrawal/pending");

/* APPROVE */
export const approveWithdrawalApi = (formData) =>
  adminApi.post("/admin/withdrawal/approve", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

/* REJECT */
export const rejectWithdrawalApi = (data) =>
  adminApi.post("/admin/withdrawal/reject", data);

/* RECEIPT DOWNLOAD */
export const downloadReceiptApi = (id) =>
  adminApi.get(`/admin/withdrawal/receipt/${id}`, {
    responseType: "blob",
  });

  /* ADMIN HISTORY */
export const getAdminWithdrawalHistoryApi = () =>
  adminApi.get("/admin/withdrawal/history");