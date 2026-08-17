import React from "react";
import { FiFileText, FiCheckCircle, FiCircle, FiCheck } from "react-icons/fi";

export default function RequiredDocuments({ documentSpecs }) {
  const validSpecs = (Array.isArray(documentSpecs) ? documentSpecs : []).filter((doc) => {
    if (!doc || typeof doc !== "object") return false;
    const name = (doc.label || doc.name || doc.doc_name || doc.title || doc.doc_type_key || "").trim();
    return name.length > 0;
  });

  const hasSpecs = validSpecs.length > 0;

  return (
    <div className="msp-section-card msp-docs-card">
      <h3 className="msp-section-title">
        <FiFileText className="msp-section-title-icon msp-icon-blue" />
        Required Documents Checklist
      </h3>

      {hasSpecs ? (
        <div className="msp-docs-grid">
          {validSpecs.map((doc, idx) => {
            const isMandatory =
              doc.is_mandatory === 1 ||
              doc.is_mandatory === true ||
              String(doc.is_mandatory) === "1" ||
              String(doc.is_mandatory).toLowerCase() === "true";
            const docName = doc.label || doc.name || doc.doc_name || doc.title || doc.doc_type_key;

            return (
              <div key={doc.id || doc.doc_type_key || idx} className="msp-doc-item">
                <div className="msp-doc-icon-status">
                  {isMandatory ? (
                    <FiCheckCircle className="msp-doc-check-icon msp-check-mandatory" />
                  ) : (
                    <FiCircle className="msp-doc-check-icon msp-check-optional" />
                  )}
                </div>
                <div className="msp-doc-info">
                  <div className="msp-doc-name">{docName}</div>
                  <div className="msp-doc-badge-wrapper">
                    {isMandatory ? (
                      <span className="msp-doc-badge msp-badge-req">Required</span>
                    ) : (
                      <span className="msp-doc-badge msp-badge-opt">Optional</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="msp-docs-empty-state" style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#065f46'
        }}>
          <FiCheck className="msp-doc-check-icon" style={{ fontSize: '1.5rem', color: '#059669', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#064e3b' }}>
              No documents required
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857', marginTop: '2px' }}>
              No document upload is needed for this service.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
