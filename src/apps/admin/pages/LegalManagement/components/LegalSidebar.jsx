import React, { useState } from 'react';
import {
    DOCUMENT_TYPES,
    TARGET_ROLES,
    VERSION_STATUS,
} from '../../../../../shared/constants/legal.constants.js';

const LegalSidebar = ({
    documents,
    selectedId,
    onSelect,
    onRefresh,
    onCreate,
    isLoading,
    searchQuery,
    onSearchChange,
    filterStatus,
    onFilterStatusChange,
    filterType,
    onFilterTypeChange,
    filterRole,
    onFilterRoleChange,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Apply all filters
    const filteredDocs = documents.filter(doc => {
        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const titleMatch = doc.title?.toLowerCase().includes(query) || false;
            const slugMatch = doc.slug?.toLowerCase().includes(query) || false;
            if (!titleMatch && !slugMatch) return false;
        }
        
        // Status filter
        if (filterStatus && doc.status !== filterStatus) {
            return false;
        }
        
        // Type filter
        if (filterType && doc.document_type !== filterType) {
            return false;
        }
        
        // Role filter
        if (filterRole && doc.target_role !== filterRole) {
            return false;
        }
        
        return true;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'PUBLISHED': return '#10b981';
            case 'DRAFT': return '#f59e0b';
            case 'ARCHIVED': return '#6b7280';
            case 'DISCARDED': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const statusOptions = Object.keys(VERSION_STATUS).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        value: VERSION_STATUS[key]
    }));

    const typeOptions = Object.keys(DOCUMENT_TYPES).map(key => ({
        label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        value: DOCUMENT_TYPES[key]
    }));

    const roleOptions = Object.keys(TARGET_ROLES).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        value: TARGET_ROLES[key]
    }));

    return (
        <div style={styles.sidebar}>
            {/* Header */}
            <div style={styles.header}>
                <span style={styles.headerTitle}>📄 Documents</span>
                <button 
                    style={styles.createButton} 
                    onClick={onCreate} 
                    title="Create New Document"
                >
                    +
                </button>
            </div>

            {/* Search & Filters */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={styles.searchInput}
                />
                <button
                    style={{
                        ...styles.filterToggle,
                        ...(isFilterOpen ? styles.filterToggleActive : {})
                    }}
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    title="Toggle Filters"
                >
                    ⚙️
                </button>
                <button 
                    style={styles.refreshButton} 
                    onClick={onRefresh} 
                    title="Refresh"
                >
                    🔄
                </button>
            </div>

            {/* Filters Panel */}
            {isFilterOpen && (
                <div style={styles.filtersContainer}>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => onFilterStatusChange(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">All Status</option>
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => onFilterTypeChange(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">All Types</option>
                            {typeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Role</label>
                        <select
                            value={filterRole}
                            onChange={(e) => onFilterRoleChange(e.target.value)}
                            style={styles.filterSelect}
                        >
                            <option value="">All Roles</option>
                            {roleOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        style={styles.clearFiltersBtn}
                        onClick={() => {
                            onFilterStatusChange('');
                            onFilterTypeChange('');
                            onFilterRoleChange('');
                            onSearchChange('');
                        }}
                    >
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* Document List */}
            <div style={styles.listContainer}>
                {isLoading ? (
                    <div style={styles.loading}>Loading...</div>
                ) : filteredDocs.length === 0 ? (
                    <div style={styles.emptyState}>
                        {documents.length === 0 ? 'No documents found' : 'No matching documents'}
                    </div>
                ) : (
                    filteredDocs.map(doc => (
                        <div
                            key={doc.id}
                            style={{
                                ...styles.listItem,
                                ...(selectedId === doc.id ? styles.listItemSelected : {})
                            }}
                            onClick={() => onSelect(doc.id)}
                        >
                            <div style={styles.listItemContent}>
                                <div style={styles.listItemTitle}>
                                    {doc.title || 'Untitled'}
                                </div>
                                <div style={styles.listItemMeta}>
                                    <span style={styles.listItemStatus}>
                                        <span style={{
                                            ...styles.statusDot,
                                            backgroundColor: getStatusColor(doc.status)
                                        }} />
                                        {doc.status || 'DRAFT'}
                                    </span>
                                    <span style={styles.listItemVersion}>
                                        v{doc.current_version || 1}
                                    </span>
                                    {doc.target_role && (
                                        <span style={styles.listItemRole}>
                                            {doc.target_role}
                                        </span>
                                    )}
                                </div>
                                {doc.document_type && (
                                    <div style={styles.listItemType}>
                                        {doc.document_type.replace(/_/g, ' ')}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div style={styles.footer}>
                <span style={styles.footerText}>
                    {filteredDocs.length} of {documents.length} documents
                </span>
            </div>
        </div>
    );
};

const styles = {
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 16px 12px 16px',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0
    },
    headerTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a2332'
    },
    createButton: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4f46e5',
        color: '#fff',
        fontSize: '20px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s'
    },
    searchContainer: {
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        flexShrink: 0
    },
    searchInput: {
        flex: 1,
        padding: '8px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#f9fafb'
    },
    filterToggle: {
        padding: '6px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s'
    },
    filterToggleActive: {
        backgroundColor: '#eef2ff',
        borderColor: '#4f46e5'
    },
    refreshButton: {
        padding: '6px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#fff',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s'
    },
    filtersContainer: {
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        backgroundColor: '#f9fafb',
        flexShrink: 0
    },
    filterGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    filterLabel: {
        fontSize: '12px',
        fontWeight: '500',
        color: '#6b7280'
    },
    filterSelect: {
        padding: '6px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '13px',
        backgroundColor: '#fff',
        outline: 'none'
    },
    clearFiltersBtn: {
        padding: '6px 12px',
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: 'none',
        borderRadius: '6px',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: '500'
    },
    listContainer: {
        flex: 1,
        overflow: 'auto',
        padding: '8px'
    },
    listItem: {
        padding: '12px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.15s',
        marginBottom: '4px'
    },
    listItemSelected: {
        backgroundColor: '#eef2ff',
        borderLeft: '3px solid #4f46e5'
    },
    listItemContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    listItemTitle: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#1a2332',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    listItemMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: '#6b7280',
        flexWrap: 'wrap'
    },
    listItemStatus: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    },
    listItemVersion: {
        backgroundColor: '#f3f4f6',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px'
    },
    listItemRole: {
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        textTransform: 'uppercase'
    },
    listItemType: {
        fontSize: '11px',
        color: '#9ca3af',
        textTransform: 'capitalize'
    },
    statusDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        display: 'inline-block'
    },
    footer: {
        padding: '12px 16px',
        borderTop: '1px solid #e5e7eb',
        fontSize: '12px',
        color: '#6b7280',
        textAlign: 'center',
        flexShrink: 0
    },
    footerText: {
        fontSize: '12px'
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
        color: '#6b7280'
    },
    emptyState: {
        padding: '20px',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '14px'
    }
};

export default LegalSidebar;