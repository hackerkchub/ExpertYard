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
 * Extract original filename from Content-Disposition header
 */
export const extractFilenameFromHeader = (dispositionHeader, fallbackName = "document") => {
  if (!dispositionHeader) return fallbackName;

  // Try filename*=UTF-8''... format first
  const utf8Match = dispositionHeader.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match && utf8Match[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {}
  }

  // Fallback to filename="..." format
  const match = dispositionHeader.match(/filename="?([^";]+)"?/i);
  if (match && match[1]) {
    return match[1].trim();
  }

  return fallbackName;
};

/**
 * Retrieve workspace document file as Blob using authenticated API endpoint
 */
export const getWorkspaceDocumentBlob = async (bookingId, documentId, mode = "view") => {
  if (!bookingId || !documentId) {
    throw new Error("Missing bookingId or documentId");
  }

  const endpoint = `/workspace/${bookingId}/documents/${documentId}/file?mode=${mode}`;
  const response = await axios.get(endpoint, {
    responseType: "blob",
    skipLoader: true,
  });

  const disposition = response.headers ? response.headers["content-disposition"] : null;
  const fileName = extractFilenameFromHeader(disposition, "document");

  return {
    blob: response.data,
    fileName,
    contentType: response.headers ? response.headers["content-type"] : null,
  };
};

/**
 * Trigger authenticated file download for workspace document
 */
export const downloadWorkspaceDocument = async (bookingId, documentId, fallbackName = "download") => {
  const { blob, fileName } = await getWorkspaceDocumentBlob(bookingId, documentId, "download");
  const blobUrl = window.URL.createObjectURL(blob);

  const finalName = fileName || fallbackName || "download";
  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = blobUrl;
  anchor.download = finalName;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);
};

/**
 * Retrieve workspace file as a Blob using authenticated axiosInstance
 * Backward compatible with fileUrl or (bookingId, documentId)
 */
export const getWorkspaceFileBlob = async (fileUrl, bookingId = null, documentId = null) => {
  if (bookingId && documentId) {
    const res = await getWorkspaceDocumentBlob(bookingId, documentId, "view");
    return res.blob;
  }

  if (!fileUrl) throw new Error("No file URL or document identifier provided.");

  const resolvedUrl = resolveWorkspaceFileUrl(fileUrl);

  const response = await axios.get(resolvedUrl, {
    responseType: "blob",
    skipLoader: true,
  });

  return response.data;
};

/**
 * Trigger direct browser file download using authenticated Blob
 */
export const downloadWorkspaceFile = async (fileUrl, fileName = "download", bookingId = null, documentId = null) => {
  if (bookingId && documentId) {
    return downloadWorkspaceDocument(bookingId, documentId, fileName);
  }

  if (!fileUrl) return;

  const blob = await getWorkspaceFileBlob(fileUrl);
  const blobUrl = window.URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = blobUrl;
  anchor.download = fileName || "download";

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);
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