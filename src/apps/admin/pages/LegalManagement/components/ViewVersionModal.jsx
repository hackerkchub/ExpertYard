import React from 'react';

const ViewVersionModal = ({ isOpen, onClose, version }) => {
    if (!isOpen || !version) return null;

    const getStatusColor = (status) => {
        switch(status) {
            case 'PUBLISHED': return '#10b981';
            case 'DRAFT': return '#f59e0b';
            case 'ARCHIVED': return '#6b7280';
            default: return '#6b7280';
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>View Version</h2>
                    <button style={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                <div style={styles.versionInfo}>
                    <div style={styles.versionHeader}>
                        <span style={styles.versionNumber}>v{version.version}</span>
                        <span style={{
                            ...styles.versionStatus,
                            backgroundColor: getStatusColor(version.status),
                            color: '#fff'
                        }}>
                            {version.status}
                        </span>
                        {version.published_at && (
                            <span style={styles.versionDate}>
                                Published: {new Date(version.published_at).toLocaleString()}
                            </span>
                        )}
                    </div>
                    {version.change_log && (
                        <div style={styles.changeLog}>📝 {version.change_log}</div>
                    )}
                    <div style={styles.versionMeta}>
                        <span>ID: {version.id}</span>
                        <span>Created: {new Date(version.created_at).toLocaleString()}</span>
                    </div>
                </div>

                <div style={styles.contentArea}>
                    <h4 style={styles.contentTitle}>Content Preview</h4>
                    <div style={styles.contentPreview}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: version.content || '<p style="color:#9ca3af;">No content available</p>'
                            }}
                        />
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
        zIndex: 10000,
        padding: '20px'
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '12px',
        maxWidth: '800px',
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
    versionInfo: {
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '16px'
    },
    versionHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        marginBottom: '8px'
    },
    versionNumber: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a2332'
    },
    versionStatus: {
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500'
    },
    versionDate: {
        fontSize: '13px',
        color: '#6b7280'
    },
    changeLog: {
        fontSize: '14px',
        color: '#6b7280',
        fontStyle: 'italic'
    },
    versionMeta: {
        marginTop: '8px',
        display: 'flex',
        gap: '16px',
        fontSize: '12px',
        color: '#9ca3af'
    },
    contentArea: {
        marginBottom: '16px'
    },
    contentTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#374151',
        margin: '0 0 8px 0'
    },
    contentPreview: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        maxHeight: '400px',
        overflow: 'auto',
        backgroundColor: '#fafafa',
        fontSize: '14px',
        lineHeight: '1.6'
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

export default ViewVersionModal;