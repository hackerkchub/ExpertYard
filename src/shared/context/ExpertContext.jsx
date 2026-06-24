import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getExpertProfileApi,
  getExpertsProfileListApi,
} from "../api/expertapi/profile.api";
import { getMyPriceApi } from "../api/expertapi/price.api";
import expertApi from "../api/expertapi/axiosInstance";

const ExpertContext = createContext(null);

export const useExpert = () => useContext(ExpertContext);

const STORAGE_KEY = "expert_session";
const TOKEN_KEY = "expert_token";
const DEFAULT_AVATAR = "https://i.pravatar.cc/40?img=12";

const truthyFlag = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value || "").toLowerCase() === "true";

const clearApiCache = async () => {
  if ("caches" in window) {
    try {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name.includes("api-cache")) {
            console.log(`Clearing cache: ${name}`);
            return caches.delete(name);
          }

          return Promise.resolve();
        })
      );
      console.log("API cache cleared successfully");
    } catch (err) {
      console.error("Cache clear error:", err);
    }
  }
};

const DEFAULT_STATE = {
  expertId: null,
  name: "",
  email: "",
  phone: "",
  categoryId: null,
  subCategoryIds: [],
  profileId: null,
  profile: null,
  position: "",
  profile_photo: "",
  is_subscribed: 0,
  subscription_status: "free",
  access_level: "free_limited",
  planId: null,
  planName: null,
  planStartedAt: null,
  planExpiresAt: null,
  can_view_contact: false,
  can_chat: false,
  can_call: false,
  can_create_service: false,
  can_earn: false,
  can_withdraw: false,
  profile_edit_enabled: false,
  can_edit_profile: false,
  priceId: null,
};

const DEFAULT_PRICE = {
  pricing_modes: [],
  call: 0,
  chat: 0,
  session: null,
  reason_for_price: "",
  handle_customer: "",
  strength: "",
  weakness: "",
};

export const ExpertProvider = ({ children }) => {
  const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

  const isInitialized = useRef(false);
  const isLoggingOut = useRef(false);

  const [expertData, setExpertData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const [expertPrice, setExpertPrice] = useState(DEFAULT_PRICE);
  const [profileLoading, setProfileLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [prevExpertId, setPrevExpertId] = useState(null);

  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);

  useEffect(() => {
    const loadExperts = async () => {
      try {
        setExpertsLoading(true);

        const res = await getExpertsProfileListApi();
        const raw = Array.isArray(res?.data) ? res.data : [];
        const mapped = raw.map((profile) => ({
          id: profile.expert_id,
          profileId: profile.id,
          name: profile.name || "Expert",
          position: profile.position || "",
          profile_photo: profile.profile_photo || DEFAULT_AVATAR,
        }));

        setExperts(mapped);
      } catch (err) {
        console.error("Failed to load experts:", err);
        setExperts([]);
      } finally {
        setExpertsLoading(false);
      }
    };

    loadExperts();
  }, []);

  const updateExpertData = useCallback((data) => {
    setExpertData((prev) => {
      const newState = { ...prev, ...data };
      const hasChanged =
        prev.expertId !== newState.expertId ||
        prev.name !== newState.name ||
        prev.profile_photo !== newState.profile_photo ||
        prev.priceId !== newState.priceId ||
        prev.subscription_status !== newState.subscription_status ||
        prev.access_level !== newState.access_level ||
        prev.can_view_contact !== newState.can_view_contact ||
        prev.can_chat !== newState.can_chat ||
        prev.can_call !== newState.can_call ||
        prev.can_create_service !== newState.can_create_service ||
        prev.can_earn !== newState.can_earn ||
        prev.can_withdraw !== newState.can_withdraw ||
        prev.profile_edit_enabled !== newState.profile_edit_enabled ||
        prev.can_edit_profile !== newState.can_edit_profile;

      if (hasChanged) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }

      return newState;
    });
  }, []);

  const logoutExpert = useCallback(async () => {
    if (isLoggingOut.current) {
      console.log("Logout already in progress, skipping");
      return;
    }

    isLoggingOut.current = true;

    try {
      const fcmToken = localStorage.getItem("expertFcmToken");
      if (fcmToken) {
        await expertApi.delete("/fcm/expert/delete-token", {
          data: { token: fcmToken },
        }).catch(() => {});
      }

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("expertFcmToken");
      localStorage.removeItem("expertFcmToken:owner");
      localStorage.removeItem("active_chat_session");
      window.dispatchEvent(new Event("active_chat_session_changed"));

      await clearApiCache();

      setExpertData(DEFAULT_STATE);
      setExpertPrice(DEFAULT_PRICE);
      setExperts([]);

      isInitialized.current = false;
      setPrevExpertId(null);
      setRefreshKey((prev) => prev + 1);
    } finally {
      isLoggingOut.current = false;
    }
  }, []);

  const fetchProfile = useCallback(
    async (expertId) => {
      if (!expertId) return;

      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        console.warn("No token, skipping profile API");
        return;
      }

      try {
        setProfileLoading(true);

        const res = await getExpertProfileApi(expertId);
        const profileData = res?.data?.data;

        if (!profileData?.id) return;

        const photoUrl = profileData.profile_photo
          ? profileData.profile_photo.startsWith("http")
            ? profileData.profile_photo
            : `${BASE_URL}${profileData.profile_photo}`
          : DEFAULT_AVATAR;

        let accessProfile = {};
        try {
          const meRes = await expertApi.get("/expert/me", { skipLoader: true });
          accessProfile = meRes?.data?.data || {};
        } catch {
          accessProfile = {};
        }

        updateExpertData({
          expertId: profileData.expert_id,
          profileId: profileData.id,
          profile: profileData,
          name: profileData.name,
          profile_photo: photoUrl,
          subscription_status: accessProfile.access?.subscription_status || accessProfile.subscription_status || "free",
          access_level: accessProfile.access?.access_level || accessProfile.access_level || "free_limited",
          planId: accessProfile.access?.plan_id || accessProfile.current_plan_id || null,
          planName: accessProfile.access?.plan_name || accessProfile.plan_name || null,
          planStartedAt: accessProfile.access?.plan_started_at || accessProfile.plan_started_at || null,
          planExpiresAt: accessProfile.access?.plan_expires_at || accessProfile.plan_expires_at || null,
          can_view_contact: truthyFlag(accessProfile.access?.can_view_contact ?? accessProfile.can_view_contact),
          can_chat: truthyFlag(accessProfile.access?.can_chat ?? accessProfile.can_chat),
          can_call: truthyFlag(accessProfile.access?.can_call ?? accessProfile.can_call),
          can_create_service: truthyFlag(accessProfile.access?.can_create_service ?? accessProfile.can_create_service),
          can_earn: truthyFlag(accessProfile.access?.can_earn ?? accessProfile.can_earn),
          can_withdraw: truthyFlag(accessProfile.access?.can_withdraw ?? accessProfile.can_withdraw),
          profile_edit_enabled: truthyFlag(accessProfile.access?.profile_edit_enabled ?? accessProfile.access?.can_edit_profile ?? accessProfile.profile_edit_enabled ?? accessProfile.can_edit_profile),
          can_edit_profile: truthyFlag(accessProfile.access?.can_edit_profile ?? accessProfile.access?.profile_edit_enabled ?? accessProfile.can_edit_profile ?? accessProfile.profile_edit_enabled),
        });
      } catch (err) {
        console.error("Profile fetch error:", err);

        if (err.response?.status === 401) {
          await logoutExpert();
        }
      } finally {
        setProfileLoading(false);
      }
    },
    [BASE_URL, logoutExpert, updateExpertData]
  );

  const fetchPrice = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      console.warn("No token, skipping price API");
      return;
    }

    try {
      setPriceLoading(true);

      const res = await getMyPriceApi();
      const priceData = res?.data?.data || res?.data || res;

      if (!priceData?.pricing_modes) {
        updateExpertData({ priceId: null });
        setExpertPrice(DEFAULT_PRICE);
        return;
      }

      updateExpertData({ priceId: 1 });
      setExpertPrice({
        pricing_modes: priceData.pricing_modes || [],
        call: priceData.call?.per_minute || 0,
        chat: priceData.chat?.per_minute || 0,
        session: priceData.session || null,
        reason_for_price: priceData.reason_for_price || "",
        handle_customer: priceData.handle_customer || "",
        strength: priceData.strength || "",
        weakness: priceData.weakness || "",
      });
    } catch (err) {
      console.error("Price fetch error:", err);

      if (err.response?.status === 401) {
        await logoutExpert();
        return;
      }

      setExpertPrice(DEFAULT_PRICE);
    } finally {
      setPriceLoading(false);
    }
  }, [logoutExpert, updateExpertData]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!expertData.expertId || !token) {
      isInitialized.current = false;
      return;
    }

    if (isInitialized.current) return;
    isInitialized.current = true;

    (async () => {
      await fetchProfile(expertData.expertId);

      if (!localStorage.getItem(TOKEN_KEY)) return;

      await fetchPrice();
    })().catch((err) => {
      console.error("Auto load failed:", err);
    });
  }, [expertData.expertId, fetchPrice, fetchProfile]);

  useEffect(() => {
    const currentId = expertData?.expertId;

    if (!currentId) return;

    if (prevExpertId && prevExpertId !== currentId) {
      (async () => {
        await clearApiCache();
        isInitialized.current = false;
        setRefreshKey((prev) => prev + 1);
      })();
    }

    setPrevExpertId(currentId);
  }, [expertData.expertId, prevExpertId]);

  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_STATE;

      const oldId = expertData.expertId;
      const newId = parsed.expertId;

      setExpertData(parsed);

      if (oldId && newId && oldId !== newId) {
        isInitialized.current = false;
        setRefreshKey((prev) => prev + 1);
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [expertData.expertId]);

  const refreshExpertData = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!expertData.expertId || !token) {
      console.warn("Cannot refresh: No expert ID or token");
      return;
    }

    isInitialized.current = false;

    await fetchProfile(expertData.expertId);

    if (!localStorage.getItem(TOKEN_KEY)) return;

    await fetchPrice();

    isInitialized.current = true;
    setRefreshKey((prev) => prev + 1);
  }, [expertData.expertId, fetchPrice, fetchProfile]);

  const value = useMemo(
    () => ({
      experts,
      expertsLoading,
      expertData,
      expertPrice,
      profileLoading,
      priceLoading,
      refreshKey,
      fetchProfile,
      fetchPrice,
      updateExpertData,
      logoutExpert,
      refreshExpertData,
    }),
    [
      experts,
      expertsLoading,
      expertData,
      expertPrice,
      profileLoading,
      priceLoading,
      refreshKey,
      fetchProfile,
      fetchPrice,
      updateExpertData,
      logoutExpert,
      refreshExpertData,
    ]
  );

  return <ExpertContext.Provider value={value}>{children}</ExpertContext.Provider>;
};
