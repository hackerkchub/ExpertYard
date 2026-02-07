import React, { useEffect, useState } from "react";
import OtpModal from "../../components/OtpModal";
import AppModal from "../../../../shared/components/AppModal";
import FollowersContent from "../../../../shared/components/modal-contents/FollowersContent";
import ReviewsContent from "../../../../shared/components/modal-contents/ReviewsContent";
import {
  updateExpertProfileApi,
  updateExpertPriceApi,
  getExpertFollowersApi
} from "../../../../shared/api/expertapi";

import {
  addOrUpdateReviewApi,
  getReviewsByExpertApi,
  deleteReviewApi,
} from "../../../../shared/api/expertapi/reviews.api";

import {
  PageWrap,
  Content,
  GlassCard,
  HeaderRow,
  HexAvatar,
  StatusDot,
  Name,
  Title,
  Badge,
  UpdateBtn,
  RateGrid,
  RateCard,
  RateValue,
  Tabs,
  Tab,
  Section,
  Label,
  Value,
  Input,
  Slider,
  DocRow,
  DocPreview,
  EditActions,
  StatRow,
  StatPill,
  ChipButton
} from "./ExpertProfile.styles";

import {
  FiEdit,
  FiCheck,
  FiX,
  FiCamera,
  FiPhoneCall,
  FiMessageCircle,
  FiUser
} from "react-icons/fi";

// CONTEXTS
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useCategory } from "../../../../shared/context/CategoryContext";

// MAPPERS
import {
  getCategoryNameById,
  getSubCategoryNameById
} from "../../../../shared/utils/categoryMapper";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

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
    type: null // "followers" | "reviews"
  });

  const expertId = expertData?.expertId || expertData?.id;

  // INIT DRAFT (PROFILE + PRICE)
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

  // LOAD SUBCATEGORIES (BY CATEGORY)
  useEffect(() => {
    if (expertData?.profile?.category_id) {
      loadSubCategories(expertData.profile.category_id);
    }
  }, [expertData?.profile?.category_id, loadSubCategories]);

  // FOLLOWER COUNT (header stat)
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

  // LOAD REVIEWS (for avg + count) – using new response shape
  useEffect(() => {
    if (!expertId) return;

    setReviewsLoading(true);
    getReviewsByExpertApi(expertId)
      .then(res => {
        // New API shape:
        // { success: true, data: { reviews: [...], total_reviews, avg_rating } }
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

  if (profileLoading || priceLoading || !draft) {
    return <div style={{ padding: 40 }}>Loading profile...</div>;
  }

  // RESOLVE CATEGORY NAMES
  const categoryName = getCategoryNameById(
    expertData?.profile?.category_id,
    categories
  );

  const subCategoryName = getSubCategoryNameById(
    expertData?.profile?.subcategory_id,
    subCategories
  );

  // PHOTO PREVIEW (sirf edit mode)
 const handlePhotoChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setDraft(prev => ({
    ...prev,
    documents: {
      ...prev.documents,
      photoFile: file, // actual file
      photo: URL.createObjectURL(file) // preview
    }
  }));
};

  // DOCUMENT PREVIEW UPDATE (edit mode)
  const handleDocChange = (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDraft(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: URL.createObjectURL(file)
      }
    }));
  };

  const contactChanged =
    !!draft &&
    (draft.email !== expertData.email || draft.phone !== expertData.phone);

  // SAVE
  const handleSave = async () => {
    try {
      if (contactChanged && !isContactVerified) {
        setShowOtp(true);
        return;
      }

      if (!expertId) {
        console.error("Missing expertId");
        return;
      }

      const profilePayload = {
        name: draft.name,
        position: draft.title,
        email: draft.email,
        phone: draft.phone,
        description: draft.description,
        education: draft.education,
        location: draft.location,
        profile_photo: draft.documents.photoFile,
        experience_certificate: draft.documents.experience_certificate,
        marksheet: draft.documents.marksheet,
        aadhar_card: draft.documents.aadhar_card
      };

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
        updateExpertPriceApi(pricePayload)
      ]);

      await Promise.all([refreshProfile(), refreshPrice()]);
      setEdit(false);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  // FOLLOWERS MODAL OPEN + LIST LOAD (dynamic)
  const openFollowersModal = async () => {
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
    } finally {
      setFollowersLoading(false);
    }
  };

  // REVIEWS MODAL OPEN (dynamic, with name + icon avatar)
  const openReviewsModal = async () => {
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
    } finally {
      setReviewsLoading(false);
    }
  };

  const closeModal = () => setModalConfig({ open: false, type: null });

  return (
    <>
      <PageWrap>
        <Content>
          {/* HEADER */}
          <GlassCard>
            <HeaderRow>
              <HexAvatar>
                <img src={draft.documents.photo} alt="profile" />
                <StatusDot />

                {edit && (
                  <label
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 40,
                      zIndex: 5,
                      background: "#38bdf8",
                      padding: "6px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      boxShadow: "0 6px 20px rgba(107, 110, 116, 0.35)"
                    }}
                  >
                    <FiCamera color="#fff" size={16} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </HexAvatar>

              <div style={{ flex: 1, minWidth: 220 }}>
                {edit ? (
                  <Input
                    value={draft.name}
                    onChange={e =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                  />
                ) : (
                  <Name>{draft.name}</Name>
                )}

                {edit ? (
                  <Input
                    value={draft.title}
                    onChange={e =>
                      setDraft({ ...draft, title: e.target.value })
                    }
                    style={{ marginTop: 10 }}
                  />
                ) : (
                  <Title>{draft.title}</Title>
                )}

                <Badge>✔ Verified Expert</Badge>

                <StatRow>
                  <StatPill
                    onClick={openFollowersModal}
                    style={{ cursor: "pointer" }}
                  >
                    Followers <span>{followersCount}</span>
                  </StatPill>

                  <StatPill
                    onClick={openReviewsModal}
                    style={{ cursor: "pointer" }}
                  >
                    Ratings &amp; Reviews{" "}
                    <span>
                      {avgRating ? avgRating.toFixed(1) : "—"} ★ • {totalReviews}
                    </span>
                  </StatPill>
                </StatRow>
              </div>

              {!edit && (
                <UpdateBtn onClick={() => setEdit(true)}>
                  <FiEdit /> Update Profile
                </UpdateBtn>
              )}
            </HeaderRow>
          </GlassCard>

          {/* PRICING */}
          <RateGrid>
            <RateCard>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "radial-gradient(circle at 0 0,#e0f2fe,rgba(255,255,255,0.4))"
                  }}
                >
                  <FiPhoneCall size={26} color="#0284c7" />
                </div>
                <div>
                  <Label>Voice Call Rate</Label>
                  <Value>Per minute</Value>
                </div>
              </div>

              <div style={{ flex: 1, marginLeft: 24 }}>
                {edit && (
                  <Slider
                    type="range"
                    min="10"
                    max="500"
                    value={draft.callRate}
                    onChange={e =>
                      setDraft({ ...draft, callRate: Number(e.target.value) })
                    }
                  />
                )}
              </div>

              <RateValue>₹{draft.callRate} / min</RateValue>
            </RateCard>

            <RateCard>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "radial-gradient(circle at 0 0,#dcfce7,rgba(255,255,255,0.4))"
                  }}
                >
                  <FiMessageCircle size={26} color="#16a34a" />
                </div>
                <div>
                  <Label>Chat Rate</Label>
                  <Value>Text consultation</Value>
                </div>
              </div>

              <div style={{ flex: 1, marginLeft: 24 }}>
                {edit && (
                  <Slider
                    type="range"
                    min="5"
                    max="200"
                    value={draft.chatRate}
                    onChange={e =>
                      setDraft({ ...draft, chatRate: Number(e.target.value) })
                    }
                  />
                )}
              </div>

              <RateValue>₹{draft.chatRate} / min</RateValue>
            </RateCard>
          </RateGrid>

          {/* TABS */}
          <Tabs>
            <Tab
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </Tab>
            <Tab
              active={activeTab === "experience"}
              onClick={() => setActiveTab("experience")}
            >
              Experience &amp; Education
            </Tab>
          </Tabs>

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <Section>
              <Label>Email</Label>
              {edit ? (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Input
                    value={draft.email}
                    onChange={e =>
                      setDraft({ ...draft, email: e.target.value })
                    }
                  />
                  {draft.email !== expertData.email && (
                    <ChipButton
                      type="button"
                      onClick={() => {
                        setIsContactVerified(false);
                        setShowOtp(true);
                      }}
                    >
                      Verify
                    </ChipButton>
                  )}
                </div>
              ) : (
                <Value>{draft.email}</Value>
              )}

              <Label>Phone</Label>
              {edit ? (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Input
                    value={draft.phone}
                    onChange={e =>
                      setDraft({ ...draft, phone: e.target.value })
                    }
                  />
                  {draft.phone !== expertData.phone && (
                    <ChipButton
                      type="button"
                      onClick={() => {
                        setIsContactVerified(false);
                        setShowOtp(true);
                      }}
                    >
                      Verify
                    </ChipButton>
                  )}
                </div>
              ) : (
                <Value>{draft.phone}</Value>
              )}

              <Label>Category</Label>
              <Value>{categoryName || "—"}</Value>

              <Label>Sub Category</Label>
              <Value>{subCategoryName || "—"}</Value>

              <Label>Location</Label>
              {edit ? (
                <Input
                  value={draft.location}
                  onChange={e =>
                    setDraft({ ...draft, location: e.target.value })
                  }
                />
              ) : (
                <Value>{draft.location}</Value>
              )}

              <Label>Description</Label>
              {edit ? (
                <Input
                  value={draft.description}
                  onChange={e =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                />
              ) : (
                <Value>{draft.description}</Value>
              )}
            </Section>
          )}

          {/* EXPERIENCE + DOCUMENTS */}
          {activeTab === "experience" && (
            <Section>
              <Label>Education</Label>
              {edit ? (
                <Input
                  value={draft.education}
                  onChange={e =>
                    setDraft({ ...draft, education: e.target.value })
                  }
                />
              ) : (
                <Value>{draft.education}</Value>
              )}

              <Label style={{ marginTop: 24 }}>Experience Certificate</Label>
              <DocRow>
                <div style={{ position: "relative" }}>
                  <DocPreview src={draft.documents.experience_certificate} />
                  {edit && (
                    <label
                      style={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        background: "#0ea5e9",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 10,
                        cursor: "pointer"
                      }}
                    >
                      Change
                      <input
                        type="file"
                        hidden
                        accept="image/*,.pdf"
                        onChange={e =>
                          handleDocChange("experience_certificate", e)
                        }
                      />
                    </label>
                  )}
                </div>
              </DocRow>

              <Label>Marksheet</Label>
              <DocRow>
                <div style={{ position: "relative" }}>
                  <DocPreview src={draft.documents.marksheet} />
                  {edit && (
                    <label
                      style={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        background: "#0ea5e9",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 10,
                        cursor: "pointer"
                      }}
                    >
                      Change
                      <input
                        type="file"
                        hidden
                        accept="image/*,.pdf"
                        onChange={e => handleDocChange("marksheet", e)}
                      />
                    </label>
                  )}
                </div>
              </DocRow>

              <Label>Aadhar Card</Label>
              <DocRow>
                <div style={{ position: "relative" }}>
                  <DocPreview src={draft.documents.aadhar_card} />
                  {edit && (
                    <label
                      style={{
                        position: "absolute",
                        bottom: 6,
                        right: 6,
                        background: "#0ea5e9",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: 999,
                        fontSize: 10,
                        cursor: "pointer"
                      }}
                    >
                      Change
                      <input
                        type="file"
                        hidden
                        accept="image/*,.pdf"
                        onChange={e => handleDocChange("aadhar_card", e)}
                      />
                    </label>
                  )}
                </div>
              </DocRow>
            </Section>
          )}

          {/* SAVE / CANCEL */}
          {edit && (
            <EditActions>
              <button
                style={{ background: "#0ea5ff", color: "#fff" }}
                onClick={handleSave}
              >
                <FiCheck /> Save Changes
              </button>

              <button
                style={{ background: "#f1f5f9" }}
                onClick={() => {
                  setEdit(false);
                  setDraft(null);
                }}
              >
                <FiX /> Cancel
              </button>
            </EditActions>
          )}
        </Content>
      </PageWrap>

      {/* OTP modal */}
      {showOtp && (
        <OtpModal
          onClose={() => setShowOtp(false)}
          onSuccess={() => {
            setIsContactVerified(true);
            setShowOtp(false);
          }}
        />
      )}

      {/* Followers / Reviews modal */}
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
