import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// Public pages
import HomePage from "../pages/Home/Home";
import ExpertList from "../pages/ExpertList/ExpertList";
import ExpertProfile from "../pages/ExpertProfile/ExpertProfile";
import CallChatExpert from "../pages/CallChat/CallChatExpert";
import UserAuth from "../pages/UserAuth/UserAuth";
// Auth pages
import WalletPage from "../pages/Wallet/Wallet";
import Chat from "../pages/Chat/Chat";

export default function UserAppRoutes() {
  const isLoggedIn = true; // TODO: auth context

  return (
    <Routes>
      <Route element={<MainLayout />}>
        
        {/* PUBLIC */}
        <Route index element={<HomePage />} />
        <Route path="/experts" element={<ExpertList />} />
        <Route path="/experts/:expertId" element={<ExpertProfile />} />
        <Route path="/call-chat" element={<CallChatExpert />} />
        <Route path="/auth" element={<UserAuth />} />
    </Route>
        {/* AUTH */}
        {!isLoggedIn ? (
          <>
            <Route path="/wallet" element={<Navigate to="/" />} />
            <Route path="/chat" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/chat" element={<Chat />} />
          </>
        )}
       
    </Routes>
  );
}
