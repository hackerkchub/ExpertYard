import React from 'react';

const VersionCompareModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { document, version1, version2, diff } = data;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Compare Versions</h2>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div style={styles.documentInfo}>
          <span style={styles.docTitle}>{document?.title}</span>
          <span style={styles.docSlug}>{document?.slug}</span>
        </div>

        <div style={styles.compareContainer}>
          <div style={styles.versionColumn}>
            <div style={styles.versionHeader}>
              <span style={styles.versionLabel}>v{version1?.version_number}</span>
              <span style={styles.versionStatus}>{version1?.status}</span>
            </div>
            <div style={styles.versionMeta}>
              {version1?.published_at && (
                <span>Published: {new Date(version1.published_at).toLocaleString()}</span>
              )}
              <span>Acceptance: {version1?.require_acceptance ? '✅ Required' : '❌ Not Required'}</span>
              <span>Signature: {version1?.require_signature ? '✅ Required' : '❌ Not Required'}</span>
            </div>
            <div style={styles.versionContent}>
              <div 
                dangerouslySetInnerHTML={{ __html: version1?.content || 'No content' }}
                style={styles.contentPreview}
              />
            </div>
          </div>

          <div style={styles.divider}>
            <span style={styles.dividerText}>⟷</span>
          </div>

          <div style={styles.versionColumn}>
            <div style={styles.versionHeader}>
              <span style={styles.versionLabel}>v{version2?.version_number}</span>
              <span style={styles.versionStatus}>{version2?.status}</span>
            </div>
            <div style={styles.versionMeta}>
              {version2?.published_at && (
                <span>Published: {new Date(version2.published_at).toLocaleString()}</span>
              )}
              <span>Acceptance: {version2?.require_acceptance ? '✅ Required' : '❌ Not Required'}</span>
              <span>Signature: {version2?.require_signature ? '✅ Required' : '❌ Not Required'}</span>
            </div>
            <div style={styles.versionContent}>
              <div 
                dangerouslySetInnerHTML={{ __html: version2?.content || 'No content' }}
                style={styles.contentPreview}
              />
            </div>
          </div>
        </div>

        <div style={styles.diffSummary}>
          <h4 style={styles.diffTitle}>Changes Summary</h4>
          <div style={styles.diffList}>
            <div style={styles.diffItem}>
              <span style={styles.diffLabel}>Content:</span>
              <span style={diff.content_changed ? styles.diffChanged : styles.diffUnchanged}>
                {diff.content_changed ? '✅ Changed' : '❌ No Change'}
              </span>
            </div>
            <div style={styles.diffItem}>
              <span style={styles.diffLabel}>Acceptance Required:</span>
              <span style={diff.acceptance_changed ? styles.diffChanged : styles.diffUnchanged}>
                {diff.acceptance_changed ? '✅ Changed' : '❌ No Change'}
              </span>
            </div>
            <div style={styles.diffItem}>
              <span style={styles.diffLabel}>Signature Required:</span>
              <span style={diff.signature_changed ? styles.diffChanged : styles.diffUnchanged}>
                {diff.signature_changed ? '✅ Changed' : '❌ No Change'}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.closeBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px'
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxWidth: '1200px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    padding: '24px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a2332',
    margin: 0
  },
  closeButton: {
    padding: '4px 8px',
    border: 'none',
    background: 'none',
    fontSize: '20px',
    color: '#6b7280',
    cursor: 'pointer'
  },
  documentInfo: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  docTitle: {
    fontWeight: '600',
    color: '#1a2332'
  },
  docSlug: {
    color: '#6b7280'
  },
  compareContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    gap: '16px',
    marginBottom: '20px'
  },
  versionColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  versionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingBottom: '8px',
    borderBottom: '2px solid #e5e7eb'
  },
  versionLabel: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a2332'
  },
  versionStatus: {
    padding: '2px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    backgroundColor: '#f3f4f6',
    color: '#4b5563'
  },
  versionMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px',
    color: '#6b7280'
  },
  versionContent: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px',
    maxHeight: '300px',
    overflow: 'auto',
    backgroundColor: '#fafafa'
  },
  contentPreview: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#1a2332'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 8px'
  },
  dividerText: {
    fontSize: '24px',
    color: '#d1d5db'
  },
  diffSummary: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '16px'
  },
  diffTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a2332',
    margin: '0 0 12px 0'
  },
  diffList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  diffItem: {
    display: 'flex',
    gap: '8px',
    fontSize: '14px'
  },
  diffLabel: {
    fontWeight: '500',
    color: '#374151',
    width: '140px'
  },
  diffChanged: {
    color: '#10b981',
    fontWeight: '500'
  },
  diffUnchanged: {
    color: '#6b7280'
  },
  footer: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '16px',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  closeBtn: {
    padding: '8px 24px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a2332',
    cursor: 'pointer'
  }
};

export default VersionCompareModal;