import React, { useState, useEffect } from 'react';
import { getPendingUsersByDocumentApi } from '../../../../../shared/api/admin/legal.api.js';

const PendingUsers = ({ isOpen, onClose, documentId }) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, limit: 20 });

    useEffect(() => {
        if (isOpen && documentId) {
            loadData();
        }
    }, [isOpen, documentId, pagination.page]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getPendingUsersByDocumentApi(documentId, {
                page: pagination.page,
                limit: pagination.limit
            });
            if (response.success) {
                setData(response.data);
            } else {
                setError('Failed to load pending users');
            }
        } catch (err) {
            setError(err.message || 'Failed to load pending users');
            console.error('Load pending users error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h3 style={styles.title}>⏳ Pending Users</h3>
                    <button style={styles.closeButton} onClick={onClose}>✕</button>
                </div>

                {isLoading ? (
                    <div style={styles.loading}>Loading...</div>
                ) : error ? (
                    <div style={styles.error}>
                        <p>{error}</p>
                        <button onClick={loadData} style={styles.retryBtn}>Retry</button>
                    </div>
                ) : data ? (
                    <div style={styles.content}>
                        <div style={styles.summary}>
                            <span>Users: {data.total_users || 0}</span>
                            <span>Experts: {data.total_experts || 0}</span>
                            <span>Total: {(data.total_users || 0) + (data.total_experts || 0)}</span>
                        </div>

                        {/* Users Table */}
                        {data.users && data.users.length > 0 && (
                            <div style={styles.tableSection}>
                                <h4 style={styles.tableTitle}>👤 Users</h4>
                                <div style={styles.tableWrapper}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.users.map(user => (
                                                <tr key={user.user_id}>
                                                    <td>{user.full_name || 'N/A'}</td>
                                                    <td>{user.email || 'N/A'}</td>
                                                    <td>{user.phone || 'N/A'}</td>
                                                    <td>{user.user_since ? new Date(user.user_since).toLocaleDateString() : 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Experts Table */}
                        {data.experts && data.experts.length > 0 && (
                            <div style={styles.tableSection}>
                                <h4 style={styles.tableTitle}>👨‍💼 Experts</h4>
                                <div style={styles.tableWrapper}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.experts.map(expert => (
                                                <tr key={expert.expert_id}>
                                                    <td>{expert.full_name || 'N/A'}</td>
                                                    <td>{expert.email || 'N/A'}</td>
                                                    <td>{expert.phone || 'N/A'}</td>
                                                    <td>{expert.expert_since ? new Date(expert.expert_since).toLocaleDateString() : 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {(!data.users || data.users.length === 0) && (!data.experts || data.experts.length === 0) && (
                            <div style={styles.empty}>All users have accepted this document ✅</div>
                        )}

                        {/* Pagination */}
                        {data.pagination && data.pagination.totalPages > 1 && (
                            <div style={styles.pagination}>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    style={styles.pageBtn}
                                >
                                    ◀ Previous
                                </button>
                                <span style={styles.pageInfo}>
                                    Page {pagination.page} of {data.pagination.totalPages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === data.pagination.totalPages}
                                    style={styles.pageBtn}
                                >
                                    Next ▶
                                </button>
                            </div>
                        )}

                        <div style={styles.actions}>
                            <button style={styles.closeBtn} onClick={onClose}>Close</button>
                            <button style={styles.refreshBtn} onClick={loadData}>🔄 Refresh</button>
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
        gap: '16px'
    },
    summary: {
        display: 'flex',
        gap: '20px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500'
    },
    tableSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    tableTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a2332',
        margin: 0
    },
    tableWrapper: {
        overflow: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '8px'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 0'
    },
    pageBtn: {
        padding: '8px 16px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '13px'
    },
    pageInfo: {
        fontSize: '14px',
        color: '#6b7280'
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
    refreshBtn: {
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

export default PendingUsers;