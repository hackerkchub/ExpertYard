import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPhoneCall,
  FiMessageSquare,
  FiStar,
  FiUserPlus,
  FiUserCheck,
} from "react-icons/fi";

import {
  PageWrap,
  HeaderBar,
  BackButton,
  LeftColumn,
  FollowButton,
  MiniRating,
  VerifiedBadge,
  TopSection,
  LeftImage,
  RightInfo,
  Name,
  Role,
  Status,
  Section,
  SectionTitle,
  SectionBody,
  TwoColumn,
  ListItem,
  ActionButtons,
  ActionButton,
  PriceTag,
  ReviewBox,
  ReviewItem,
  ReviewUser,
  ReviewText,
  RatingRow,
} from "./ExpertProfile.styles";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";

const DEFAULT_AVATAR = "https://i.pravatar.cc/300?img=12";

const ExpertProfilePage = () => {
  const { expertId } = useParams();
  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  const { balance } = useWallet();

  const {
    expertData,
    expertPrice,
    fetchProfile,
    fetchPrice,
    profileLoading,
    priceLoading,
  } = useExpert();

  const [following, setFollowing] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (expertId) {
      fetchProfile(expertId);
      fetchPrice(expertId);
    }
  }, [expertId]);

  if (profileLoading || priceLoading) {
    return <div style={{ padding: 30 }}>Loading expert…</div>;
  }

  if (!expertData?.profile) {
    return <div style={{ padding: 30 }}>Expert not found.</div>;
  }

  const profile = expertData.profile;
  const price = expertPrice || {};

  /* ================= REVIEWS (SAFE DEFAULT) ================= */
  const reviews = profile.reviews || [
    { id: 1, name: "Amit", rating: 5, text: "Very helpful and professional." },
    { id: 2, name: "Neha", rating: 4, text: "Good guidance, worth it." },
  ];

  const avgRating =
    reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;

  /* ================= START CHAT / CALL ================= */
  const handleStart = (type) => {
    // 🔐 LOGIN CHECK
    if (!isLoggedIn) {
      navigate("/user/auth", {
        state: { from: `/experts/${expertId}` },
      });
      return;
    }

    const perMinute =
      type === "chat"
        ? Number(price.chat_per_minute || 0)
        : Number(price.call_per_minute || 0);

    const minRequired = perMinute * 5;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      // ✅ SUFFICIENT BALANCE
      if (type === "chat") {
        navigate("/user/chat"); // 🔥 CHAT SCREEN
      } else {
        alert("Call feature coming soon 🚧");
      }
    } else {
      // ❌ INSUFFICIENT BALANCE
      setRequiredAmount(minRequired - userBalance);
      setShowRecharge(true);
    }
  };

  return (
    <PageWrap>
      {/* HEADER */}
      <HeaderBar>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} /> Back
        </BackButton>
      </HeaderBar>

      {/* TOP SECTION */}
      <TopSection>
        {/* LEFT */}
        <LeftColumn>
          <LeftImage src={profile.profile_photo || DEFAULT_AVATAR} />

          <MiniRating>
            <FiStar color="#facc15" />
            {avgRating.toFixed(1)} ({reviews.length})
          </MiniRating>

          <FollowButton
            $active={following}
            onClick={() => setFollowing(!following)}
          >
            {following ? <FiUserCheck /> : <FiUserPlus />}
            {following ? "Following" : "Follow"}
          </FollowButton>
        </LeftColumn>

        {/* RIGHT */}
        <RightInfo>
          <Name>
            {profile.name}{" "}
            <VerifiedBadge>
              <FiUserCheck size={14} /> Verified
            </VerifiedBadge>
          </Name>

          <Role>{profile.position || "Expert"}</Role>
          <Status $online>🟢 Available Now</Status>

          <ActionButtons>
            <div>
              <PriceTag>₹{price.call_per_minute || 0} / min</PriceTag>
              <ActionButton
                $primary
                onClick={() => handleStart("call")}
              >
                <FiPhoneCall /> Start Call
              </ActionButton>
            </div>

            <div>
              <PriceTag>₹{price.chat_per_minute || 0} / min</PriceTag>
              <ActionButton onClick={() => handleStart("chat")}>
                <FiMessageSquare /> Start Chat
              </ActionButton>
            </div>
          </ActionButtons>
        </RightInfo>
      </TopSection>

      {/* ABOUT */}
      <Section>
        <SectionTitle>About</SectionTitle>
        <SectionBody>{profile.description || "—"}</SectionBody>
      </Section>

      {/* EDUCATION */}
      <Section>
        <SectionTitle>Education</SectionTitle>
        <ListItem>{profile.education || "—"}</ListItem>
      </Section>

      {/* EXPERTISE */}
      <Section>
        <SectionTitle>Expertise</SectionTitle>
        <TwoColumn>
          <div>
            <strong>Main Expertise:</strong>
            <ListItem>{profile.main_expertise || "—"}</ListItem>
          </div>
          <div>
            <strong>Sub Category:</strong>
            <ListItem>{profile.subcategory_name || "—"}</ListItem>
          </div>
        </TwoColumn>
      </Section>

      {/* REVIEWS */}
      <Section>
        <SectionTitle>Rating & Reviews</SectionTitle>

        <RatingRow>
          <FiStar color="#facc15" />
          <strong>{avgRating.toFixed(1)}</strong> / 5 ({reviews.length})
        </RatingRow>

        <ReviewBox>
          {reviews.map((r) => (
            <ReviewItem key={r.id}>
              <ReviewUser>
                {r.name} • ⭐ {r.rating}
              </ReviewUser>
              <ReviewText>{r.text}</ReviewText>
            </ReviewItem>
          ))}
        </ReviewBox>
      </Section>

      {/* 🔴 RECHARGE POPUP */}
      {showRecharge && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#0f172a",
              padding: 24,
              borderRadius: 14,
              width: 360,
              textAlign: "center",
              color: "#fff",
            }}
          >
            <h3>Insufficient Balance</h3>
            <p style={{ marginTop: 10, color: "#cbd5f5" }}>
              Recharge <strong>₹{requiredAmount}</strong> to continue.
            </p>

            <div style={{ marginTop: 20 }}>
              <ActionButton
                $primary
                onClick={() => navigate("/user/wallet")}
              >
                Recharge Now
              </ActionButton>

              <ActionButton
                style={{ marginLeft: 10 }}
                onClick={() => setShowRecharge(false)}
              >
                Cancel
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </PageWrap>
  );
};

export default ExpertProfilePage;
