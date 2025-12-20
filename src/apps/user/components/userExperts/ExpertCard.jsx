// src/apps/user/components/userExperts/ExpertCard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiPhoneCall, FiMessageSquare, FiMapPin } from "react-icons/fi";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";

import { getExpertPriceById } from "../../../../shared/api/expertapi/price.api";
import { getExpertFollowersApi } from "../../../../shared/api/expertApi/follower.api";
import { getReviewsByExpertApi } from "../../../../shared/api/expertApi/reviews.api";

import {
  Card,
  CardHeader,
  AvatarWrap,
  AvatarImg,
  StatusDot,
  NameRow,
  Name,
  Badge,
  Role,
  MetaRow,
  MetaItem,
  RatingStar,
  LangRow,
  LangChip,
  PriceRow,
  PriceLabel,
  PriceTag,
  ActionRow,
  PrimaryBtn,
  GhostBtn,
} from "./ExpertCard.styles";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

const ExpertCard = ({ data, mode, maxPrice }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { balance } = useWallet();

  const [callPrice, setCallPrice] = useState(data.callPrice || 0);
  const [chatPrice, setChatPrice] = useState(data.chatPrice || 0);
  const [followersCount, setFollowersCount] = useState(
    data.followersCount || 0
  );
  const [avgRating, setAvgRating] = useState(data.avgRating || 0);
  const [totalReviews, setTotalReviews] = useState(data.totalReviews || 0);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [showRecharge, setShowRecharge] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);

  const expertId = data.id;

  // Load price + followers + rating/reviews for this expert
  useEffect(() => {
    let cancelled = false;
    if (!expertId) return;

    const loadMeta = async () => {
      try {
        setLoadingMeta(true);

        // 1) PRICE
        const priceRes = await getExpertPriceById(expertId);
        const priceData = priceRes?.data?.data;
        if (!cancelled && priceData) {
          setCallPrice(Number(priceData.call_per_minute || 0));
          setChatPrice(Number(priceData.chat_per_minute || 0));
        }

        // 2) FOLLOWERS
        const followersRes = await getExpertFollowersApi(expertId);
        if (!cancelled && followersRes?.data) {
          setFollowersCount(
            followersRes.data.total_followers ||
              followersRes.data.followers?.length ||
              0
          );
        }

        // 3) REVIEWS
        const reviewsRes = await getReviewsByExpertApi(expertId);
        const rData = reviewsRes?.data?.data || {};
        if (!cancelled) {
          setAvgRating(Number(rData.avg_rating || 0));
          setTotalReviews(
            rData.total_reviews || (rData.reviews || []).length || 0
          );
        }
      } catch (err) {
        console.error("ExpertCard meta load failed:", err);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    };

    loadMeta();
    return () => {
      cancelled = true;
    };
  }, [expertId]);

  // Max price filter (card level) – agar price limit se upar ho to card hide
  const isHiddenByPrice = useMemo(() => {
    if (!maxPrice) return false;
    const mp = Number(maxPrice);
    if (!mp) return false;

    if (mode === "call") {
      return callPrice > mp;
    }
    if (mode === "chat") {
      return chatPrice > mp;
    }
    return false;
  }, [maxPrice, mode, callPrice, chatPrice]);

  if (isHiddenByPrice) {
    return null;
  }

  const handleViewProfile = () => {
    if (!expertId) return;
    navigate(`/user/experts/${expertId}`);
  };

  const handleStart = (type) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/user/experts/${expertId}` } });
      return;
    }

    const perMinute =
      type === "chat" ? Number(chatPrice || 0) : Number(callPrice || 0);

    // 5 min minimum
    const minRequired = perMinute * 5;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      if (type === "chat") {
        navigate("/user/chat");
      } else {
        // Call under development – same as ExpertProfilePage
        alert("Call feature coming soon 🚧");
      }
    } else {
      setRequiredAmount(minRequired - userBalance);
      setShowRecharge(true);
    }
  };

  const languages = data.languages && data.languages.length > 0
    ? data.languages
    : ["English", "Hindi"]; // default for now

  return (
    <>
      <Card>
        {/* HEADER */}
        <CardHeader>
          <AvatarWrap $isAI={false}>
            <AvatarImg src={data.profile_photo || DEFAULT_AVATAR} alt={data.name} />
            <StatusDot $online />
          </AvatarWrap>

          <div>
            <NameRow>
              <Name>{data.name}</Name>
              <Badge>Verified</Badge>
            </NameRow>
            <Role>{data.position || "Expert"}</Role>

            <MetaRow>
              <MetaItem>
                <FiMapPin size={12} />
                {data.location || "India"}
              </MetaItem>
              <MetaItem>
                <RatingStar>★</RatingStar>
                {avgRating ? avgRating.toFixed(1) : "—"} ({totalReviews})
              </MetaItem>
              <MetaItem>Followers: {followersCount}</MetaItem>
            </MetaRow>
          </div>
        </CardHeader>

        {/* SPECIALITY / LANGUAGES */}
        {data.speciality && (
          <MetaRow style={{ marginTop: 4 }}>
            <MetaItem>{data.speciality}</MetaItem>
          </MetaRow>
        )}

        <LangRow>
          {languages.map((lang) => (
            <LangChip key={lang}>{lang}</LangChip>
          ))}
        </LangRow>

        {/* PRICE */}
        <PriceRow>
          <div>
            <PriceLabel>Call Rate</PriceLabel>
            <PriceTag>₹{callPrice || 0} / min</PriceTag>
          </div>
          <div>
            <PriceLabel>Chat Rate</PriceLabel>
            <PriceTag>₹{chatPrice || 0} / min</PriceTag>
          </div>
        </PriceRow>

        {/* ACTIONS */}
        <ActionRow>
          {mode === "chat" ? (
            <PrimaryBtn
              disabled={loadingMeta || chatPrice <= 0}
              onClick={() => handleStart("chat")}
            >
              <FiMessageSquare size={14} /> Start Chat
            </PrimaryBtn>
          ) : (
            <PrimaryBtn
              disabled={loadingMeta || callPrice <= 0}
              onClick={() => handleStart("call")}
            >
              <FiPhoneCall size={14} /> Start Call
            </PrimaryBtn>
          )}

          <GhostBtn type="button" onClick={handleViewProfile}>
            View Profile
          </GhostBtn>
        </ActionRow>

        {loadingMeta && (
          <div style={{ marginTop: 6, fontSize: 11, color: "#64748b" }}>
            Loading details…
          </div>
        )}
      </Card>

      {/* Low balance popup */}
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
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              width: "min(90vw, 380px)",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: 12,
                color: "#0f172a",
              }}
            >
              Low Balance
            </h3>
            <p
              style={{
                margin: 0,
                marginBottom: 20,
                color: "#475569",
              }}
            >
              Need <strong>₹{requiredAmount.toFixed(2)}</strong> more.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
              }}
            >
              <PrimaryBtn onClick={() => navigate("/user/wallet")}>
                Recharge Now
              </PrimaryBtn>
              <GhostBtn onClick={() => setShowRecharge(false)}>
                Cancel
              </GhostBtn>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertCard;
