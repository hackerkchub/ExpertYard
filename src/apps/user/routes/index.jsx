import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ScrollToTop from "../components/ScrollToTop";
// Pages
import HomePage from "../pages/Home/Home";
import ExpertList from "../pages/ExpertList/ExpertList";
import ExpertProfile from "../pages/ExpertProfile/ExpertProfile";
import CallChatExpert from "../pages/CallChat/CallChatExpert";
import UserAuth from "../pages/UserAuth/UserAuth";
import WalletPage from "../pages/Wallet/Wallet";
import Chat from "../pages/Chat/Chat";
import UserChatHistory from "../pages/chat-history/UserChatHistory"; // ✅ NEW
import MyOffer from "../pages/MyOffers/MyOffer";
import ProtectedRoute from "./ProtectedRoute";
import VoiceCall from "../pages/voice-call/VoiceCall";
import Categories from "../pages/Category/Categories";
import SubcategoryPage from "../pages/Subcategory/SubcategoryPage";
import AboutUs from "../pages/About-Us/AboutUs"; // NEW
import HowItWorks from "../pages/how-it-work/HowItWorks"; // NEW
import Reviews from "../pages/reviews/Reviews";
import ExpertGuidelines from "../pages/Expert-Guideline/ExpertGuidelines";
import TermsAndConditions from "../pages/T&C/T&C";
import PrivacyPolicy from "../pages/Privacy-Policy/PrivacyPolicy";
import FAQ from "../pages/FAQ/Faq";
import ContactUs from "../pages/Contact-Us/ContactUs";
import Careers from "../pages/Careers/Career";

export default function UserAppRoutes() {
  return (
    <>
    <ScrollToTop/>
    <Routes>
      <Route element={<MainLayout />}>
        {/* PUBLIC ROUTES */}
        <Route index element={<HomePage />} />
        <Route path="/experts" element={<ExpertList />} />
        <Route path="/experts/:expertId" element={<ExpertProfile />} />
        <Route path="/call-chat" element={<CallChatExpert />} />
        <Route path="/auth" element={<UserAuth />} />
        <Route path="/my-offers" element={<MyOffer />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<AboutUs />} /> 
        <Route path="/how-it-works" element={<HowItWorks />} /> 
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/guidelines" element={<ExpertGuidelines />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/subcategories/:categoryId" element={<SubcategoryPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/careers" element={<Careers />} />
          <Route
          path="/voice-call/:expertId"
          element={
            <ProtectedRoute>
              <VoiceCall />
            </ProtectedRoute>
          }
        />
        {/* PROTECTED ROUTES */}
        {/* WALLET */}
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />

        {/* LIVE CHAT ROUTES */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:room_id"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* ✅ NEW: CHAT HISTORY ROUTES */}
        <Route
          path="/chat-history"
          element={
            <ProtectedRoute>
              <UserChatHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat-history/:session_id"
          element={
            <ProtectedRoute>
              <UserChatHistory />
            </ProtectedRoute>
          }
        />

        {/* ✅ ADD MORE PROTECTED ROUTES HERE IF NEEDED */}
      </Route>
      {/* <Route path="/earnings" element={<EarningDashboard />} /> */}

{/* NEW */}
      {/* FALLBACK 404 */}
      <Route path="*" element={
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column'
        }}>
          <h1>404 - Page Not Found</h1>
          <p>The page you're looking for doesn't exist.</p>
        </div>
      } />
    </Routes>
    </>
  );
}