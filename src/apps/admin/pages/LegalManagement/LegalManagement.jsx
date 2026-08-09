import React, { useState, useEffect, useCallback } from 'react';
import {
    getLegalDocumentsApi,
    getLegalDocumentApi,
    updateLegalContentApi,
    updateLegalMetaApi,
    publishLegalDocumentApi,
    createNewVersionApi,
    deleteDraftVersionApi,
    archiveLegalDocumentApi,
    getLegalHistoryApi,
    compareLegalVersionsApi,
    getLegalStatisticsApi,
    getAcceptanceListApi,
    getAcceptanceDetailsApi,
    getPendingUsersByDocumentApi,
    getAcceptedUsersByDocumentApi,
} from '../../../../shared/api/admin/legal.api.js';

// Components
import LegalSidebar from './components/LegalSidebar';
import LegalToolbar from './components/LegalToolbar';
import MetadataForm from './components/MetadataForm';
import ContentEditor from './components/ContentEditor';
import VersionHistory from './components/VersionHistory';
import VersionCompareModal from './components/VersionCompareModal';
import CreateDocumentModal from './components/CreateDocumentModal';
import ConfirmDialog from './components/ConfirmDialog';
import LegalStatistics from './components/LegalStatistics';
import AcceptanceList from './components/AcceptanceList';
import AcceptanceDetailsModal from './components/AcceptanceDetailsModal';
import PendingUsers from './components/PendingUsers';
import AcceptedUsers from './components/AcceptedUsers';
import ViewVersionModal from './components/ViewVersionModal';
import LegalLoader from './components/LegalLoader';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';

// Styles
import './LegalManagement.css';

const LegalManagement = () => {
    // State Management
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingDocument, setIsLoadingDocument] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('metadata');
    
    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterRole, setFilterRole] = useState('');
    
    // Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showViewVersionModal, setShowViewVersionModal] = useState(false);
    const [showAcceptanceDetails, setShowAcceptanceDetails] = useState(false);
    const [showPendingUsers, setShowPendingUsers] = useState(false);
    const [showAcceptedUsers, setShowAcceptedUsers] = useState(false);
    
    // Data States
    const [compareData, setCompareData] = useState(null);
    const [viewVersionData, setViewVersionData] = useState(null);
    const [selectedAcceptanceId, setSelectedAcceptanceId] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [documentToAction, setDocumentToAction] = useState(null);
    const [pendingUsersData, setPendingUsersData] = useState(null);
    const [acceptedUsersData, setAcceptedUsersData] = useState(null);
    const [versions, setVersions] = useState([]);

    // Load Documents with Filters
    const loadDocuments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {
                limit: 100
            };
            if (searchQuery) params.search = searchQuery;
            if (filterStatus) params.status = filterStatus;
            if (filterType) params.document_type = filterType;
            if (filterRole) params.target_role = filterRole;

            const response = await getLegalDocumentsApi(params);
            
            if (response.success) {
                const docs = response.data.documents || [];
                setDocuments(docs);
                
                // Auto-select first document if none selected
                if (docs.length > 0 && !selectedId) {
                    setSelectedId(docs[0].id);
                } else if (docs.length === 0) {
                    setSelectedId(null);
                    setSelectedDocument(null);
                }
            } else {
                setError('Failed to load documents');
            }
        } catch (err) {
            setError(err.message || 'Failed to load documents');
            console.error('Load documents error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, filterStatus, filterType, filterRole, selectedId]);

    // Load Single Document
    const loadDocument = useCallback(async (id) => {
        if (!id) return;
        
        setIsLoadingDocument(true);
        setError(null);
        try {
            const response = await getLegalDocumentApi(id);
            if (response.success) {
                setSelectedDocument(response.data);
                // Load history in background
                loadHistory(id);
            } else {
                setError('Failed to load document');
            }
        } catch (err) {
            setError(err.message || 'Failed to load document');
            console.error('Load document error:', err);
        } finally {
            setIsLoadingDocument(false);
        }
    }, []);

    // Load History
    const loadHistory = async (documentId) => {
        try {
            const response = await getLegalHistoryApi(documentId);
            if (response.success) {
                setVersions(response.data.versions || []);
            }
        } catch (err) {
            console.error('Load history error:', err);
        }
    };

    // Initial Load
    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);

    // Load Document when selectedId changes
    useEffect(() => {
        if (selectedId) {
            loadDocument(selectedId);
        }
    }, [selectedId, loadDocument]);

    // Handlers
    const handleSelectDocument = (id) => {
        setSelectedId(id);
        setActiveTab('metadata');
    };

    const handleRefresh = () => {
        loadDocuments();
        if (selectedId) loadDocument(selectedId);
    };

    const handleCreateDocument = () => {
        setShowCreateModal(true);
    };

    const handleDocumentCreated = (newDoc) => {
        loadDocuments();
        if (newDoc?.document_id) {
            setSelectedId(newDoc.document_id);
        }
    };

    const handleSaveMetadata = async (payload) => {
        if (!selectedId) return;
        try {
            const response = await updateLegalMetaApi(selectedId, payload);
            if (response.success) {
                await loadDocument(selectedId);
                await loadDocuments();
                return response;
            }
            throw new Error('Failed to update metadata');
        } catch (err) {
            console.error('Save metadata error:', err);
            throw err;
        }
    };

    const handleSaveContent = async (payload) => {
        if (!selectedId) return;
        try {
            const response = await updateLegalContentApi(selectedId, payload);
            if (response.success) {
                await loadDocument(selectedId);
                return response;
            }
            throw new Error('Failed to update content');
        } catch (err) {
            console.error('Save content error:', err);
            throw err;
        }
    };

    // Action Handlers with Confirm
    const showConfirm = (type, title, message, action) => {
        setDocumentToAction(selectedId);
        setConfirmAction({
            type,
            title,
            message,
            action
        });
        setShowConfirmDialog(true);
    };

    const handlePublish = () => {
        showConfirm(
            'publish',
            'Publish Document',
            'Are you sure you want to publish this document? This will make it publicly available.',
            async () => {
                try {
                    const response = await publishLegalDocumentApi(selectedId);
                    if (response.success) {
                        await loadDocument(selectedId);
                        await loadDocuments();
                        return response;
                    }
                    throw new Error('Failed to publish');
                } catch (err) {
                    console.error('Publish error:', err);
                    throw err;
                }
            }
        );
    };

    const handleNewVersion = () => {
        showConfirm(
            'newVersion',
            'Create New Version',
            'This will create a new draft version from the current published version. Continue?',
            async () => {
                try {
                    const response = await createNewVersionApi(selectedId);
                    if (response.success) {
                        await loadDocument(selectedId);
                        await loadDocuments();
                        return response;
                    }
                    throw new Error('Failed to create new version');
                } catch (err) {
                    console.error('New version error:', err);
                    throw err;
                }
            }
        );
    };

    const handleDeleteDraft = () => {
        showConfirm(
            'deleteDraft',
            'Delete Draft',
            'Are you sure you want to delete this draft? This action cannot be undone.',
            async () => {
                try {
                    const response = await deleteDraftVersionApi(selectedId);
                    if (response.success) {
                        await loadDocument(selectedId);
                        await loadDocuments();
                        return response;
                    }
                    throw new Error('Failed to delete draft');
                } catch (err) {
                    console.error('Delete draft error:', err);
                    throw err;
                }
            }
        );
    };

    const handleArchive = () => {
        showConfirm(
            'archive',
            'Archive Document',
            'Are you sure you want to archive this document? It will be hidden from public view.',
            async () => {
                try {
                    const response = await archiveLegalDocumentApi(selectedId);
                    if (response.success) {
                        await loadDocument(selectedId);
                        await loadDocuments();
                        return response;
                    }
                    throw new Error('Failed to archive');
                } catch (err) {
                    console.error('Archive error:', err);
                    throw err;
                }
            }
        );
    };

    const handleCompare = async (v1, v2) => {
        if (!selectedId) return;
        try {
            const response = await compareLegalVersionsApi(selectedId, v1, v2);
            if (response.success) {
                setCompareData(response.data);
                setShowCompareModal(true);
            }
        } catch (err) {
            console.error('Compare error:', err);
            alert('Failed to compare versions: ' + err.message);
        }
    };

    const handleViewVersion = (version) => {
        setViewVersionData(version);
        setShowViewVersionModal(true);
    };

    const handleViewStatistics = () => {
        setActiveTab('statistics');
    };

    const handleViewAcceptances = () => {
        setActiveTab('acceptances');
    };

    const handleViewPendingUsers = () => {
        setPendingUsersData({ documentId: selectedId });
        setShowPendingUsers(true);
    };

    const handleViewAcceptedUsers = () => {
        setAcceptedUsersData({ documentId: selectedId });
        setShowAcceptedUsers(true);
    };

    const handleViewPublic = () => {
        if (selectedDocument?.slug) {
            window.open(`/legal/document/${selectedDocument.slug}`, '_blank');
        }
    };

    const handleConfirm = async () => {
        if (!confirmAction) return;
        try {
            await confirmAction.action();
            setShowConfirmDialog(false);
            setConfirmAction(null);
        } catch (err) {
            console.error('Confirm action error:', err);
            alert('Action failed: ' + err.message);
        }
    };

    const handleCancelConfirm = () => {
        setShowConfirmDialog(false);
        setConfirmAction(null);
        setDocumentToAction(null);
    };

    // Computed properties
    const isDraft = selectedDocument?.status === 'DRAFT';
    const isPublished = selectedDocument?.status === 'PUBLISHED';
    const isArchived = selectedDocument?.status === 'ARCHIVED';
    const hasDraft = versions.some(v => v.status === 'DRAFT');

    // Render
    if (isLoading && documents.length === 0) {
        return <LegalLoader />;
    }

    if (error && documents.length === 0) {
        return <ErrorState error={error} onRetry={loadDocuments} />;
    }

    return (
        <div className="legal-management">
            {/* Sidebar */}
            <div className="legal-sidebar-wrapper">
                <LegalSidebar
                    documents={documents}
                    selectedId={selectedId}
                    onSelect={handleSelectDocument}
                    onRefresh={loadDocuments}
                    onCreate={handleCreateDocument}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterStatus={filterStatus}
                    onFilterStatusChange={setFilterStatus}
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    filterRole={filterRole}
                    onFilterRoleChange={setFilterRole}
                />
            </div>

            {/* Main Content */}
            <div className="legal-main-content">
                {selectedDocument ? (
                    <>
                        {/* Toolbar */}
                        <LegalToolbar
                            document={selectedDocument}
                            isDraft={isDraft}
                            isPublished={isPublished}
                            isArchived={isArchived}
                            hasDraft={hasDraft}
                            onPublish={handlePublish}
                            onNewVersion={handleNewVersion}
                            onDeleteDraft={handleDeleteDraft}
                            onArchive={handleArchive}
                            onRefresh={handleRefresh}
                            onViewPublic={handleViewPublic}
                            onViewStatistics={handleViewStatistics}
                            onViewAcceptances={handleViewAcceptances}
                            onViewPendingUsers={handleViewPendingUsers}
                            onViewAcceptedUsers={handleViewAcceptedUsers}
                            onCreateNew={handleCreateDocument}
                            selectedId={selectedId}
                        />

                        {/* Tabs */}
                        <div className="legal-tabs">
                            <button
                                className={`legal-tab ${activeTab === 'metadata' ? 'active' : ''}`}
                                onClick={() => setActiveTab('metadata')}
                            >
                                📋 Metadata
                            </button>
                            <button
                                className={`legal-tab ${activeTab === 'content' ? 'active' : ''}`}
                                onClick={() => setActiveTab('content')}
                            >
                                📝 Content
                            </button>
                            <button
                                className={`legal-tab ${activeTab === 'history' ? 'active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                📜 History
                            </button>
                            <button
                                className={`legal-tab ${activeTab === 'statistics' ? 'active' : ''}`}
                                onClick={() => setActiveTab('statistics')}
                            >
                                📊 Statistics
                            </button>
                            <button
                                className={`legal-tab ${activeTab === 'acceptances' ? 'active' : ''}`}
                                onClick={() => setActiveTab('acceptances')}
                            >
                                ✅ Acceptances
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="legal-tab-content">
                            {activeTab === 'metadata' && (
                                <MetadataForm
                                    document={selectedDocument}
                                    onSave={handleSaveMetadata}
                                    isLoading={isLoadingDocument}
                                />
                            )}

                            {activeTab === 'content' && (
                                <ContentEditor
                                    document={selectedDocument}
                                    onSave={handleSaveContent}
                                    isDraft={isDraft}
                                    isLoading={isLoadingDocument}
                                />
                            )}

                            {activeTab === 'history' && (
                                <VersionHistory
                                    documentId={selectedId}
                                    versions={versions}
                                    onCompare={handleCompare}
                                    onViewVersion={handleViewVersion}
                                    onDeleteDraft={handleDeleteDraft}
                                    onPublish={handlePublish}
                                    onRefresh={() => loadDocument(selectedId)}
                                    isLoading={isLoadingDocument}
                                />
                            )}

                            {activeTab === 'statistics' && (
                                <LegalStatistics documentId={selectedId} />
                            )}

                            {activeTab === 'acceptances' && (
                                <AcceptanceList
                                    documentId={selectedId}
                                    onViewDetails={(id) => {
                                        setSelectedAcceptanceId(id);
                                        setShowAcceptanceDetails(true);
                                    }}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <EmptyState
                        title="No Document Selected"
                        description="Select a document from the sidebar or create a new one."
                        actionLabel="Create Document"
                        onAction={handleCreateDocument}
                        icon="📄"
                    />
                )}
            </div>

            {/* Modals */}
            <CreateDocumentModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreated={handleDocumentCreated}
            />

            <VersionCompareModal
                isOpen={showCompareModal}
                onClose={() => {
                    setShowCompareModal(false);
                    setCompareData(null);
                }}
                data={compareData}
            />

            <ViewVersionModal
                isOpen={showViewVersionModal}
                onClose={() => {
                    setShowViewVersionModal(false);
                    setViewVersionData(null);
                }}
                version={viewVersionData}
            />

            <ConfirmDialog
                isOpen={showConfirmDialog}
                onConfirm={handleConfirm}
                onCancel={handleCancelConfirm}
                title={confirmAction?.title}
                message={confirmAction?.message}
                confirmLabel={confirmAction?.type === 'deleteDraft' ? 'Delete' : 'Confirm'}
                isDanger={confirmAction?.type === 'deleteDraft' || confirmAction?.type === 'archive'}
            />

            <AcceptanceDetailsModal
                isOpen={showAcceptanceDetails}
                onClose={() => {
                    setShowAcceptanceDetails(false);
                    setSelectedAcceptanceId(null);
                }}
                acceptanceId={selectedAcceptanceId}
            />

            <PendingUsers
                isOpen={showPendingUsers}
                onClose={() => {
                    setShowPendingUsers(false);
                    setPendingUsersData(null);
                }}
                documentId={pendingUsersData?.documentId}
            />

            <AcceptedUsers
                isOpen={showAcceptedUsers}
                onClose={() => {
                    setShowAcceptedUsers(false);
                    setAcceptedUsersData(null);
                }}
                documentId={acceptedUsersData?.documentId}
            />
        </div>
    );
};

export default LegalManagement;