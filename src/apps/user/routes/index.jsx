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

import ProtectedRoute from "./ProtectedRoute";

export default function UserAppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* PUBLIC */}
        <Route index element={<HomePage />} />
        <Route path="/experts" element={<ExpertList />} />
        <Route path="/experts/:expertId" element={<ExpertProfile />} />
        <Route path="/call-chat" element={<CallChatExpert />} />
        <Route path="/auth" element={<UserAuth />} />

        {/* PROTECTED */}
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <WalletPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
