import React from 'react';

const LegalToolbar = ({
    document,
    isDraft,
    isPublished,
    isArchived,
    hasDraft,
    onPublish,
    onNewVersion,
    onDeleteDraft,
    onArchive,
    onRefresh,
    onViewPublic,
    onViewStatistics,
    onViewAcceptances,
    onViewPendingUsers,
    onViewAcceptedUsers,
    onCreateNew,
    selectedId,
}) => {
    const statusColors = {
        DRAFT: { bg: '#fef3c7', text: '#92400e', label: 'Draft' },
        PUBLISHED: { bg: '#d1fae5', text: '#065f46', label: 'Published' },
        ARCHIVED: { bg: '#f3f4f6', text: '#4b5563', label: 'Archived' },
        DISCARDED: { bg: '#fee2e2', text: '#991b1b', label: 'Discarded' }
    };

    const status = document?.status || 'DRAFT';
    const statusStyle = statusColors[status] || statusColors.DRAFT;

    return (
        <div style={styles.toolbar}>
            <div style={styles.leftSection}>
                <h2 style={styles.docTitle}>{document?.title || 'Untitled'}</h2>
                <div style={styles.docMeta}>
                    <span style={{
                        ...styles.statusBadge,
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text
                    }}>
                        {statusStyle.label}
                    </span>
                    {document?.version_number && (
                        <span style={styles.versionBadge}>v{document.version_number}</span>
                    )}
                    {document?.document_type && (
                        <span style={styles.typeBadge}>
                            {document.document_type.replace(/_/g, ' ').toLowerCase()}
                        </span>
                    )}
                    {document?.target_role && (
                        <span style={styles.roleBadge}>
                            {document.target_role}
                        </span>
                    )}
                </div>
            </div>

            <div style={styles.rightSection}>
                {/* Refresh */}
                <button style={styles.btnSecondary} onClick={onRefresh} title="Refresh">
                    🔄 Refresh
                </button>
                
                {/* View Public */}
                {document?.slug && isPublished && (
                    <button style={styles.btnSecondary} onClick={onViewPublic} title="View Public">
                        🌐 View Public
                    </button>
                )}

                {/* Draft Actions */}
                {isDraft && (
                    <>
                        <button style={styles.btnDanger} onClick={onDeleteDraft}>
                            🗑️ Delete Draft
                        </button>
                        <button style={styles.btnPrimary} onClick={onPublish}>
                            📤 Publish
                        </button>
                    </>
                )}

                {/* Published Actions */}
                {isPublished && (
                    <>
                        <button style={styles.btnPrimary} onClick={onNewVersion}>
                            ✨ New Version
                        </button>
                        <button style={styles.btnDanger} onClick={onArchive}>
                            📦 Archive
                        </button>
                        <button style={styles.btnSecondary} onClick={onViewStatistics}>
                            📊 Stats
                        </button>
                        <button style={styles.btnSecondary} onClick={onViewAcceptances}>
                            ✅ Acceptances
                        </button>
                        <button style={styles.btnSecondary} onClick={onViewPendingUsers}>
                            ⏳ Pending
                        </button>
                        <button style={styles.btnSecondary} onClick={onViewAcceptedUsers}>
                            ✅ Accepted
                        </button>
                    </>
                )}

                {/* Archived Actions */}
                {isArchived && (
                    <>
                        <span style={styles.archivedLabel}>📦 Archived</span>
                        <button style={styles.btnSecondary} onClick={onViewStatistics}>
                            📊 Stats
                        </button>
                        <button style={styles.btnSecondary} onClick={onViewAcceptances}>
                            ✅ Acceptances
                        </button>
                    </>
                )}

                {/* Create New */}
                <button style={styles.btnPrimary} onClick={onCreateNew}>
                    ✨ New Document
                </button>
            </div>
        </div>
    );
};

const styles = {
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap',
        gap: '12px',
        flexShrink: 0,
        backgroundColor: '#ffffff'
    },
    leftSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        minWidth: 0
    },
    docTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a2332',
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    docMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap'
    },
    statusBadge: {
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500'
    },
    versionBadge: {
        padding: '4px 12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '20px',
        fontSize: '12px',
        color: '#4b5563'
    },
    typeBadge: {
        padding: '4px 12px',
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        borderRadius: '20px',
        fontSize: '11px',
        textTransform: 'capitalize'
    },
    roleBadge: {
        padding: '4px 12px',
        backgroundColor: '#fce7f3',
        color: '#9d174d',
        borderRadius: '20px',
        fontSize: '11px',
        textTransform: 'uppercase'
    },
    rightSection: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    btnPrimary: {
        padding: '8px 16px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        whiteSpace: 'nowrap'
    },
    btnSecondary: {
        padding: '8px 16px',
        backgroundColor: '#f3f4f6',
        color: '#1a2332',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        whiteSpace: 'nowrap'
    },
    btnDanger: {
        padding: '8px 16px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        whiteSpace: 'nowrap'
    },
    archivedLabel: {
        padding: '8px 16px',
        backgroundColor: '#f3f4f6',
        color: '#4b5563',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500'
    }
};

export default LegalToolbar;