import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getExpertProfileApi,
  getExpertsProfileListApi,
    getExpertBySlugApi,
} from "../../../shared/api/expertapi/profile.api";
import { getExpertPriceByIdApi } from "../../../shared/api/expertapi/price.api";
import useNetworkReconnect from "../../../shared/hooks/useNetworkReconnect";
import { normalizeExpertAccess } from "../../../shared/utils/expertAccess";

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
  expertId: null,
  pricing_modes: [],
  call: 0,
  video_call: 0,
  video_call_per_minute: 0,
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
  const loadExperts = useCallback(async () => {
      try {
        setExpertsLoading(true);

        const res = await getExpertsProfileListApi();

        // ✅ FIX: backend returns { success, data }
        const raw = res?.data || [];

        const mapped = raw.map((p) => normalizeExpertAccess({
          id: p.expert_id,
          profileId: p.id,
          slug: p.expert_slug,
          name: p.name || p.expert_name,
          position: p.position,
          profile_photo: p.profile_photo,
         chat: p.chat?.per_minute || 0,
         video_call: p.video_call?.per_minute || p.video_call_per_minute || 0,
         video_call_per_minute: p.video_call?.per_minute || p.video_call_per_minute || 0,
         call: p.call?.per_minute || 0,
         session: p.session || null,
         pricing_modes: p.pricing_modes || [],
          subcategory_id: p.subcategory_id,
          category_id: p.category_id,
          category_name: p.category_name,
          subcategory_name: p.subcategory_name,
          expertise: p.expertise || [],
          primary_expertise: p.primary_expertise || null,
          isPaidExpert: p.isPaidExpert,
          is_subscribed: p.is_subscribed,
          isSubscribed: p.isSubscribed,
          subscription_status: p.subscription_status,
          subscriptionStatus: p.subscriptionStatus,
          access_level: p.access_level,
          accessLevel: p.accessLevel,
          can_chat: p.can_chat,
          canChat: p.canChat,
          can_call: p.can_call,
          canCall: p.canCall,
          can_view_contact: p.can_view_contact,
          canViewContact: p.canViewContact,
          chat_enabled: p.chat_enabled,
          chatEnabled: p.chatEnabled,
          call_enabled: p.call_enabled,
          callEnabled: p.callEnabled,
          show_chat_button: p.show_chat_button,
          showChatButton: p.showChatButton,
          show_call_button: p.show_call_button,
          showCallButton: p.showCallButton,
          show_in_user_module: p.show_in_user_module,
          showInUserModule: p.showInUserModule,
          show_on_listing: p.show_on_listing,
          showOnListing: p.showOnListing,
          public_profile_enabled: p.public_profile_enabled,
          publicProfileEnabled: p.publicProfileEnabled,
          plan_expires_at: p.plan_expires_at,
          planExpiresAt: p.planExpiresAt,
        }));

        setExperts(mapped);
      } catch (err) {
        console.error("LOAD EXPERTS ERROR:", err);
        setExperts([]);
      } finally {
        setExpertsLoading(false);
      }
  }, []);

  useEffect(() => {
    loadExperts();
  }, [loadExperts]);

  useNetworkReconnect(loadExperts);

  /* ================= PROFILE ================= */
  const fetchProfile = useCallback(async (slug, force = false) => {
    if (!slug) return;
    if (!force && (expertData.profile?.expert_slug === slug || expertData.profile?.slug === slug)) {
      return;
    }

    try {
      setProfileLoading(true);

      const res = await getExpertBySlugApi(slug);

      // ✅ backend already returns full URL
     const data = res?.data?.data;

      if (!data) return;

      const normalizedData = normalizeExpertAccess(data);

      setExpertData({
        expertId: data.expert_id,
        profileId: data.id,
        profile: normalizedData,
        effective_access: normalizedData.effective_access,
        can_chat: normalizedData.can_chat,
        canChat: normalizedData.canChat,
        can_call: normalizedData.can_call,
        canCall: normalizedData.canCall,
        show_chat_button: normalizedData.show_chat_button,
        showChatButton: normalizedData.showChatButton,
        show_call_button: normalizedData.show_call_button,
        showCallButton: normalizedData.showCallButton,
        show_in_user_module: normalizedData.show_in_user_module,
        showInUserModule: normalizedData.showInUserModule,
        show_on_listing: normalizedData.show_on_listing,
        showOnListing: normalizedData.showOnListing,
        public_profile_enabled: normalizedData.public_profile_enabled,
        publicProfileEnabled: normalizedData.publicProfileEnabled,
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        profile_photo: data.profile_photo,
        expertise: normalizedData.expertise || data.expertise || [],
        primary_expertise: normalizedData.primary_expertise || data.primary_expertise || null,
      });
    } catch (err) {
      console.error("PROFILE ERROR:", err);
    } finally {
      setProfileLoading(false);
    }
  }, [expertData.profile]);

  /* ================= PRICE ================= */
 const fetchPrice = useCallback(async (expertId, force = false) => {
  if (!expertId) return;
  if (!force && expertPrice.expertId === expertId) {
    return;
  }

  try {
    setPriceLoading(true);

    const res = await getExpertPriceByIdApi(expertId);

    // 🔥 HANDLE NEW BACKEND FORMAT
    const priceData = res?.data?.data || res?.data || res;

    console.log("PUBLIC PRICE:", priceData);

    if (!priceData || !priceData.pricing_modes) {
      setExpertPrice({ ...DEFAULT_PRICE, expertId });
      return;
    }

    setExpertPrice({
      expertId,
      pricing_modes: priceData.pricing_modes || [],
      call: priceData.call?.per_minute || 0,
      video_call: priceData.video_call?.per_minute || priceData.video_call_per_minute || 0,
      video_call_per_minute: priceData.video_call?.per_minute || priceData.video_call_per_minute || 0,
      chat: priceData.chat?.per_minute || 0,
      session: priceData.session || null,
      reason_for_price: priceData.reason_for_price || "",
      handle_customer: priceData.handle_customer || "",
      strength: priceData.strength || "",
      weakness: priceData.weakness || "",
    });

  } catch (err) {
    console.error("PRICE ERROR:", err);
    setExpertPrice({ ...DEFAULT_PRICE, expertId });
  } finally {
    setPriceLoading(false);
  }
}, [expertPrice.expertId]);

  /* ================= AUTO PRICE LOAD ================= */
  useEffect(() => {
    if (expertData.expertId) {
      fetchPrice(expertData.expertId);
    }
  }, [expertData.expertId, fetchPrice]);

  const refreshProfile = async () => {
    if (expertData.expertId) {
      const slugVal = expertData.profile?.expert_slug || expertData.profile?.slug || expertData.expertId;
      await fetchProfile(slugVal, true);
    }
  };

  const refreshPrice = async () => {
    if (expertData.expertId) {
      await fetchPrice(expertData.expertId, true);
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
