import { createContext, useContext, useState, useCallback } from "react";

const LegalContext = createContext(null);

export function LegalProvider({ children }) {
    const [pendingDocuments, setPendingDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [accepted, setAccepted] = useState({});
    const [applicationLocked, setApplicationLocked] = useState(false);
    const [legalInitialized, setLegalInitialized] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = useCallback(() => {
        setRefreshKey(prev => prev + 1);
    }, []);

    const value = {
        pendingDocuments,
        setPendingDocuments,
        isLoading,
        setIsLoading,
        isOpen,
        setIsOpen,
        accepted,
        setAccepted,
        applicationLocked,
        setApplicationLocked,
        legalInitialized,
        setLegalInitialized,
        refreshKey,
        refresh,
    };

    return (
        <LegalContext.Provider value={value}>
            {children}
        </LegalContext.Provider>
    );
}

export const useLegal = () => {
    const context = useContext(LegalContext);
    if (!context) {
        throw new Error("useLegal must be used within a LegalProvider");
    }
    return context;
};