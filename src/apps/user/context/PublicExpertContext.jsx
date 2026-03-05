import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getExpertProfileApi,
  getExpertsProfileListApi,
} from "../../../shared/api/expertapi/profile.api";
import { getExpertPriceById } from "../../../shared/api/expertapi/price.api";

const ExpertContext = createContext(null);
export const usePublicExpert = () => useContext(ExpertContext); // ⭐ SAME HOOK NAME

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
  const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "";

  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);

  const [expertData, setExpertData] = useState(DEFAULT_STATE);
  const [profileLoading, setProfileLoading] = useState(false);

  const [expertPrice, setExpertPrice] = useState(DEFAULT_PRICE);
  const [priceLoading, setPriceLoading] = useState(false);

  /* ALL EXPERTS */
  useEffect(() => {
    const loadExperts = async () => {
      try {
        setExpertsLoading(true);
        const res = await getExpertsProfileListApi();

        const raw = res?.data?.data || [];

        const mapped = raw.map((p) => ({
          id: p.expert_id,
          profileId: p.id,
          name: p.name,
          position: p.position,
          profile_photo: p.profile_photo,
          chat_per_minute: Number(p.chat_per_minute),
          call_per_minute: Number(p.call_per_minute),
        }));

        setExperts(mapped);
      } catch {
        setExperts([]);
      } finally {
        setExpertsLoading(false);
      }
    };

    loadExperts();
  }, []);

  /* PROFILE */
  const fetchProfile = useCallback(
    async (expertId) => {
      if (!expertId) return;

      try {
        setProfileLoading(true);

        const res = await getExpertProfileApi(expertId);
        const data = res?.data?.data;

        if (!data) return;

        let photoUrl = data.profile_photo;

        if (photoUrl && !photoUrl.startsWith("http")) {
          photoUrl = `${BASE_URL}${photoUrl}`;
        }

        setExpertData({
          expertId: data.expert_id,
          profileId: data.id,
          profile: data,
          name: data.name,
          email: data.email,
          phone: data.phone,
          position: data.position,
          profile_photo: photoUrl,
        });
      } finally {
        setProfileLoading(false);
      }
    },
    [BASE_URL]
  );

  /* PRICE */
  const fetchPrice = useCallback(async (expertId) => {
    if (!expertId) return;

    try {
      setPriceLoading(true);

      const res = await getExpertPriceById(expertId);
      const price = res?.data?.data;

      if (!price) {
        setExpertPrice(DEFAULT_PRICE);
        return;
      }

      setExpertPrice({
        id: price.id,
        call_per_minute: Number(price.call_per_minute),
        chat_per_minute: Number(price.chat_per_minute),
        reason_for_price: price.reason_for_price || "",
        handle_customer: price.handle_customer || "",
        strength: price.strength || "",
        weakness: price.weakness || "",
      });
    } catch (err) {
      if (err.response?.status === 404) {
        setExpertPrice(DEFAULT_PRICE);
      }
    } finally {
      setPriceLoading(false);
    }
  }, []);

  /* ⭐ AUTO TRIGGER LIKE EXPERT CONTEXT */
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
        updateExpertData: () => {}, // ⭐ dummy for compatibility
        logoutExpert: () => {},     // ⭐ dummy for compatibility
      }}
    >
      {children}
    </ExpertContext.Provider>
  );
};