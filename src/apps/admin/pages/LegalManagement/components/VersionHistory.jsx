import React, { useState } from 'react';

const VersionHistory = ({
    documentId,
    versions = [],
    onCompare,
    onViewVersion,
    onDeleteDraft,
    onPublish,
    onRefresh,
    isLoading,
}) => {
    const [selectedVersions, setSelectedVersions] = useState([]);

    const handleVersionSelect = (versionId) => {
        setSelectedVersions(prev => {
            if (prev.includes(versionId)) {
                return prev.filter(id => id !== versionId);
            }
            if (prev.length >= 2) {
                return [prev[1], versionId];
            }
            return [...prev, versionId];
        });
    };

    const handleCompare = () => {
        if (selectedVersions.length === 2) {
            onCompare(selectedVersions[0], selectedVersions[1]);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'PUBLISHED': return '#10b981';
            case 'DRAFT': return '#f59e0b';
            case 'ARCHIVED': return '#6b7280';
            case 'DISCARDED': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'PUBLISHED': return 'Published';
            case 'DRAFT': return 'Draft';
            case 'ARCHIVED': return 'Archived';
            case 'DISCARDED': return 'Discarded';
            default: return status || 'Unknown';
        }
    };

    if (isLoading) {
        return <div style={styles.loading}>Loading history...</div>;
    }

    if (!versions || versions.length === 0) {
        return <div style={styles.emptyState}>No versions found</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Version History</h3>
                <div style={styles.headerActions}>
                    {selectedVersions.length === 2 && (
                        <button
                            onClick={handleCompare}
                            style={styles.compareButton}
                        >
                            🔄 Compare Selected
                        </button>
                    )}
                    <button
                        onClick={onRefresh}
                        style={styles.refreshButton}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <div style={styles.list}>
                {versions.map((version, index) => {
                    const isLatest = index === 0;
                    const isDraft = version.status === 'DRAFT';
                    const isPublished = version.status === 'PUBLISHED';
                    
                    return (
                        <div
                            key={version.id}
                            style={{
                                ...styles.versionItem,
                                ...(selectedVersions.includes(version.id) ? styles.versionItemSelected : {})
                            }}
                            onClick={() => handleVersionSelect(version.id)}
                        >
                            <div style={styles.versionHeader}>
                                <div style={styles.versionLeft}>
                                    <span style={styles.versionNumber}>v{version.version}</span>
                                    <span style={{
                                        ...styles.versionStatus,
                                        backgroundColor: getStatusColor(version.status),
                                        color: '#fff'
                                    }}>
                                        {getStatusLabel(version.status)}
                                    </span>
                                    {isLatest && isPublished && (
                                        <span style={styles.currentBadge}>Current</span>
                                    )}
                                </div>
                                <div style={styles.versionRight}>
                                    {version.published_at && (
                                        <span style={styles.versionDate}>
                                            {new Date(version.published_at).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    )}
                                    {version.created_at && !version.published_at && (
                                        <span style={styles.versionDate}>
                                            Created: {new Date(version.created_at).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {version.change_log && (
                                <div style={styles.changeLog}>📝 {version.change_log}</div>
                            )}
                            <div style={styles.versionActions}>
                                <button
                                    style={styles.versionActionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onViewVersion(version);
                                    }}
                                >
                                    👁️ View
                                </button>
                                {isDraft && (
                                    <>
                                        <button
                                            style={styles.versionActionBtnPublish}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onPublish();
                                            }}
                                        >
                                            📤 Publish
                                        </button>
                                        <button
                                            style={styles.versionActionBtnDanger}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteDraft();
                                            }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        height: '100%'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
    },
    headerActions: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
    },
    title: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a2332',
        margin: 0
    },
    compareButton: {
        padding: '8px 16px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    refreshButton: {
        padding: '8px 12px',
        backgroundColor: '#f3f4f6',
        color: '#1a2332',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        cursor: 'pointer'
    },
    list: {
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    versionItem: {
        padding: '16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s'
    },
    versionItemSelected: {
        borderColor: '#4f46e5',
        backgroundColor: '#eef2ff'
    },
    versionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px'
    },
    versionLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
    },
    versionRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    versionNumber: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#1a2332'
    },
    versionStatus: {
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '500'
    },
    versionDate: {
        fontSize: '12px',
        color: '#6b7280'
    },
    currentBadge: {
        padding: '2px 10px',
        backgroundColor: '#d1fae5',
        color: '#065f46',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '500'
    },
    changeLog: {
        marginTop: '8px',
        fontSize: '13px',
        color: '#6b7280',
        fontStyle: 'italic'
    },
    versionActions: {
        marginTop: '8px',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    versionActionBtn: {
        padding: '4px 12px',
        backgroundColor: '#f3f4f6',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#1a2332',
        cursor: 'pointer'
    },
    versionActionBtnPublish: {
        padding: '4px 12px',
        backgroundColor: '#d1fae5',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#065f46',
        cursor: 'pointer'
    },
    versionActionBtnDanger: {
        padding: '4px 12px',
        backgroundColor: '#fee2e2',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#991b1b',
        cursor: 'pointer'
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
        color: '#6b7280'
    },
    emptyState: {
        padding: '20px',
        textAlign: 'center',
        color: '#6b7280'
    }
};

export default VersionHistory;