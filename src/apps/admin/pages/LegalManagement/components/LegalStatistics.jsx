import React, { useState, useEffect } from 'react';
import { getLegalStatisticsApi } from '../../../../../shared/api/admin/legal.api.js';

const LegalStatistics = ({ documentId }) => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStatistics();
    }, [documentId]);

    const loadStatistics = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getLegalStatisticsApi();
            if (response.success) {
                setStats(response.data);
            } else {
                setError('Failed to load statistics');
            }
        } catch (err) {
            setError(err.message || 'Failed to load statistics');
            console.error('Load statistics error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div style={styles.loading}>Loading statistics...</div>;
    }

    if (error) {
        return (
            <div style={styles.error}>
                <p>{error}</p>
                <button onClick={loadStatistics} style={styles.retryBtn}>Retry</button>
            </div>
        );
    }

    if (!stats) {
        return <div style={styles.empty}>No statistics available</div>;
    }

    const cards = [
        {
            label: 'Total Documents',
            value: stats.documents?.total || 0,
            icon: '📄',
            color: '#4f46e5'
        },
        {
            label: 'Published',
            value: stats.documents?.published || 0,
            icon: '📤',
            color: '#10b981'
        },
        {
            label: 'Total Acceptances',
            value: stats.acceptances?.total || 0,
            icon: '✅',
            color: '#8b5cf6'
        },
        {
            label: 'Today\'s Acceptances',
            value: stats.acceptances?.today || 0,
            icon: '📊',
            color: '#f59e0b'
        },
        {
            label: 'This Week',
            value: stats.acceptances?.this_week || 0,
            icon: '📈',
            color: '#3b82f6'
        },
        {
            label: 'Acceptance Rate',
            value: `${stats.acceptances?.rate || 0}%`,
            icon: '🎯',
            color: '#ef4444'
        },
        {
            label: 'Pending Users',
            value: stats.pending?.users || 0,
            icon: '👤',
            color: '#f97316'
        },
        {
            label: 'Pending Experts',
            value: stats.pending?.experts || 0,
            icon: '👨‍💼',
            color: '#8b5cf6'
        }
    ];

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>📊 Legal Statistics</h3>
                <button onClick={loadStatistics} style={styles.refreshBtn}>🔄 Refresh</button>
            </div>
            <div style={styles.grid}>
                {cards.map((card, index) => (
                    <div key={index} style={styles.card}>
                        <div style={styles.cardIcon}>{card.icon}</div>
                        <div style={styles.cardContent}>
                            <div style={styles.cardValue}>{card.value}</div>
                            <div style={styles.cardLabel}>{card.label}</div>
                        </div>
                        <div style={{...styles.cardBar, backgroundColor: card.color}} />
                    </div>
                ))}
            </div>
            {stats.users && stats.experts && (
                <div style={styles.details}>
                    <div style={styles.detailSection}>
                        <h4 style={styles.detailTitle}>👤 Users</h4>
                        <div style={styles.detailRow}>
                            <span>Total: {stats.users.total || 0}</span>
                            <span>Accepted: {stats.users.accepted || 0}</span>
                            <span>Pending: {stats.users.pending || 0}</span>
                        </div>
                    </div>
                    <div style={styles.detailSection}>
                        <h4 style={styles.detailTitle}>👨‍💼 Experts</h4>
                        <div style={styles.detailRow}>
                            <span>Total: {stats.experts.total || 0}</span>
                            <span>Accepted: {stats.experts.accepted || 0}</span>
                            <span>Pending: {stats.experts.pending || 0}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
    },
    title: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a2332',
        margin: 0
    },
    refreshBtn: {
        padding: '8px 16px',
        backgroundColor: '#f3f4f6',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        cursor: 'pointer'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px'
    },
    card: {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s'
    },
    cardIcon: {
        fontSize: '28px',
        marginBottom: '8px'
    },
    cardContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    cardValue: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a2332'
    },
    cardLabel: {
        fontSize: '13px',
        color: '#6b7280',
        marginTop: '4px'
    },
    cardBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '3px'
    },
    details: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginTop: '8px'
    },
    detailSection: {
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        padding: '16px'
    },
    detailTitle: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a2332',
        margin: '0 0 8px 0'
    },
    detailRow: {
        display: 'flex',
        gap: '16px',
        fontSize: '14px',
        color: '#4b5563'
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

export default LegalStatistics;