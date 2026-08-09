// hooks/useLegalBasePath.js

import { useAuth } from "../context/UserAuthContext";

export default function useLegalBasePath() {
    const { user } = useAuth();

    const expertLoggedIn = Boolean(localStorage.getItem("expert_token"));

    if (expertLoggedIn) {
        return "/expert/legal";
    }

    if (user) {
        return "/user/legal";
    }

    return null;
}