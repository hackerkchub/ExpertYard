import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getExpertProfileApi,
  getExpertsProfileListApi,
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
  id: null,
  call_per_minute: 0,
  chat_per_minute: 0,
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
          chat_per_minute: Number(p.chat_per_minute || 0),
          call_per_minute: Number(p.call_per_minute || 0),
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
  const fetchProfile = useCallback(async (expertId) => {
    if (!expertId) return;

    try {
      setProfileLoading(true);

      const res = await getExpertProfileApi(expertId);

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

      // ✅ backend returns { success, data }
      const price = res?.data;

      if (!price) {
        setExpertPrice(DEFAULT_PRICE);
        return;
      }

      setExpertPrice({
        id: price.id,
        call_per_minute: Number(price.call_per_minute || 0),
        chat_per_minute: Number(price.chat_per_minute || 0),
        reason_for_price: price.reason_for_price || "",
        handle_customer: price.handle_customer || "",
        strength: price.strength || "",
        weakness: price.weakness || "",
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