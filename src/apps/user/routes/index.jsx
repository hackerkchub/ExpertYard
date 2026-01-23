import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

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
import Categories from "../components/HomeComponent/Categories";
import SubcategoryPage from "../pages/Subcategory/SubcategoryPage";

export default function UserAppRoutes() {
  return (
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
                <Route path="/subcategories/:categoryId" element={<SubcategoryPage />} />
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
  );
}