import React, { useState, useEffect } from 'react';
import { getAcceptanceDetailsApi } from '../../../../../shared/api/admin/legal.api.js';

const AcceptanceDetailsModal = ({ isOpen, onClose, acceptanceId }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && acceptanceId) {
            loadDetails();
        }
    }, [isOpen, acceptanceId]);

    const loadDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getAcceptanceDetailsApi(acceptanceId);
            if (response.success) {
                setData(response.data);
            } else {
                setError('Failed to load acceptance details');
            }
        } catch (err) {
            setError(err.message || 'Failed to load acceptance details');
            console.error('Load details error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h3 style={styles.title}>📋 Acceptance Details</h3>
                    <button style={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                {isLoading ? (
                    <div style={styles.loading}>Loading...</div>
                ) : error ? (
                    <div style={styles.error}>
                        <p>{error}</p>
                        <button onClick={loadDetails} style={styles.retryBtn}>Retry</button>
                    </div>
                ) : data ? (
                    <div style={styles.content}>
                        {/* Document Info */}
                        <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>📄 Document</h4>
                            <div style={styles.infoGrid}>
                                <div><strong>Title:</strong> {data.document?.title || 'N/A'}</div>
                                <div><strong>Slug:</strong> {data.document?.slug || 'N/A'}</div>
                                <div><strong>Type:</strong> {data.document?.type || 'N/A'}</div>
                                <div><strong>Status:</strong> {data.document?.status || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Version Info */}
                        <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>📌 Version</h4>
                            <div style={styles.infoGrid}>
                                <div><strong>Version:</strong> v{data.version?.number || 'N/A'}</div>
                                <div><strong>Label:</strong> {data.version?.label || 'N/A'}</div>
                                <div><strong>Published:</strong> {data.version?.published_at ? new Date(data.version.published_at).toLocaleString() : 'N/A'}</div>
                                <div><strong>Hash:</strong> <code style={styles.hash}>{data.version?.content_hash?.substring(0, 16)}...</code></div>
                            </div>
                        </div>

                        {/* Acceptance Info */}
                        <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>✅ Acceptance</h4>
                            <div style={styles.infoGrid}>
                                <div><strong>Role:</strong> 
                                    <span style={{
                                        ...styles.roleBadge,
                                        backgroundColor: data.role === 'USER' ? '#dbeafe' : '#fce7f3',
                                        color: data.role === 'USER' ? '#1d4ed8' : '#9d174d'
                                    }}>{data.role}</span>
                                </div>
                                <div><strong>User/Expert:</strong> {data.user_id ? `User #${data.user_id}` : data.expert_id ? `Expert #${data.expert_id}` : 'N/A'}</div>
                                <div><strong>Accepted:</strong> {data.accepted ? '✅ Yes' : '❌ No'}</div>
                                <div><strong>Accepted At:</strong> {data.accepted_at ? new Date(data.accepted_at).toLocaleString() : 'N/A'}</div>
                            </div>
                        </div>

                        {/* Signature Info */}
                        {data.signature && (
                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>✍️ Signature</h4>
                                <div style={styles.infoGrid}>
                                    <div><strong>Name:</strong> {data.signature.name || 'N/A'}</div>
                                    <div><strong>Type:</strong> {data.signature.type || 'N/A'}</div>
                                    <div><strong>Path:</strong> {data.signature.path || 'N/A'}</div>
                                </div>
                            </div>
                        )}

                        {/* Device Info */}
                        {data.device_info && (
                            <div style={styles.section}>
                                <h4 style={styles.sectionTitle}>📱 Device Info</h4>
                                <div style={styles.infoGrid}>
                                    <div><strong>IP:</strong> {data.device_info.ip || 'N/A'}</div>
                                    <div><strong>Browser:</strong> {data.device_info.browser || 'N/A'}</div>
                                    <div><strong>Device:</strong> {data.device_info.device || 'N/A'}</div>
                                    <div><strong>Platform:</strong> {data.device_info.platform || 'N/A'}</div>
                                    <div><strong>User Agent:</strong> <code style={styles.userAgent}>{data.device_info.user_agent || 'N/A'}</code></div>
                                </div>
                            </div>
                        )}

                        {/* Content Hash */}
                        <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>🔐 Content Hash</h4>
                            <code style={styles.fullHash}>{data.content_hash || 'N/A'}</code>
                        </div>

                        {/* Timestamps */}
                        <div style={styles.section}>
                            <h4 style={styles.sectionTitle}>⏱️ Timestamps</h4>
                            <div style={styles.infoGrid}>
                                <div><strong>Created:</strong> {data.created_at ? new Date(data.created_at).toLocaleString() : 'N/A'}</div>
                                <div><strong>Updated:</strong> {data.updated_at ? new Date(data.updated_at).toLocaleString() : 'N/A'}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={styles.actions}>
                            <button style={styles.closeBtn} onClick={onClose}>Close</button>
                            <button style={styles.printBtn} onClick={() => window.print()}>🖨️ Print</button>
                        </div>
                    </div>
                ) : (
                    <div style={styles.empty}>No data available</div>
                )}
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
        maxWidth: '700px',
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
        marginBottom: '20px'
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
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    section: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px'
    },
    sectionTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a2332',
        margin: '0 0 12px 0'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px 16px',
        fontSize: '14px',
        color: '#4b5563'
    },
    roleBadge: {
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '500',
        marginLeft: '8px'
    },
    hash: {
        fontSize: '12px',
        backgroundColor: '#f3f4f6',
        padding: '2px 6px',
        borderRadius: '4px'
    },
    fullHash: {
        fontSize: '12px',
        backgroundColor: '#f3f4f6',
        padding: '8px',
        borderRadius: '4px',
        display: 'block',
        wordBreak: 'break-all'
    },
    userAgent: {
        fontSize: '11px',
        backgroundColor: '#f3f4f6',
        padding: '4px 8px',
        borderRadius: '4px',
        display: 'block',
        wordBreak: 'break-all'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px'
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
    },
    printBtn: {
        padding: '8px 24px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    },
    loading: {
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280'
    },
    error: {
        padding: '40px',
        textAlign: 'center',
        color: '#ef4444'
    },
    empty: {
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280'
    },
    retryBtn: {
        marginTop: '12px',
        padding: '8px 20px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer'
    }
};

export default AcceptanceDetailsModal;