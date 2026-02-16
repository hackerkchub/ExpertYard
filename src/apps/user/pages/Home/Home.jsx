// src/apps/user/pages/Home/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import Slider from "../../components/HomeSlider/HomeSlider";
import Categories from "../../components/HomeComponent/Categories";

// NEW COMPONENTS
import Hero from "../../components/HomeComponent/Hero";
import Experts from "../../components/HomeComponent/Experts";
import HowItWorks from "../../components/HomeComponent/HowItWorks";
import Testimonials from "../../components/HomeComponent/Testimonials";
import "./Home.css";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWebPush } from "../../../../shared/hooks/useWebPush";


import { FiUserCheck, FiMessageCircle } from "react-icons/fi";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

const {
  supported,
  permission,     // "default" | "granted" | "denied"
  isSubscribed,
  enable,
  loading,
} = useWebPush({
  panel: "user",
  userId: user?.id,
});


  return (
    <>
      <Hero />
      {isLoggedIn && supported && permission === "default" && (
  <div
    style={{
      margin: "16px auto",
      maxWidth: 1200,
      background: "#0f172a",
      color: "white",
      padding: "14px 18px",
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    }}
  >
    <div style={{ fontSize: 14 }}>
      🔔 Enable notifications to get instant chat updates.
    </div>

    <button
      disabled={loading}
      onClick={async () => {
        try {
          await enable();
        } catch (e) {
          alert(e?.message || "Permission failed");
        }
      }}
      style={{
        padding: "10px 16px",
        borderRadius: 999,
        border: "none",
        background: "white",
        color: "#0f172a",
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {loading ? "Enabling..." : "Allow"}
    </button>
  </div>
)}

      
      <div className="section-wrapper">
        <div className="section-header">
          <h2>Categories</h2>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/user/categories')}
          >
            View All Categories
          </button>
        </div>
        <Categories />
      </div>
      
        <Experts />
     

      <HowItWorks />
      {/* <Testimonials /> */}
    </>
  );
};

export default HomePage;