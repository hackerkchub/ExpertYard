// src/apps/admin/pages/ExpertDetail.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaBriefcase,
  FaFileAlt,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaRupeeSign,
  FaClock,
  FaCertificate,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaImage,
  FaTrash,
  FaEye,
  FaDollarSign,
  FaChartLine,
  FaUserShield
} from "react-icons/fa";

import {
  getFullExpertApi,
  getExpertAccessSettingsApi,
  updateExpertAccessSettingsApi,
  updateManagedExpertProfileApi,
  createManagedExpertPostApi,
  updateManagedExpertPostApi,
  createManagedExpertServiceApi,
  updateManagedExpertServiceApi,
  deleteManagedExpertServiceApi,
  updateManagedExpertPricingApi,
  createManagedExpertPlanApi,
  updateManagedExpertPlanApi,
  deleteManagedExpertPlanApi,
  createManagedExpertExperienceApi,
  updateManagedExpertExperienceApi,
  updateManagedExpertPasswordApi,
  createManagedExpertReelApi,
  updateManagedExpertReelApi,
  deleteManagedExpertReelApi,
  deleteExperienceApi,
  deletePostApi,
  deleteReviewApi
} from "../../../shared/api/admin/expert.api";

import {
  PageContainer,
  ContentWrapper,
  DetailHeader,
  HeaderLeft,
  BackButton,
  ExpertTitle,
  HeaderRight,
  ActionButton,
  StatsGrid,
  StatCard,
  StatIcon,
  StatLabel,
  StatValue,
  StatTrend,
  InfoCard,
  InfoGrid,
  InfoItem,
  DetailSection,
  Card,
  CardHeader,
  CardTitle,
  CardMeta,
  CardContent,
  RatingStars,
  DeleteButton,
  ViewButton,
  ButtonGroup,
  LoadingSpinner,
  EmptyState,
  PriceTag,
  PlanBadge
} from "../styles/expertDetail.styles";

const DEFAULT_EXPERT_IMAGE = "https://via.placeholder.com/160?text=Expert";

export default function ExpertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessSettings, setAccessSettings] = useState({});
  const [savingAccess, setSavingAccess] = useState(false);
  const [savingManage, setSavingManage] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingReel, setEditingReel] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);
  const [profileForm, setProfileForm] = useState({});
  const [pricingForm, setPricingForm] = useState({
    call_per_minute: "",
    video_call_per_minute: "",
    chat_per_minute: "",
    session_price: "",
    session_duration: "",
    pricing_modes: "per_minute,session",
  });
  const [planForm, setPlanForm] = useState({
    name: "",
    duration_type: "monthly",
    price: "",
    minutes_limit: "",
    calls_limit: "",
    call_enabled: true,
    chat_enabled: true,
    is_active: true,
  });
  const [experienceForm, setExperienceForm] = useState({
    title: "",
    company: "",
    start_date: "",
    end_date: "",
    certificate: null,
  });
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [postForm, setPostForm] = useState({ title: "", description: "", image: null });
  const [serviceForm, setServiceForm] = useState({
    title: "",
    price: "",
    category_id: "",
    subcategory_id: "",
    short_description: "",
    full_description: "",
    service_type: "consultation",
    status: "active",
    image: null,
  });
  const [reelForm, setReelForm] = useState({
    title: "",
    caption: "",
    description: "",
    category_id: "",
    subcategory_id: "",
    linked_service_id: "",
    status: "approved",
    video: null,
    thumbnail: null,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getFullExpertApi(id);
      console.log("API Response:", res.data);
      const detailData = res.data.data;
      setData(detailData);
      setAccessSettings(detailData?.effective_access || {});
      const expertData = detailData?.expert || {};
      const profileData = detailData?.profile || {};
      setProfileForm({
        name: expertData.name || profileData.name || "",
        email: expertData.email || profileData.email || "",
        phone: expertData.phone || profileData.phone || "",
        position: profileData.position || "",
        education: profileData.education || "",
        location: profileData.location || "",
        description: profileData.description || "",
        category_id: profileData.category_id || expertData.category_id || "",
        subcategory_id: profileData.subcategory_id || expertData.subcategory_id || "",
        profile_photo: null,
      });
      const priceData = detailData?.prices || {};
      setPricingForm({
        call_per_minute: priceData.call_per_minute || "",
        video_call_per_minute: priceData.video_call_per_minute || "",
        chat_per_minute: priceData.chat_per_minute || "",
        session_price: priceData.session_price || "",
        session_duration: priceData.session_duration || "",
        pricing_modes: normalizePricingModes(priceData.pricing_modes).join(",") || "per_minute,session",
      });

      try {
        const accessRes = await getExpertAccessSettingsApi(id);
        setAccessSettings(accessRes.data?.data?.effective_access || detailData?.effective_access || {});
      } catch (accessErr) {
        console.warn("Access settings endpoint failed, using detail response access data:", accessErr);
      }
    } catch (err) {
      console.error("Error fetching expert details:", err);
      alert("Failed to load expert details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (expId) => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await deleteExperienceApi(expId);
      fetchData();
      alert("Experience deleted successfully");
    } catch (err) {
      console.error("Delete experience error:", err);
      alert("Failed to delete experience");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePostApi(postId);
      fetchData();
      alert("Post deleted successfully");
    } catch (err) {
      console.error("Delete post error:", err);
      alert("Failed to delete post");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReviewApi(reviewId);
      fetchData();
      alert("Review deleted successfully");
    } catch (err) {
      console.error("Delete review error:", err);
      alert("Failed to delete review");
    }
  };

const truncateText = (text, maxLength = 200) => {
    if (!text || typeof text !== 'string') return 'No content available';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const resolveImageUrl = (value) => {
    if (!value) return DEFAULT_EXPERT_IMAGE;
    const text = String(value);
    if (/^https?:\/\//i.test(text)) return text;
    const clean = text.replace(/^\/+/, "");
    if (clean.startsWith("uploads/")) return `https://softmaxs.com/${clean}`;
    return `https://softmaxs.com/uploads/${clean}`;
  };

  const normalizePricingModes = (value) => {
    if (Array.isArray(value)) {
      return value.filter(Boolean).map(String);
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];

      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean).map(String);
        }
      } catch {
        // fall through to comma-separated parsing
      }

      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (value && typeof value === "object") {
      return Object.values(value).filter(Boolean).map(String);
    }

    return [];
  };

  const accessOptions = [
    ["show_in_user_module", "Show expert in User Module"],
    ["show_on_listing", "Show expert on listing page"],
    ["show_chat_button", "Show Chat button"],
    ["show_call_button", "Show Call button"],
    ["show_video_call_button", "Show Video Call button"],
    ["allow_video_call", "Allow Video Call"],
    ["video_call_enabled_by_admin", "Admin Video Call Enabled"],
    ["leads_enabled", "Enable Leads"],
    ["earnings_enabled", "Enable Earnings"],
    ["chat_history_enabled", "Enable Chat History"],
    ["services_enabled", "Enable Services"],
    ["my_content_enabled", "Enable My Content"],
    ["profile_edit_enabled", "Enable Profile Edit"],
    ["public_profile_enabled", "Enable Public Profile"],
    ["show_user_contact_in_expert_emails", "Show User Email/Phone in Expert Emails"],
  ];

  const profilePageAccessOptions = [
    ["show_chat_button_on_profile_page", "Show Chat Button on Expert Profile Page"],
    ["show_call_button_on_profile_page", "Show Call Button on Expert Profile Page"],
  ];

  const handleAccessToggle = async (field) => {
    const profilePageField = profilePageAccessOptions.some(([optionField]) => optionField === field);
    const currentValue = profilePageField ? accessSettings[field] !== false : Boolean(accessSettings[field]);
    const nextValue = !currentValue;
    try {
      setSavingAccess(true);
      setAccessSettings((prev) => ({ ...prev, [field]: nextValue }));
      const res = await updateExpertAccessSettingsApi(id, { [field]: nextValue });
      setAccessSettings(res.data?.data?.effective_access || {});
    } catch (err) {
      console.error("Access settings update error:", err);
      alert("Failed to update access settings");
      fetchData();
    } finally {
      setSavingAccess(false);
    }
  };

  const appendDefined = (formData, values) => {
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    return formData;
  };

  const toInputDate = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  const handleProfileFormChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    try {
      setSavingManage(true);
      const formData = appendDefined(new FormData(), profileForm);
      await updateManagedExpertProfileApi(id, formData);
      await fetchData();
      alert("Expert profile updated successfully");
    } catch (err) {
      console.error("Admin profile update error:", err);
      alert(err?.message || err || "Failed to update expert profile");
    } finally {
      setSavingManage(false);
    }
  };

  const handleSavePricing = async (event) => {
    event.preventDefault();
    try {
      setSavingManage(true);
      await updateManagedExpertPricingApi(id, pricingForm);
      await fetchData();
      alert("Pricing updated successfully");
    } catch (err) {
      console.error("Admin pricing save error:", err);
      alert(err?.message || err || "Failed to update pricing");
    } finally {
      setSavingManage(false);
    }
  };

  const resetPlanForm = () => {
    setEditingPlan(null);
    setPlanForm({
      name: "",
      duration_type: "monthly",
      price: "",
      minutes_limit: "",
      calls_limit: "",
      call_enabled: true,
      chat_enabled: true,
      is_active: true,
    });
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || "",
      duration_type: plan.duration_type || "monthly",
      price: plan.price || "",
      minutes_limit: plan.minutes_limit || "",
      calls_limit: plan.calls_limit || "",
      call_enabled: Boolean(plan.call_enabled),
      chat_enabled: Boolean(plan.chat_enabled),
      is_active: plan.is_active !== 0,
    });
  };

  const handleSavePlan = async (event) => {
    event.preventDefault();
    try {
      setSavingManage(true);
      const wasEditing = Boolean(editingPlan?.id);
      if (wasEditing) {
        await updateManagedExpertPlanApi(id, editingPlan.id, planForm);
      } else {
        await createManagedExpertPlanApi(id, planForm);
      }
      resetPlanForm();
      await fetchData();
      alert(wasEditing ? "Subscription plan updated successfully" : "Subscription plan created successfully");
    } catch (err) {
      console.error("Admin plan save error:", err);
      alert(err?.message || err || "Failed to save subscription plan");
    } finally {
      setSavingManage(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm("Disable this subscription plan?")) return;
    try {
      await deleteManagedExpertPlanApi(id, planId);
      await fetchData();
      alert("Subscription plan disabled successfully");
    } catch (err) {
      console.error("Admin plan delete error:", err);
      alert(err?.message || err || "Failed to disable subscription plan");
    }
  };

  const resetExperienceForm = () => {
    setEditingExperience(null);
    setExperienceForm({
      title: "",
      company: "",
      start_date: "",
      end_date: "",
      certificate: null,
    });
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
    setExperienceForm({
      title: experience.title || "",
      company: experience.company || "",
      start_date: toInputDate(experience.start_date),
      end_date: toInputDate(experience.end_date),
      certificate: null,
    });
  };

  const handleSaveExperience = async (event) => {
    event.preventDefault();
    try {
      setSavingManage(true);
      const wasEditing = Boolean(editingExperience?.id);
      const formData = appendDefined(new FormData(), experienceForm);
      if (wasEditing) {
        await updateManagedExpertExperienceApi(id, editingExperience.id, formData);
      } else {
        await createManagedExpertExperienceApi(id, formData);
      }
      resetExperienceForm();
      await fetchData();
      alert(wasEditing ? "Experience updated successfully" : "Experience added successfully");
    } catch (err) {
      console.error("Admin experience save error:", err);
      alert(err?.message || err || "Failed to save experience");
    } finally {
      setSavingManage(false);
    }
  };

  const resetPostForm = () => {
    setEditingPost(null);
    setPostForm({ title: "", description: "", image: null });
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title || "",
      description: post.description || post.content || "",
      image: null,
    });
  };

  const handleSavePost = async (event) => {
    event.preventDefault();
    try {
      setSavingManage(true);
      const wasEditing = Boolean(editingPost?.id);
      const formData = appendDefined(new FormData(), {
        title: postForm.title,
        description: postForm.description,
        image: postForm.image,
      });
      if (wasEditing) {
        await updateManagedExpertPostApi(id, editingPost.id, formData);
      } else {
        await createManagedExpertPostApi(id, formData);
      }
      resetPostForm();
      await fetchData();
      alert(wasEditing ? "Post updated successfully" : "Post created successfully");
    } catch (err) {
      console.error("Admin post save error:", err);
      alert(err?.message || err || "Failed to save post");
    } finally {
      setSavingManage(false);
    }
  };

  const resetReelForm = () => {
    setEditingReel(null);
    setReelForm({
      title: "",
      caption: "",
      description: "",
      category_id: profileForm.category_id || "",
      subcategory_id: profileForm.subcategory_id || "",
      linked_service_id: "",
      status: "approved",
      video: null,
      thumbnail: null,
    });
  };

  const handleEditReel = (reel) => {
    setEditingReel(reel);
    setReelForm({
      title: reel.title || "",
      caption: reel.caption || "",
      description: reel.description || "",
      category_id: reel.category_id || "",
      subcategory_id: reel.subcategory_id || "",
      linked_service_id: reel.linked_service_id || "",
      status: reel.status || "approved",
      video: null,
      thumbnail: null,
    });
  };

  const handleSaveReel = async (event) => {
    event.preventDefault();
    try {
      setSavingManage(true);
      const wasEditing = Boolean(editingReel?.id);
      const formData = appendDefined(new FormData(), reelForm);
      if (wasEditing) {
        await updateManagedExpertReelApi(editingReel.id, formData);
      } else {
        await createManagedExpertReelApi(id, formData);
      }
      resetReelForm();
      await fetchData();
      alert(wasEditing ? "Reel updated successfully" : "Reel created successfully");
    } catch (err) {
      console.error("Admin reel save error:", err);
      alert(err?.message || err || "Failed to save reel");
    } finally {
      setSavingManage(false);
    }
  };

  const handleDeleteReel = async (reelId) => {
    if (!window.confirm("Delete this reel?")) return;
    try {
      await deleteManagedExpertReelApi(reelId);
      await fetchData();
      alert("Reel deleted successfully");
    } catch (err) {
      console.error("Admin reel delete error:", err);
      alert(err?.message || err || "Failed to delete reel");
    }
  };

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm({
      title: "",
      price: "",
      category_id: profileForm.category_id || "",
      subcategory_id: profileForm.subcategory_id || "",
      short_description: "",
      full_description: "",
      service_type: "consultation",
      status: "active",
      image: null,
    });
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title || "",
      price: service.price || "",
      category_id: service.category_id || "",
      subcategory_id: service.subcategory_id || "",
      short_description: service.short_description || service.description || "",
      full_description: service.full_description || service.description || "",
      service_type: service.service_type || "consultation",
      status: service.status || "active",
      image: null,
    });
  };

  const handleSaveService = async (event) => {
    event.preventDefault();
    try {
      setSavingManage(true);
      const wasEditing = Boolean(editingService?.id);
      const formData = appendDefined(new FormData(), serviceForm);
      if (wasEditing) {
        await updateManagedExpertServiceApi(id, editingService.id, formData);
      } else {
        await createManagedExpertServiceApi(id, formData);
      }
      resetServiceForm();
      await fetchData();
      alert(wasEditing ? "Service updated successfully" : "Service created successfully");
    } catch (err) {
      console.error("Admin service save error:", err);
      alert(err?.message || err || "Failed to save service");
    } finally {
      setSavingManage(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteManagedExpertServiceApi(id, serviceId);
      await fetchData();
      alert("Service deleted successfully");
    } catch (err) {
      console.error("Admin service delete error:", err);
      alert(err?.message || err || "Failed to delete service");
    }
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      setSavingManage(true);
      await updateManagedExpertPasswordApi(id, { password: passwordForm.password });
      setPasswordForm({ password: "", confirmPassword: "" });
      alert("Expert password updated successfully");
    } catch (err) {
      console.error("Admin password update error:", err);
      alert(err?.message || err || "Failed to update password");
    } finally {
      setSavingManage(false);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }
    return <RatingStars>{stars}</RatingStars>;
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <p>Loading expert details...</p>
        </LoadingSpinner>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <EmptyState>
          <FaFileAlt size={48} />
          <h4>Expert not found</h4>
          <p>The expert you're looking for doesn't exist or has been removed</p>
          <BackButton onClick={() => navigate("/admin/expert-management")}>
            <FaArrowLeft /> Back to Experts
          </BackButton>
        </EmptyState>
      </PageContainer>
    );
  }

  const expert = data.expert || {};
  const profile = data.profile || {};
  const experiences = data.experience || [];
  const posts = data.posts || [];
  const reviews = data.reviews || [];
  const plans = data.plans || [];
  const prices = data.prices || {};
  const services = data.services || [];
  const reels = data.reels || [];
  const pricingModes = normalizePricingModes(prices.pricing_modes);

  const stats = {
    totalExperience: experiences.length,
    totalPosts: posts.length,
    totalReviews: reviews.length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + (r.rating_number || 0), 0) / reviews.length).toFixed(1)
      : 0
  };

  const formGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: 10,
    fontSize: 14,
  };

  const labelStyle = {
    display: "grid",
    gap: 6,
    color: "#334155",
    fontWeight: 600,
    fontSize: 13,
  };

  const managerFormStyle = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  };

  return (
    <PageContainer>
      <ContentWrapper>
        {/* Header */}
        <DetailHeader>
          <HeaderLeft>
            <BackButton onClick={() => navigate("/admin/expert-management")}>
              <FaArrowLeft /> Back to Experts
            </BackButton>
            <ExpertTitle>{expert.name || 'Unknown Expert'}</ExpertTitle>
          </HeaderLeft>
          <HeaderRight>
            {/* <ActionButton onClick={() => navigate(`/admin/expert-approval/${id}`)}>
              <FaCheckCircle /> Approve/Edit
            </ActionButton> */}
          </HeaderRight>
        </DetailHeader>

        {/* Stats Cards */}
        <StatsGrid>
          <StatCard>
            <StatIcon><FaBriefcase /></StatIcon>
            <StatLabel>Experience</StatLabel>
            <StatValue>{stats.totalExperience}</StatValue>
            <StatTrend>Years of expertise</StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon><FaFileAlt /></StatIcon>
            <StatLabel>Posts</StatLabel>
            <StatValue>{stats.totalPosts}</StatValue>
            <StatTrend>Articles published</StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon><FaStar /></StatIcon>
            <StatLabel>Reviews</StatLabel>
            <StatValue>{stats.totalReviews}</StatValue>
            <StatTrend $positive>{stats.avgRating} ⭐ average</StatTrend>
          </StatCard>

          <StatCard>
            <StatIcon><FaChartLine /></StatIcon>
            <StatLabel>Status</StatLabel>
            <StatValue>{expert.status === 1 ? 'Active' : 'Inactive'}</StatValue>
            <StatTrend $positive={expert.status === 1}>
              {expert.status === 1 ? 'Available' : 'Not available'}
            </StatTrend>
          </StatCard>
        </StatsGrid>

        {/* Basic Information */}
        <InfoCard>
          <h3><FaIdCard /> Basic Information</h3>
          <InfoGrid>
            <InfoItem>
              <strong>Full Name</strong>
              <span>{expert.name || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaEnvelope /> Email</strong>
              <span>{expert.email || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaPhone /> Phone</strong>
              <span>{expert.phone || profile.phone || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaMapMarkerAlt /> Location</strong>
              <span>{profile.location || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaCalendarAlt /> Joined</strong>
              <span>{formatDate(expert.created_at)}</span>
            </InfoItem>
            <InfoItem>
              <strong><FaChartLine /> Subscription</strong>
              <span>
                <PlanBadge $plan={expert.current_plan}>
                  {expert.current_plan || 'No plan'}
                </PlanBadge>
              </span>
            </InfoItem>
            <InfoItem>
              <strong>Category ID</strong>
              <span>{expert.category_id || 'N/A'}</span>
            </InfoItem>
            <InfoItem>
              <strong>Subcategory ID</strong>
              <span>{expert.subcategory_id || 'N/A'}</span>
            </InfoItem>
          </InfoGrid>
        </InfoCard>

        <InfoCard>
          <h3><FaUserShield /> Admin Expert Access Settings</h3>
          <p style={{ marginTop: 0, color: "#475569", lineHeight: 1.5 }}>
            Admin settings override subscription plan status.
          </p>
          <p style={{ color: "#64748b", lineHeight: 1.5 }}>
            If enabled here, the expert can use this feature even without a paid plan. If disabled here, the feature remains blocked even if the expert has a paid plan.
          </p>
          <InfoGrid>
            {accessOptions.map(([field, label]) => (
              <InfoItem key={field}>
                <strong>{label}</strong>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: savingAccess ? "wait" : "pointer" }}>
                  <input
                    type="checkbox"
                    checked={Boolean(accessSettings[field])}
                    disabled={savingAccess}
                    onChange={() => handleAccessToggle(field)}
                  />
                  <span>{accessSettings[field] ? "Enabled" : "Disabled"}</span>
                </label>
              </InfoItem>
            ))}
          </InfoGrid>
          <h4 style={{ margin: "20px 0 10px", color: "#0f172a" }}>Expert Profile Page Controls</h4>
          <p style={{ marginTop: 0, color: "#64748b", lineHeight: 1.5 }}>
            These controls affect only the user-side Expert Profile page. Listing, search, home, and other pages keep using the existing global controls.
          </p>
          <InfoGrid>
            {profilePageAccessOptions.map(([field, label]) => (
              <InfoItem key={field}>
                <strong>{label}</strong>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: savingAccess ? "wait" : "pointer" }}>
                  <input
                    type="checkbox"
                    checked={accessSettings[field] !== false}
                    disabled={savingAccess}
                    onChange={() => handleAccessToggle(field)}
                  />
                  <span>{accessSettings[field] !== false ? "Enabled" : "Disabled"}</span>
                </label>
              </InfoItem>
            ))}
          </InfoGrid>
        </InfoCard>

        <InfoCard>
          <h3><FaUserShield /> Admin Manage Expert Profile</h3>
          <form onSubmit={handleSaveProfile} style={managerFormStyle}>
            <div style={formGridStyle}>
              {[
                ["name", "Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["position", "Position"],
                ["education", "Education"],
                ["location", "Location"],
                ["category_id", "Category ID"],
                ["subcategory_id", "Subcategory ID"],
              ].map(([field, label]) => (
                <label key={field} style={labelStyle}>
                  {label}
                  <input
                    style={inputStyle}
                    value={profileForm[field] || ""}
                    onChange={(e) => handleProfileFormChange(field, e.target.value)}
                  />
                </label>
              ))}
              <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                Description
                <textarea
                  style={{ ...inputStyle, minHeight: 90 }}
                  value={profileForm.description || ""}
                  onChange={(e) => handleProfileFormChange("description", e.target.value)}
                />
              </label>
              <label style={labelStyle}>
                Profile Photo
                <input
                  style={inputStyle}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleProfileFormChange("profile_photo", e.target.files?.[0] || null)}
                />
              </label>
            </div>
            <ButtonGroup style={{ marginTop: 16 }}>
              <ActionButton type="submit" disabled={savingManage}>
                Save Profile
              </ActionButton>
            </ButtonGroup>
          </form>
        </InfoCard>

        <InfoCard>
          <h3><FaRupeeSign /> Admin Manage Call, Chat, Video & Session Prices</h3>
          <form onSubmit={handleSavePricing} style={managerFormStyle}>
            <div style={formGridStyle}>
              {[
                ["call_per_minute", "Voice Call Price / Min"],
                ["video_call_per_minute", "Video Call Price / Min"],
                ["chat_per_minute", "Chat Price / Min"],
                ["session_price", "Session Price"],
                ["session_duration", "Session Duration Minutes"],
              ].map(([field, label]) => (
                <label key={field} style={labelStyle}>
                  {label}
                  <input
                    style={inputStyle}
                    type="number"
                    min="0"
                    value={pricingForm[field] || ""}
                    onChange={(e) => setPricingForm((prev) => ({ ...prev, [field]: e.target.value }))}
                  />
                </label>
              ))}
              <label style={labelStyle}>
                Pricing Modes
                <input
                  style={inputStyle}
                  value={pricingForm.pricing_modes}
                  onChange={(e) => setPricingForm((prev) => ({ ...prev, pricing_modes: e.target.value }))}
                  placeholder="per_minute,session"
                />
              </label>
            </div>
            <ButtonGroup style={{ marginTop: 16 }}>
              <ActionButton type="submit" disabled={savingManage}>
                Save Pricing
              </ActionButton>
            </ButtonGroup>
          </form>
        </InfoCard>

        <DetailSection>
          <h3>
            <FaDollarSign /> Admin Manage Subscription Plans
            <span className="badge">{plans.length} plans</span>
          </h3>
          <form onSubmit={handleSavePlan} style={managerFormStyle}>
            <div style={formGridStyle}>
              <label style={labelStyle}>
                Plan Name
                <input style={inputStyle} value={planForm.name} onChange={(e) => setPlanForm((prev) => ({ ...prev, name: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                Duration
                <select style={inputStyle} value={planForm.duration_type} onChange={(e) => setPlanForm((prev) => ({ ...prev, duration_type: e.target.value }))}>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half_yearly">Half Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </label>
              <label style={labelStyle}>
                Price
                <input style={inputStyle} type="number" min="0" value={planForm.price} onChange={(e) => setPlanForm((prev) => ({ ...prev, price: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                Minutes Limit
                <input style={inputStyle} type="number" min="0" value={planForm.minutes_limit} onChange={(e) => setPlanForm((prev) => ({ ...prev, minutes_limit: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Calls Limit
                <input style={inputStyle} type="number" min="0" value={planForm.calls_limit} onChange={(e) => setPlanForm((prev) => ({ ...prev, calls_limit: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                <span>Call Enabled</span>
                <input type="checkbox" checked={planForm.call_enabled} onChange={(e) => setPlanForm((prev) => ({ ...prev, call_enabled: e.target.checked }))} />
              </label>
              <label style={labelStyle}>
                <span>Chat Enabled</span>
                <input type="checkbox" checked={planForm.chat_enabled} onChange={(e) => setPlanForm((prev) => ({ ...prev, chat_enabled: e.target.checked }))} />
              </label>
              <label style={labelStyle}>
                <span>Active</span>
                <input type="checkbox" checked={planForm.is_active} onChange={(e) => setPlanForm((prev) => ({ ...prev, is_active: e.target.checked }))} />
              </label>
            </div>
            <ButtonGroup style={{ marginTop: 16 }}>
              <ActionButton type="submit" disabled={savingManage}>{editingPlan ? "Update Plan" : "Create Plan"}</ActionButton>
              {editingPlan && <ViewButton type="button" onClick={resetPlanForm}>Cancel Edit</ViewButton>}
            </ButtonGroup>
          </form>
          {plans.length > 0 && (
            <InfoGrid>
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <ButtonGroup>
                      <ViewButton onClick={() => handleEditPlan(plan)}>Edit</ViewButton>
                      <DeleteButton onClick={() => handleDeletePlan(plan.id)}>Disable</DeleteButton>
                    </ButtonGroup>
                  </CardHeader>
                  <CardMeta>
                    <span><FaRupeeSign /> {plan.price}</span>
                    <span>{plan.duration_type}</span>
                    <span>{plan.is_active === 1 ? "Active" : "Inactive"}</span>
                  </CardMeta>
                  <CardContent>
                    Calls: {plan.call_enabled ? "Enabled" : "Disabled"} | Chat: {plan.chat_enabled ? "Enabled" : "Disabled"}
                  </CardContent>
                </Card>
              ))}
            </InfoGrid>
          )}
        </DetailSection>

        <InfoCard>
          <h3><FaUserShield /> Admin Update Expert Password</h3>
          <form onSubmit={handleSavePassword} style={managerFormStyle}>
            <div style={formGridStyle}>
              <label style={labelStyle}>
                New Password
                <input style={inputStyle} type="password" value={passwordForm.password} onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))} minLength={6} required />
              </label>
              <label style={labelStyle}>
                Confirm Password
                <input style={inputStyle} type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} minLength={6} required />
              </label>
            </div>
            <ButtonGroup style={{ marginTop: 16 }}>
              <ActionButton type="submit" disabled={savingManage}>
                Update Password
              </ActionButton>
            </ButtonGroup>
          </form>
        </InfoCard>

        {/* Profile Details */}
        {profile && Object.keys(profile).length > 0 && (
          <InfoCard>
            <h3><FaCertificate /> Professional Profile</h3>
            <InfoGrid>
              <InfoItem>
                <strong>Position</strong>
                <span>{profile.position || 'N/A'}</span>
              </InfoItem>
              <InfoItem>
                <strong><FaGraduationCap /> Education</strong>
                <span>{profile.education || 'N/A'}</span>
              </InfoItem>
              <InfoItem>
                <strong>Description</strong>
                <span>{profile.description || 'N/A'}</span>
              </InfoItem>
              {profile.profile_photo && (
                <InfoItem>
                  <strong>Profile Photo</strong>
                  <div>
                    <img 
                      src={resolveImageUrl(profile.profile_photo)} 
                      alt="Profile" 
                      style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => { e.currentTarget.src = DEFAULT_EXPERT_IMAGE; }}
                    />
                  </div>
                </InfoItem>
              )}
            </InfoGrid>
          </InfoCard>
        )}

        {/* Pricing Information */}
        {(prices.call_per_minute || prices.chat_per_minute || prices.session_price) && (
          <InfoCard>
            <h3><FaRupeeSign /> Pricing & Plans</h3>
            <InfoGrid>
              {prices.call_per_minute && (
                <InfoItem>
                  <strong>Call per minute</strong>
                  <PriceTag><FaRupeeSign /> {prices.call_per_minute}</PriceTag>
                </InfoItem>
              )}
              {prices.chat_per_minute && (
                <InfoItem>
                  <strong>Chat per minute</strong>
                  <PriceTag><FaRupeeSign /> {prices.chat_per_minute}</PriceTag>
                </InfoItem>
              )}
              {prices.session_price && (
                <InfoItem>
                  <strong>Session Price</strong>
                  <PriceTag><FaRupeeSign /> {prices.session_price}</PriceTag>
                </InfoItem>
              )}
              {prices.session_duration && (
                <InfoItem>
                  <strong>Session Duration</strong>
                  <span>{prices.session_duration} minutes</span>
                </InfoItem>
              )}
              <InfoItem>
                <strong>Pricing Modes</strong>
                <span>{pricingModes.length ? pricingModes.join(', ') : 'Not configured'}</span>
              </InfoItem>
            </InfoGrid>
          </InfoCard>
        )}

        {/* Subscription Plans */}
        {plans.length > 0 && (
          <DetailSection>
            <h3>
              <FaDollarSign /> Subscription Plans
              <span className="badge">{plans.length} plans</span>
            </h3>
            <InfoGrid>
              {plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <PriceTag><FaRupeeSign /> {plan.price}</PriceTag>
                  </CardHeader>
                  <CardMeta>
                    <span><FaClock /> {plan.duration_type}</span>
                    {plan.is_active === 1 && <span><FaCheckCircle style={{ color: '#10b981' }} /> Active</span>}
                  </CardMeta>
                  {plan.call_enabled === 1 && <span>📞 Calls enabled</span>}
                  {plan.chat_enabled === 1 && <span>💬 Chat enabled</span>}
                </Card>
              ))}
            </InfoGrid>
          </DetailSection>
        )}

        {/* Work Experience */}
        <DetailSection>
          <h3>
            <FaBriefcase /> Admin Manage Work Experience
            <span className="badge">{experiences.length} records</span>
          </h3>
          <form onSubmit={handleSaveExperience} style={managerFormStyle}>
            <div style={formGridStyle}>
              <label style={labelStyle}>
                Title / Role
                <input style={inputStyle} value={experienceForm.title} onChange={(e) => setExperienceForm((prev) => ({ ...prev, title: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                Company / Organization
                <input style={inputStyle} value={experienceForm.company} onChange={(e) => setExperienceForm((prev) => ({ ...prev, company: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                Start Date
                <input style={inputStyle} type="date" value={experienceForm.start_date} onChange={(e) => setExperienceForm((prev) => ({ ...prev, start_date: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                End Date
                <input style={inputStyle} type="date" value={experienceForm.end_date} onChange={(e) => setExperienceForm((prev) => ({ ...prev, end_date: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Certificate
                <input style={inputStyle} type="file" accept="image/*,application/pdf" onChange={(e) => setExperienceForm((prev) => ({ ...prev, certificate: e.target.files?.[0] || null }))} />
              </label>
            </div>
            <ButtonGroup style={{ marginTop: 16 }}>
              <ActionButton type="submit" disabled={savingManage}>{editingExperience ? "Update Experience" : "Add Experience"}</ActionButton>
              {editingExperience && <ViewButton type="button" onClick={resetExperienceForm}>Cancel Edit</ViewButton>}
            </ButtonGroup>
          </form>
          {experiences.length > 0 ? (
            experiences.map((exp) => (
              <Card key={exp.id}>
                <CardHeader>
                  <CardTitle>{exp.title}</CardTitle>
                  <ButtonGroup>
                    <ViewButton onClick={() => handleEditExperience(exp)}>Edit</ViewButton>
                    <DeleteButton onClick={() => handleDeleteExperience(exp.id)}>
                      <FaTrash /> Delete
                    </DeleteButton>
                  </ButtonGroup>
                </CardHeader>
                <CardMeta>
                  <span>{exp.company}</span>
                  <span>{formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}</span>
                </CardMeta>
                {exp.certificate && (
                  <CardMeta>
                    <span><FaCertificate /> Certificate available</span>
                  </CardMeta>
                )}
              </Card>
            ))
          ) : (
            <EmptyState>
              <FaBriefcase size={48} />
              <h4>No experience records</h4>
              <p>This expert hasn't added any work experience yet</p>
            </EmptyState>
          )}
        </DetailSection>

        {/* Posts / Articles */}
        <DetailSection>
          <h3>
            <FaFileAlt /> Admin Manage Posts
            <span className="badge">{posts.length} posts</span>
          </h3>
          <form onSubmit={handleSavePost} style={managerFormStyle}>
            <div style={formGridStyle}>
              <label style={labelStyle}>
                Post Title
                <input style={inputStyle} value={postForm.title} onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))} required />
              </label>
              <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                Description
                <textarea style={{ ...inputStyle, minHeight: 90 }} value={postForm.description} onChange={(e) => setPostForm((prev) => ({ ...prev, description: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                Image
                <input style={inputStyle} type="file" accept="image/*" onChange={(e) => setPostForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))} />
              </label>
            </div>
            <ButtonGroup style={{ marginTop: 16 }}>
              <ActionButton type="submit" disabled={savingManage}>{editingPost ? "Update Post" : "Create Post"}</ActionButton>
              {editingPost && <ViewButton type="button" onClick={resetPostForm}>Cancel Edit</ViewButton>}
            </ButtonGroup>
          </form>
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <ButtonGroup>
                    <ViewButton onClick={() => handleEditPost(post)}>Edit</ViewButton>
                    <DeleteButton onClick={() => handleDeletePost(post.id)}>
                      <FaTrash /> Delete
                    </DeleteButton>
                  </ButtonGroup>
                </CardHeader>
                <CardMeta>
                  <span><FaCalendarAlt /> {formatDate(post.created_at)}</span>
                  {post.likes !== undefined && <span>❤️ {post.likes} likes</span>}
                  {post.comments_count !== undefined && <span>💬 {post.comments_count} comments</span>}
                </CardMeta>
                {post.image_url && (
                  <img 
                    src={resolveImageUrl(post.image_url)} 
                    alt={post.title}
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '12px', marginTop: '12px' }}
                    onError={(e) => { e.currentTarget.src = DEFAULT_EXPERT_IMAGE; }}
                  />
                )}
                <CardContent>{truncateText(post.description || post.content)}</CardContent>
              </Card>
            ))
          ) : (
            <EmptyState>
              <FaFileAlt size={48} />
              <h4>No posts yet</h4>
              <p>This expert hasn't published any posts</p>
            </EmptyState>
          )}
        </DetailSection>

        <DetailSection>
          <h3>
            <FaImage /> Admin Manage Reels
            <span className="badge">{reels.length} reels</span>
          </h3>
          <form onSubmit={handleSaveReel} style={managerFormStyle}>
            <div style={formGridStyle}>
              <label style={labelStyle}>
                Title
                <input style={inputStyle} value={reelForm.title} onChange={(e) => setReelForm((prev) => ({ ...prev, title: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                Caption
                <input style={inputStyle} value={reelForm.caption} onChange={(e) => setReelForm((prev) => ({ ...prev, caption: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Category ID
                <input style={inputStyle} value={reelForm.category_id} onChange={(e) => setReelForm((prev) => ({ ...prev, category_id: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Subcategory ID
                <input style={inputStyle} value={reelForm.subcategory_id} onChange={(e) => setReelForm((prev) => ({ ...prev, subcategory_id: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Linked Service ID
                <input style={inputStyle} value={reelForm.linked_service_id} onChange={(e) => setReelForm((prev) => ({ ...prev, linked_service_id: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Status
                <select style={inputStyle} value={reelForm.status} onChange={(e) => setReelForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                Description
                <textarea style={{ ...inputStyle, minHeight: 90 }} value={reelForm.description} onChange={(e) => setReelForm((prev) => ({ ...prev, description: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Video
                <input style={inputStyle} type="file" accept="video/*" onChange={(e) => setReelForm((prev) => ({ ...prev, video: e.target.files?.[0] || null }))} />
              </label>
              <label style={labelStyle}>
                Thumbnail
                <input style={inputStyle} type="file" accept="image/*" onChange={(e) => setReelForm((prev) => ({ ...prev, thumbnail: e.target.files?.[0] || null }))} />
              </label>
            </div>
            <ButtonGroup style={{ marginTop: 16 }}>
              <ActionButton type="submit" disabled={savingManage}>{editingReel ? "Update Reel" : "Create Reel"}</ActionButton>
              {editingReel && <ViewButton type="button" onClick={resetReelForm}>Cancel Edit</ViewButton>}
            </ButtonGroup>
          </form>
          {reels.length > 0 ? (
            reels.map((reel) => (
              <Card key={reel.id}>
                <CardHeader>
                  <CardTitle>{reel.title || reel.caption || `Reel #${reel.id}`}</CardTitle>
                  <ButtonGroup>
                    <ViewButton onClick={() => handleEditReel(reel)}>Edit</ViewButton>
                    <DeleteButton onClick={() => handleDeleteReel(reel.id)}><FaTrash /> Delete</DeleteButton>
                  </ButtonGroup>
                </CardHeader>
                <CardMeta>
                  <span>{reel.status || "approved"}</span>
                  <span><FaCalendarAlt /> {formatDate(reel.created_at)}</span>
                </CardMeta>
              </Card>
            ))
          ) : (
            <EmptyState>
              <FaImage size={48} />
              <h4>No reels yet</h4>
              <p>Create a reel for this expert using the form above.</p>
            </EmptyState>
          )}
        </DetailSection>

        <DetailSection>
          <h3>
            <FaBriefcase /> Admin Manage Services
            <span className="badge">{services.length} services</span>
          </h3>
          <form onSubmit={handleSaveService} style={managerFormStyle}>
            <div style={formGridStyle}>
              <label style={labelStyle}>
                Service Title
                <input style={inputStyle} value={serviceForm.title} onChange={(e) => setServiceForm((prev) => ({ ...prev, title: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                Price
                <input style={inputStyle} type="number" min="0" value={serviceForm.price} onChange={(e) => setServiceForm((prev) => ({ ...prev, price: e.target.value }))} required />
              </label>
              <label style={labelStyle}>
                Category ID
                <input style={inputStyle} value={serviceForm.category_id} onChange={(e) => setServiceForm((prev) => ({ ...prev, category_id: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Subcategory ID
                <input style={inputStyle} value={serviceForm.subcategory_id} onChange={(e) => setServiceForm((prev) => ({ ...prev, subcategory_id: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Service Type
                <input style={inputStyle} value={serviceForm.service_type} onChange={(e) => setServiceForm((prev) => ({ ...prev, service_type: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Status
                <select style={inputStyle} value={serviceForm.status} onChange={(e) => setServiceForm((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                Short Description
                <textarea style={{ ...inputStyle, minHeight: 80 }} value={serviceForm.short_description} onChange={(e) => setServiceForm((prev) => ({ ...prev, short_description: e.target.value }))} />
              </label>
              <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>
                Full Description
                <textarea style={{ ...inputStyle, minHeight: 100 }} value={serviceForm.full_description} onChange={(e) => setServiceForm((prev) => ({ ...prev, full_description: e.target.value }))} />
              </label>
              <label style={labelStyle}>
                Service Image
                <input style={inputStyle} type="file" accept="image/*" onChange={(e) => setServiceForm((prev) => ({ ...prev, image: e.target.files?.[0] || null }))} />
              </label>
            </div>
            <ButtonGroup style={{ marginTop: 16 }}>
              <ActionButton type="submit" disabled={savingManage}>{editingService ? "Update Service" : "Create Service"}</ActionButton>
              {editingService && <ViewButton type="button" onClick={resetServiceForm}>Cancel Edit</ViewButton>}
            </ButtonGroup>
          </form>
          {services.length > 0 ? (
            services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle>{service.title}</CardTitle>
                  <ButtonGroup>
                    <ViewButton onClick={() => handleEditService(service)}>Edit</ViewButton>
                    <DeleteButton onClick={() => handleDeleteService(service.id)}><FaTrash /> Delete</DeleteButton>
                  </ButtonGroup>
                </CardHeader>
                <CardMeta>
                  <span><FaRupeeSign /> {service.price}</span>
                  <span>{service.status || "active"}</span>
                </CardMeta>
                <CardContent>{truncateText(service.short_description || service.description || service.full_description)}</CardContent>
              </Card>
            ))
          ) : (
            <EmptyState>
              <FaBriefcase size={48} />
              <h4>No services yet</h4>
              <p>Create a service for this expert using the form above.</p>
            </EmptyState>
          )}
        </DetailSection>

        {/* Reviews & Ratings */}
        <DetailSection>
          <h3>
            <FaStar /> Reviews & Ratings
            <span className="badge">{reviews.length} reviews</span>
          </h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div>
                    {renderRatingStars(review.rating_number || 0)}
                    <CardTitle style={{ marginTop: '8px' }}>
                      {review.first_name} {review.last_name}
                    </CardTitle>
                  </div>
                  <DeleteButton onClick={() => handleDeleteReview(review.id)}>
                    <FaTrash /> Delete Review
                  </DeleteButton>
                </CardHeader>
                <CardMeta>
                  <span><FaCalendarAlt /> {formatDate(review.created_at)}</span>
                </CardMeta>
                <CardContent>{review.review_text || 'No review text provided'}</CardContent>
              </Card>
            ))
          ) : (
            <EmptyState>
              <FaStar size={48} />
              <h4>No reviews yet</h4>
              <p>This expert hasn't received any reviews</p>
            </EmptyState>
          )}
        </DetailSection>
      </ContentWrapper>
    </PageContainer>
  );
}
