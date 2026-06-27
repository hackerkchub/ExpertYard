import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import OtpModal from "../../components/OtpModal";
import AppModal from "../../../../shared/components/AppModal";
import FollowersContent from "../../../../shared/components/modal-contents/FollowersContent";
import ReviewsContent from "../../../../shared/components/modal-contents/ReviewsContent";
import {
  updateExpertProfileApi,
  savePriceApi,
  getExpertFollowersApi,
  getMyProfileApi
} from "../../../../shared/api/expertapi";
import {
  getReviewsByExpertApi,
} from "../../../../shared/api/expertapi/reviews.api";
import {
  addExperienceApi,
  getExpertExperienceApi,
  updateExperienceApi,
  deleteExperienceApi
} from "../../../../shared/api/expertapi/experience.api";
import {
  getPlansApi,
  createPlanApi,
  updatePlanApi,
  deletePlanApi
} from "../../../../shared/api/expertapi/subscription.api";
import { hotToast } from "../../../../shared/utils/lazyNotifications";

import {
  FiEdit,
  FiCheck,
  FiX,
  FiCamera,
  FiPhoneCall,
  FiMessageCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBookOpen,
  FiAward,
  FiFileText,
  FiStar,
  FiUsers,
  FiChevronRight,
  FiTrendingUp,
  FiShield,
  FiBriefcase,
  FiDownload,
  FiEye,
  FiFile,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiPackage,
  FiDollarSign,
  FiLock
} from "react-icons/fi";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { useCategory } from "../../../../shared/context/CategoryContext";
import {
  getCategoryNameById,
  getSubCategoryNameById
} from "../../../../shared/utils/categoryMapper";
import { reverseGeocode, autocompleteLocation } from "../../../../shared/api/userApi/locationDiscovery.api";
import { getCategoriesApi, getSubCategoriesApi, saveCategoryApi, saveSubCategoryApi } from "../../../../shared/api/expertapi/category.api";
import { prettyLabel } from "../../constants/categoryIcons";

import * as S from "./ExpertProfile.styles";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";
const isEnabledFlag = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value || "").toLowerCase() === "true";

// Utility function to check if URL is an image
const isImageUrl = (url) => {
  if (!url) return false;
  return url.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp|ico)$/i) !== null;
};

// Utility to check if string is a blob URL
const isBlobUrl = (url) =>
  typeof url === "string" && url.startsWith("blob:");

const notifySuccess = (message) => void hotToast("success", message);
const notifyError = (message) => void hotToast("error", message);

export default function ExpertProfile() {
  const {
    expertData,
    expertPrice,
    profileLoading,
    priceLoading,
    refreshExpertData,
  } = useExpert();

  const { categories, subCategories, loadSubCategories } = useCategory();

  const [edit, setEdit] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isContactVerified, setIsContactVerified] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState(null);

  // Session pricing state
  const [sessionPrice, setSessionPrice] = useState(0);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Subscription plans state
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [manualSearch, setManualSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingManually, setIsSearchingManually] = useState(false);
  
  // Category/Subcategory edit states
  const [selectedCatIds, setSelectedCatIds] = useState([]);
  const [selectedSubCats, setSelectedSubCats] = useState({}); // categoryId -> array of subcategoryIds
  const [subCatGroups, setSubCatGroups] = useState([]); // Array of { category_id, category_name, subcategories }
  const [primaryCatSub, setPrimaryCatSub] = useState({ category_id: null, subcategory_id: null });
  const [subCatLoading, setSubCatLoading] = useState(false);

  useEffect(() => {
    if (edit && expertData) {
      const catIds = expertData.categoryIds || [];
      setSelectedCatIds(catIds.map(Number));

      const subCats = {};
      (expertData.categorySelections || []).forEach((item) => {
        subCats[Number(item.category_id)] = (item.subcategory_ids || []).map(Number);
      });
      setSelectedSubCats(subCats);

      setPrimaryCatSub({
        category_id: Number(expertData.primaryCategoryId || expertData.categoryId || 0) || null,
        subcategory_id: Number(expertData.primarySubCategoryId || expertData.subCategoryIds?.[0] || 0) || null
      });
    }
  }, [edit, expertData]);

  useEffect(() => {
    if (!edit || !selectedCatIds.length) {
      setSubCatGroups([]);
      return;
    }

    const loadSubCategoriesForSelected = async () => {
      setSubCatLoading(true);
      try {
        const loaded = await Promise.all(
          selectedCatIds.map(async (categoryId) => {
            const res = await getSubCategoriesApi(categoryId);
            const list = Array.isArray(res?.data?.data) ? res.data.data : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            const categoryName = list[0]?.category_name || list[0]?.categoryName || `Category ${categoryId}`;
            return {
              category_id: categoryId,
              category_name: categoryName,
              subcategories: list,
            };
          })
        );
        setSubCatGroups(loaded);
      } catch (err) {
        console.error("Failed to load subcategories for edit", err);
      } finally {
        setSubCatLoading(false);
      }
    };

    loadSubCategoriesForSelected();
  }, [selectedCatIds, edit]);

  const handleToggleCategory = (catId) => {
    setSelectedCatIds((prev) => {
      const next = prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId];
      if (prev.includes(catId)) {
        setSelectedSubCats((sub) => {
          const copy = { ...sub };
          delete copy[catId];
          return copy;
        });
      }
      return next;
    });
  };

  const handleToggleSubcategory = (catId, subId) => {
    setSelectedSubCats((prev) => {
      const current = prev[catId] || [];
      const next = current.includes(subId) ? current.filter((id) => id !== subId) : [...current, subId];
      return { ...prev, [catId]: next };
    });

    setPrimaryCatSub((prev) => {
      if (!prev.category_id || !prev.subcategory_id) {
        return { category_id: catId, subcategory_id: subId };
      }
      return prev;
    });
  };

  const handleSetPrimary = (catId, subId) => {
    setPrimaryCatSub({ category_id: catId, subcategory_id: subId });
  };
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    name: "",
    duration_type: "monthly",
    price: "",
    minutes_limit: "",
    calls_limit: "",
    call_enabled: true,
    chat_enabled: true
  });
  const [planSubmitLoading, setPlanSubmitLoading] = useState(false);

  // Experience state
  const [experiences, setExperiences] = useState([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [totalExperience, setTotalExperience] = useState({ years: 0, months: 0 });
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    certificate: null,
    certificatePreview: null
  });
  const [experienceSubmitLoading, setExperienceSubmitLoading] = useState(false);

  // Followers state
  const [followersList, setFollowersList] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followersLoading, setFollowersLoading] = useState(false);

  // Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // followers / reviews modal
  const [modalConfig, setModalConfig] = useState({
    open: false,
    type: null
  });

  const expertId = expertData?.expertId || expertData?.id;
  const canEditProfile = isEnabledFlag(expertData?.profile_edit_enabled ?? expertData?.can_edit_profile);
  const profileEditBlockedMessage =
    "Profile editing is currently disabled for your account. Please upgrade your plan or contact admin.";
  
  const draftRef = useRef();

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    return () => {
      const docs = draftRef.current?.documents;
      if (!docs) return;

      Object.values(docs).forEach(v => {
        if (typeof v === "string" && v.startsWith("blob:")) {
          URL.revokeObjectURL(v);
        }
      });
    };
  }, []);

  // INIT DRAFT with session pricing
 useEffect(() => {
  if (!edit && expertData?.profile && expertPrice?.pricing_modes) {
    
    const session = expertPrice?.session;
console.log("PRICE:", expertPrice);
    setDraft({
      name: expertData.name || "",
      title: expertData.position || "",
      email: expertData.email || "",
      phone: expertData.phone || "",
      description: expertData.profile.description || "",
      education: expertData.profile.education || "",
      location: expertData.profile.location || "",
      latitude: expertData.profile.latitude || "",
longitude: expertData.profile.longitude || "",

city: expertData.profile.city || "",
state: expertData.profile.state || "",
country: expertData.profile.country || "",
pincode: expertData.profile.pincode || "",
      callRate: expertPrice?.call || 0,
      chatRate: expertPrice?.chat || 0,
      documents: {
        photo: expertData.profile_photo || DEFAULT_AVATAR,
        experience_certificate: expertData.profile.experience_certificate,
        marksheet: expertData.profile.marksheet,
        aadhar_card: expertData.profile.aadhar_card
      }
    });

    // ✅ IMPORTANT FIX
   setSessionPrice(Number(session?.price) || 0);
setSessionDuration(Number(session?.duration) || 0);
  }
}, [expertData, expertPrice, edit]);

  // LOAD SUBCATEGORIES
  useEffect(() => {
    if (expertData?.profile?.category_id) {
      loadSubCategories(expertData.profile.category_id);
    }
  }, [expertData?.profile?.category_id, loadSubCategories]);

  // LOAD EXPERIENCES
  const loadExperiences = useCallback(async () => {
    if (!expertId) return;

    setExperiencesLoading(true);
    try {
      const res = await getExpertExperienceApi(expertId);
      const data = res.data || res;
      
      setExperiences(data.experience || []);
      setTotalExperience({
        years: data.total_experience?.years || 0,
        months: data.total_experience?.months || 0
      });
    } catch (err) {
      console.error("Failed to load experiences", err);
      notifyError("Failed to load experience data");
      setExperiences([]);
      setTotalExperience({ years: 0, months: 0 });
    } finally {
      setExperiencesLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  useEffect(() => {
    getMyProfileApi()
  }, []);

  // LOAD SUBSCRIPTION PLANS
  const loadSubscriptionPlans = useCallback(async () => {
    if (!expertId) return;

    setPlansLoading(true);
    try {
      const res = await getPlansApi(expertId);
      const data = res.data || res;
      setSubscriptionPlans(data.data || data || []);
    } catch (err) {
      console.error("Failed to load subscription plans", err);
      setSubscriptionPlans([]);
    } finally {
      setPlansLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    loadSubscriptionPlans();
  }, [loadSubscriptionPlans]);

  // FOLLOWER COUNT
  useEffect(() => {
    if (!expertId) return;

    getExpertFollowersApi(expertId)
      .then(res => {
        const total = res.data.total_followers || 0;
        setFollowersCount(total);
      })
      .catch(err => {
        console.error("Followers count error", err);
        setFollowersCount(0);
      });
  }, [expertId]);

  // LOAD REVIEWS
  useEffect(() => {
    if (!expertId) return;

    setReviewsLoading(true);
    getReviewsByExpertApi(expertId)
      .then(res => {
        const data = res.data.data || {};
        const list = data.reviews || [];
        setReviewsList(list);
        setTotalReviews(data.total_reviews || list.length || 0);
        setAvgRating(Number(data.avg_rating || 0));
      })
      .catch(err => {
        console.error("Reviews load error", err);
        setReviewsList([]);
        setAvgRating(0);
        setTotalReviews(0);
      })
      .finally(() => setReviewsLoading(false));
  }, [expertId]);

  // RESOLVE CATEGORY NAMES
  const categoryName = getCategoryNameById(
    expertData?.profile?.category_id,
    categories
  );

  const subCategoryName = getSubCategoryNameById(
    expertData?.profile?.subcategory_id,
    subCategories
  );

  // PHOTO CHANGE
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isBlobUrl(draft.documents.photo)) {
      URL.revokeObjectURL(draft.documents.photo);
    }

    setDraft(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        photoFile: file,
        photo: URL.createObjectURL(file)
      }
    }));
  };

  // DOCUMENT CHANGE
  const handleDocChange = (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isBlobUrl(draft.documents[field])) {
      URL.revokeObjectURL(draft.documents[field]);
    }

    setDraft(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [`${field}File`]: file,
        [field]: URL.createObjectURL(file)
      }
    }));
  };

  const contactChanged =
    !!draft &&
    (draft.email !== expertData.email || draft.phone !== expertData.phone);

  useEffect(() => {
    if (!manualSearch || manualSearch.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await autocompleteLocation(manualSearch.trim());
        if (res.data?.success) {
          setSuggestions(res.data.data || []);
        }
      } catch (err) {
        console.error("Autocomplete failed:", err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [manualSearch]);

  const handleSelectSuggestion = (loc) => {
    const cityName = loc.city || "";
    const addressName = loc.search_text || `${loc.area ? loc.area + ', ' : ''}${loc.city}, ${loc.state}`;
    
    setDraft((prev) => ({
      ...prev,
      city: cityName,
      state: loc.state || "",
      country: loc.country || "",
      pincode: loc.pincode || "",
      latitude: loc.latitude ? loc.latitude.toString() : "",
      longitude: loc.longitude ? loc.longitude.toString() : "",
      location: addressName
    }));
    
    setSuggestions([]);
    setManualSearch("");
    setIsSearchingManually(false);
    notifySuccess(`📍 Location set manually: ${cityName}`);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      notifyError("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await reverseGeocode(latitude, longitude);
          if (res.data?.success && res.data.data) {
            const loc = res.data.data;
            const city = loc.city || "";
            setDraft((prev) => ({
              ...prev,
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              city,
              state: loc.state || "",
              country: loc.country || "",
              pincode: loc.pincode || "",
              location: loc.search_text || ""
            }));

            notifySuccess(
              city
                ? `📍 Location detected: ${city}`
                : "Location detected successfully"
            );
          } else {
            notifySuccess("Location coordinates detected");
          }
        } catch (err) {
          console.error(err);

          notifyError(
            "Coordinates captured but address lookup failed"
          );

          setDraft((prev) => ({
            ...prev,
            latitude: latitude.toString(),
            longitude: longitude.toString()
          }));
          setIsSearchingManually(true);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        setIsSearchingManually(true);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            notifyError("Location permission denied. Please search manually using the 'Search Manually' button.");
            break;

          case error.POSITION_UNAVAILABLE:
            notifyError("Location unavailable. Please search manually.");
            break;

          case error.TIMEOUT:
            notifyError("Location request timed out. Please try again or search manually.");
            break;

          default:
            notifyError("Unable to detect location. Please search manually.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };
  // ========== PRODUCTION READY HANDLE SAVE ==========
  const handleSave = async () => {
    if (!canEditProfile) {
      notifyError(profileEditBlockedMessage);
      setEdit(false);
      return;
    }

    try {
      setSaveLoading(true);
      
      if (contactChanged && !isContactVerified) {
        setShowOtp(true);
        setSaveLoading(false);
        return;
      }

      if (!expertId) {
        console.error("Missing expertId");
        notifyError("Expert ID not found");
        setSaveLoading(false);
        return;
      }

     if (!draft.latitude || !draft.longitude) {
  notifyError("Please detect your location first");
  setSaveLoading(false);
  return;
}
  const profileFormData = new FormData();

profileFormData.append("name", draft.name || "");
profileFormData.append("position", draft.title || "");
profileFormData.append("email", draft.email || "");
profileFormData.append("phone", draft.phone || "");
profileFormData.append("description", draft.description || "");
profileFormData.append("education", draft.education || "");

profileFormData.append("location", draft.location || "");
profileFormData.append("latitude", draft.latitude || "");
profileFormData.append("longitude", draft.longitude || "");
profileFormData.append("city", draft.city || "");
profileFormData.append("state", draft.state || "");
profileFormData.append("country", draft.country || "");
profileFormData.append("pincode", draft.pincode || "");

if (draft.documents.photoFile) {
  profileFormData.append(
    "profile_photo",
    draft.documents.photoFile
  );
}

if (draft.documents.experience_certificateFile) {
  profileFormData.append(
    "experience_certificate",
    draft.documents.experience_certificateFile
  );
}

if (draft.documents.marksheetFile) {
  profileFormData.append(
    "marksheet",
    draft.documents.marksheetFile
  );
}

if (draft.documents.aadhar_cardFile) {
  profileFormData.append(
    "aadhar_card",
    draft.documents.aadhar_cardFile
  );
}

      // ========== PRICING MODES (NO SUBSCRIPTION) ==========
      const pricingModes = [];

      // ✅ Per Minute Pricing
      if (draft.callRate > 0 && draft.chatRate > 0) {
        pricingModes.push("per_minute");
      }

      // ✅ Session Pricing
      if (sessionPrice > 0 && sessionDuration > 0) {
        pricingModes.push("session");
      }

      // ❌ DO NOT ADD "subscription" here

      // ========== PRICE PAYLOAD ==========
      const pricePayload = {
        expert_id: expertId,
        pricing_modes: pricingModes,
        call_per_minute: pricingModes.includes("per_minute") ? draft.callRate : null,
        chat_per_minute: pricingModes.includes("per_minute") ? draft.chatRate : null,
        session_price: pricingModes.includes("session") ? sessionPrice : null,
        session_duration: pricingModes.includes("session") ? sessionDuration : null,
        reason_for_price: "",
        handle_customer: "",
        strength: "",
        weakness: ""
      };

      console.log("PROFILE PAYLOAD", profileFormData);

      // ========== BUILD PROMISES ==========
      const profilePromises = [updateExpertProfileApi(profileFormData)];

      // ✅ ONLY call price API if needed
      if (pricingModes.length > 0) {
        profilePromises.push(savePriceApi(pricePayload));
      }

      await Promise.all(profilePromises);

      // ========== SAVE CATEGORY & SUBCATEGORY MAPPINGS ==========
      if (selectedCatIds.length > 0) {
        const payloadCategories = Object.entries(selectedSubCats)
          .map(([catId, subIds]) => ({
            category_id: Number(catId),
            subcategory_ids: [...new Set((subIds || []).map(Number).filter(Boolean))],
          }))
          .filter((item) => selectedCatIds.includes(item.category_id) && item.subcategory_ids.length);

        if (!payloadCategories.length) {
          notifyError("Please select at least one subcategory/specialization.");
          setSaveLoading(false);
          return;
        }

        const firstCategory = payloadCategories[0];
        const primaryCategoryId = primaryCatSub.category_id || firstCategory.category_id;
        const primarySubcategoryId = primaryCatSub.subcategory_id || firstCategory.subcategory_ids[0];
        const primaryIsSelected = payloadCategories.some(
          (item) => item.category_id === primaryCategoryId && item.subcategory_ids.includes(primarySubcategoryId)
        );
        const finalPrimary = primaryIsSelected
          ? { category_id: primaryCategoryId, subcategory_id: primarySubcategoryId }
          : { category_id: firstCategory.category_id, subcategory_id: firstCategory.subcategory_ids[0] };

        await saveCategoryApi({
          category_ids: selectedCatIds,
          category_id: finalPrimary.category_id
        });

        await saveSubCategoryApi({
          categories: payloadCategories,
          primary_category_id: finalPrimary.category_id,
          primary_subcategory_id: finalPrimary.subcategory_id
        });
      }

      await refreshExpertData();
      // ========== REFRESH ==========
      // await Promise.all([refreshPrice()]);
      
      notifySuccess("Profile updated successfully!");
      
      setEdit(false);
      // setDraft(null);
      
    } catch (err) {
      console.error("Save failed", err);
      notifyError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setDraft(null);
  };

  // ================= SUBSCRIPTION PLAN CRUD OPERATIONS =================
  
  const handleAddPlan = () => {
    if (!canEditProfile) {
      notifyError(profileEditBlockedMessage);
      return;
    }
    setEditingPlan(null);
    setPlanForm({
      name: "",
      duration_type: "monthly",
      price: "",
      minutes_limit: "",
      calls_limit: "",
      call_enabled: true,
      chat_enabled: true
    });
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan) => {
    if (!canEditProfile) {
      notifyError(profileEditBlockedMessage);
      return;
    }
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name,
      duration_type: plan.duration_type,
      price: plan.price.toString(),
      minutes_limit: plan.minutes_limit?.toString() || "",
      calls_limit: plan.calls_limit?.toString() || "",
      call_enabled: plan.call_enabled,
      chat_enabled: plan.chat_enabled
    });
    setShowPlanModal(true);
  };

  const handlePlanFormChange = (field, value) => {
    setPlanForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitPlan = async () => {
    if (!canEditProfile) {
      notifyError(profileEditBlockedMessage);
      return;
    }

    if (!planForm.name || !planForm.price) {
      notifyError("Plan name and price are required");
      return;
    }

    setPlanSubmitLoading(true);
    
    try {
      const payload = {
        name: planForm.name,
        duration_type: planForm.duration_type,
        price: Number(planForm.price),
        minutes_limit: planForm.minutes_limit ? Number(planForm.minutes_limit) : null,
        calls_limit: planForm.calls_limit ? Number(planForm.calls_limit) : null,
        call_enabled: planForm.call_enabled,
        chat_enabled: planForm.chat_enabled
      };

      if (editingPlan) {
        await updatePlanApi(editingPlan.id, payload);
        notifySuccess("Plan updated successfully!");
      } else {
        await createPlanApi(payload);
        notifySuccess("Plan added successfully!");
      }

      await loadSubscriptionPlans();
      setShowPlanModal(false);
      
    } catch (err) {
      console.error("Failed to save plan", err);
      notifyError(err.response?.data?.message || "Failed to save plan");
    } finally {
      setPlanSubmitLoading(false);
    }
  };

  const handleDeletePlan = async (planId, planName) => {
    if (!canEditProfile) {
      notifyError(profileEditBlockedMessage);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${planName}" plan?`)) {
      return;
    }

    try {
      await deletePlanApi(planId);
      notifySuccess("Plan deleted successfully!");
      await loadSubscriptionPlans();
    } catch (err) {
      console.error("Failed to delete plan", err);
      notifyError(err.response?.data?.message || "Failed to delete plan");
    }
  };

  // ================= EXPERIENCE CRUD OPERATIONS =================
  
  const handleAddExperience = () => {
    if (!canEditProfile) {
      notifyError(profileEditBlockedMessage);
      return;
    }
    setEditingExperience(null);
    setExperienceForm({
      title: "",
      company: "",
      start_date: "",
      end_date: "",
      certificate: null,
      certificatePreview: null
    });
    setShowExperienceModal(true);
  };

  const handleEditExperience = (exp) => {
    if (!canEditProfile) {
      notifyError(profileEditBlockedMessage);
      return;
    }
    setEditingExperience(exp);
    setExperienceForm({
      title: exp.title || "",
      company: exp.company || "",
      start_date: exp.start_date ? exp.start_date.split('T')[0] : "",
      end_date: exp.end_date ? exp.end_date.split('T')[0] : "",
      certificate: null,
      certificatePreview: exp.certificate || null
    });
    setShowExperienceModal(true);
  };

  const handleExperienceFormChange = (field, value) => {
    setExperienceForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (experienceForm.certificatePreview && typeof experienceForm.certificatePreview === 'string' && experienceForm.certificatePreview.startsWith('blob:')) {
      URL.revokeObjectURL(experienceForm.certificatePreview);
    }

    setExperienceForm(prev => ({
      ...prev,
      certificate: file,
      certificatePreview: URL.createObjectURL(file)
    }));
  };

  const handleSubmitExperience = async () => {
    if (!experienceForm.title.trim()) {
      notifyError("Title is required");
      return;
    }
    if (!experienceForm.start_date) {
      notifyError("Start date is required");
      return;
    }
    if (experienceForm.end_date && experienceForm.end_date < experienceForm.start_date) {
      notifyError("End date cannot be before start date");
      return;
    }

    setExperienceSubmitLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", experienceForm.title);
      if (experienceForm.company) formData.append("company", experienceForm.company);
      formData.append("start_date", experienceForm.start_date);
      if (experienceForm.end_date) formData.append("end_date", experienceForm.end_date);
      if (experienceForm.certificate) {
        formData.append("certificate", experienceForm.certificate);
      }

      if (editingExperience) {
        await updateExperienceApi(editingExperience.id, formData);
        notifySuccess("Experience updated successfully!");
      } else {
        await addExperienceApi(formData);
        notifySuccess("Experience added successfully!");
      }

      await loadExperiences();
      setShowExperienceModal(false);
      setExperienceForm({
        title: "",
        company: "",
        start_date: "",
        end_date: "",
        certificate: null,
        certificatePreview: null
      });
      
    } catch (err) {
      console.error("Failed to save experience", err);
      notifyError(err.response?.data?.message || "Failed to save experience");
    } finally {
      setExperienceSubmitLoading(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!canEditProfile) {
      notifyError(profileEditBlockedMessage);
      return;
    }

    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      await deleteExperienceApi(id);
      notifySuccess("Experience deleted successfully!");
      await loadExperiences();
    } catch (err) {
      console.error("Failed to delete experience", err);
      notifyError(err.response?.data?.message || "Failed to delete experience");
    }
  };

  // OPEN FOLLOWERS MODAL
  const openFollowersModal = useCallback(async () => {
    if (!expertId) return;

    setModalConfig({ open: true, type: "followers" });
    setFollowersLoading(true);

    try {
      const res = await getExpertFollowersApi(expertId);
      const mappedFollowers = (res.data.followers || []).map(f => ({
        id: f.id,
        name: `${f.first_name || ""} ${f.last_name || ""}`.trim() || "User",
      }));

      setFollowersList(mappedFollowers);
      setFollowersCount(res.data.total_followers || mappedFollowers.length);
    } catch (err) {
      console.error("Failed to load followers", err);
      setFollowersList([]);
      notifyError("Failed to load followers");
    } finally {
      setFollowersLoading(false);
    }
  }, [expertId]);

  // OPEN REVIEWS MODAL
  const openReviewsModal = useCallback(async () => {
    if (!expertId) return;

    setModalConfig({ open: true, type: "reviews" });
    setReviewsLoading(true);

    try {
      const res = await getReviewsByExpertApi(expertId);
      const data = res.data.data || {};
      const list = data.reviews || [];

      setReviewsList(list);
      setTotalReviews(data.total_reviews || list.length || 0);
      setAvgRating(Number(data.avg_rating || 0));
    } catch (err) {
      console.error("Failed to load reviews", err);
      setReviewsList([]);
      setTotalReviews(0);
      setAvgRating(0);
      notifyError("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  }, [expertId]);

  const closeModal = () => setModalConfig({ open: false, type: null });

  const responseRate = useMemo(() => {
    if (!followersCount) return 0;
    const rate = (totalReviews / followersCount) * 100;
    return Math.min(rate, 100).toFixed(0);
  }, [totalReviews, followersCount]);

  const stats = useMemo(() => [
    {
      icon: <FiUsers />,
      label: "Total Followers",
      value: followersCount,
      onClick: openFollowersModal,
      color: "#3b82f6"
    },
    {
      icon: <FiStar />,
      label: "Average Rating",
      value: avgRating ? avgRating.toFixed(1) : "0.0",
      suffix: "★",
      onClick: openReviewsModal,
      color: "#f59e0b"
    },
    {
      icon: <FiMessageCircle />,
      label: "Total Reviews",
      value: totalReviews,
      onClick: openReviewsModal,
      color: "#10b981"
    },
    {
      icon: <FiTrendingUp />,
      label: "Response Rate",
      value: `${responseRate}%`,
      color: "#8b5cf6"
    }
  ], [followersCount, avgRating, totalReviews, openFollowersModal, openReviewsModal]);

  if (profileLoading || priceLoading || !draft) {
    return (
      <S.LoadingContainer>
        <S.LoadingSpinner />
        <S.LoadingText>Loading premium profile...</S.LoadingText>
      </S.LoadingContainer>
    );
  }

  const renderDocument = (docUrl, altText) => {
    if (!docUrl) {
      return <S.NoDocument>No document</S.NoDocument>;
    }

    if (isImageUrl(docUrl)) {
      return <img src={docUrl} alt={altText} />;
    }

    return (
      <S.PdfPreview>
        <FiFile size={24} />
        <span>PDF Document</span>
      </S.PdfPreview>
    );
  };

  return (
    <>
      <S.PageWrap>
        <S.Content>
          {/* Premium Header with Gradient */}
          <S.PremiumHeader>
            <S.HeaderGlow />
            <S.HeaderContent>
              <S.HeaderGreeting>Welcome back,</S.HeaderGreeting>
              <S.HeaderTitle>{draft.name}</S.HeaderTitle>
              <S.HeaderBadge>
                <FiShield /> Verified Expert
              </S.HeaderBadge>
            </S.HeaderContent>
            <S.HeaderStats>
              {stats.slice(0, 2).map((stat, index) => (
                <S.HeaderStat 
                  key={index} 
                  onClick={stat.onClick}
                  clickable={!!stat.onClick}
                >
                  <S.HeaderStatIcon style={{ background: `${stat.color}20`, color: stat.color }}>
                    {stat.icon}
                  </S.HeaderStatIcon>
                  <S.HeaderStatInfo>
                    <S.HeaderStatLabel>{stat.label}</S.HeaderStatLabel>
                    <S.HeaderStatValue>
                      {stat.value}{stat.suffix || ""}
                    </S.HeaderStatValue>
                  </S.HeaderStatInfo>
                </S.HeaderStat>
              ))}
            </S.HeaderStats>
          </S.PremiumHeader>

          {/* Main Profile Card */}
          <S.ProfileCard>
            <S.ProfileCardInner>
              {/* Left Column - Avatar & Basic Info */}
              <S.ProfileLeftColumn>
                <S.AvatarContainer>
                  <S.PremiumAvatar>
                    <img src={draft.documents.photo || DEFAULT_AVATAR} alt={draft.name} />
                    <S.AvatarBadge>
                      <FiShield />
                    </S.AvatarBadge>
                    {edit && (
                      <S.AvatarUploadButton htmlFor="photo-upload">
                        <FiCamera />
                        <input
                          id="photo-upload"
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handlePhotoChange}
                        />
                      </S.AvatarUploadButton>
                    )}
                  </S.PremiumAvatar>
                </S.AvatarContainer>

                <S.ExpertNameSection>
                  {edit ? (
                    <S.PremiumInput
                      value={draft.name}
                      onChange={e => setDraft({ ...draft, name: e.target.value })}
                      placeholder="Full Name"
                    />
                  ) : (
                    <S.ExpertName>{draft.name}</S.ExpertName>
                  )}
                  
                  {edit ? (
                    <S.PremiumInput
                      value={draft.title}
                      onChange={e => setDraft({ ...draft, title: e.target.value })}
                      placeholder="Professional Title"
                      style={{ marginTop: 8 }}
                    />
                  ) : (
                    <S.ExpertTitle>{draft.title}</S.ExpertTitle>
                  )}

                  <S.ExpertCategories style={{ flexWrap: 'wrap', gap: '4px' }}>
                    {expertData.profile?.expertise && expertData.profile.expertise.length > 0 ? (
                      expertData.profile.expertise.map((exp, idx) => (
                        <React.Fragment key={exp.category_id}>
                          {idx > 0 && <span style={{ color: '#94a3b8', margin: '0 4px' }}>|</span>}
                          <S.CategoryPill title={(exp.subcategories || []).map(s => s.subcategory_name).join(', ')}>
                            {exp.category_name}
                          </S.CategoryPill>
                        </React.Fragment>
                      ))
                    ) : (
                      <>
                        <S.CategoryPill>
                          {categoryName || "Category"}
                        </S.CategoryPill>
                        {subCategoryName && (
                          <>
                            <FiChevronRight size={14} />
                            <S.CategoryPill>
                              {subCategoryName}
                            </S.CategoryPill>
                          </>
                        )}
                      </>
                    )}
                  </S.ExpertCategories>
                </S.ExpertNameSection>

                {/* Quick Stats */}
                <S.QuickStatsGrid>
                  {stats.map((stat, index) => (
                    <S.QuickStatCard 
                      key={index} 
                      onClick={stat.onClick} 
                      clickable={!!stat.onClick}
                    >
                      <S.QuickStatIcon style={{ background: `${stat.color}15`, color: stat.color }}>
                        {stat.icon}
                      </S.QuickStatIcon>
                      <S.QuickStatContent>
                        <S.QuickStatValue>{stat.value}{stat.suffix || ""}</S.QuickStatValue>
                        <S.QuickStatLabel>{stat.label}</S.QuickStatLabel>
                      </S.QuickStatContent>
                    </S.QuickStatCard>
                  ))}
                </S.QuickStatsGrid>
              </S.ProfileLeftColumn>

              {/* Right Column - Action Buttons */}
              <S.ProfileRightColumn>
                {!edit ? (
                  <S.ActionButton
                    primary
                    disabled={!canEditProfile}
                    onClick={() => {
                      if (!canEditProfile) {
                        notifyError(profileEditBlockedMessage);
                        return;
                      }
                      setEdit(true);
                    }}
                  >
                    <FiEdit /> Edit Profile
                  </S.ActionButton>
                ) : (
                  <S.ActionButtonGroup>
                    <S.ActionButton primary onClick={handleSave} disabled={saveLoading}>
                      {saveLoading ? <S.LoadingSpinnerSmall /> : <FiCheck />}
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </S.ActionButton>
                    <S.ActionButton onClick={handleCancel}>
                      <FiX /> Cancel
                    </S.ActionButton>
                  </S.ActionButtonGroup>
                )}
              </S.ProfileRightColumn>
            </S.ProfileCardInner>
          </S.ProfileCard>

          {/* Pricing Cards - Includes Session Pricing */}
          <S.PricingSection>
            <S.PricingCard gradient="call">
              <S.PricingIconWrapper gradient="call">
                <FiPhoneCall />
              </S.PricingIconWrapper>
              <S.PricingContent>
                <S.PricingLabel>Voice Call Rate</S.PricingLabel>
                <S.PricingValue>₹{draft.callRate}</S.PricingValue>
                <S.PricingPeriod>per minute</S.PricingPeriod>
              </S.PricingContent>
              {edit && (
                <S.PricingSlider>
                  <S.SliderLabel>Adjust rate: ₹{draft.callRate}</S.SliderLabel>
                  <S.PremiumSlider
                    type="range"
                    min="10"
                    max="500"
                    value={draft.callRate}
                    onChange={e => setDraft({ ...draft, callRate: Number(e.target.value) })}
                  />
                </S.PricingSlider>
              )}
            </S.PricingCard>

            <S.PricingCard gradient="chat">
              <S.PricingIconWrapper gradient="chat">
                <FiMessageCircle />
              </S.PricingIconWrapper>
              <S.PricingContent>
                <S.PricingLabel>Chat Rate</S.PricingLabel>
                <S.PricingValue>₹{draft.chatRate}</S.PricingValue>
                <S.PricingPeriod>per minute</S.PricingPeriod>
              </S.PricingContent>
              {edit && (
                <S.PricingSlider>
                  <S.SliderLabel>Adjust rate: ₹{draft.chatRate}</S.SliderLabel>
                  <S.PremiumSlider
                    type="range"
                    min="5"
                    max="200"
                    value={draft.chatRate}
                    onChange={e => setDraft({ ...draft, chatRate: Number(e.target.value) })}
                  />
                </S.PricingSlider>
              )}
            </S.PricingCard>

            {/* Session Pricing Card */}
            <S.PricingCard gradient="session">
              <S.PricingIconWrapper gradient="session">
                <FiPackage />
              </S.PricingIconWrapper>
              <S.PricingContent>
                <S.PricingLabel>Session Rate</S.PricingLabel>
                <S.PricingValue>₹{sessionPrice}</S.PricingValue>
                <S.PricingPeriod>per {sessionDuration} min session</S.PricingPeriod>
              </S.PricingContent>
              {edit && (
                <S.PricingSlider>
                  <S.SliderLabel>Session Price: ₹{sessionPrice}</S.SliderLabel>
                  <S.PremiumSlider
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={sessionPrice}
                    onChange={e => setSessionPrice(Number(e.target.value))}
                  />
                  <S.SliderLabel style={{ marginTop: 8 }}>Session Duration: {sessionDuration} minutes</S.SliderLabel>
                  <S.PremiumSlider
                    type="range"
                    min="15"
                    max="120"
                    step="5"
                    value={sessionDuration}
                    onChange={e => setSessionDuration(Number(e.target.value))}
                  />
                </S.PricingSlider>
              )}
            </S.PricingCard>
          </S.PricingSection>

          {/* Premium Tabs */}
          <S.PremiumTabs>
            <S.PremiumTab
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            >
              <FiUser /> Overview
            </S.PremiumTab>
            <S.PremiumTab
              active={activeTab === "experience"}
              onClick={() => setActiveTab("experience")}
            >
              <FiBriefcase /> Experience & Documents
            </S.PremiumTab>
            <S.PremiumTab
              active={activeTab === "plans"}
              onClick={() => setActiveTab("plans")}
            >
              <FiDollarSign /> Subscription Plans
            </S.PremiumTab>
          </S.PremiumTabs>

          {/* Tab Content */}
          <S.TabContent>
            {!canEditProfile && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 16px",
                marginBottom: 18,
                border: "1px solid #fecaca",
                borderRadius: 8,
                background: "#fef2f2",
                color: "#991b1b",
                fontWeight: 600
              }}>
                <FiLock />
                <span>{profileEditBlockedMessage}</span>
              </div>
            )}
            {activeTab === "overview" && (
              <S.OverviewGrid>
                {/* Contact Information */}
                <S.InfoCard>
                  <S.CardHeader>
                    <FiMail /> Contact Information
                  </S.CardHeader>
                  <S.InfoList>
                    <S.InfoItem>
                      <S.InfoIcon>
                        <FiMail />
                      </S.InfoIcon>
                      <S.InfoContent>
                        <S.InfoLabel>Email Address</S.InfoLabel>
                        {edit ? (
                          <S.InputGroup>
                            <S.PremiumInput
                              value={draft.email}
                              onChange={e => setDraft({ ...draft, email: e.target.value })}
                              placeholder="email@example.com"
                            />
                          </S.InputGroup>
                        ) : (
                          <S.InfoValue>{draft.email}</S.InfoValue>
                        )}
                      </S.InfoContent>
                    </S.InfoItem>

                    <S.InfoItem>
                      <S.InfoIcon>
                        <FiPhone />
                      </S.InfoIcon>
                      <S.InfoContent>
                        <S.InfoLabel>Phone Number</S.InfoLabel>
                        {edit ? (
                          <S.InputGroup>
                            <S.PremiumInput
                              value={draft.phone}
                              onChange={e => setDraft({ ...draft, phone: e.target.value })}
                              placeholder="+91 0000000000"
                            />
                          </S.InputGroup>
                        ) : (
                          <S.InfoValue>{draft.phone}</S.InfoValue>
                        )}
                      </S.InfoContent>
                    </S.InfoItem>

                    <S.InfoItem>
                      <S.InfoIcon>
                        <FiMapPin />
                      </S.InfoIcon>
                      <S.InfoContent>
                        <S.InfoLabel>Location</S.InfoLabel>
                        {edit ? (
                        <div>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                            <button
                              type="button"
                              onClick={handleDetectLocation}
                              disabled={isDetectingLocation}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: isDetectingLocation ? "not-allowed" : "pointer",
                                backgroundColor: "#0284c7",
                                color: "white"
                              }}
                            >
                              <FiMapPin />
                              {isDetectingLocation ? " Detecting..." : " Detect Current Location"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsSearchingManually(!isSearchingManually)}
                              style={{
                                padding: "10px 14px",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: "#64748b",
                                color: "white"
                              }}
                            >
                              Search Manually
                            </button>
                          </div>

                          {isSearchingManually && (
                            <div style={{ marginBottom: "12px", position: "relative" }}>
                              <S.PremiumInput
                                type="text"
                                value={manualSearch}
                                onChange={e => setManualSearch(e.target.value)}
                                placeholder="Type city, area or pincode to search..."
                              />
                              {suggestions.length > 0 && (
                                <div style={{
                                  position: "absolute",
                                  top: "100%",
                                  left: 0,
                                  right: 0,
                                  backgroundColor: "white",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "6px",
                                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                  zIndex: 10,
                                  maxHeight: "200px",
                                  overflowY: "auto"
                                }}>
                                  {suggestions.map(loc => (
                                    <div
                                      key={loc.id}
                                      onClick={() => handleSelectSuggestion(loc)}
                                      style={{
                                        padding: "10px 12px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #f1f5f9",
                                        fontSize: "13px",
                                        textAlign: "left",
                                        color: "#0f172a"
                                      }}
                                      onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8fafc"}
                                      onMouseLeave={e => e.currentTarget.style.backgroundColor = "white"}
                                    >
                                      {loc.search_text}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                            <div>
                              <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Address / Location Name</label>
                              <S.PremiumInput
                                value={draft.location || ""}
                                onChange={e => setDraft({ ...draft, location: e.target.value })}
                                placeholder="Enter address or location name"
                              />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>City</label>
                                <S.PremiumInput
                                  value={draft.city || ""}
                                  onChange={e => setDraft({ ...draft, city: e.target.value })}
                                  placeholder="City"
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>State</label>
                                <S.PremiumInput
                                  value={draft.state || ""}
                                  onChange={e => setDraft({ ...draft, state: e.target.value })}
                                  placeholder="State"
                                />
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                              <div>
                                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Country</label>
                                <S.PremiumInput
                                  value={draft.country || ""}
                                  onChange={e => setDraft({ ...draft, country: e.target.value })}
                                  placeholder="Country"
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Pincode</label>
                                <S.PremiumInput
                                  value={draft.pincode || ""}
                                  onChange={e => setDraft({ ...draft, pincode: e.target.value })}
                                  placeholder="Pincode"
                                />
                              </div>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                              <strong>Coordinates:</strong> Lat: {draft.latitude || "Not detected"}, Lng: {draft.longitude || "Not detected"}
                            </div>
                          </div>
</div>

                          
                        ) : (
                          <S.InfoValue>{draft.location || "Not specified"}</S.InfoValue>
                        )}
                      </S.InfoContent>
                    </S.InfoItem>
                  </S.InfoList>
                </S.InfoCard>

                {/* About & Description */}
                <S.InfoCard>
                  <S.CardHeader>
                    <FiFileText /> About Me
                  </S.CardHeader>
                  {edit ? (
                    <S.TextArea
                      value={draft.description}
                      onChange={e => setDraft({ ...draft, description: e.target.value })}
                      placeholder="Tell us about yourself, your expertise, and experience..."
                      rows={6}
                    />
                  ) : (
                    <S.Description>
                      {draft.description || "No description provided."}
                    </S.Description>
                  )}
                </S.InfoCard>

                {/* Categories */}
                <S.InfoCard>
                  <S.CardHeader>
                    <FiAward /> Expertise Areas
                  </S.CardHeader>
                  {edit ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Category selection */}
                      <div>
                        <h4 style={{ fontSize: '14px', color: '#1e293b', marginBottom: '10px', fontWeight: 'bold' }}>Choose Categories</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                          {categories.map((cat) => {
                            const catId = Number(cat.id);
                            const isChecked = selectedCatIds.includes(catId);
                            return (
                              <label
                                key={cat.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  border: isChecked ? '1.5px solid #000080' : '1px solid #cbd5e1',
                                  backgroundColor: isChecked ? 'rgba(0, 0, 128, 0.05)' : 'white',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  fontWeight: isChecked ? 'bold' : 'normal',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleCategory(catId)}
                                  style={{ accentColor: '#000080' }}
                                />
                                <span>{prettyLabel(cat.name)}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Subcategory selection for selected categories */}
                      {selectedCatIds.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: '14px', color: '#1e293b', marginBottom: '10px', fontWeight: 'bold' }}>Select Specializations & Set Primary</h4>
                          {subCatLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', color: '#64748b' }}>
                              <S.LoadingSpinnerSmall />
                              <span style={{ fontSize: '13px' }}>Loading specializations...</span>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {subCatGroups.map((group) => (
                                <div key={group.category_id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', background: '#f8fafc' }}>
                                  <h5 style={{ fontSize: '13px', color: '#334155', fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '10px' }}>
                                    {group.category_name}
                                  </h5>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                    {(group.subcategories || []).map((sub) => {
                                      const subId = Number(sub.id);
                                      const isSubChecked = (selectedSubCats[group.category_id] || []).includes(subId);
                                      const isPrimary = primaryCatSub.category_id === group.category_id && primaryCatSub.subcategory_id === subId;
                                      return (
                                        <div
                                          key={sub.id}
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '8px',
                                            padding: '8px 10px',
                                            borderRadius: '6px',
                                            backgroundColor: 'white',
                                            border: isSubChecked ? '1px solid #10b981' : '1px solid #e2e8f0',
                                            fontSize: '12px'
                                          }}
                                        >
                                          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', flex: 1 }}>
                                            <input
                                              type="checkbox"
                                              checked={isSubChecked}
                                              onChange={() => handleToggleSubcategory(group.category_id, subId)}
                                              style={{ accentColor: '#10b981' }}
                                            />
                                            <span style={{ fontWeight: isSubChecked ? 'bold' : 'normal' }}>{sub.name}</span>
                                          </label>
                                          
                                          {isSubChecked && (
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer', color: isPrimary ? '#d97706' : '#64748b', fontSize: '11px' }} title="Set as primary specialization">
                                              <input
                                                type="radio"
                                                name="primary_specialization"
                                                checked={isPrimary}
                                                onChange={() => handleSetPrimary(group.category_id, subId)}
                                                style={{ accentColor: '#d97706', width: '12px', height: '12px' }}
                                              />
                                              <span>Primary</span>
                                            </label>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <S.CategoriesList style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start' }}>
                      {expertData.profile?.expertise && expertData.profile.expertise.length > 0 ? (
                        expertData.profile.expertise.map((exp) => (
                          <div key={exp.category_id} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                            <S.CategoryTag style={{ fontWeight: 'bold', background: 'rgba(14, 165, 233, 0.15)', color: '#0369a1' }}>
                              {exp.category_name}
                            </S.CategoryTag>
                            <FiChevronRight size={14} style={{ color: '#64748b' }} />
                            {(exp.subcategories || []).map((sub) => (
                              <S.CategoryTag key={sub.subcategory_id} style={{ background: sub.is_primary ? 'rgba(16, 185, 129, 0.15)' : 'rgba(226, 232, 240, 0.8)', color: sub.is_primary ? '#065f46' : '#334155' }}>
                                {sub.subcategory_name} {sub.is_primary && "(Primary)"}
                              </S.CategoryTag>
                            ))}
                          </div>
                        ))
                      ) : (
                        <>
                          <S.CategoryTag>
                            {categoryName || "Category"}
                          </S.CategoryTag>
                          {subCategoryName && (
                            <S.CategoryTag>
                              {subCategoryName}
                            </S.CategoryTag>
                          )}
                        </>
                      )}
                    </S.CategoriesList>
                  )}
                </S.InfoCard>
              </S.OverviewGrid>
            )}

            {activeTab === "experience" && (
              <S.ExperienceGrid>
                {/* Education */}
                <S.InfoCard>
                  <S.CardHeader>
                    <FiBookOpen /> Education
                  </S.CardHeader>
                  {edit ? (
                    <S.TextArea
                      value={draft.education}
                      onChange={e => setDraft({ ...draft, education: e.target.value })}
                      placeholder="Your educational background..."
                      rows={4}
                    />
                  ) : (
                    <S.Description>
                      {draft.education || "No education information provided."}
                    </S.Description>
                  )}
                </S.InfoCard>

                {/* Total Experience Summary */}
                {(totalExperience.years > 0 || totalExperience.months > 0) && (
                  <S.InfoCard>
                    <S.CardHeader>
                      <FiClock /> Total Experience
                    </S.CardHeader>
                    <S.TotalExperienceDisplay>
                      <S.TotalExperienceYears>
                        {totalExperience.years} {totalExperience.years === 1 ? 'Year' : 'Years'}
                      </S.TotalExperienceYears>
                      {totalExperience.months > 0 && (
                        <S.TotalExperienceMonths>
                          {totalExperience.months} {totalExperience.months === 1 ? 'Month' : 'Months'}
                        </S.TotalExperienceMonths>
                      )}
                    </S.TotalExperienceDisplay>
                  </S.InfoCard>
                )}

                {/* Experience List */}
                <S.ExperienceSection>
                  <S.ExperienceHeader>
                    <S.CardHeader>
                      <FiBriefcase /> Work Experience
                    </S.CardHeader>
                    <S.AddExperienceButton onClick={handleAddExperience}>
                      <FiPlus /> Add Experience
                    </S.AddExperienceButton>
                  </S.ExperienceHeader>

                  {experiencesLoading ? (
                    <S.LoadingContainer style={{ padding: "40px" }}>
                      <S.LoadingSpinnerSmall />
                      <S.LoadingText>Loading experiences...</S.LoadingText>
                    </S.LoadingContainer>
                  ) : experiences.length === 0 ? (
                    <S.NoExperienceMessage>
                      <FiBriefcase size={48} />
                      <h3>No experience added yet</h3>
                      <p>Click the "Add Experience" button to add your work history</p>
                    </S.NoExperienceMessage>
                  ) : (
                    <S.ExperienceList>
                      {experiences.map((exp) => (
                        <S.ExperienceItem key={exp.id}>
                          <S.ExperienceItemHeader>
                            <S.ExperienceTitleSection>
                              <S.ExperienceTitle>{exp.title}</S.ExperienceTitle>
                              {exp.company && (
                                <S.ExperienceCompany>
                                  <FiMapPin size={14} />
                                  {exp.company}
                                </S.ExperienceCompany>
                              )}
                            </S.ExperienceTitleSection>
                            <S.ExperienceActions>
                              <S.ExperienceEditButton onClick={() => handleEditExperience(exp)}>
                                <FiEdit />
                              </S.ExperienceEditButton>
                              <S.ExperienceDeleteButton onClick={() => handleDeleteExperience(exp.id)}>
                                <FiTrash2 />
                              </S.ExperienceDeleteButton>
                            </S.ExperienceActions>
                          </S.ExperienceItemHeader>
                          
                          <S.ExperienceDate>
                            <FiCalendar size={14} />
                            {exp.start_date?.split('T')[0]} - {exp.end_date ? exp.end_date.split('T')[0] : "Present"}
                          </S.ExperienceDate>
                          
                          {exp.certificate && (
                            <S.ExperienceCertificate>
                              <FiFile size={14} />
                              <a 
                                href={exp.certificate} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                View Certificate
                              </a>
                              <a 
                                href={exp.certificate} 
                                download
                              >
                                <FiDownload size={14} /> Download
                              </a>
                            </S.ExperienceCertificate>
                          )}
                        </S.ExperienceItem>
                      ))}
                    </S.ExperienceList>
                  )}
                </S.ExperienceSection>

                {/* Documents Grid */}
                <S.DocumentsGrid>
                  <S.DocumentCard
                    onMouseEnter={() => setHoveredDoc('experience')}
                    onMouseLeave={() => setHoveredDoc(null)}
                  >
                    <S.DocumentPreview>
                      {renderDocument(draft.documents.experience_certificate, "Experience Certificate")}
                      {hoveredDoc === 'experience' && draft.documents.experience_certificate && (
                        <S.DocumentOverlay>
                          <S.DocumentActions>
                            <S.DocumentAction 
                              href={draft.documents.experience_certificate} 
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FiEye />
                            </S.DocumentAction>
                            <S.DocumentAction 
                              as="a" 
                              href={draft.documents.experience_certificate} 
                              download="experience_certificate"
                            >
                              <FiDownload />
                            </S.DocumentAction>
                          </S.DocumentActions>
                        </S.DocumentOverlay>
                      )}
                    </S.DocumentPreview>
                    <S.DocumentInfo>
                      <S.DocumentTitle>Profile Certificate</S.DocumentTitle>
                      {edit && (
                        <S.DocumentUploadButton>
                          <FiCamera />
                          <input
                            type="file"
                            hidden
                            accept="image/*,.pdf"
                            onChange={e => handleDocChange("experience_certificate", e)}
                          />
                        </S.DocumentUploadButton>
                      )}
                    </S.DocumentInfo>
                  </S.DocumentCard>

                  <S.DocumentCard
                    onMouseEnter={() => setHoveredDoc('marksheet')}
                    onMouseLeave={() => setHoveredDoc(null)}
                  >
                    <S.DocumentPreview>
                      {renderDocument(draft.documents.marksheet, "Marksheet")}
                      {hoveredDoc === 'marksheet' && draft.documents.marksheet && (
                        <S.DocumentOverlay>
                          <S.DocumentActions>
                            <S.DocumentAction 
                              href={draft.documents.marksheet} 
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FiEye />
                            </S.DocumentAction>
                            <S.DocumentAction 
                              as="a" 
                              href={draft.documents.marksheet} 
                              download="marksheet"
                            >
                              <FiDownload />
                            </S.DocumentAction>
                          </S.DocumentActions>
                        </S.DocumentOverlay>
                      )}
                    </S.DocumentPreview>
                    <S.DocumentInfo>
                      <S.DocumentTitle>Marksheet</S.DocumentTitle>
                      {edit && (
                        <S.DocumentUploadButton>
                          <FiCamera />
                          <input
                            type="file"
                            hidden
                            accept="image/*,.pdf"
                            onChange={e => handleDocChange("marksheet", e)}
                          />
                        </S.DocumentUploadButton>
                      )}
                    </S.DocumentInfo>
                  </S.DocumentCard>

                  <S.DocumentCard
                    onMouseEnter={() => setHoveredDoc('aadhar')}
                    onMouseLeave={() => setHoveredDoc(null)}
                  >
                    <S.DocumentPreview>
                      {renderDocument(draft.documents.aadhar_card, "Aadhar Card")}
                      {hoveredDoc === 'aadhar' && draft.documents.aadhar_card && (
                        <S.DocumentOverlay>
                          <S.DocumentActions>
                            <S.DocumentAction 
                              href={draft.documents.aadhar_card} 
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FiEye />
                            </S.DocumentAction>
                            <S.DocumentAction 
                              as="a" 
                              href={draft.documents.aadhar_card} 
                              download="aadhar_card"
                            >
                              <FiDownload />
                            </S.DocumentAction>
                          </S.DocumentActions>
                        </S.DocumentOverlay>
                      )}
                    </S.DocumentPreview>
                    <S.DocumentInfo>
                      <S.DocumentTitle>Aadhar Card</S.DocumentTitle>
                      {edit && (
                        <S.DocumentUploadButton>
                          <FiCamera />
                          <input
                            type="file"
                            hidden
                            accept="image/*,.pdf"
                            onChange={e => handleDocChange("aadhar_card", e)}
                          />
                        </S.DocumentUploadButton>
                      )}
                    </S.DocumentInfo>
                  </S.DocumentCard>
                </S.DocumentsGrid>
              </S.ExperienceGrid>
            )}

            {activeTab === "plans" && (
              <S.PlansContainer>
                <S.PlansHeader>
                  <S.CardHeader>
                    <FiDollarSign /> Subscription Plans
                  </S.CardHeader>
                  <S.AddPlanButton onClick={handleAddPlan}>
                    <FiPlus /> Add Plan
                  </S.AddPlanButton>
                </S.PlansHeader>

                {plansLoading ? (
                  <S.LoadingContainer style={{ padding: "40px" }}>
                    <S.LoadingSpinnerSmall />
                    <S.LoadingText>Loading plans...</S.LoadingText>
                  </S.LoadingContainer>
                ) : subscriptionPlans.length === 0 ? (
                  <S.NoPlansMessage>
                    <FiPackage size={48} />
                    <h3>No subscription plans created yet</h3>
                    <p>Click the "Add Plan" button to create subscription packages for your clients</p>
                  </S.NoPlansMessage>
                ) : (
                  <S.PlansGrid>
                    {subscriptionPlans.map((plan) => (
                      <S.PlanCard key={plan.id}>
                        <S.PlanHeader>
                          <S.PlanName>{plan.name}</S.PlanName>
                          <S.PlanActions>
                            <S.PlanEditButton onClick={() => handleEditPlan(plan)}>
                              <FiEdit />
                            </S.PlanEditButton>
                            <S.PlanDeleteButton onClick={() => handleDeletePlan(plan.id, plan.name)}>
                              <FiTrash2 />
                            </S.PlanDeleteButton>
                          </S.PlanActions>
                        </S.PlanHeader>
                        
                        <S.PlanPrice>₹{plan.price}</S.PlanPrice>
                        <S.PlanDuration>
                          {plan.duration_type?.replace('_', ' ').toUpperCase()}
                        </S.PlanDuration>
                        
                        <S.PlanFeatures>
                          {plan.minutes_limit && (
                            <S.PlanFeature>
                              <FiClock /> {plan.minutes_limit} minutes limit
                            </S.PlanFeature>
                          )}
                          {plan.calls_limit && (
                            <S.PlanFeature>
                              <FiPhoneCall /> {plan.calls_limit} calls limit
                            </S.PlanFeature>
                          )}
                          <S.PlanFeature>
                            {plan.call_enabled ? '✅' : '❌'} Call Support
                          </S.PlanFeature>
                          <S.PlanFeature>
                            {plan.chat_enabled ? '✅' : '❌'} Chat Support
                          </S.PlanFeature>
                        </S.PlanFeatures>
                      </S.PlanCard>
                    ))}
                  </S.PlansGrid>
                )}
              </S.PlansContainer>
            )}
          </S.TabContent>
        </S.Content>
      </S.PageWrap>

      {/* OTP Modal */}
      {showOtp && (
        <OtpModal
          onClose={() => setShowOtp(false)}
          onSuccess={() => {
            setIsContactVerified(true);
            setShowOtp(false);
          }}
        />
      )}

      {/* Experience Add/Edit Modal */}
      {showExperienceModal && (
        <S.ModalOverlay onClick={() => setShowExperienceModal(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h2>{editingExperience ? "Edit Experience" : "Add Experience"}</h2>
              <S.ModalCloseButton onClick={() => setShowExperienceModal(false)}>
                <FiX />
              </S.ModalCloseButton>
            </S.ModalHeader>
            
            <S.ModalBody>
              <S.FormGroup>
                <S.FormLabel>Title *</S.FormLabel>
                <S.FormInput
                  type="text"
                  value={experienceForm.title}
                  onChange={(e) => handleExperienceFormChange("title", e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.FormLabel>Company</S.FormLabel>
                <S.FormInput
                  type="text"
                  value={experienceForm.company}
                  onChange={(e) => handleExperienceFormChange("company", e.target.value)}
                  placeholder="e.g., Google, Microsoft"
                />
              </S.FormGroup>

              <S.FormRow>
                <S.FormGroup>
                  <S.FormLabel>Start Date *</S.FormLabel>
                  <S.FormInput
                    type="date"
                    value={experienceForm.start_date}
                    onChange={(e) => handleExperienceFormChange("start_date", e.target.value)}
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <S.FormLabel>End Date</S.FormLabel>
                  <S.FormInput
                    type="date"
                    value={experienceForm.end_date}
                    onChange={(e) => handleExperienceFormChange("end_date", e.target.value)}
                  />
                  <S.FormHint>Leave empty for current position</S.FormHint>
                </S.FormGroup>
              </S.FormRow>

              <S.FormGroup>
                <S.FormLabel>Certificate </S.FormLabel>
                <S.FileInputWrapper>
                  <S.FileInputLabel htmlFor="certificate-upload">
                    <FiCamera /> Choose File
                  </S.FileInputLabel>
                  <input
                    id="certificate-upload"
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={handleCertificateChange}
                  />
                  {experienceForm.certificatePreview && (
                    <S.FileName>
                      {typeof experienceForm.certificatePreview === 'string' && 
                       !experienceForm.certificatePreview.startsWith('blob:') 
                        ? experienceForm.certificatePreview.split('/').pop() 
                        : "New file selected"}
                    </S.FileName>
                  )}
                </S.FileInputWrapper>
                {experienceForm.certificatePreview && typeof experienceForm.certificatePreview === 'string' && 
                 experienceForm.certificatePreview.startsWith('blob:') && (
                  <S.FilePreview>
                    {isImageUrl(experienceForm.certificatePreview) ? (
                      <img src={experienceForm.certificatePreview} alt="Preview" />
                    ) : (
                      <span>PDF file ready for upload</span>
                    )}
                  </S.FilePreview>
                )}
              </S.FormGroup>
            </S.ModalBody>

            <S.ModalFooter>
              <S.ModalCancelButton onClick={() => setShowExperienceModal(false)}>
                Cancel
              </S.ModalCancelButton>
              <S.ModalSubmitButton onClick={handleSubmitExperience} disabled={experienceSubmitLoading}>
                {experienceSubmitLoading ? <S.LoadingSpinnerSmall /> : null}
                {experienceSubmitLoading ? "Saving..." : (editingExperience ? "Update Experience" : "Add Experience")}
              </S.ModalSubmitButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* Plan Add/Edit Modal */}
      {showPlanModal && (
        <S.ModalOverlay onClick={() => setShowPlanModal(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h2>{editingPlan ? "Edit Subscription Plan" : "Add Subscription Plan"}</h2>
              <S.ModalCloseButton onClick={() => setShowPlanModal(false)}>
                <FiX />
              </S.ModalCloseButton>
            </S.ModalHeader>
            
            <S.ModalBody>
              <S.FormGroup>
                <S.FormLabel>Plan Name *</S.FormLabel>
                <S.FormInput
                  type="text"
                  value={planForm.name}
                  onChange={(e) => handlePlanFormChange("name", e.target.value)}
                  placeholder="e.g., Basic, Premium, Pro"
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.FormLabel>Duration Type *</S.FormLabel>
                <S.FormSelect
                  value={planForm.duration_type}
                  onChange={(e) => handlePlanFormChange("duration_type", e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly (3 months)</option>
                  <option value="half_yearly">Half Yearly (6 months)</option>
                  <option value="yearly">Yearly (12 months)</option>
                </S.FormSelect>
              </S.FormGroup>

              <S.FormGroup>
                <S.FormLabel>Price * (₹)</S.FormLabel>
                <S.FormInput
                  type="number"
                  value={planForm.price}
                  onChange={(e) => handlePlanFormChange("price", e.target.value)}
                  placeholder="999"
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.FormLabel>Minutes Limit</S.FormLabel>
                <S.FormInput
                  type="number"
                  value={planForm.minutes_limit}
                  onChange={(e) => handlePlanFormChange("minutes_limit", e.target.value)}
                  placeholder="Unlimited if empty"
                />
                <S.FormHint>Total minutes available in this plan</S.FormHint>
              </S.FormGroup>

              <S.FormGroup>
                <S.FormLabel>Calls Limit</S.FormLabel>
                <S.FormInput
                  type="number"
                  value={planForm.calls_limit}
                  onChange={(e) => handlePlanFormChange("calls_limit", e.target.value)}
                  placeholder="Unlimited if empty"
                />
                <S.FormHint>Number of calls allowed</S.FormHint>
              </S.FormGroup>

              <S.CheckboxGroup>
                <S.CheckboxLabel>
                  <S.CheckboxInput
                    type="checkbox"
                    checked={planForm.call_enabled}
                    onChange={(e) => handlePlanFormChange("call_enabled", e.target.checked)}
                  />
                  Enable Call Support
                </S.CheckboxLabel>
                <S.CheckboxLabel>
                  <S.CheckboxInput
                    type="checkbox"
                    checked={planForm.chat_enabled}
                    onChange={(e) => handlePlanFormChange("chat_enabled", e.target.checked)}
                  />
                  Enable Chat Support
                </S.CheckboxLabel>
              </S.CheckboxGroup>
            </S.ModalBody>

            <S.ModalFooter>
              <S.ModalCancelButton onClick={() => setShowPlanModal(false)}>
                Cancel
              </S.ModalCancelButton>
              <S.ModalSubmitButton onClick={handleSubmitPlan} disabled={planSubmitLoading}>
                {planSubmitLoading ? <S.LoadingSpinnerSmall /> : null}
                {planSubmitLoading ? "Saving..." : (editingPlan ? "Update Plan" : "Add Plan")}
              </S.ModalSubmitButton>
            </S.ModalFooter>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* Followers/Reviews Modal */}
      <AppModal
        isOpen={modalConfig.open}
        title={
          modalConfig.type === "followers"
            ? "Followers"
            : "Ratings & Reviews"
        }
        onClose={closeModal}
      >
        {modalConfig.type === "followers" && (
          <FollowersContent
            followers={followersList.map((f) => ({
              ...f,
              avatar: <FiUser size={20} />,
            }))}
            total={followersCount}
            loading={followersLoading}
          />
        )}

        {modalConfig.type === "reviews" && (
          <ReviewsContent
            avgRating={avgRating}
            total={totalReviews}
            loading={reviewsLoading}
            reviews={reviewsList.map((r) => ({
              id: r.id,
              rating: r.rating_number,
              text: r.review_text,
              name:
                `${r.first_name || ""} ${r.last_name || ""}`.trim() || "User",
              avatar: <FiUser size={20} />,
              userId: r.user_id,
              createdAt: r.created_at,
            }))}
          />
        )}
      </AppModal>
    </>
  );
}
