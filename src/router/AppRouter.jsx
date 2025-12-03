import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home/Home";
import MainLayout from "../layouts/MainLayout";
import ExpertList from "../pages/ExpertList/ExpertList";
import ExpertProfile from "../pages/ExpertProfile/ExpertProfile";
import WalletPage from "../pages/Wallet/Wallet";
import Chat from "../pages/Chat/Chat";
import BecomeExpert from "../pages/ExpertRegistration/ExpertRegistration";
// import AboutPage from "../pages/AboutPage";
// import ContactPage from "../pages/ContactPage";
// import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>

      {/* All pages wrapped inside MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/experts" element={<ExpertList />} />
       <Route path="/experts/:expertId" element={<ExpertProfile />} />
        <Route path="/wallet" element={<WalletPage />} />
       
        
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
      <Route path="/chat" element={<Chat />} />
       <Route path="/become-expert" element={<BecomeExpert />} />
    </Routes>
  );
}
