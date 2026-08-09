import useLegalBasePath from "./useLegalBasePath";
import { useCallback } from "react";
import {
    getPendingLegalDocumentsApi,
    acceptBulkLegalDocumentApi,
} from "../api/legal.api";
export default function useLegalDocuments() {

    const basePath = useLegalBasePath();

    const loadPendingDocuments = useCallback(async () => {

        if (!basePath) return [];

        const res = await getPendingLegalDocumentsApi(basePath);

        return res.data || [];

    }, [basePath]);

    const acceptDocuments = useCallback(async (documents) => {

        if (!basePath) return;

       return await acceptBulkLegalDocumentApi(basePath, {
    acceptances: documents,
});

    }, [basePath]);

    return {
        loadPendingDocuments,
        acceptDocuments,
    };
}