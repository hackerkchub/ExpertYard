import React from 'react';

const ErrorState = ({ error, onRetry, icon = '⚠️' }) => {
    return (
        <div style={styles.container}>
            <div style={styles.icon}>{icon}</div>
            <h3 style={styles.title}>Something went wrong</h3>
            <p style={styles.description}>{error || 'An unexpected error occurred.'}</p>
            {onRetry && (
                <button style={styles.retryButton} onClick={onRetry}>
                    🔄 Try Again
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
    retryButton: {
        padding: '10px 24px',
        backgroundColor: '#dc2626',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    }
};

export default ErrorState;