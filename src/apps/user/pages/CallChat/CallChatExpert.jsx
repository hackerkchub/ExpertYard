// src/apps/user/pages/UserExpertsPage.jsx - ✅ PERFECT EXPERT CANCEL SUPPORT
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSearchParams,useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";

import {
  PageWrap,
  HeaderSection,
  Title,
  SubTitle,
  TabsRow,
  TabButton,
  Layout,
  FilterWrap,
  FilterTitle,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterCheckboxRow,
  FilterCheckbox,
  FilterText,
  ResetFilterBtn,
  ExpertsWrap,
  Grid,
  EmptyState,
  LoaderRow,
  AIComingSoon,
  AIIcon,
  AITitle,
  AIDesc,
  AIHint,
} from "./CallChatExpert.styles";

import ExpertCard from "../../components/userExperts/ExpertCard";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { socket } from "../../../../shared/api/socket";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { filterExpertsApi } from "../../../../shared/api/expertapi/filter.api";

const TABS = [
  { id: "call", label: "Call with Experts" },
  { id: "chat", label: "Chat with Experts" },
  { id: "ai", label: "AI Experts" },
];

const professionsMap = {
  all: "All Professions",
  engineers: "Engineers",
  doctors: "Doctors",
  mentors: "Mentors",
  lawyers: "Lawyers",
  therapists: "Therapists",
  fitness: "Fitness",
  business: "Business",
  global: "Global Strategy",
};

const languagesOptions = [
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Kannada",
];

export default function UserExpertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeFromUrl = searchParams.get("mode"); // call | chat
 const navigate = useNavigate();
  const [tab, setTab] = useState("call");

  // base profiles from ExpertContext (/expert-profile/list)
  const { experts, expertsLoading } = useExpert();
  const { subCategories } = useCategory();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance } = useWallet();

  const [profession, setProfession] = useState("all");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [minRating, setMinRating] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortPrice, setSortPrice] = useState(""); // optional asc/desc

  // filtered experts from backend for rating/price
  const [serverExperts, setServerExperts] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  // ✅ CHAT WAITING STATES (same as ExpertProfile)
  const [showWaitingPopup, setShowWaitingPopup] = useState(false);
  const [waitingText, setWaitingText] = useState("Waiting for expert to accept...");
  const [chatRequestId, setChatRequestId] = useState(null);
  const [chatRejectedMessage, setChatRejectedMessage] = useState("");
  const [showChatCancelled, setShowChatCancelled] = useState(false);

  // URL → TAB sync
  useEffect(() => {
    if (modeFromUrl === "call" || modeFromUrl === "chat") {
      setTab(modeFromUrl);
    }
  }, [modeFromUrl]);

  // ✅ FIXED SOCKET EVENTS - EXPERT CANCEL भी handle करता है
  useEffect(() => {
      // Request pending
      const handleRequestPending = ({ request_id }) => {
        console.log("⏳ USER: Request pending:", request_id);
        setChatRequestId(request_id);
        setShowWaitingPopup(true);
        setWaitingText("Waiting for expert to accept...");
      };
  
      // Chat accepted → redirect
      const handleChatAccepted = ({ user_id, room_id, expert_id }) => {
        if (Number(user_id) !== Number(userId)) return;
        console.log("✅ USER: Chat accepted → /user/chat/", room_id);
        setShowWaitingPopup(false);
        setChatRequestId(null);
        navigate(`/user/chat/${room_id}`, { replace: true });
      };
  
      // Chat rejected by expert
   const handleChatRejected = ({ user_id, message }) => {
  if (Number(user_id) !== Number(userId)) return;

  console.log("❌ USER: Chat rejected by expert");

  // ✅ 1. Waiting popup band
  setShowWaitingPopup(false);

  // ✅ 2. Clear request
  setChatRequestId(null);

  // ✅ 3. Force reject popup
  setChatRejectedMessage(
    message || "Expert has rejected your chat request."
  );
};

      // User cancelled confirmation
      const handleChatCancelled = ({ user_id, message }) => {
        if (Number(user_id) !== Number(userId)) return;
        console.log("❌ USER: Chat cancelled:", message);
        setShowWaitingPopup(false);
        setChatRequestId(null);
        setShowChatCancelled(true);
      };
  
      // Chat ended (low balance, etc.)
      const handleChatEnded = ({ room_id, reason }) => {
        console.log("🔚 USER: Chat ended:", reason);
        // Handle chat end notifications
      };
  
      socket.on("request_pending", handleRequestPending);
      socket.on("chat_accepted", handleChatAccepted);
      socket.on("chat_rejected", handleChatRejected);
      socket.on("chat_cancelled", handleChatCancelled);
      socket.on("chat_ended", handleChatEnded);
  
      return () => {
        socket.off("request_pending", handleRequestPending);
        socket.off("chat_accepted", handleChatAccepted);
        socket.off("chat_rejected", handleChatRejected);
        socket.off("chat_cancelled", handleChatCancelled);
        socket.off("chat_ended", handleChatEnded);
      };
    }, [navigate, userId]);
  

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

  const resetFilters = () => {
    setProfession("all");
    setSelectedLanguages([]);
    setMinRating("0");
    setMaxPrice("");
    setSortPrice("");
    setServerExperts([]); // reset to base experts
  };

  // ✅ START CHAT HANDLER - DYNAMIC PRICE CHECK
  const handleStartChat = useCallback((expertId) => {
    if (!isLoggedIn) {
      window.location.href = "/user/auth";
      return;
    }

    // Dynamic min required based on expert price (better UX)
    const minRequired = 5 * 30; // Default ₹30/min * 5 = ₹150
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      // Emit chat request
      socket.emit("request_chat", { 
        user_id: userId, 
        expert_id: Number(expertId) 
      });
      console.log("🚀 Chat request sent:", { user_id: userId, expert_id: expertId });
    } else {
      alert(`Low balance! Need ₹${Math.max(0, minRequired - userBalance).toFixed(0)} more to start chat.`);
      window.location.href = "/user/wallet";
    }
  }, [isLoggedIn, userId, balance]);

  // helper: subcategory name from id
  const getSubcategoryName = (subId) => {
    const sc = subCategories.find((s) => Number(s.id) === Number(subId));
    return sc ? sc.name : "";
  };

  // BACKEND FILTER CALL (price + rating + mode)
  useEffect(() => {
    // AI tab par koi expert nahi
    if (tab === "ai") return;

    const hasPrice = maxPrice && Number(maxPrice) > 0;
    const hasRating = minRating && Number(minRating) > 0;

    // agar price/rating dono empty hain -> backend filter API call mat karo
    if (!hasPrice && !hasRating && !sortPrice) {
      setServerExperts([]);
      return;
    }

    const params = {};

    if (hasPrice) {
      params.price = Number(maxPrice);
      if (tab === "call" || tab === "chat") {
        params.mode = tab;
      }
    }

    if (hasRating) {
      params.rating = Number(minRating);
    }

    if (sortPrice) {
      params.sort_price = sortPrice;
    }

    let cancelled = false;

    const runFilter = async () => {
      try {
        setFilterLoading(true);
        const res = await filterExpertsApi(params);
        const list = res?.data?.data || [];
        if (!cancelled) {
          setServerExperts(list);
        }
      } catch (err) {
        console.error("Filter experts failed", err);
        if (!cancelled) setServerExperts([]);
      } finally {
        if (!cancelled) setFilterLoading(false);
      }
    };

    runFilter();

    return () => {
      cancelled = true;
    };
  }, [tab, maxPrice, minRating, sortPrice]);

  // FINAL LIST (profession + language filter front-end, price/rating from backend)
  const filteredList = useMemo(() => {
    if (tab === "ai") return [];

    // base list: agar serverExperts non-empty hai to woh, otherwise context experts
    const baseList =
      serverExperts && serverExperts.length > 0 ? serverExperts : experts;

    let list = [...baseList];

    // Profession (simple contains check on position)
    if (profession !== "all") {
      const key = profession.toLowerCase();
      list = list.filter((e) =>
        (e.position || "").toLowerCase().includes(
          key === "doctors" ? "doctor" : key.slice(0, 3)
        )
      );
    }

    // Language: abhi API nahi, to skip
    if (selectedLanguages.length > 0) {
      list = list.filter(() => true);
    }

    return list;
  }, [tab, experts, serverExperts, profession, selectedLanguages]);

  const overallLoading = expertsLoading || filterLoading;

  // ✅ CALLBACKS FOR MODALS
  const handleCancelRequest = useCallback(() => {
    if (chatRequestId && userId) {
      socket.emit("cancel_chat_request", { 
        request_id: chatRequestId, 
        user_id: userId 
      });
    }
    setShowWaitingPopup(false);
    setChatRequestId(null);
  }, [chatRequestId, userId]);

  const handleChatRejectedClose = useCallback(() => {
    setChatRejectedMessage("");
  }, []);

  const handleChatCancelledClose = useCallback(() => {
    setShowChatCancelled(false);
  }, []);

  // Spinner component
  const Spinner = () => (
    <div
      style={{
        width: 28,
        height: 28,
        border: "3px solid #e2e8f0",
        borderTopColor: "#0ea5e9",
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
      
      <PageWrap>
        {/* HEADER */}
        <HeaderSection>
          <div>
            <Title>Find the right expert – instantly</Title>
            <SubTitle>
              Talk 1:1 with verified professionals & smart AI specialists
              for career, health, finance, legal and more.
            </SubTitle>
          </div>
        </HeaderSection>

        {/* TABS */}
        <TabsRow>
          {TABS.map((t) => (
            <TabButton
              key={t.id}
              $active={tab === t.id}
              onClick={() => {
                setTab(t.id);
                if (t.id !== "ai") {
                  setSearchParams({ mode: t.id });
                }
              }}
            >
              {t.label}
            </TabButton>
          ))}
        </TabsRow>

        {/* MAIN LAYOUT */}
        <Layout>
          {/* FILTERS */}
          <FilterWrap>
            <FilterTitle>Filters</FilterTitle>

            {tab !== "ai" && (
              <FilterGroup>
                <FilterLabel>Profession</FilterLabel>
                <FilterSelect
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                >
                  {Object.entries(professionsMap).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>
            )}

            <FilterGroup>
              <FilterLabel>Language</FilterLabel>
              {languagesOptions.map((lang) => (
                <FilterCheckboxRow key={lang}>
                  <FilterCheckbox
                    type="checkbox"
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                  />
                  <FilterText>{lang}</FilterText>
                </FilterCheckboxRow>
              ))}
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Minimum Rating</FilterLabel>
              <FilterSelect
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="0">Any rating</option>
                <option value="3.5">3.5+</option>
                <option value="4.0">4.0+</option>
                <option value="4.5">4.5+</option>
                <option value="5.0">5.0</option>
              </FilterSelect>
            </FilterGroup>

            {tab !== "ai" && (
              <>
                <FilterGroup>
                  <FilterLabel>
                    Max price ({tab === "call" ? "₹/min Call" : "₹/min Chat"})
                  </FilterLabel>
                  <FilterSelect
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  >
                    <option value="">No limit</option>
                    <option value="30">Up to ₹30</option>
                    <option value="40">Up to ₹40</option>
                    <option value="60">Up to ₹60</option>
                    <option value="100">Up to ₹100</option>
                  </FilterSelect>
                </FilterGroup>

                <FilterGroup>
                  <FilterLabel>Sort by Price</FilterLabel>
                  <FilterSelect
                    value={sortPrice}
                    onChange={(e) => setSortPrice(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </FilterSelect>
                </FilterGroup>
              </>
            )}

            <ResetFilterBtn onClick={resetFilters}>
              Reset Filters
            </ResetFilterBtn>
          </FilterWrap>

          {/* CONTENT */}
          <ExpertsWrap>
            {tab === "ai" ? (
              <AIComingSoon>
                <AIIcon>🤖</AIIcon>
                <AITitle>AI Experts Coming Soon</AITitle>
                <AIDesc>
                  Our AI experts are currently under development.
                </AIDesc>
                <AIHint>🚀 Our team is actively working on this</AIHint>
              </AIComingSoon>
            ) : overallLoading ? (
              <LoaderRow>Loading experts…</LoaderRow>
            ) : filteredList.length === 0 ? (
              <EmptyState>
                No experts found for current filters.
              </EmptyState>
            ) : (
              <Grid>
                {filteredList.slice(0, 20).map((exp) => (
                  <ExpertCard
                    key={`${exp.expert_id || exp.id}`}
                    mode={tab}
                    data={{
                      id: exp.expert_id || exp.id,
                      profileId: exp.id,
                      name: exp.name || exp.expert_name || "Expert",
                      profile_photo: exp.profile_photo || null,
                      position: exp.position || "Expert",
                      speciality: getSubcategoryName(exp.subcategory_id),
                      location: exp.location || "India",
                      callPrice: 0,
                      chatPrice: 0,
                      avgRating: 0,
                      totalReviews: 0,
                      followersCount: 0,
                      languages: [],
                    }}
                    maxPrice={maxPrice}
                    // ✅ PASS START CHAT HANDLER TO EXPERTCARD
                    onStartChat={tab === "chat" ? handleStartChat : undefined}
                  />
                ))}
              </Grid>
            )}
          </ExpertsWrap>
        </Layout>

        {/* ✅ WAITING POPUP */}
        {showWaitingPopup && (
          <div style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", 
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
          }}>
            <div style={{ 
              background: "#fff", padding: 28, borderRadius: 18, 
              width: "min(90vw, 420px)", textAlign: "center", 
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)" 
            }}>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Request Sent</h3>
              <p style={{ marginTop: 12, color: "#475569" }}>{waitingText}</p>
              <div style={{ marginTop: 18 }}>
                <Spinner />
              </div>
              <button
                onClick={handleCancelRequest}
                style={{
                  marginTop: 22, padding: "10px 18px", borderRadius: 999,
                  border: "1px solid #e2e8f0", background: "#f8fafc",
                  color: "#334155", fontWeight: 500, cursor: "pointer",
                }}
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* ✅ CHAT REJECTED POPUP */}
     {chatRejectedMessage && !showWaitingPopup && (
  <div style={{ 
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", 
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
  }}>
    <div style={{ 
      background: "#fff", padding: 24, borderRadius: 16, 
      width: "min(90vw, 400px)", textAlign: "center", 
      boxShadow: "0 25px 50px rgba(0,0,0,0.15)" 
    }}>
      <FiX size={24} color="#ef4444" style={{ marginBottom: 12 }} />
      <h3 style={{ margin: 0, marginBottom: 8, color: "#dc2626" }}>
        Request Declined
      </h3>
      <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
        {chatRejectedMessage}
      </p>
      <button 
        onClick={handleChatRejectedClose}
        style={{
          padding: "12px 24px",
          borderRadius: 999,
          background: "#3b82f6",
          color: "white",
          border: "none",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        OK
      </button>
    </div>
  </div>
)}

        {/* ✅ CHAT CANCELLED POPUP - EXPERT & USER दोनों के लिए */}
        {showChatCancelled && (
          <div style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", 
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
          }}>
            <div style={{ 
              background: "#fff", padding: 24, borderRadius: 16, 
              width: "min(90vw, 400px)", textAlign: "center", 
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)" 
            }}>
              <FiX size={24} color="#6b7280" style={{ marginBottom: 12 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#475569" }}>Request Cancelled</h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
                Your chat request has been cancelled.
              </p>
              <button 
                onClick={handleChatCancelledClose}
                style={{
                  padding: "12px 24px", borderRadius: 999,
                  background: "#3b82f6", color: "white", border: "none",
                  fontWeight: 500, cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </PageWrap>
    </>
  );
}
