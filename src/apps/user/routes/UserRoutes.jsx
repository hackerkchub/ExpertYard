import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import WalletPage from "../pages/Wallet/Wallet";
import Chat from "../pages/Chat/Chat";
import MainLayout from "../layouts/MainLayout";

export default function UserRoutes() {
  const isLoggedIn = true; // TODO: use auth context

  if (!isLoggedIn) return <Navigate to="/" />;

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}
