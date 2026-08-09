import React from 'react';

const ConfirmDialog = ({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDanger = false,
    isLoading = false,
}) => {
    if (!isOpen) return null;

    return (
        <div style={styles.overlay} onClick={onCancel}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h3 style={styles.title}>{title || 'Confirm Action'}</h3>
                </div>
                <div style={styles.body}>
                    <p style={styles.message}>{message || 'Are you sure you want to proceed?'}</p>
                </div>
                <div style={styles.footer}>
                    <button
                        style={styles.cancelButton}
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        style={{
                            ...styles.confirmButton,
                            ...(isDanger ? styles.confirmButtonDanger : {})
                        }}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmLabel}
                    </button>
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
        maxWidth: '450px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    header: {
        marginBottom: '12px'
    },
    title: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a2332',
        margin: 0
    },
    body: {
        marginBottom: '20px'
    },
    message: {
        fontSize: '14px',
        color: '#4b5563',
        margin: 0,
        lineHeight: '1.6'
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '16px'
    },
    cancelButton: {
        padding: '8px 20px',
        backgroundColor: '#f3f4f6',
        color: '#1a2332',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    confirmButton: {
        padding: '8px 20px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    confirmButtonDanger: {
        backgroundColor: '#dc2626'
    }
};

export default ConfirmDialog;