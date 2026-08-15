import axios from "./axiosInstance";
import { APP_CONFIG } from "../../config/appConfig";

/**
 * Resolve workspace file URL against backend origin
 */
export const resolveWorkspaceFileUrl = (fileUrl) => {
  if (!fileUrl) return "";

  if (
    fileUrl.startsWith("http://") ||
    fileUrl.startsWith("https://") ||
    fileUrl.startsWith("blob:") ||
    fileUrl.startsWith("data:")
  ) {
    return fileUrl;
  }

  const apiBase = APP_CONFIG?.API_BASE_URL || "";
  let backendOrigin = APP_CONFIG?.SOCKET_URL || "";

  if (!backendOrigin && apiBase) {
    backendOrigin = apiBase.replace(/\/api\/?$/, "");
  }

  // Strip trailing slashes from backendOrigin
  const cleanOrigin = backendOrigin.replace(/\/+$/, "");

  // Ensure leading slash on file path
  const cleanPath = fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`;

  return `${cleanOrigin}${cleanPath}`;
};

/**
 * Trigger direct browser file download without fetch/blob to avoid CORS errors
 */
export const downloadWorkspaceFile = (fileUrl, fileName = "download") => {
  if (!fileUrl) return;

  const resolvedUrl = resolveWorkspaceFileUrl(fileUrl);
  if (!resolvedUrl) return;

  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = resolvedUrl;
  anchor.download = fileName || "download";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

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

/**
 * Request status change by Expert (COMPLETED or CANCELLED) requiring Admin approval
 */
export const requestWorkspaceStatusChange = (bookingId, targetStatus, notes = "") => {
  return axios.post(`/workspace/${bookingId}/request-status-change`, {
    target_status: targetStatus,
    notes,
  });
};

/**
 * Dismiss status change request by Admin
 */
export const dismissWorkspaceStatusRequest = (bookingId) => {
  return axios.delete(`/workspace/${bookingId}/dismiss-status-request`);
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