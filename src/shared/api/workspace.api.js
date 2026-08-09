import axios from "./axiosInstance";

/* =====================================================
   📦 WORKSPACE API
   USER / EXPERT / ADMIN COMMON
===================================================== */

/* =====================================================
   🟢 WORKSPACE
===================================================== */

/**
 * Get complete workspace data
 */
export const getWorkspace = (bookingId) => {
  return axios.get(`/workspace/${bookingId}`);
};

/**
 * Refresh workspace
 * skipLoader prevents global loader
 */
export const refreshWorkspace = (bookingId) => {
  return axios.get(`/workspace/${bookingId}`, {
    skipLoader: true,
  });
};

/**
 * Admin / Supervisory workflow step override
 */
export const updateWorkspaceStep = (bookingId, targetStepKey) => {
  return axios.patch(`/workspace/${bookingId}/transition`, {
    target_step_key: targetStepKey,
  });
};

/**
 * Confirm client form / requirement details
 */
export const confirmWorkspaceForm = (bookingId) => {
  return axios.patch(`/workspace/${bookingId}/confirm-form`);
};

/* =====================================================
   📁 FILE UPLOAD
===================================================== */

/**
 * Upload physical workspace file
 */
export const uploadWorkspaceFile = (formData, onUploadProgress) => {
  return axios.post(`/workspace/upload-file`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

/* =====================================================
   📄 DOCUMENTS
===================================================== */

/**
 * Upload workspace document
 */
export const uploadWorkspaceDocument = (bookingId, payload) => {
  return axios.post(
    `/workspace/${bookingId}/documents/upload`,
    payload
  );
};

/**
 * Replace existing workspace document
 */
export const replaceWorkspaceDocument = (
  bookingId,
  documentId,
  payload
) => {
  return axios.patch(
    `/workspace/${bookingId}/documents/${documentId}/replace`,
    payload
  );
};

/**
 * Approve / Reject workspace document
 */
export const verifyWorkspaceDocument = (
  bookingId,
  documentId,
  status,
  rejectionReason = ""
) => {
  return axios.patch(
    `/workspace/${bookingId}/documents/${documentId}/status`,
    {
      status,
      rejection_reason: rejectionReason,
    }
  );
};

/* =====================================================
   🎁 DELIVERY
===================================================== */

/**
 * Submit final delivery
 */
export const submitWorkspaceDelivery = (
  bookingId,
  payload
) => {
  return axios.post(
    `/workspace/${bookingId}/delivery`,
    payload
  );
};

/**
 * Accept final delivery
 */
export const acceptWorkspaceDelivery = (bookingId) => {
  return axios.post(
    `/workspace/${bookingId}/delivery/accept`
  );
};

/* =====================================================
   👨‍💼 ADMIN WORKSPACE MONITORING
===================================================== */

/**
 * Get all workspace monitoring records
 */
export const getAdminWorkspaceMonitor = () => {
  return axios.get(`/workspace/admin/monitor`);
};

/**
 * Get experts available for workspace assignment
 */
export const getWorkspaceExpertsList = () => {
  return axios.get(`/workspace/admin/experts-list`);
};

/**
 * Reassign workspace expert
 */
export const reassignWorkspaceExpert = (
  bookingId,
  expertId
) => {
  return axios.patch(
    `/workspace/${bookingId}/reassign-expert`,
    {
      expert_id: expertId,
    }
  );
};

/* =====================================================
   ⭐ REVIEW
===================================================== */

/**
 * Submit workspace service review
 */
export const submitWorkspaceReview = (payload) => {
  return axios.post("/reviews", payload);
};