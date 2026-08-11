import React, { useState } from "react";
import APP_CONFIG from "../../../../config/appConfig";
import {
    uploadWorkspaceFile,
    uploadWorkspaceDocument,
    replaceWorkspaceDocument,
    verifyWorkspaceDocument,
} from "../../../api/workspace.api";

export default function DocumentsTab({ bookingId, documents = [], snapshot, permissions, onRefresh, currentUserRole }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrlInput, setFileUrlInput] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);
  const [replacingDocId, setReplacingDocId] = useState(null);
  const [replaceFile, setReplaceFile] = useState(null);

  const clientDocuments = (documents || []).filter((d) => {
    const role = String(d.uploaded_by_role || "").trim().toUpperCase();
    const docType = String(d.doc_type_key || "").trim().toUpperCase();
    return role !== "EXPERT" && role !== "ADMIN" && docType !== "FINAL_DELIVERABLE" && docType !== "DELIVERY" && !docType.includes("DELIVER");
  });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!fileName) {
        setFileName(file.name);
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!fileName) return alert("Please provide a document label.");

    let finalUrl = fileUrlInput;

    try {
      setUploading(true);

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await uploadWorkspaceFile(formData);
        if (uploadResponse.data.success && uploadResponse.data.data?.file_url) {
          finalUrl = uploadResponse.data.data.file_url;
        } else {
          return alert(uploadResponse.data.message || "File upload to server failed.");
        }
      }

      if (!finalUrl) return alert("Please select a file or provide a valid URL.");

      const roleClean = String(currentUserRole || "").trim().toLowerCase();
      const isExpertOrAdmin = roleClean === "expert" || roleClean === "admin";
      const response = await uploadWorkspaceDocument(bookingId, {
        doc_type_key: isExpertOrAdmin ? "FINAL_DELIVERABLE" : "CLIENT_DOCUMENT",
        file_name: fileName,
        file_url: finalUrl,
        file_size: selectedFile ? selectedFile.size : 1024
      });

      if (response.data.success) {
        setFileName("");
        setSelectedFile(null);
        setFileUrlInput("");
        if (onRefresh) onRefresh();
      } else {
        alert(response.data.message || "Upload failed.");
      }
    } catch (err) {
      alert("Error uploading document.");
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceSubmit = async (doc) => {
    if (!replaceFile) return alert("Please select a file to replace.");

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", replaceFile);

      const uploadResponse = await uploadWorkspaceFile(formData);
      if (!uploadResponse.data.success || !uploadResponse.data.data?.file_url) {
        return alert(uploadResponse.data.message || "File upload failed.");
      }

      const response = await replaceWorkspaceDocument(bookingId, doc.id, {
        file_name: replaceFile.name,
        file_url: uploadResponse.data.data.file_url,
        file_size: replaceFile.size
      });

      if (response.data.success) {
        setReplacingDocId(null);
        setReplaceFile(null);
        if (onRefresh) onRefresh();
      } else {
        alert(response.data.message || "Replacement failed.");
      }
    } catch (err) {
      alert("Error replacing document.");
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = async (docId, status, rejectionReason = "") => {
    try {
      const response = await verifyWorkspaceDocument(bookingId, docId, status, rejectionReason);

      if (response.data.success && onRefresh) {
        onRefresh();
      }
    } catch (err) {
      alert("Error updating document status.");
    }
  };

  const formatUrl = (url = "") => {
    if (!url) return "#";
    if (url.startsWith("blob:") || url.startsWith("data:")) {
      return url;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
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

  const isBlobOrExpired = (url = "") => {
    return url.startsWith("blob:");
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

  return (
    <div className="tab-documents">
      <h3 className="tab-panel-title">Required Documents & Verification</h3>

      {/* Upload Form */}
      {permissions?.allow_document_upload !== false && (
        <form onSubmit={handleUpload} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#1e293b' }}>Upload New Workspace Document</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem', color: '#475569' }}>
                Document Label / Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Identity Proof / PAN Card"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem', color: '#475569' }}>
                Choose File from Device
              </label>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx,.zip"
                onChange={handleFileChange}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'flex-end' }}>
            <button type="submit" disabled={uploading} style={{ padding: '0.6rem 1.25rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>
              {uploading ? "Uploading File..." : "📁 Upload Document"}
            </button>
          </div>
        </form>
      )}

      {/* Documents Table */}
      {clientDocuments.length === 0 ? (
        <p style={{ color: '#64748b' }}>No client documents uploaded yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '0.75rem 1rem' }}>File Name</th>
              <th className="col-uploaded-by" style={{ padding: '0.75rem 1rem' }}>Uploaded By</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clientDocuments.map((doc) => {
              const fullUrl = formatUrl(doc.file_url);
              const expired = isBlobOrExpired(doc.file_url);

              return (
                <tr key={doc.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>
                    {doc.file_name}
                    {expired && (
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#dc2626', fontWeight: '700' }}>
                        ⚠️ Temp session link expired (Re-upload below)
                      </span>
                    )}
                  </td>
                  <td className="col-uploaded-by" style={{ padding: '0.75rem 1rem' }}>{doc.uploaded_by_role}</td>
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
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {!expired ? (
                        <>
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
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setReplacingDocId(doc.id)}
                          style={{ background: '#d97706', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          📤 Re-upload File
                        </button>
                      )}

                      {(currentUserRole === 'expert' || currentUserRole === 'admin') && doc.status === 'SUBMITTED' && (
                        <>
                          <button onClick={() => handleVerify(doc.id, 'APPROVED')} style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.65rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => handleVerify(doc.id, 'REJECTED', 'Blurry / Unreadable')} style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.65rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}>Reject</button>
                        </>
                      )}
                    </div>

                    {/* Inline Re-upload Form */}
                    {replacingDocId === doc.id && (
                      <div style={{ marginTop: '0.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx,.zip"
                          onChange={(e) => setReplaceFile(e.target.files[0] || null)}
                          style={{ fontSize: '0.8rem', flex: 1 }}
                        />
                        <button
                          onClick={() => handleReplaceSubmit(doc)}
                          disabled={uploading || !replaceFile}
                          style={{ background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.35rem 0.75rem', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          {uploading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setReplacingDocId(null)}
                          style={{ background: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '4px', padding: '0.35rem 0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Uploaded by {previewDoc.uploaded_by_role}</span>
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