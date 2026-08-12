import React, { useState } from "react";
import APP_CONFIG from "../../../../config/appConfig";
import {
    uploadWorkspaceFile,
    submitWorkspaceDelivery,
    acceptWorkspaceDelivery,
} from "../../../api/workspace.api";

export default function DeliveryTab({ bookingId, workspace, snapshot, documents = [], permissions, onRefresh, currentUserRole }) {
  const [notes, setNotes] = useState("");
  const [fileUrlInput, setFileUrlInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    let finalUrl = fileUrlInput;

    try {
      setSubmitting(true);

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await uploadWorkspaceFile(formData);
        if (uploadResponse.data.success && uploadResponse.data.data?.file_url) {
          finalUrl = uploadResponse.data.data.file_url;
        } else {
          return alert(uploadResponse.data.message || "Deliverable file upload failed.");
        }
      }

      const response = await submitWorkspaceDelivery(bookingId, {
        notes,
        file_url: finalUrl,
        file_name: selectedFile ? selectedFile.name : undefined
      });

      if (response.data.success && onRefresh) {
        onRefresh();
      } else {
        alert(response.data.message || "Failed to submit deliverables.");
      }
    } catch (err) {
      alert("Error submitting deliverables.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptDelivery = async () => {
    try {
      const response = await acceptWorkspaceDelivery(bookingId);
      if (response.data.success && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      alert("Error accepting delivery.");
    }
  };

  const isDelivered = workspace?.current_step_key === "DELIVERED" || workspace?.current_step_key === "COMPLETED";

  // Filter final deliverable and expert-uploaded documents from workspace documents
  const deliverableDocs = (documents || []).filter((d) => {
    const role = String(d.uploaded_by_role || "").trim().toUpperCase();
    const docType = String(d.doc_type_key || "").trim().toUpperCase();
    return role === "EXPERT" || role === "ADMIN" || docType === "FINAL_DELIVERABLE" || docType === "DELIVERY" || docType.includes("DELIVER");
  });

  // Fallback for legacy workspace delivery file URL if present
  let allDeliverableDocs = [...deliverableDocs];
  const legacyUrl = workspace?.delivery_file_url || workspace?.file_url;
  if (legacyUrl && !allDeliverableDocs.some((d) => d.file_url === legacyUrl)) {
    allDeliverableDocs.unshift({
      id: "legacy_delivery",
      file_name: "Final_Deliverable_Work.pdf",
      file_url: legacyUrl,
      uploaded_by_role: "EXPERT",
      status: "APPROVED"
    });
  }

  const formatUrl = (url = "") => {
    if (!url) return "#";
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const apiBase = APP_CONFIG.API_BASE_URL;
    const backendOrigin = apiBase.replace(/\/api\/?$/, "");
    return url.startsWith("/") ? `${backendOrigin}${url}` : `${backendOrigin}/${url}`;
  };

  const handleDownloadFile = async (url, fileName) => {
    if (!url || url === "#") return alert("No valid download URL available.");
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.warn("Direct blob download failed, falling back to direct anchor:", err);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download";
      a.target = "_blank";
      a.rel = "noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const isImage = (url = "", fileName = "") => {
    if (!url && !fileName) return false;
    const combined = (url + " " + fileName).split("?")[0].toLowerCase();
    return combined.match(/\.(jpeg|jpg|png|gif|webp|svg|bmp|ico)$/) || url.startsWith("data:image/");
  };

  const isPdf = (url = "", fileName = "") => {
    if (!url && !fileName) return false;
    const combined = (url + " " + fileName).split("?")[0].toLowerCase();
    return combined.endsWith(".pdf") || combined.includes(".pdf?") || combined.includes("pdf");
  };

  const userRoleClean = String(currentUserRole || "").trim().toLowerCase();
  const isExpertOrAdminRole = userRoleClean === "expert" || userRoleClean === "admin";
  const isUserOrAdminRole = userRoleClean === "user" || userRoleClean === "admin";

  return (
    <div className="tab-delivery">
      <h3 className="tab-panel-title">Final Work Delivery Portal</h3>

      {/* Expert / Admin Submission Form */}
      {isExpertOrAdminRole && workspace?.current_step_key !== "COMPLETED" && (
        <form onSubmit={handleSubmitWork} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Submit Completed Work Deliverables</h4>
          <textarea
            placeholder="Delivery Notes & Client Instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '0.75rem', fontSize: '0.9rem' }}
            rows={3}
          />

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem', color: '#475569' }}>
              Upload Final Deliverable File (PDF / ZIP / Image)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
            />
          </div>

          <button type="submit" disabled={submitting} style={{ padding: '0.75rem 1.5rem', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            {submitting ? "Submitting Work..." : "🎁 Submit Deliverables to Client"}
          </button>
        </form>
      )}

      {/* Deliverable Document Files Table & Acceptance Section */}
      <div style={{ background: '#ffffff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>
            📁 Final Work Deliverables ({allDeliverableDocs.length})
          </h4>
          {isDelivered && (
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', background: '#dcfce7', color: '#166534' }}>
              Delivery Active
            </span>
          )}
        </div>

        {workspace?.delivery_notes && (
          <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '6px', borderLeft: '4px solid #2563eb', marginBottom: '1rem' }}>
            <strong style={{ color: '#334155', fontSize: '0.85rem', display: 'block' }}>Expert Delivery Notes:</strong>
            <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontSize: '0.9rem' }}>"{workspace.delivery_notes}"</p>
          </div>
        )}

        {allDeliverableDocs.length === 0 ? (
          <p style={{ color: '#64748b', margin: 0 }}>Deliverables will appear here once submitted by the expert.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.85rem' }}>File Name</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.85rem' }}>Uploaded By</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem', color: '#475569', fontSize: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allDeliverableDocs.map((doc) => {
                const fullUrl = formatUrl(doc.file_url);

                return (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#0f172a' }}>
                      {doc.file_name}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: '#e0f2fe', color: '#0369a1' }}>
                        {doc.uploaded_by_role || "EXPERT"}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        background: doc.status === 'APPROVED' ? '#dcfce7' : doc.status === 'REJECTED' ? '#fee2e2' : '#fef3c7',
                        color: doc.status === 'APPROVED' ? '#166534' : doc.status === 'REJECTED' ? '#991b1b' : '#92400e'
                      }}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ ...doc, fullUrl })}
                          style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          👁️ View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(fullUrl, doc.file_name)}
                          style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          ⬇️ Download
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.25rem' }}>
          {isUserOrAdminRole && workspace?.current_step_key === "DELIVERED" && (
            <button onClick={handleAcceptDelivery} style={{ padding: '0.75rem 1.5rem', background: '#166534', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
              Accept Delivery & Complete Order ✅
            </button>
          )}
          {workspace?.current_step_key === "COMPLETED" && (
            <span style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontWeight: '800' }}>
              ✅ Order Completed & Closed
            </span>
          )}
        </div>
      </div>

      {/* Lightbox / In-Page Document Modal Viewer */}
      {previewDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '12px', maxWidth: '850px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', pb: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0f172a' }}>{previewDoc.file_name}</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Final Work Deliverable</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: '800' }}
              >
                ✕
              </button>
            </div>

            {/* Document / Image Content Preview */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '1rem', marginBottom: '1.25rem' }}>
              {isImage(previewDoc.fullUrl, previewDoc.file_name) ? (
                <img
                  src={previewDoc.fullUrl}
                  alt={previewDoc.file_name}
                  style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '6px' }}
                />
              ) : isPdf(previewDoc.fullUrl, previewDoc.file_name) ? (
                <object
                  data={previewDoc.fullUrl}
                  type="application/pdf"
                  style={{ width: '100%', height: '60vh', border: 'none', borderRadius: '6px' }}
                >
                  <iframe
                    src={previewDoc.fullUrl}
                    title={previewDoc.file_name}
                    style={{ width: '100%', height: '60vh', border: 'none', borderRadius: '6px' }}
                  />
                </object>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '1rem' }}>
                    📄 Document File: <strong>{previewDoc.file_name}</strong>
                  </p>
                  <button
                    onClick={() => handleDownloadFile(previewDoc.fullUrl, previewDoc.file_name)}
                    style={{ padding: '0.65rem 1.25rem', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    ⬇️ Download File to View
                  </button>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <a
                href={previewDoc.fullUrl}
                target="_blank"
                rel="noreferrer"
                style={{ padding: '0.6rem 1.25rem', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: '700', textDecoration: 'none' }}
              >
                🔗 Open Direct Link
              </a>
              <button
                type="button"
                onClick={() => handleDownloadFile(previewDoc.fullUrl, previewDoc.file_name)}
                style={{ padding: '0.6rem 1.25rem', background: '#059669', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
              >
                ⬇️ Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}