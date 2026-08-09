import api from "./axiosInstance";

/* =========================================
   LEGAL DOCUMENTS (USER / EXPERT)
========================================= */

/**
 * basePath:
 * "/user/legal"
 * "/expert/legal"
 */

// Pending Documents
export const getPendingLegalDocumentsApi = async (basePath) => {
    console.log("basePath:", basePath);
    const { data } = await api.get(`${basePath}/pending`);
    return data;
};

// Accept Single
export const acceptLegalDocumentApi = async (basePath, payload) => {
    const { data } = await api.post(`${basePath}/accept`, payload);
    return data;
};

// Accept Bulk
export const acceptBulkLegalDocumentApi = async (basePath, payload) => {
    const { data } = await api.post(`${basePath}/accept-bulk`, payload);
    return data;
};

// My Acceptances
export const getMyAcceptancesApi = async (basePath) => {
    const { data } = await api.get(`${basePath}/my-acceptances`);
    return data;
};

// Check Acceptance
export const checkAcceptanceApi = async (basePath, versionId) => {
    const { data } = await api.get(`${basePath}/check/${versionId}`);
    return data;
};

// Current Documents
export const getCurrentLegalDocumentsApi = async (basePath) => {
    const { data } = await api.get(`${basePath}/current`);
    return data;
};

// Document Metadata
export const getLegalDocumentMetadataApi = async (
    basePath,
    slug,
    config = {}
) => {
    const { data } = await api.get(
        `${basePath}/document/${slug}`,
        config
    );

    return data;
};

// Document Content
export const getLegalDocumentContentApi = async (
    basePath,
    slug,
    config = {}
) => {
    const { data } = await api.get(
        `${basePath}/document/${slug}/content`,
        config
    );

    return data;
};