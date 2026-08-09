import adminApi from "./axiosInstance";

/* ===========================
   DOCUMENT MANAGEMENT
=========================== */

// Create
export const createLegalDocumentApi = async (payload) => {
    const { data } = await adminApi.post("/admin/legal", payload);
    return data;
};

// List
export const getLegalDocumentsApi = async (params = {}) => {
    const { data } = await adminApi.get("/admin/legal", { params });
    return data;
};

// Single
export const getLegalDocumentApi = async (id, version = null) => {
    const { data } = await adminApi.get(`/admin/legal/${id}`, {
        params: version ? { version } : {},
    });
    return data;
};

// Update Content
export const updateLegalContentApi = async (id, payload) => {
    const { data } = await adminApi.patch(
        `/admin/legal/${id}/content`,
        payload
    );
    return data;
};

// Update Meta
export const updateLegalMetaApi = async (id, payload) => {
    const { data } = await adminApi.patch(
        `/admin/legal/${id}/meta`,
        payload
    );
    return data;
};

// Publish
export const publishLegalDocumentApi = async (id) => {
    const { data } = await adminApi.post(
        `/admin/legal/${id}/publish`
    );
    return data;
};

// New Version
export const createNewVersionApi = async (id) => {
    const { data } = await adminApi.post(
        `/admin/legal/${id}/new-version`
    );
    return data;
};

// Delete Draft
export const deleteDraftVersionApi = async (id) => {
    const { data } = await adminApi.delete(
        `/admin/legal/${id}/draft`
    );
    return data;
};

// Archive
export const archiveLegalDocumentApi = async (id) => {
    const { data } = await adminApi.post(
        `/admin/legal/${id}/archive`
    );
    return data;
};

// History
export const getLegalHistoryApi = async (id) => {
    const { data } = await adminApi.get(
        `/admin/legal/${id}/history`
    );
    return data;
};

// Compare
export const compareLegalVersionsApi = async (id, v1, v2) => {
    const { data } = await adminApi.get(
        `/admin/legal/${id}/compare`,
        {
            params: { v1, v2 },
        }
    );
    return data;
};

/* ===========================
   REPORTING
=========================== */

export const getAcceptanceListApi = async (params = {}) => {
    const { data } = await adminApi.get(
        "/admin/legal/acceptances",
        { params }
    );
    return data;
};

export const getAcceptanceDetailsApi = async (id) => {
    const { data } = await adminApi.get(
        `/admin/legal/acceptance/${id}`
    );
    return data;
};

export const getUserLegalHistoryApi = async (userId) => {
    const { data } = await adminApi.get(
        `/admin/legal/user/${userId}/history`
    );
    return data;
};

export const getExpertLegalHistoryApi = async (expertId) => {
    const { data } = await adminApi.get(
        `/admin/legal/expert/${expertId}/history`
    );
    return data;
};

export const getLegalStatisticsApi = async () => {
    const { data } = await adminApi.get(
        "/admin/legal/statistics"
    );
    return data;
};

export const getPendingUsersByDocumentApi = async (
    documentId,
    params = {}
) => {
    const { data } = await adminApi.get(
        `/admin/legal/document/${documentId}/pending-users`,
        { params }
    );
    return data;
};

export const getAcceptedUsersByDocumentApi = async (
    documentId,
    params = {}
) => {
    const { data } = await adminApi.get(
        `/admin/legal/document/${documentId}/accepted-users`,
        { params }
    );
    return data;
};