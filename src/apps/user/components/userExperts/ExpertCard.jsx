// src/apps/user/components/userExperts/ExpertCard.jsx - ✅ FIXED NO SOCKET
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiPhoneCall, FiMessageSquare, FiMapPin, FiX } from "react-icons/fi";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";

import { getExpertPriceById } from "../../../../shared/api/expertapi/price.api";
import { getExpertFollowersApi } from "../../../../shared/api/expertapi/follower.api";
import { getReviewsByExpertApi } from "../../../../shared/api/expertapi/reviews.api";

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

const ExpertCard = ({ data, mode, maxPrice, onStartChat }) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance } = useWallet();

  const [callPrice, setCallPrice] = useState(data.callPrice || 0);
  const [chatPrice, setChatPrice] = useState(data.chatPrice || 0);
  const [followersCount, setFollowersCount] = useState(data.followersCount || 0);
  const [avgRating, setAvgRating] = useState(data.avgRating || 0);
  const [totalReviews, setTotalReviews] = useState(data.totalReviews || 0);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [showRecharge, setShowRecharge] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);

  const expertId = data.id;

  // ✅ NO SOCKET LISTENERS HERE - ONLY EMIT

  // Load price + followers + rating/reviews
  useEffect(() => {
    let cancelled = false;
    if (!expertId) return;

    const loadMeta = async () => {
      try {
        setLoadingMeta(true);

        const priceRes = await getExpertPriceById(expertId);
        const priceData = priceRes?.data?.data;
        if (!cancelled && priceData) {
          setCallPrice(Number(priceData.call_per_minute || 0));
          setChatPrice(Number(priceData.chat_per_minute || 0));
        }

        const followersRes = await getExpertFollowersApi(expertId);
        if (!cancelled && followersRes?.data) {
          setFollowersCount(
            followersRes.data.total_followers ||
              followersRes.data.followers?.length ||
              0
          );
        }

        const reviewsRes = await getReviewsByExpertApi(expertId);
        const rData = reviewsRes?.data?.data || {};
        if (!cancelled) {
          setAvgRating(Number(rData.avg_rating || 0));
          setTotalReviews(rData.total_reviews || (rData.reviews || []).length || 0);
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

  // Max price filter
  const isHiddenByPrice = useMemo(() => {
    if (!maxPrice) return false;
    const mp = Number(maxPrice);
    if (!mp) return false;

    if (mode === "call") return callPrice > mp;
    if (mode === "chat") return chatPrice > mp;
    return false;
  }, [maxPrice, mode, callPrice, chatPrice]);

  if (isHiddenByPrice) return null;

  // ✅ SIMPLIFIED START CHAT - ONLY CALL PARENT OR EMIT
  const handleStartChatLocal = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/user/experts/${expertId}` } });
      return;
    }

    if (onStartChat) {
      // ✅ PARENT HANDLER (UserExpertsPage)
      onStartChat(expertId);
      return;
    }

    // ✅ LOCAL EMIT (standalone)
    const perMinute = Number(chatPrice || 0);
    const minRequired = perMinute * 5;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      window.socket?.emit("request_chat", { 
        user_id: userId, 
        expert_id: Number(expertId) 
      });
      console.log("🚀 CARD: Direct chat request:", expertId);
    } else {
      setRequiredAmount(Math.max(0, minRequired - userBalance));
      setShowRecharge(true);
    }
  }, [isLoggedIn, onStartChat, expertId, chatPrice, balance, userId, navigate]);

  const handleStartCall = useCallback(() => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: `/user/experts/${expertId}` } });
      return;
    }
    alert("Call feature coming soon 🚧");
  }, [isLoggedIn, expertId, navigate]);

  const handleViewProfile = useCallback(() => {
    navigate(`/user/experts/${expertId}`);
  }, [expertId, navigate]);

  const handleRechargeClose = useCallback(() => {
    setShowRecharge(false);
    setRequiredAmount(0);
  }, []);

  const languages = data.languages && data.languages.length > 0
    ? data.languages
    : ["English", "Hindi"];

  const Spinner = () => (
    <div
      style={{
        width: 28,
        height: 28,
        border: "3px solid #e2e8f0",
        borderTopColor: "#10b981",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto",
      }}
    />
  );

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <Card>
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

        <ActionRow>
          {mode === "chat" ? (
            <PrimaryBtn
              disabled={loadingMeta || chatPrice <= 0 || !isLoggedIn}
              onClick={handleStartChatLocal}
            >
              <FiMessageSquare size={14} /> Start Chat
            </PrimaryBtn>
          ) : (
            <PrimaryBtn
              disabled={loadingMeta || callPrice <= 0 || !isLoggedIn}
              onClick={handleStartCall}
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

      {/* ✅ ONLY LOW BALANCE POPUP */}
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
            <h3 style={{ margin: 0, marginBottom: 12, color: "#0f172a" }}>
              Low Balance
            </h3>
            <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
              Need <strong>₹{requiredAmount.toFixed(2)}</strong> more for 5 minutes.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <PrimaryBtn onClick={() => navigate("/user/wallet")}>
                Recharge Now
              </PrimaryBtn>
              <GhostBtn onClick={handleRechargeClose}>Cancel</GhostBtn>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpertCard;
