import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";

import {
  getExpertProfileApi,
  getExpertsProfileListApi,
} from "../api/expertapi/profile.api";

import { getMyPriceApi } from "../api/expertapi/price.api";

const ExpertContext = createContext(null);
export const useExpert = () => useContext(ExpertContext);

const STORAGE_KEY = "expert_session";
const TOKEN_KEY = "expert_token";
const DEFAULT_AVATAR = "https://i.pravatar.cc/40?img=12";

/* ================= CACHE CLEAR (SAME AS AUTH) ================= */

const clearApiCache = async () => {
  if ("caches" in window) {
    try {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name.includes("api-cache")) {
            console.log(`🗑️ Clearing cache: ${name}`);
            return caches.delete(name);
          }
          return Promise.resolve();
        })
      );
      console.log("✅ API cache cleared successfully");
    } catch (err) {
      console.error("❌ Cache clear error:", err);
    }
  }
};

/* ================= DEFAULT STATES ================= */

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

/* ================= PROVIDER ================= */

export const ExpertProvider = ({ children }) => {
  const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

  const isInitialized = useRef(false);
  const isLoggingOut = useRef(false); // ✅ PREVENT double logout

  const [expertData, setExpertData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...DEFAULT_STATE, ...JSON.parse(saved) }
        : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  const [expertPrice, setExpertPrice] = useState(DEFAULT_PRICE);

  const [profileLoading, setProfileLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const [prevExpertId, setPrevExpertId] = useState(null);

  /* ================= PUBLIC EXPERT LIST ================= */

  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);

  useEffect(() => {
    const loadExperts = async () => {
      try {
        setExpertsLoading(true);

        const res = await getExpertsProfileListApi();
        const raw = Array.isArray(res?.data) ? res.data : [];

        const mapped = raw.map((p) => ({
          id: p.expert_id,
          profileId: p.id,
          name: p.name || "Expert",
          position: p.position || "",
          profile_photo: p.profile_photo || DEFAULT_AVATAR,
        }));

        setExperts(mapped);
      } catch (err) {
        console.error("❌ Failed to load experts:", err);
        setExperts([]);
      } finally {
        setExpertsLoading(false);
      }
    };

    loadExperts();
  }, []);

  /* ================= UPDATE ================= */

  const updateExpertData = useCallback((data) => {
    setExpertData((prev) => {
      const newState = { ...prev, ...data };

      // ✅ PERFORMANCE: Only compare critical fields instead of deep compare
      const hasChanged = prev.expertId !== newState.expertId ||
                        prev.name !== newState.name ||
                        prev.profile_photo !== newState.profile_photo ||
                        prev.priceId !== newState.priceId;

      if (hasChanged) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      }

      return newState;
    });
  }, []);

  /* ================= LOGOUT ================= */

  const logoutExpert = useCallback(async () => {
    // ✅ PREVENT double logout
    if (isLoggingOut.current) {
      console.log("⚠️ Logout already in progress, skipping...");
      return;
    }
    
    isLoggingOut.current = true;

    try {
      console.log("🚪 Logging out expert...");
      
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);

      await clearApiCache();

      setExpertData(DEFAULT_STATE);
      setExpertPrice(DEFAULT_PRICE);
      setExperts([]); // ✅ Clear expert list to avoid stale data

      isInitialized.current = false;
      setPrevExpertId(null);

      setRefreshKey((prev) => prev + 1); // 🔥 NO RELOAD
      
      console.log("✅ Expert logged out successfully");
    } finally {
      // ✅ Safer: Always reset flag, even if error occurs
      isLoggingOut.current = false;
    }
  }, []);

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = useCallback(
    async (expertId) => {
      if (!expertId) return;

      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        console.warn("❌ No token, skipping profile API");
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

        updateExpertData({
          expertId: profileData.expert_id,
          profileId: profileData.id,
          profile: profileData,
          name: profileData.name,
          profile_photo: photoUrl,
        });
      } catch (err) {
        console.error("❌ Profile fetch error:", err);
        
        // ✅ Auto logout on 401
        if (err.response?.status === 401) {
          console.log("🚨 Token expired → logging out expert");
          await logoutExpert();
        }
      } finally {
        setProfileLoading(false);
      }
    },
    [BASE_URL, updateExpertData, logoutExpert]
  );

  /* ================= FETCH PRICE ================= */

  const fetchPrice = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      console.warn("❌ No token, skipping price API");
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
      console.error("❌ Price fetch error:", err);
      
      // ✅ Auto logout on 401
      if (err.response?.status === 401) {
        console.log("🚨 Token expired → logging out expert");
        await logoutExpert();
        return;
      }
      
      // Don't throw, just set default
      setExpertPrice(DEFAULT_PRICE);
    } finally {
      setPriceLoading(false);
    }
  }, [updateExpertData, logoutExpert]);

  /* ================= AUTO LOAD ================= */

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    // ✅ IMPROVED: Check both expertId AND token
    if (!expertData.expertId || !token) {
      isInitialized.current = false;
      return;
    }

    if (isInitialized.current) return;
    isInitialized.current = true;

    // ✅ FINAL FIX: Sequential calls with logout check
    (async () => {
      await fetchProfile(expertData.expertId);

      // ✅ Stop if logout happened during profile fetch
      if (!localStorage.getItem(TOKEN_KEY)) return;

      await fetchPrice();
    })().catch(err => {
      console.error("❌ Auto load failed:", err);
    });
  }, [expertData.expertId, fetchProfile, fetchPrice]);

  /* ================= EXPERT SWITCH DETECTION ================= */

  // ✅ FIXED: Removed prevExpertId from dependencies
  useEffect(() => {
    const currentId = expertData?.expertId;

    if (!currentId) return;

    if (prevExpertId && prevExpertId !== currentId) {
      console.log(`⚠️ Expert switched from ${prevExpertId} to ${currentId}`);
      
      (async () => {
        await clearApiCache();
        isInitialized.current = false; // 🔥 Reset initialization flag
        setRefreshKey((prev) => prev + 1); // 🔥 NO RELOAD
      })();
    }

    setPrevExpertId(currentId);
  }, [expertData.expertId]); // ✅ Only depends on expertData.expertId

  /* ================= SYNC ACROSS TABS ================= */

  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_STATE;

      const oldId = expertData.expertId;
      const newId = parsed.expertId;

      setExpertData(parsed);

      // If expert changed in another tab, trigger refresh
      if (oldId && newId && oldId !== newId) {
        console.log("⚠️ Expert changed in another tab - triggering refresh");
        isInitialized.current = false; // 🔥 Reset initialization flag
        setRefreshKey((prev) => prev + 1);
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [expertData.expertId]);

  /* ================= REFRESH EXPERT DATA ================= */
  
  const refreshExpertData = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!expertData.expertId || !token) {
      console.warn("⚠️ Cannot refresh: No expert ID or token");
      return;
    }
    
    console.log("🔄 Refreshing expert data...");
    isInitialized.current = false; // 🔥 Reset to allow re-initialization
    
    // ✅ FINAL FIX: Sequential calls with logout check
    await fetchProfile(expertData.expertId);

    // ✅ Stop if logout happened during profile fetch
    if (!localStorage.getItem(TOKEN_KEY)) return;

    await fetchPrice();
    
    isInitialized.current = true;
    setRefreshKey((prev) => prev + 1);
  }, [expertData.expertId, fetchProfile, fetchPrice]);

  /* ================= VALUE ================= */

  return (
    <ExpertContext.Provider
      value={{
        experts,
        expertsLoading,

        expertData,
        expertPrice,

        profileLoading,
        priceLoading,

        refreshKey, // 🔥 SAME AS AUTH

        fetchProfile,
        fetchPrice,
        updateExpertData,
        logoutExpert,
        refreshExpertData,
      }}
    >
      {children}
    </ExpertContext.Provider>
  );
};