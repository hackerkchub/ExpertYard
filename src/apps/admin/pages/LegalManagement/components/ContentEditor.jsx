import React, { useState, useEffect, useRef } from 'react';
import RichTextEditor from "../../../../../shared/components/RichTextEditor/RichTextEditor";
import "../../../../../shared/styles/legal-document.css";

const ContentEditor = ({ document, onSave, isDraft, isLoading }) => {
    const [content, setContent] = useState('');
    const [changeLog, setChangeLog] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editorHeight, setEditorHeight] = useState('400px');
    const containerRef = useRef(null);

    useEffect(() => {
        if (document) {
            setContent(document.content || '');
            setChangeLog(document.change_log || '');
            setHasChanges(false);
        }
    }, [document]);

    // Calculate available height for editor
    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const toolbarHeight = container.querySelector('.toolbar-section')?.offsetHeight || 0;
                const changeLogHeight = container.querySelector('.changelog-section')?.offsetHeight || 0;
                const actionsHeight = container.querySelector('.actions-section')?.offsetHeight || 0;
                const padding = 40;
                const availableHeight = container.clientHeight - toolbarHeight - changeLogHeight - actionsHeight - padding;
                setEditorHeight(Math.max(200, availableHeight));
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [showPreview]);

    const handleContentChange = (html) => {
        setContent(html);
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!hasChanges || isSaving || isLoading) return;
        
        setIsSaving(true);
        try {
            await onSave({ content, change_log: changeLog });
            setHasChanges(false);
        } catch (error) {
            console.error('Save failed:', error);
            alert('Failed to save content: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div style={styles.loading}>Loading content...</div>;
    }

    return (
        <div ref={containerRef} style={styles.container}>
            {/* Toolbar */}
            <div className="toolbar-section" style={styles.toolbar}>
                <div style={styles.toolbarLeft}>
                    <button
                        style={{
                            ...styles.previewButton,
                            ...(!showPreview ? styles.previewButtonActive : {})
                        }}
                        onClick={() => setShowPreview(false)}
                    >
                        ✏️ Edit
                    </button>
                    <button
                        style={{
                            ...styles.previewButton,
                            ...(showPreview ? styles.previewButtonActive : {})
                        }}
                        onClick={() => setShowPreview(true)}
                    >
                        👁️ Preview
                    </button>
                </div>
                <div style={styles.toolbarRight}>
                    {!isDraft && (
                        <span style={styles.readonlyBadge}>🔒 Read-only (Published)</span>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div style={styles.contentArea}>
                {showPreview ? (
                    <div style={styles.previewContainer}>
                        <div 
                            className="legal-document"
                            style={styles.previewContent}
                            dangerouslySetInnerHTML={{ 
                                __html: content || '<p style="color:#9ca3af;text-align:center;padding:40px 0;">No content to preview</p>' 
                            }}
                        />
                    </div>
                ) : (
                    <>
                        <div
                            style={{
                                ...styles.editorWrapper,
                                height: editorHeight
                            }}
                        >
                            <RichTextEditor
                                value={content}
                                editable={isDraft}
                                onChange={handleContentChange}
                            />
                        </div>

                        <div className="changelog-section" style={styles.changeLogContainer}>
                            <label style={styles.label}>Change Log</label>
                            <input
                                type="text"
                                value={changeLog}
                                onChange={(e) => {
                                    setChangeLog(e.target.value);
                                    setHasChanges(true);
                                }}
                                disabled={!isDraft}
                                style={{
                                    ...styles.changeLogInput,
                                    ...(!isDraft ? styles.inputDisabled : {})
                                }}
                                placeholder="Describe what changed in this version..."
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Save Button */}
            {isDraft && (
                <div className="actions-section" style={styles.actions}>
                    <div style={styles.actionsInner}>
                        <div style={styles.saveInfo}>
                            {hasChanges && (
                                <span style={styles.unsavedChanges}>⚠️ Unsaved changes</span>
                            )}
                            {!hasChanges && content && (
                                <span style={styles.savedStatus}>✅ All changes saved</span>
                            )}
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving || isLoading}
                            style={{
                                ...styles.saveButton,
                                ...((!hasChanges || isSaving || isLoading) ? styles.saveButtonDisabled : {})
                            }}
                        >
                            {isSaving ? (
                                <>
                                    <span style={styles.spinner}></span>
                                    Saving...
                                </>
                            ) : (
                                '💾 Save Draft'
                            )}
                        </button>
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
        height: '100%',
        minHeight: '500px',
        position: 'relative'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        flexShrink: 0,
        paddingBottom: '12px',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '12px'
    },
    toolbarLeft: {
        display: 'flex',
        gap: '4px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        padding: '3px'
    },
    toolbarRight: {
        display: 'flex',
        alignItems: 'center'
    },
    previewButton: {
        padding: '6px 14px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: 'transparent',
        color: '#6b7280'
    },
    previewButtonActive: {
        backgroundColor: '#fff',
        color: '#1a2332',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    readonlyBadge: {
        fontSize: '13px',
        color: '#6b7280',
        padding: '4px 12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px'
    },
    contentArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: 0,
        overflow: 'hidden'
    },
    editorWrapper: {
        flex: 1,
        minHeight: '200px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative'
    },
    previewContainer: {
        flex: 1,
        minHeight: '300px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        overflow: 'auto'
    },
    previewContent: {
        fontSize: '15px',
        lineHeight: '1.8',
        color: '#1a2332'
    },
    changeLogContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        flexShrink: 0
    },
    label: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#374151'
    },
    changeLogInput: {
        padding: '10px 12px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s'
    },
    inputDisabled: {
        backgroundColor: '#f9fafb',
        cursor: 'not-allowed',
        color: '#6b7280'
    },
    actions: {
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px',
        marginTop: '12px',
        flexShrink: 0,
        backgroundColor: '#ffffff'
    },
    actionsInner: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
    },
    saveInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '13px'
    },
    unsavedChanges: {
        color: '#d97706',
        fontWeight: '500'
    },
    savedStatus: {
        color: '#059669',
        fontWeight: '500'
    },
    saveButton: {
        padding: '10px 28px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        minWidth: '140px',
        justifyContent: 'center'
    },
    saveButtonDisabled: {
        backgroundColor: '#a5b4fc',
        cursor: 'not-allowed',
        opacity: 0.6
    },
    spinner: {
        display: 'inline-block',
        width: '16px',
        height: '16px',
        border: '2px solid #ffffff',
        borderTop: '2px solid transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
    },
    loading: {
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280'
    }
};

// Add keyframes for spinner
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(styleSheet);

export default ContentEditor;