import React, { useState, useEffect } from 'react';
import {
    DOCUMENT_TYPES,
    TARGET_ROLES
} from "../../../../../shared/constants/legal.constants.js";

const MetadataForm = ({ document, onSave, isLoading }) => {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        document_type: '',
        target_role: '',
        require_acceptance: false,
        require_signature: false
    });
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (document) {
            setFormData({
                title: document.title || '',
                slug: document.slug || '',
                document_type: document.document_type || '',
                target_role: document.target_role || '',
                require_acceptance: document.require_acceptance === 1 || document.require_acceptance === true,
                require_signature: document.require_signature === 1 || document.require_signature === true
            });
            setHasChanges(false);
        }
    }, [document]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleSubmit = async () => {
        if (!hasChanges || isSaving || isLoading) return;
        
        setIsSaving(true);
        try {
            const payload = {};
            if (formData.title !== document.title) payload.title = formData.title;
            if (formData.slug !== document.slug) payload.slug = formData.slug;
            if (formData.document_type !== document.document_type) payload.document_type = formData.document_type;
            if (formData.target_role !== document.target_role) payload.target_role = formData.target_role;
            if (formData.require_acceptance !== (document.require_acceptance === 1)) payload.require_acceptance = formData.require_acceptance;
            if (formData.require_signature !== (document.require_signature === 1)) payload.require_signature = formData.require_signature;

            if (Object.keys(payload).length > 0) {
                await onSave(payload);
                setHasChanges(false);
            }
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save metadata: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const docTypeOptions = Object.keys(DOCUMENT_TYPES).map(key => ({
        label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
        value: DOCUMENT_TYPES[key]
    }));

    const roleOptions = Object.keys(TARGET_ROLES).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
        value: TARGET_ROLES[key]
    }));

    if (isLoading) {
        return <div style={styles.loading}>Loading metadata...</div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.grid}>
                <div style={styles.field}>
                    <label style={styles.label}>Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        style={styles.input}
                        placeholder="Enter document title"
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Slug</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        style={styles.input}
                        placeholder="url-friendly-slug"
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Document Type</label>
                    <select
                        value={formData.document_type}
                        onChange={(e) => handleChange('document_type', e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Select type...</option>
                        {docTypeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Target Role</label>
                    <select
                        value={formData.target_role}
                        onChange={(e) => handleChange('target_role', e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Select role...</option>
                        {roleOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Require Acceptance</label>
                    <div style={styles.toggleGroup}>
                        <button
                            type="button"
                            style={{
                                ...styles.toggleButton,
                                ...(formData.require_acceptance ? styles.toggleButtonActive : {})
                            }}
                            onClick={() => handleChange('require_acceptance', true)}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            style={{
                                ...styles.toggleButton,
                                ...(!formData.require_acceptance ? styles.toggleButtonActive : {})
                            }}
                            onClick={() => handleChange('require_acceptance', false)}
                        >
                            No
                        </button>
                    </div>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Require Signature</label>
                    <div style={styles.toggleGroup}>
                        <button
                            type="button"
                            style={{
                                ...styles.toggleButton,
                                ...(formData.require_signature ? styles.toggleButtonActive : {})
                            }}
                            onClick={() => handleChange('require_signature', true)}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            style={{
                                ...styles.toggleButton,
                                ...(!formData.require_signature ? styles.toggleButtonActive : {})
                            }}
                            onClick={() => handleChange('require_signature', false)}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>

            {document?.created_at && (
                <div style={styles.metaInfo}>
                    <span>Created: {new Date(document.created_at).toLocaleString()}</span>
                    {document.updated_at && (
                        <span>Last Updated: {new Date(document.updated_at).toLocaleString()}</span>
                    )}
                </div>
            )}

            <div style={styles.actions}>
                <button
                    onClick={handleSubmit}
                    disabled={!hasChanges || isSaving || isLoading}
                    style={{
                        ...styles.saveButton,
                        ...((!hasChanges || isSaving || isLoading) ? styles.saveButtonDisabled : {})
                    }}
                >
                    {isSaving ? 'Saving...' : '💾 Save Metadata'}
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#374151'
    },
    input: {
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    select: {
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        backgroundColor: '#fff',
        transition: 'border-color 0.2s'
    },
    toggleGroup: {
        display: 'flex',
        gap: '4px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '3px'
    },
    toggleButton: {
        padding: '6px 16px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: 'transparent',
        color: '#6b7280'
    },
    toggleButtonActive: {
        backgroundColor: '#fff',
        color: '#1a2332',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    metaInfo: {
        display: 'flex',
        gap: '24px',
        fontSize: '13px',
        color: '#6b7280',
        padding: '12px 0',
        borderTop: '1px solid #e5e7eb'
    },
    actions: {
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px'
    },
    saveButton: {
        padding: '10px 24px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    saveButtonDisabled: {
        backgroundColor: '#a5b4fc',
        cursor: 'not-allowed',
        opacity: 0.6
    },
    loading: {
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280'
    }
};

export default MetadataForm;