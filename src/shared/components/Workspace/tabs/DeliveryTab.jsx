import React, { useState } from "react";
import { getAuthToken } from "../BookingWorkspaceShell";

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
      const token = getAuthToken();

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadRes = await fetch("/api/workspace/upload-file", {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : ""
          },
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.data?.file_url) {
          finalUrl = uploadData.data.file_url;
        } else {
          return alert(uploadData.message || "Deliverable file upload failed.");
        }
      }

      const res = await fetch(`/api/workspace/${bookingId}/delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({ notes, file_url: finalUrl })
      });
      const data = await res.json();
      if (data.success && onRefresh) {
        onRefresh();
      } else {
        alert(data.message || "Failed to submit deliverables.");
      }
    } catch (err) {
      alert("Error submitting deliverables.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptDelivery = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`/api/workspace/${bookingId}/delivery/accept`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : ""
        }
      });
      const data = await res.json();
      if (data.success && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      alert("Error accepting delivery.");
    }
  };

  const isDelivered = workspace?.current_step_key === "DELIVERED" || workspace?.current_step_key === "COMPLETED";

  // Filter final deliverable documents from workspace documents
  const deliverableDocs = documents.filter(
    (d) => d.doc_type_key === "FINAL_DELIVERABLE" || d.doc_type_key === "DELIVERY"
  );

  const formatUrl = (url = "") => {
    if (!url) return "#";
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const apiBase = import.meta.env?.VITE_API_BASE_URL || "http://localhost:5000";
    const backendOrigin = apiBase.replace(/\/api\/?$/, "");
    return url.startsWith("/") ? `${backendOrigin}${url}` : `${backendOrigin}/${url}`;
  };

  const isImage = (url = "") => {
    if (!url) return false;
    const clean = url.split("?")[0].toLowerCase();
    return (
      clean.match(/\.(jpeg|jpg|png|gif|webp|svg|bmp|ico)$/) ||
      clean.includes("/uploads/workspace/") ||
      clean.includes("/uploads/") ||
      url.startsWith("data:image/") ||
      url.startsWith("blob:")
    );
  };

  return (
    <div className="tab-delivery">
      <h3 className="tab-panel-title">Final Work Delivery Portal</h3>

      {/* Expert / Admin Submission Form */}
      {(currentUserRole === "expert" || currentUserRole === "admin") && workspace?.current_step_key !== "COMPLETED" && (
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

      {/* Delivery Viewer & Acceptance */}
      {isDelivered ? (
        <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#065f46', fontSize: '1.1rem' }}>
            🎁 Work Deliverables Ready for Review!
          </h4>
          <p style={{ margin: '0.25rem 0 1rem 0', color: '#047857', fontSize: '0.95rem' }}>
            <strong>Expert Notes:</strong> "{workspace.delivery_notes || "Final work deliverables submitted for your review."}"
          </p>

          {/* Deliverable Document Files */}
          {deliverableDocs.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Attached Deliverable Documents:</h5>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {deliverableDocs.map((doc) => {
                  const fullUrl = formatUrl(doc.file_url);

                  return (
                    <div key={doc.id} style={{ background: '#ffffff', border: '1px solid #a7f3d0', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#0f172a', display: 'block' }}>{doc.file_name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Deliverable File</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewDoc({ ...doc, fullUrl })}
                          style={{ padding: '0.35rem 0.75rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          👁️ View File
                        </button>
                        <a
                          href={fullUrl}
                          download={doc.file_name}
                          style={{ padding: '0.35rem 0.75rem', background: '#059669', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '0.8rem' }}
                        >
                          ⬇️ Download
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {(currentUserRole === "user" || currentUserRole === "admin") && workspace.current_step_key === "DELIVERED" && (
              <button onClick={handleAcceptDelivery} style={{ padding: '0.75rem 1.5rem', background: '#166534', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
                Accept Delivery & Complete Order ✅
              </button>
            )}
            {workspace.current_step_key === "COMPLETED" && (
              <span style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '6px', fontWeight: '800' }}>
                ✅ Order Completed & Closed
              </span>
            )}
          </div>
        </div>
      ) : (
        <p style={{ color: '#64748b' }}>Deliverables will appear here once submitted by the expert.</p>
      )}

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
              {isImage(previewDoc.fullUrl) ? (
                <img
                  src={previewDoc.fullUrl}
                  alt={previewDoc.file_name}
                  style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '6px' }}
                />
              ) : (
                <iframe
                  src={previewDoc.fullUrl}
                  title={previewDoc.file_name}
                  style={{ width: '100%', height: '60vh', border: 'none', borderRadius: '6px' }}
                />
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
              <a
                href={previewDoc.fullUrl}
                download={previewDoc.file_name}
                style={{ padding: '0.6rem 1.25rem', background: '#059669', color: '#ffffff', borderRadius: '6px', fontWeight: '700', textDecoration: 'none' }}
              >
                ⬇️ Download Document
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
