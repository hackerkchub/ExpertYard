import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiFileText,
  FiFolder,
  FiClock,
  FiMessageSquare,
  FiPhone,
  FiUploadCloud,
  FiAlertTriangle,
  FiRefreshCw,
  FiDownload,
  FiUserCheck,
  FiShield,
  FiDollarSign,
  FiX
} from "react-icons/fi";
import OrderProgressTimeline from "./OrderProgressTimeline";
import {
  getWorkspace,
  uploadWorkspaceFile,
  uploadWorkspaceDocument,
  acceptWorkspaceDelivery,
  confirmWorkspaceForm,
  updateWorkspaceStep,
  resolveWorkspaceFileUrl,
  getWorkspaceFileBlob,
  getWorkspaceDocumentBlob,
  downloadWorkspaceFile,
  downloadWorkspaceDocument
} from "../../api/workspace.api";
import "./Workspace.css";

export default function BookingWorkspaceShell() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // State Management
  const [workspace, setWorkspace] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Modal / Action State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docFile, setDocFile] = useState(null);
  const [docLabel, setDocLabel] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [acceptingDelivery, setAcceptingDelivery] = useState(false);
  const [confirmingForm, setConfirmingForm] = useState(false);

  // File Action & Lightbox Preview State
  const [loadingAction, setLoadingAction] = useState({});
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    blobUrl: null,
    fileName: "",
    fileUrl: "",
  });

  const handleViewFile = async (docOrUrl, fileName = "Document", actionKey, docId = null) => {
    if (loadingAction[actionKey]) return;
    try {
      setLoadingAction((prev) => ({ ...prev, [actionKey]: true }));

      let blob = null;
      let resolvedFileName = fileName || "Document";

      const targetDocId = docId || (typeof docOrUrl === "object" ? docOrUrl.id : null);
      const targetFileUrl = typeof docOrUrl === "string" ? docOrUrl : docOrUrl?.file_url;

      if (bookingId && targetDocId) {
        const res = await getWorkspaceDocumentBlob(bookingId, targetDocId, "view");
        blob = res.blob;
        if (res.fileName) resolvedFileName = res.fileName;
      } else if (targetFileUrl) {
        blob = await getWorkspaceFileBlob(targetFileUrl);
      } else {
        throw new Error("Document unavailable");
      }

      const blobUrl = window.URL.createObjectURL(blob);
      setPreviewModal({
        isOpen: true,
        blobUrl,
        fileName: resolvedFileName,
        fileUrl: targetFileUrl || "",
        docId: targetDocId
      });
    } catch (err) {
      console.error("View document error:", err);
      const msg = err?.response?.status === 403
        ? "Access denied: You don't have permission to view this document."
        : err?.response?.status === 404
        ? "Document is no longer available on the server."
        : "Unable to open this document. Please try again.";
      alert(msg);
    } finally {
      setLoadingAction((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleDownloadFile = async (docOrUrl, fileName = "download", actionKey, docId = null) => {
    if (loadingAction[actionKey]) return;
    try {
      setLoadingAction((prev) => ({ ...prev, [actionKey]: true }));

      const targetDocId = docId || (typeof docOrUrl === "object" ? docOrUrl.id : null);
      const targetFileUrl = typeof docOrUrl === "string" ? docOrUrl : docOrUrl?.file_url;

      if (bookingId && targetDocId) {
        await downloadWorkspaceDocument(bookingId, targetDocId, fileName);
      } else if (targetFileUrl) {
        await downloadWorkspaceFile(targetFileUrl, fileName);
      } else {
        throw new Error("Document unavailable for download.");
      }
    } catch (err) {
      console.error("Download document error:", err);
      const msg = err?.response?.status === 403
        ? "Access denied: You don't have permission to download this document."
        : err?.response?.status === 404
        ? "Document file is no longer available on the server."
        : "Unable to download this document. Please try again.";
      alert(msg);
    } finally {
      setLoadingAction((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleClosePreviewModal = () => {
    if (previewModal.blobUrl) {
      window.URL.revokeObjectURL(previewModal.blobUrl);
    }
    setPreviewModal({
      isOpen: false,
      blobUrl: null,
      fileName: "",
      fileUrl: "",
      docId: null
    });
  };

  useEffect(() => {
    if (previewModal.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [previewModal.isOpen]);

  // User Role
  const userRaw = localStorage.getItem("user") || localStorage.getItem("userData");
  let currentUserRole = "user";
  try {
    const parsedUser = JSON.parse(userRaw);
    if (parsedUser?.role) currentUserRole = parsedUser.role.toLowerCase();
  } catch (e) {}

  // Token Resolver helper
  const getAuthToken = () => {
    return (
      localStorage.getItem("user_token") ||
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      localStorage.getItem("expert_token") ||
      localStorage.getItem("admin_token") ||
      ""
    );
  };

  // Fetch Complete Workspace State
  const fetchWorkspace = useCallback(async () => {
    if (!bookingId) return;
    try {
      setRefreshing(true);
      setError("");
      const res = await getWorkspace(bookingId);
      if (res.data?.success) {
        setWorkspace(res.data.data.workspace);
        setSnapshot(res.data.data.snapshot);
        setDocuments(res.data.data.documents || []);
      } else {
        setError(res.data?.message || "Failed to load workspace details.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error fetching workspace.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  // Handle Admin Step Override
  const handleStepOverride = async (targetStepKey) => {
    if (!window.confirm(`Are you sure you want to transition order to ${targetStepKey}?`)) return;
    try {
      const response = await updateWorkspaceStep(bookingId, targetStepKey);
      if (response.data?.success) {
        fetchWorkspace();
      } else {
        alert(response.data.message || "Failed to override step.");
      }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Error overriding step.");
    }
  };

  // Handle Client Document Upload
  const handleUploadDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!docFile) return alert("Please select a file to upload.");
    try {
      setUploadingDoc(true);
      const formData = new FormData();
      formData.append("file", docFile);

      // Upload file via workspace API endpoint helper (uses APP_CONFIG.API_BASE_URL)
      const fileRes = await uploadWorkspaceFile(formData);
      const fileData = fileRes.data;

      if (!fileData.success) throw new Error(fileData.message || "File upload failed.");

      // Attach document metadata to workspace
      const docPayload = {
        doc_type_key: "CLIENT_DOCUMENT",
        file_name: docFile.name,
        file_url: fileData.data?.file_url || fileData.file_url,
        file_size: docFile.size
      };

      await uploadWorkspaceDocument(bookingId, docPayload);
      alert("Document uploaded successfully!");
      setShowUploadModal(false);
      setDocFile(null);
      setDocLabel("");
      fetchWorkspace();
    } catch (err) {
      alert(err.message || "Failed to upload document.");
    } finally {
      setUploadingDoc(false);
    }
  };

  // Handle Delivery Acceptance
  const handleAcceptDelivery = async () => {
    if (!window.confirm("Are you sure you want to accept the delivery and complete this order?")) return;
    try {
      setAcceptingDelivery(true);
      const res = await acceptWorkspaceDelivery(bookingId);
      if (res.data?.success) {
        alert("Delivery accepted! Order is now COMPLETED.");
        fetchWorkspace();
      } else {
        alert(res.data?.message || "Failed to accept delivery.");
      }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Error accepting delivery.");
    } finally {
      setAcceptingDelivery(false);
    }
  };

  // Handle Form Confirmation
  const handleConfirmFormDetails = async () => {
    try {
      setConfirmingForm(true);
      const res = await confirmWorkspaceForm(bookingId);
      if (res.data?.success) {
        alert("Requirements confirmed!");
        fetchWorkspace();
      } else {
        alert(res.data?.message || "Failed to confirm requirements.");
      }
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Error confirming requirements.");
    } finally {
      setConfirmingForm(false);
    }
  };

  // Action Dispatcher for Timeline Buttons
  const handleTimelineAction = (actionType) => {
    if (actionType === "upload_document") {
      setShowUploadModal(true);
    } else if (actionType === "chat") {
      const expId = snapshot?.expert?.expert_id || workspace?.expert_id;
      if (expId) navigate(`/user/chat?expert_id=${expId}`);
      else alert("Expert assignment in progress.");
    } else if (actionType === "call") {
      const expId = snapshot?.expert?.expert_id || workspace?.expert_id;
      if (expId) navigate(`/user/voice-call/${expId}`);
      else alert("Expert assignment in progress.");
    } else if (actionType === "view_delivery") {
      const el = document.getElementById("canvas-delivery-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="canvas-workspace-container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="canvas-spin" style={{ width: 44, height: 44, border: "4px solid #e2e8f0", borderTopColor: "#6b46c1", borderRadius: "50%", margin: "0 auto 1rem" }} />
          <p style={{ color: "#64748b", fontWeight: 700 }}>Loading Order Workspace Canvas...</p>
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="canvas-workspace-container" style={{ maxWidth: 640, margin: "3rem auto", padding: "2rem", background: "#fff", borderRadius: 16, border: "1px solid #fecaca", textAlign: "center" }}>
        <FiAlertTriangle size={36} color="#ef4444" style={{ marginBottom: "0.5rem" }} />
        <h3 style={{ color: "#b91c1c", margin: "0 0 0.5rem" }}>Order Workspace Unavailable</h3>
        <p style={{ color: "#64748b", marginBottom: "1.5rem" }}>{error || "Booking record not found."}</p>
        <button onClick={() => navigate(-1)} style={{ padding: "0.6rem 1.25rem", background: "#6b46c1", color: "#fff", border: 0, borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
          ← Return to Dashboard
        </button>
      </div>
    );
  }

  // Derive State Flags & Data
  const currentStepKey = String(workspace?.current_step_key || "SUBMITTED").toUpperCase();
  const bookingStatus = String(workspace?.booking_status || workspace?.status || "").toUpperCase();
  const isCompleted = currentStepKey === "COMPLETED" || bookingStatus === "COMPLETED";
  const isCancelled = currentStepKey === "CANCELLED" || bookingStatus === "CANCELLED";

  // Communication Availability Rule: ONLY Active orders!
  const canContactExpert = !isCompleted && !isCancelled;

  // Filter Document lists
  const rejectedDocs = documents.filter((d) => String(d.status).toUpperCase() === "REJECTED");
  const expertFiles = documents.filter((d) => String(d.doc_type_key).toUpperCase() === "EXPERT_DELIVERY" || String(d.uploaded_by_role).toUpperCase() === "EXPERT");
  const userDocs = documents.filter((d) => String(d.uploaded_by_role).toUpperCase() !== "EXPERT" && String(d.doc_type_key).toUpperCase() !== "EXPERT_DELIVERY");

  // Action Required State
  const isActionRequired = (rejectedDocs.length > 0 || workspace?.expert_status_request === "CANCELLED_REQUESTED" || workspace?.action_required === true) && !isCompleted && !isCancelled;

  // Metadata Snapshot Details
  const expertInfo = snapshot?.expert || {};
  const masterServiceInfo = snapshot?.master_service || {};
  const financial = snapshot?.financial || {};

  const effectiveBaseAmount = Number(
    financial?.effective_base_amount ?? financial?.base_amount ?? 0
  );

  const gstAmount = Number(financial?.gst_amount ?? 0);

  const totalAmount = Number(
    financial?.total_amount ?? workspace?.amount ?? 0
  );

  const formatCurrency = (value) => {
    const amount = Number(value);

    if (!Number.isFinite(amount)) {
      return "₹0.00";
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="canvas-workspace-container">
      
      {/* 1. ORDER WORKSPACE HEADER BAR */}
      <div className="canvas-header-card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{ background: "#f1f5f9", border: 0, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#334155" }}
            title="Back"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#6b46c1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Order Workspace • Booking #{workspace.booking_id || workspace.id}
            </div>
            <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
              {masterServiceInfo.title || workspace.service_title || "Service Fulfilling Order"}
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* <button
            type="button"
            onClick={fetchWorkspace}
            disabled={refreshing}
            style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#334155", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
          >
            <FiRefreshCw size={13} className={refreshing ? "canvas-spin" : ""} /> Refresh
          </button> */}

          {currentUserRole === "admin" && (
            <select
              value={currentStepKey}
              onChange={(e) => handleStepOverride(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #6b46c1", background: "#faf5ff", color: "#553c9a", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
            >
              <option value="SUBMITTED">Admin: Set SUBMITTED</option>
              <option value="DOCUMENTS">Admin: Set DOCUMENTS</option>
              <option value="EXPERT_ASSIGNED">Admin: Set EXPERT_ASSIGNED</option>
              <option value="IN_REVIEW">Admin: Set IN_REVIEW</option>
              <option value="DELIVERED">Admin: Set DELIVERED</option>
              <option value="COMPLETED">Admin: Set COMPLETED</option>
              <option value="CANCELLED">Admin: Set CANCELLED</option>
            </select>
          )}
        </div>
      </div>

      {/* 2. SINGLE CONTINUOUS CANVAS GRID (65% PRIMARY COLUMN / 35% SIDEBAR) */}
      <div className="canvas-workspace-grid">
        
        {/* =========================================================================
           PRIMARY CANVAS COLUMN (LEFT)
           ========================================================================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* COMPLETE ORDER PROGRESS JOURNEY */}
          <OrderProgressTimeline
            workspace={workspace}
            snapshot={snapshot}
            documents={documents}
            currentUserRole={currentUserRole}
            onActionClick={handleTimelineAction}
          />

          {/* ACTION REQUIRED BANNER CARD (IF APPLICABLE) */}
          {isActionRequired && (
            <div className="canvas-card" style={{ background: "#fffbeb", border: "1.5px solid #fde68a" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <FiAlertTriangle size={22} color="#b45309" style={{ marginTop: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: "#92400e", fontSize: "1rem", fontWeight: 800 }}>
                    Action Required from Client
                  </h4>
                  <p style={{ margin: "4px 0 10px", color: "#78350f", fontSize: "0.86rem", lineHeight: 1.45 }}>
                    {rejectedDocs.length > 0
                      ? `Your expert rejected ${rejectedDocs.length} document(s). Please review the feedback and re-upload valid files.`
                      : "Action is required to proceed with service fulfillment."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    style={{ background: "#f59e0b", color: "#fff", border: 0, padding: "8px 16px", borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <FiUploadCloud size={14} /> Upload Required Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FILES RECEIVED FROM EXPERT CARD */}
          {expertFiles.length > 0 && (
            <div className="canvas-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                  <FiFolder color="#6b46c1" /> Files Received from Expert ({expertFiles.length})
                </h3>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#047857", background: "#ecfdf5", padding: "2px 8px", borderRadius: 10 }}>
                  ✓ Deliverables
                </span>
              </div>

              <div style={{ display: "grid", gap: 8, marginTop: "0.5rem" }}>
                {expertFiles.map((file, idx) => (
                  <div
                    key={file.id || idx}
                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>📄 {file.file_name || "Deliverable File"}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                        Uploaded by Expert • {file.created_at ? new Date(file.created_at).toLocaleDateString() : "Recent"}
                      </div>
                    </div>

                    {file.file_url && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          type="button"
                          disabled={loadingAction[`view_exp_${file.id || idx}`]}
                          onClick={() => handleViewFile(file.file_url, file.file_name || "Deliverable File", `view_exp_${file.id || idx}`, file.id || "delivery")}
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: 12,
                            color: "#6b46c1",
                            fontWeight: 700,
                            cursor: loadingAction[`view_exp_${file.id || idx}`] ? "not-allowed" : "pointer",
                            padding: "4px 8px"
                          }}
                        >
                          {loadingAction[`view_exp_${file.id || idx}`] ? "Opening..." : "View"}
                        </button>
                        <button
                          type="button"
                          disabled={loadingAction[`dl_exp_${file.id || idx}`]}
                          onClick={() => handleDownloadFile(file.file_url, file.file_name || "deliverable", `dl_exp_${file.id || idx}`, file.id || "delivery")}
                          style={{
                            padding: "6px 12px",
                            background: "#6b46c1",
                            color: "#fff",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 700,
                            border: 0,
                            cursor: loadingAction[`dl_exp_${file.id || idx}`] ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            opacity: loadingAction[`dl_exp_${file.id || idx}`] ? 0.7 : 1
                          }}
                        >
                          <FiDownload size={13} /> {loadingAction[`dl_exp_${file.id || idx}`] ? "Downloading..." : "Download"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMITTED CLIENT DOCUMENTS CARD */}
          <div className="canvas-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 6 }}>
                <FiFileText color="#6b46c1" /> Your Submitted Documents ({userDocs.length})
              </h3>
              {!isCompleted && !isCancelled && (
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  style={{ background: "#faf5ff", color: "#6b46c1", border: "1px solid #d8b4fe", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                >
                  <FiUploadCloud size={13} /> Upload Document
                </button>
              )}
            </div>

            {userDocs.length === 0 ? (
              <div style={{ padding: "1.25rem", textAlign: "center", color: "#64748b", fontSize: 13, background: "#f8fafc", borderRadius: 10 }}>
                No custom client documents uploaded yet.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8, marginTop: "0.5rem" }}>
                {userDocs.map((doc, idx) => {
                  const docStatus = String(doc.status || "APPROVED").toUpperCase();
                  const isRejected = docStatus === "REJECTED";

                  return (
                    <div
                      key={doc.id || idx}
                      style={{
                        background: isRejected ? "#fef2f2" : "#f8fafc",
                        border: isRejected ? "1px solid #fecaca" : "1px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "10px 12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 8
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isRejected ? "#b91c1c" : "#0f172a" }}>
                          📄 {doc.file_name || doc.label || "Document"}
                        </div>
                        {isRejected && doc.rejection_reason && (
                          <div style={{ fontSize: 11, color: "#dc2626", marginTop: 2, fontWeight: 600 }}>
                            Reason: {doc.rejection_reason}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: 8,
                          background: isRejected ? "#fee2e2" : "#dcfce7",
                          color: isRejected ? "#b91c1c" : "#15803d"
                        }}>
                          {isRejected ? "REJECTED" : "ACCEPTED"}
                        </span>
                        {doc.file_url && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button
                              type="button"
                              disabled={loadingAction[`view_user_${doc.id || idx}`]}
                              onClick={() => handleViewFile(doc.file_url, doc.file_name || doc.label || "Document", `view_user_${doc.id || idx}`, doc.id)}
                              style={{
                                background: "none",
                                border: "none",
                                fontSize: 12,
                                color: "#6b46c1",
                                fontWeight: 700,
                                cursor: loadingAction[`view_user_${doc.id || idx}`] ? "not-allowed" : "pointer",
                                padding: "4px 8px"
                              }}
                            >
                              {loadingAction[`view_user_${doc.id || idx}`] ? "Opening..." : "View"}
                            </button>
                            <button
                              type="button"
                              disabled={loadingAction[`dl_user_${doc.id || idx}`]}
                              onClick={() => handleDownloadFile(doc.file_url, doc.file_name || doc.label || "document", `dl_user_${doc.id || idx}`, doc.id)}
                              style={{
                                padding: "4px 10px",
                                background: "#faf5ff",
                                color: "#6b46c1",
                                border: "1px solid #d8b4fe",
                                borderRadius: 6,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: loadingAction[`dl_user_${doc.id || idx}`] ? "not-allowed" : "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                opacity: loadingAction[`dl_user_${doc.id || idx}`] ? 0.7 : 1
                              }}
                            >
                              <FiDownload size={12} /> {loadingAction[`dl_user_${doc.id || idx}`] ? "Downloading..." : "Download"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FINAL SERVICE DELIVERY CONTAINER */}
          {currentStepKey === "DELIVERED" && !isCompleted && (
            <div id="canvas-delivery-section" className="canvas-card" style={{ background: "#faf5ff", border: "1.5px solid #d8b4fe" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e9d5ff", paddingBottom: "0.75rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#553c9a" }}>
                  🎁 Service Delivered — Ready for Your Review
                </h3>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#b45309", background: "#fffbeb", padding: "2px 8px", borderRadius: 10 }}>
                  Review Required
                </span>
              </div>

              <p style={{ margin: "0.5rem 0", fontSize: "0.88rem", color: "#553c9a", lineHeight: 1.45 }}>
                Your expert has uploaded the final service deliverables. Please inspect the files and accept delivery to complete your order.
              </p>

              <div style={{ display: "flex", gap: 10, marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={handleAcceptDelivery}
                  disabled={acceptingDelivery}
                  style={{ background: "#10b981", color: "#fff", border: 0, padding: "10px 20px", borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: "pointer" }}
                >
                  {acceptingDelivery ? "Processing Acceptance..." : "✓ Accept Delivery & Complete Order"}
                </button>
              </div>
            </div>
          )}

          {/* CLIENT REQUIREMENT ANSWERS GRID */}
          {workspace.form_responses && Object.keys(workspace.form_responses).length > 0 && (
            <div className="canvas-card">
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                📝 Requirement Form Responses
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: "0.5rem" }}>
                {Object.entries(workspace.form_responses).map(([k, v]) => (
                  <div key={k} style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>{k.replace(/_/g, " ")}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginTop: 2, wordBreak: "break-word" }}>
                      {String(v || "N/A")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
           SIDEBAR CANVAS COLUMN (RIGHT)
           ========================================================================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          
          {/* ASSIGNED EXPERT CARD */}
          <div className="canvas-card">
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              Assigned Expert
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "0.25rem" }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#6b46c1",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.1rem",
                flexShrink: 0
              }}>
                {(expertInfo.expert_name || workspace.expert_name || "E").slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: "0.98rem", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {expertInfo.expert_name || workspace.expert_name || "Assigned Expert"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {expertInfo.position || "Verified Platform Expert"}
                </div>
              </div>
            </div>

            {/* CALL + CHAT AVAILABILITY RULE: ONLY VISIBLE WHILE ORDER IS ACTIVE! */}
            {canContactExpert && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => handleTimelineAction("chat")}
                  style={{ background: "#6b46c1", color: "#fff", border: 0, padding: "8px", borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                >
                  <FiMessageSquare size={13} /> Chat
                </button>
                <button
                  type="button"
                  onClick={() => handleTimelineAction("call")}
                  style={{ background: "#ffffff", color: "#334155", border: "1px solid #cbd5e1", padding: "8px", borderRadius: 8, fontWeight: 800, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                >
                  <FiPhone size={13} /> Call
                </button>
              </div>
            )}
          </div>

          {/* PAYMENT & ORDER SUMMARY CARD */}
          <div className="canvas-card">
            <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
              Order & Payment Summary
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, marginTop: "0.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                <span>Booking ID:</span>
                <strong style={{ color: "#0f172a" }}>#{workspace.booking_id || workspace.id}</strong>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                <span>Service Fee:</span>
                <strong style={{ color: "#0f172a" }}>{formatCurrency(effectiveBaseAmount)}</strong>
              </div>

              {gstAmount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                  <span>GST ({financial?.gst_rate_percent || 18}%):</span>
                  <strong style={{ color: "#0f172a" }}>{formatCurrency(gstAmount)}</strong>
                </div>
              )}

              <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 900, color: "#0f172a" }}>
                <span>Total Paid:</span>
                <span style={{ color: "#10b981" }}>{formatCurrency(totalAmount)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", paddingTop: 4 }}>
                <span>Payment Status:</span>
                <span style={{ color: "#047857", fontWeight: 800, background: "#ecfdf5", padding: "2px 6px", borderRadius: 6, fontSize: 11 }}>
                  ✓ PAID (ESCROW)
                </span>
              </div>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 8, padding: 8, fontSize: 11, color: "#64748b", lineHeight: 1.4, marginTop: "0.5rem" }}>
              🔒 Escrow Protection: Payment is safely held by G9Expert until final delivery approval.
            </div>
          </div>

        </div>
      </div>

      {/* DOCUMENT UPLOAD MODAL */}
      {showUploadModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, maxWidth: 460, width: "100%", padding: "1.5rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>Upload Document</h3>
              <button type="button" onClick={() => setShowUploadModal(false)} style={{ background: "none", border: 0, cursor: "pointer", color: "#64748b" }}>
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadDocumentSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 4 }}>Select File *</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setDocFile(e.target.files[0])}
                  style={{ width: "100%", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: "8px 14px", background: "#f1f5f9", border: 0, borderRadius: 8, fontWeight: 700, color: "#334155", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" disabled={uploadingDoc} style={{ padding: "8px 16px", background: "#6b46c1", color: "#fff", border: 0, borderRadius: 8, fontWeight: 800, cursor: "pointer" }}>
                  {uploadingDoc ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANVAS FILE PREVIEW LIGHTBOX MODAL */}
      {previewModal.isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={handleClosePreviewModal}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              width: "100%",
              maxWidth: 820,
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid #e2e8f0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#f8fafc",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                📄 {previewModal.fileName}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  type="button"
                  disabled={loadingAction["modal_dl"]}
                  onClick={() => handleDownloadFile(previewModal.fileUrl, previewModal.fileName, "modal_dl", previewModal.docId)}
                  style={{
                    padding: "6px 14px",
                    background: "#6b46c1",
                    color: "#ffffff",
                    border: 0,
                    borderRadius: 8,
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: loadingAction["modal_dl"] ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <FiDownload size={13} /> {loadingAction["modal_dl"] ? "Downloading..." : "Download"}
                </button>
                <button
                  type="button"
                  onClick={handleClosePreviewModal}
                  style={{ background: "none", border: 0, cursor: "pointer", color: "#64748b", padding: 4 }}
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div style={{ padding: 16, overflowY: "auto", flex: 1, display: "flex", justifyContent: "center", alignItems: "center", background: "#0f172a", minHeight: 350 }}>
              {(() => {
                const ext = (previewModal.fileName || previewModal.fileUrl || "").split(".").pop().toLowerCase();
                if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
                  return (
                    <img
                      src={previewModal.blobUrl}
                      alt={previewModal.fileName}
                      style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 8 }}
                    />
                  );
                }
                if (ext === "pdf") {
                  return (
                    <iframe
                      src={previewModal.blobUrl}
                      title={previewModal.fileName}
                      style={{ width: "100%", height: "65vh", border: 0, borderRadius: 8, background: "#ffffff" }}
                    />
                  );
                }
                return (
                  <div style={{ textAlign: "center", padding: "2.5rem 1.5rem", color: "#94a3b8" }}>
                    <p style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 16, color: "#f8fafc" }}>
                      Preview is not available for this file type.
                    </p>
                    <button
                      type="button"
                      disabled={loadingAction["modal_dl"]}
                      onClick={() => handleDownloadFile(previewModal.fileUrl, previewModal.fileName, "modal_dl", previewModal.docId)}
                      style={{
                        padding: "8px 18px",
                        background: "#6b46c1",
                        color: "#ffffff",
                        border: 0,
                        borderRadius: 8,
                        fontWeight: 800,
                        fontSize: 13,
                        cursor: loadingAction["modal_dl"] ? "not-allowed" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6
                      }}
                    >
                      <FiDownload size={14} /> {loadingAction["modal_dl"] ? "Downloading..." : "Download File"}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}