import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getAllExperts } from "../services/expertService";
import { getExpertProfileApi } from "../api/expertapi/profile.api";
import { getExpertPriceById } from "../api/expertapi/price.api";

const ExpertContext = createContext(null);
export const useExpert = () => useContext(ExpertContext);

const STORAGE_KEY = "expert_session";
const DEFAULT_AVATAR = "https://i.pravatar.cc/40?img=12";

/* -------------------------------
   DEFAULT SHAPES (SAFE)
-------------------------------- */
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
  id: null,
  call_per_minute: 0,
  chat_per_minute: 0,
  reason_for_price: "",
  handle_customer: "",
  strength: "",
  weakness: "",
};

export const ExpertProvider = ({ children }) => {
  const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

  /* ----------------------------------
     ALL EXPERTS
  ---------------------------------- */
  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);

  /* ----------------------------------
     LOGGED-IN EXPERT
  ---------------------------------- */
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

  /* ----------------------------------
     PROFILE
  ---------------------------------- */
  const [profileLoading, setProfileLoading] = useState(false);

  /* ----------------------------------
     PRICE
  ---------------------------------- */
  const [expertPrice, setExpertPrice] = useState(DEFAULT_PRICE);
  const [priceLoading, setPriceLoading] = useState(false);

  /* ----------------------------------
     LOAD ALL EXPERTS
  ---------------------------------- */
  useEffect(() => {
    const loadExperts = async () => {
      try {
        setExpertsLoading(true);
        const data = await getAllExperts();
        setExperts(data || []);
      } catch (err) {
        console.error("Experts load failed", err);
      } finally {
        setExpertsLoading(false);
      }
    };
    loadExperts();
  }, []);

  /* ----------------------------------
     FETCH PROFILE
  ---------------------------------- */
  const fetchProfile = useCallback(async (expertId) => {
    if (!expertId) return;

    try {
      setProfileLoading(true);

      const res = await getExpertProfileApi(expertId);
      const profileData = res?.data?.data;
      if (!profileData) return;

      let photoUrl = DEFAULT_AVATAR;
      if (profileData.profile_photo) {
        photoUrl = profileData.profile_photo.startsWith("http")
          ? profileData.profile_photo
          : `${BASE_URL}${profileData.profile_photo}`;
      }

      updateExpertData({
        profileId: profileData.id,
        profile: profileData,
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        position: profileData.position || "",
        profile_photo: photoUrl,
      });
    } catch (err) {
      console.error("Profile load failed", err);
    } finally {
      setProfileLoading(false);
    }
  }, [BASE_URL]);

  /* ----------------------------------
     FETCH PRICE
  ---------------------------------- */
  const fetchPrice = useCallback(async (expertId) => {
    if (!expertId) return;

    try {
      setPriceLoading(true);

      const res = await getExpertPriceById(expertId);
      const priceData = res?.data?.data;
      if (!priceData) return;

      setExpertPrice({
        id: priceData.id,
        call_per_minute: Number(priceData.call_per_minute),
        chat_per_minute: Number(priceData.chat_per_minute),
        reason_for_price: priceData.reason_for_price || "",
        handle_customer: priceData.handle_customer || "",
        strength: priceData.strength || "",
        weakness: priceData.weakness || "",
      });
    } catch (err) {
      console.error("Price load failed", err);
    } finally {
      setPriceLoading(false);
    }
  }, []);

  /* ----------------------------------
     AUTO LOAD ON LOGIN
  ---------------------------------- */
  useEffect(() => {
    if (expertData.expertId) {
      fetchProfile(expertData.expertId);
      fetchPrice(expertData.expertId);
    }
  }, [expertData.expertId, fetchProfile, fetchPrice]);

  /* ----------------------------------
     UPDATE + PERSIST
  ---------------------------------- */
  const updateExpertData = (data) => {
    setExpertData((prev) => {
      const merged = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  /* ----------------------------------
     HELPERS (IMPORTANT)
  ---------------------------------- */
  const refreshProfile = async () => {
    if (expertData.expertId) {
      await fetchProfile(expertData.expertId);
    }
  };

  const refreshPrice = async () => {
    if (expertData.expertId) {
      await fetchPrice(expertData.expertId);
    }
  };

  const logoutExpert = () => {
    localStorage.removeItem(STORAGE_KEY);
    setExpertData(DEFAULT_STATE);
    setExpertPrice(DEFAULT_PRICE);
  };

  return (
    <ExpertContext.Provider
      value={{
        experts,
        expertsLoading,
        expertData,
        profileLoading,
        expertPrice,
        priceLoading,
          fetchProfile,
          fetchPrice,
        updateExpertData,
        refreshProfile,
        refreshPrice,
        logoutExpert,
      }}
    >
      {children}
    </ExpertContext.Provider>
  );
};
