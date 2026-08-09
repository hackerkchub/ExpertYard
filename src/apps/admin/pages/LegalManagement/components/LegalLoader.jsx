import React from 'react';

const LegalLoader = () => {
    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.skeletonSearch} />
                <div style={styles.skeletonItem} />
                <div style={styles.skeletonItem} />
                <div style={styles.skeletonItem} />
                <div style={styles.skeletonItem} />
            </div>
            <div style={styles.main}>
                <div style={styles.skeletonToolbar} />
                <div style={styles.skeletonTabs}>
                    <div style={styles.skeletonTab} />
                    <div style={styles.skeletonTab} />
                    <div style={styles.skeletonTab} />
                </div>
                <div style={styles.skeletonContent}>
                    <div style={styles.skeletonField} />
                    <div style={styles.skeletonField} />
                    <div style={styles.skeletonField} />
                    <div style={styles.skeletonEditor} />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        height: 'calc(100vh - 70px)',
        backgroundColor: '#f8fafc',
        gap: 0,
        overflow: 'hidden'
    },
    sidebar: {
        width: '300px',
        minWidth: '250px',
        height: '100%',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        padding: '16px',
        flexShrink: 0
    },
    main: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        padding: '0'
    },
    skeletonSearch: {
        height: '40px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        marginBottom: '16px',
        animation: 'pulse 1.5s ease-in-out infinite'
    },
    skeletonItem: {
        height: '56px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        marginBottom: '8px',
        animation: 'pulse 1.5s ease-in-out infinite'
    },
    skeletonToolbar: {
        height: '80px',
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        animation: 'pulse 1.5s ease-in-out infinite'
    },
    skeletonTabs: {
        display: 'flex',
        gap: '0',
        padding: '0 24px',
        borderBottom: '2px solid #e5e7eb',
        height: '48px',
        backgroundColor: '#ffffff'
    },
    skeletonTab: {
        width: '100px',
        height: '48px',
        backgroundColor: '#f3f4f6',
        marginRight: '4px',
        animation: 'pulse 1.5s ease-in-out infinite'
    },
    skeletonContent: {
        flex: 1,
        padding: '24px',
        overflow: 'auto'
    },
    skeletonField: {
        height: '60px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        marginBottom: '16px',
        animation: 'pulse 1.5s ease-in-out infinite'
    },
    skeletonEditor: {
        height: '300px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        animation: 'pulse 1.5s ease-in-out infinite'
    }
};

// Add pulse animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);

export default LegalLoader;