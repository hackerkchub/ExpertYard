import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getExpertProfileApi,
  getExpertsProfileListApi,
    getExpertBySlugApi,
} from "../../../shared/api/expertapi/profile.api";
import { getExpertPriceByIdApi } from "../../../shared/api/expertapi/price.api";

const ExpertContext = createContext(null);
export const usePublicExpert = () => useContext(ExpertContext);

const DEFAULT_STATE = {
  expertId: null,
  profileId: null,
  profile: null,
  name: "",
  email: "",
  phone: "",
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
  weakness: "",
};
export const PublicExpertProvider = ({ children }) => {
  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);

  const [expertData, setExpertData] = useState(DEFAULT_STATE);
  const [profileLoading, setProfileLoading] = useState(false);

  const [expertPrice, setExpertPrice] = useState(DEFAULT_PRICE);
  const [priceLoading, setPriceLoading] = useState(false);

  /* ================= ALL EXPERTS ================= */
  useEffect(() => {
    const loadExperts = async () => {
      try {
        setExpertsLoading(true);

        const res = await getExpertsProfileListApi();

        // ✅ FIX: backend returns { success, data }
        const raw = res?.data || [];

        const mapped = raw.map((p) => ({
          id: p.expert_id,
          profileId: p.id,
          name: p.name || p.expert_name,
          position: p.position,
          profile_photo: p.profile_photo,
         chat: p.chat?.per_minute || 0,
call: p.call?.per_minute || 0,
session: p.session || null,
pricing_modes: p.pricing_modes || [],
          subcategory_id: p.subcategory_id,
        }));

        setExperts(mapped);
      } catch (err) {
        console.error("LOAD EXPERTS ERROR:", err);
        setExperts([]);
      } finally {
        setExpertsLoading(false);
      }
    };

    loadExperts();
  }, []);

  /* ================= PROFILE ================= */
  const fetchProfile = useCallback(async (slug) => {
    if (!slug) return;

    try {
      setProfileLoading(true);

      const res = await getExpertBySlugApi(slug);

      // ✅ backend already returns full URL
     const data = res?.data?.data;

      if (!data) return;

      setExpertData({
        expertId: data.expert_id,
        profileId: data.id,
        profile: data,
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        profile_photo: data.profile_photo,
      });
    } catch (err) {
      console.error("PROFILE ERROR:", err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  /* ================= PRICE ================= */
 const fetchPrice = useCallback(async (expertId) => {
  if (!expertId) return;

  try {
    setPriceLoading(true);

    const res = await getExpertPriceByIdApi(expertId);

    // 🔥 HANDLE NEW BACKEND FORMAT
    const priceData = res?.data?.data || res?.data || res;

    console.log("PUBLIC PRICE:", priceData);

    if (!priceData || !priceData.pricing_modes) {
      setExpertPrice(DEFAULT_PRICE);
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
      weakness: priceData.weakness || "",
    });

  } catch (err) {
    console.error("PRICE ERROR:", err);
    setExpertPrice(DEFAULT_PRICE);
  } finally {
    setPriceLoading(false);
  }
}, []);

  /* ================= AUTO PRICE LOAD ================= */
  useEffect(() => {
    if (expertData.expertId) {
      fetchPrice(expertData.expertId);
    }
  }, [expertData.expertId, fetchPrice]);

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
        refreshProfile,
        refreshPrice,
        updateExpertData: () => {},
        logoutExpert: () => {},
      }}
    >
      {children}
    </ExpertContext.Provider>
  );
};