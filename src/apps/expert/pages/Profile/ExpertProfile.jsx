import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import OtpModal from "../../components/OtpModal";
import AppModal from "../../../../shared/components/AppModal";
import FollowersContent from "../../../../shared/components/modal-contents/FollowersContent";
import ReviewsContent from "../../../../shared/components/modal-contents/ReviewsContent";
import {
  updateExpertProfileApi,
  savePriceApi,
  getExpertFollowersApi
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
import { toast } from "react-hot-toast";

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
  
  FiClock
} from "react-icons/fi";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { useCategory } from "../../../../shared/context/CategoryContext";
import {
  getCategoryNameById,
  getSubCategoryNameById
} from "../../../../shared/utils/categoryMapper";

import * as S from "./ExpertProfile.styles";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

// Utility function to check if URL is an image
const isImageUrl = (url) => {
  if (!url) return false;
  return url.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp|ico)$/i) !== null;
};

// Utility to check if string is a blob URL
const isBlobUrl = (url) =>
  typeof url === "string" && url.startsWith("blob:");

export default function ExpertProfile() {
  const {
    expertData,
    expertPrice,
    profileLoading,
    priceLoading,
    refreshPrice,
    refreshProfile
  } = useExpert();

  const { categories, subCategories, loadSubCategories } = useCategory();

  const [edit, setEdit] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isContactVerified, setIsContactVerified] = useState(true);
  const [draft, setDraft] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [hoveredDoc, setHoveredDoc] = useState(null);

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

  // INIT DRAFT
  useEffect(() => {
    if (!edit && expertData?.profile) {
      setDraft({
        name: expertData.name || "",
        title: expertData.position || "",
        email: expertData.email || "",
        phone: expertData.phone || "",
        description: expertData.profile.description || "",
        education: expertData.profile.education || "",
        location: expertData.profile.location || "",
        callRate: expertPrice?.call_per_minute || 0,
        chatRate: expertPrice?.chat_per_minute || 0,
        documents: {
          photo: expertData.profile_photo || DEFAULT_AVATAR,
          experience_certificate: expertData.profile.experience_certificate,
          marksheet: expertData.profile.marksheet,
          aadhar_card: expertData.profile.aadhar_card
        }
      });
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
      toast.error("Failed to load experience data");
      setExperiences([]);
      setTotalExperience({ years: 0, months: 0 });
    } finally {
      setExperiencesLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

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

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      setSaveLoading(true);
      
      if (contactChanged && !isContactVerified) {
        setShowOtp(true);
        setSaveLoading(false);
        return;
      }

      if (!expertId) {
        console.error("Missing expertId");
        toast.error("Expert ID not found");
        setSaveLoading(false);
        return;
      }

      const profilePayload = {
        name: draft.name,
        position: draft.title,
        email: draft.email,
        phone: draft.phone,
        description: draft.description,
        education: draft.education,
        location: draft.location
      };

      if (draft.documents.photoFile)
        profilePayload.profile_photo = draft.documents.photoFile;

      if (draft.documents.experience_certificateFile)
        profilePayload.experience_certificate = draft.documents.experience_certificateFile;

      if (draft.documents.marksheetFile)
        profilePayload.marksheet = draft.documents.marksheetFile;

      if (draft.documents.aadhar_cardFile)
        profilePayload.aadhar_card = draft.documents.aadhar_cardFile;

      const pricePayload = {
        expert_id: expertId,
        call_per_minute: draft.callRate,
        chat_per_minute: draft.chatRate,
        reason_for_price: "",
        handle_customer: "",
        strength: "",
        weakness: ""
      };

      await Promise.all([
        updateExpertProfileApi(expertId, profilePayload),
        savePriceApi(pricePayload)
      ]);

      await Promise.all([refreshProfile(), refreshPrice()]);
      
      toast.success("Profile updated successfully!");
      
      setEdit(false);
      setDraft(null);
    } catch (err) {
      console.error("Save failed", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setEdit(false);
    setDraft(null);
  };

  // ================= EXPERIENCE CRUD OPERATIONS =================
  
  // Open modal for adding experience
  const handleAddExperience = () => {
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

  // Open modal for editing experience
  const handleEditExperience = (exp) => {
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

  // Handle experience form input change
  const handleExperienceFormChange = (field, value) => {
    setExperienceForm(prev => ({ ...prev, [field]: value }));
  };

  // Handle certificate file change
  const handleCertificateChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up old preview URL if exists
    if (experienceForm.certificatePreview && typeof experienceForm.certificatePreview === 'string' && experienceForm.certificatePreview.startsWith('blob:')) {
      URL.revokeObjectURL(experienceForm.certificatePreview);
    }

    setExperienceForm(prev => ({
      ...prev,
      certificate: file,
      certificatePreview: URL.createObjectURL(file)
    }));
  };

  // Submit experience (add or update)
  const handleSubmitExperience = async () => {
    // Validation
    if (!experienceForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!experienceForm.start_date) {
      toast.error("Start date is required");
      return;
    }
    if (experienceForm.end_date && experienceForm.end_date < experienceForm.start_date) {
      toast.error("End date cannot be before start date");
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
        // Update existing experience
        await updateExperienceApi(editingExperience.id, formData);
        toast.success("Experience updated successfully!");
      } else {
        // Add new experience
        await addExperienceApi(formData);
        toast.success("Experience added successfully!");
      }

      // Reload experiences
      await loadExperiences();
      
      // Close modal
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
      toast.error(err.response?.data?.message || "Failed to save experience");
    } finally {
      setExperienceSubmitLoading(false);
    }
  };

  // Delete experience
  const handleDeleteExperience = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    try {
      await deleteExperienceApi(id);
      toast.success("Experience deleted successfully!");
      await loadExperiences();
    } catch (err) {
      console.error("Failed to delete experience", err);
      toast.error(err.response?.data?.message || "Failed to delete experience");
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
      toast.error("Failed to load followers");
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
      toast.error("Failed to load reviews");
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

  // Memoize stats
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

                  <S.ExpertCategories>
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
                  <S.ActionButton primary onClick={() => setEdit(true)}>
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

          {/* Pricing Cards */}
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
          </S.PremiumTabs>

          {/* Tab Content */}
          <S.TabContent>
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
                          <S.PremiumInput
                            value={draft.location}
                            onChange={e => setDraft({ ...draft, location: e.target.value })}
                            placeholder="City, Country"
                          />
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
                  <S.CategoriesList>
                    <S.CategoryTag>
                      {categoryName || "Category"}
                    </S.CategoryTag>
                    {subCategoryName && (
                      <S.CategoryTag>
                        {subCategoryName}
                      </S.CategoryTag>
                    )}
                  </S.CategoriesList>
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
                  {/* Experience Certificate - This is from profile documents, not experience list */}
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

                  {/* Marksheet */}
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

                  {/* Aadhar Card */}
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
                {experienceSubmitLoading ? <S.LoadingSpinnerSmall /> : (editingExperience ? "" : "")}
                {experienceSubmitLoading ? "Saving..." : (editingExperience ? "Update Experience" : "Add Experience")}
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