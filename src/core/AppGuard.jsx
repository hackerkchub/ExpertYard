import { Navigate, useLocation } from "react-router-dom";
import AppIdentity, { APP_TYPES } from "../config/appIdentity";
import { useLegal } from "../shared/context/LegalContext";

// Routes that should bypass the legal lock
const BYPASS_ROUTES = [
    "/login",
    "/signup",
    "/forgot-password",
    "/privacy",
    "/terms",
    "/refund",
    "/cookie-policy",
    "/legal",
];

export default function AppGuard({ children }) {
    const { pathname } = useLocation();
    const { applicationLocked, legalInitialized } = useLegal();

    const path = pathname.toLowerCase();
    const appType = AppIdentity.getType();

    // Wait for legal initialization
    if (!legalInitialized) {
        return null;
    }

    // Check if current route should bypass legal lock
    const shouldBypass = BYPASS_ROUTES.some(route => path.startsWith(route));

    // If application is locked and route is not in bypass list, block navigation
    if (applicationLocked && !shouldBypass) {
        return null;
    }

    /* =====================================
            WEB
    ===================================== */

    if (appType === APP_TYPES.WEB) {
        return children;
    }

    /* =====================================
            USER APK
    ===================================== */

    if (appType === APP_TYPES.USER) {
        if (path.startsWith("/expert")) {
            return <Navigate to="/user" replace />;
        }

        if (path.startsWith("/admin")) {
            return <Navigate to="/user" replace />;
        }

        return children;
    }

    /* =====================================
            EXPERT APK
    ===================================== */

    if (appType === APP_TYPES.EXPERT) {
        if (path.startsWith("/user")) {
            return <Navigate to="/expert" replace />;
        }

        if (path.startsWith("/admin")) {
            return <Navigate to="/expert" replace />;
        }

        return children;
    }

    return children;
}