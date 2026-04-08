// src/shared/context/ExpertContext.jsx (FINAL PRODUCTION READY)

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

import { getMyPriceApi } from "../api/expertapi/price.api"; // ✅ FIX: Correct import

const ExpertContext = createContext(null);
export const useExpert = () => useContext(ExpertContext);

const STORAGE_KEY = "expert_session";
const DEFAULT_AVATAR = "https://i.pravatar.cc/40?img=12";

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
};

const DEFAULT_PRICE = {
  pricing_modes: [],
  call: 0,
  chat: 0,
  session: null,
  reason_for_price: "",
  handle_customer: "",
  strength: "",
  weakness: ""
};

/* ================= PROVIDER ================= */

export const ExpertProvider = ({ children }) => {
  const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";
  const isInitialized = useRef(false);

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
          name: p.name || p.expert_name || "Expert",
          position: p.position || "",
          profile_photo: p.profile_photo || DEFAULT_AVATAR,
          category_id: p.category_id,
          subcategory_id: p.subcategory_id,
          chat_per_minute: Number(p.chat_per_minute) || null,
          call_per_minute: Number(p.call_per_minute) || null,
        }));

        setExperts(mapped);
      } catch (err) {
        console.error("Experts load failed", err);
        setExperts([]);
      } finally {
        setExpertsLoading(false);
      }
    };

    loadExperts();
  }, []);

  /* ================= LOGGED IN EXPERT ================= */

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

  /* ================= UPDATE EXPERT SESSION (OPTIMIZED) ================= */

 const updateExpertData = useCallback((data) => {
  setExpertData((prev) => {
    const newState = { ...prev, ...data };

    if (JSON.stringify(prev) !== JSON.stringify(newState)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    }

    return newState;
  });
}, []);
  /* ================= FETCH PROFILE (UPDATED WITH SAFETY) ================= */

  const fetchProfile = useCallback(
    async (expertId) => {
      if (!expertId) return;

      try {
        setProfileLoading(true);

        const res = await getExpertProfileApi(expertId);
        
       const profileData = res?.data?.data;

        // ✅ SAFETY FIX: Check if profile data exists and has ID
        if (!profileData || !profileData.id) {
          console.warn("Invalid profile data received");
          return;
        }

        let photoUrl = DEFAULT_AVATAR;

        if (profileData.profile_photo) {
          photoUrl = profileData.profile_photo.startsWith("http")
            ? profileData.profile_photo
            : `${BASE_URL}${profileData.profile_photo}`;
        }

        updateExpertData({
          expertId: profileData.expert_id || expertId,
          profileId: profileData.id,
          profile: profileData,
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          position: profileData.position || "",
          profile_photo: photoUrl,
        });

        // ✅ Load price data from profile if available
        if (
          profileData.call_per_minute !== undefined ||
          profileData.chat_per_minute !== undefined
        ) {
          setExpertPrice((prev) => ({
            ...prev,
            call_per_minute: Number(profileData.call_per_minute) || 0,
            chat_per_minute: Number(profileData.chat_per_minute) || 0,
            reason_for_price: profileData.reason_for_price || prev.reason_for_price,
            handle_customer: profileData.handle_customer || prev.handle_customer,
            strength: profileData.strength || prev.strength,
            weakness: profileData.weakness || prev.weakness,
          }));
        }
      } catch (err) {
        console.error("Profile load failed", err);
      } finally {
        setProfileLoading(false);
      }
    },
    [BASE_URL, updateExpertData]
  );

  /* ================= FETCH PRICE (CRITICAL FIX) ================= */

 const fetchPrice = useCallback(async () => {
  try {
    setPriceLoading(true);

    const res = await getMyPriceApi();

    // ✅ HANDLE BOTH CASES
    const priceData = res?.data?.data || res?.data || res;

    console.log("API RAW:", res);
    console.log("PARSED PRICE:", priceData);

    if (!priceData || !priceData.pricing_modes) {
      console.log("No price data found");
      return;
    }

    setExpertPrice({
      pricing_modes: priceData.pricing_modes || [],
      call: priceData.call?.per_minute || 0,
      chat: priceData.chat?.per_minute || 0,
      session: priceData.session || null,
      reason_for_price: priceData.reason_for_price || "",
      handle_customer: priceData.handle_customer || "",
      strength: priceData.strength || "",
      weakness: priceData.weakness || ""
    });

  } catch (err) {
    console.error("Price load failed", err);
  } finally {
    setPriceLoading(false);
  }
}, []);

  /* ================= AUTO LOAD AFTER LOGIN (OPTIMIZED) ================= */

 useEffect(() => {
  if (!expertData.expertId) {
    isInitialized.current = false; // 🔥 reset when no expert
    return;
  }

  if (isInitialized.current) return;

  isInitialized.current = true;

  const loadAllData = async () => {
    try {
      await Promise.all([
        fetchProfile(expertData.expertId),
        fetchPrice()
      ]);
    } catch (err) {
      console.error("Failed to load expert data", err);
    }
  };

  loadAllData();
}, [expertData.expertId, fetchProfile, fetchPrice]);

  /* ================= REFRESH FUNCTIONS ================= */

  const refreshProfile = useCallback(() => {
    if (expertData.expertId) fetchProfile(expertData.expertId);
  }, [expertData.expertId, fetchProfile]);

  const refreshPrice = useCallback(() => {
    fetchPrice();
  }, [fetchPrice]);

  const refreshAll = useCallback(() => {
    if (expertData.expertId) {
      Promise.all([
        fetchProfile(expertData.expertId),
        fetchPrice()
      ]);
    }
  }, [expertData.expertId, fetchProfile, fetchPrice]);

  /* ================= LOGOUT ================= */

  const logoutExpert = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("expert_token");
    
    setExpertData(DEFAULT_STATE);
    setExpertPrice(DEFAULT_PRICE);
    isInitialized.current = false; // Reset initialization flag
  }, []);

  /* ================= PROVIDER VALUE ================= */

  return (
    <ExpertContext.Provider
      value={{
        // Public experts list
        experts,
        expertsLoading,

        // Expert data
        expertData,
        expertPrice,

        // Loading states
        profileLoading,
        priceLoading,

        // Actions
        fetchProfile,
        fetchPrice,
        updateExpertData,
        refreshProfile,
        refreshPrice,
        refreshAll,
        logoutExpert,
      }}
    >
      {children}
    </ExpertContext.Provider>
  );
};