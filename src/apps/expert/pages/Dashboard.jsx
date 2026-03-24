import React, { useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/ExpertSidebar";
import Topbar from "../components/ExpertTopbar";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";
import { useExpert } from "../../../shared/context/ExpertContext";
import { useWebPush } from "../../../shared/hooks/useWebPush";

import StatsCard from "../components/StatsCard";
import QueueCard from "../components/QueueCard";

import {
  Layout,
  MainContent,
  ContentInner,
  Welcome,
  StatsRow,
} from "../styles/Dashboard.styles";

export default function Dashboard() {
  const { expertData, profileLoading, expertPrice, priceLoading } = useExpert();
  const navigate = useNavigate();
  const { unreadCount, chatUnreadCount, callUnreadCount } = useExpertNotifications();

  // Calculate price status
  const callPrice = parseFloat(expertPrice?.call_per_minute);
const chatPrice = parseFloat(expertPrice?.chat_per_minute);

const safeCall = isNaN(callPrice) ? 0 : callPrice;
const safeChat = isNaN(chatPrice) ? 0 : chatPrice;

const isPriceMissing = safeCall <= 0 && safeChat <= 0;

  const expertId = useMemo(() => {
    if (!expertData) return null;
    return expertData.expert_id || expertData.id || expertData?.expert?.id || expertData?.profile?.expert_id || null;
  }, [expertData]);

  const expertName = expertData?.profile?.name || expertData?.name || "Expert";

  const { supported, permission, enable } = useWebPush({
    panel: "expert",
    userId: expertId,
  });

  const stats = [
    { label: "Live Requests", value: String(unreadCount) },
    { label: "Call Requests", value: String(callUnreadCount) },
    { label: "Pending Chats", value: String(chatUnreadCount) },
  ];
const hasShownToast = useRef(false);

useEffect(() => {
  if (!isPriceMissing) {
    hasShownToast.current = false;
  }
}, [isPriceMissing]);
  // ✅ FIX 1 & 2: Safer price check with proper toast control
 useEffect(() => {
  if (profileLoading || priceLoading) return;
  if (!expertPrice || typeof expertPrice !== "object") return;

  if (isPriceMissing && !hasShownToast.current) {
    hasShownToast.current = true;
    toast.warning("⚠️ Please set your price to start receiving clients");
  }

}, [expertPrice, profileLoading, priceLoading, isPriceMissing]);

  // ✅ Optional: Check if price is set on mount
  // useEffect(() => {
  //   if (!profileLoading && !priceLoading && expertPrice && isPriceMissing) {
  //     console.log("Price missing - showing warning banner");
  //   }
  // }, [profileLoading, priceLoading, expertPrice, isPriceMissing]);

  // ✅ FIX 3: Check if price data is loaded before showing banner
  const shouldShowBanner =
  !profileLoading &&
  !priceLoading &&
  expertPrice &&
  typeof expertPrice.id === "number" &&
  isPriceMissing;

  return (
    <Layout>
      <Sidebar />

      <MainContent>
        <Topbar />

        {/* ✅ FIX 3: Price Warning Banner with proper condition */}
        {shouldShowBanner && (
          <div style={{
            background: "#fff7ed",
            border: "1px solid #fdba74",
            color: "#9a3412",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            animation: "slideDown 0.3s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>⚠️</span>
              <span>
                <strong>Price not set!</strong> Set your price to start receiving client requests.
              </span>
            </div>
            <button
              onClick={() => navigate("/expert/profile")}
              style={{
                background: "#ea580c",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => e.target.style.background = "#c2410c"}
              onMouseLeave={(e) => e.target.style.background = "#ea580c"}
            >
              Set Price →
            </button>
          </div>
        )}

        <ContentInner>
          <Welcome>
            {profileLoading ? (
              <span style={{ opacity: 0.7 }}>Loading...</span>
            ) : (
              `Welcome, ${expertName}`
            )}
          </Welcome>

          {/* Minimal Push Notification Banner */}
          {supported && permission === "default" && (
            <div style={{
              background: "#fff",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "12px 20px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "14px", color: "#666" }}>
                🔔 Enable desktop notifications to never miss a client request.
              </span>
              <button 
                onClick={enable}
                style={{ background: "none", border: "none", color: "#0a66c2", fontWeight: "700", cursor: "pointer" }}
              >
                Enable
              </button>
            </div>
          )}

          <StatsRow>
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                label={stat.label}
                value={stat.value}
              />
            ))}
          </StatsRow>

          <QueueCard />

          {/* ✅ FIX 3: Helpful tip with proper condition */}
          {shouldShowBanner && (
            <div style={{
              marginTop: "24px",
              padding: "16px",
              background: "#fef9e7",
              borderRadius: "8px",
              border: "1px solid #ffe6b3",
              textAlign: "center"
            }}>
              <p style={{ margin: 0, color: "#b45309", fontSize: "14px" }}>
                💡 Tip: Set competitive pricing to attract more clients. You can always update it later.
              </p>
            </div>
          )}
        </ContentInner>
      </MainContent>
    </Layout>
  );
}