import React from 'react';

const EmptyState = ({ title, description, actionLabel, onAction, icon = '📄' }) => {
    return (
        <div style={styles.container}>
            <div style={styles.icon}>{icon}</div>
            <h3 style={styles.title}>{title || 'No Data Found'}</h3>
            <p style={styles.description}>{description || 'There is nothing to display here.'}</p>
            {actionLabel && onAction && (
                <button style={styles.actionButton} onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        textAlign: 'center',
        height: '100%',
        minHeight: '300px'
    },
    icon: {
        fontSize: '48px',
        marginBottom: '16px'
    },
    title: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a2332',
        margin: '0 0 8px 0'
    },
    description: {
        fontSize: '14px',
        color: '#6b7280',
        margin: '0 0 20px 0',
        maxWidth: '400px'
    },
    actionButton: {
        padding: '10px 24px',
        backgroundColor: '#4f46e5',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    }
};

export default EmptyState;