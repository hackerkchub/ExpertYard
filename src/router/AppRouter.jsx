import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
// import AboutPage from "../pages/AboutPage";
// import ContactPage from "../pages/ContactPage";
// import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>

      {/* All pages wrapped inside MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} /> */}
      </Route>

    </Routes>
  );
}
