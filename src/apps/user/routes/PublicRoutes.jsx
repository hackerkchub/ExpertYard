import React from "react";
import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/Home/Home";
import ExpertList from "../pages/ExpertList/ExpertList";
import ExpertProfile from "../pages/ExpertProfile/ExpertProfile";
import MainLayout from "../layouts/MainLayout";
import UserAuth from "../pages/UserAuth/UserAuth";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/experts" element={<ExpertList />} />
        <Route path="/experts/:expertId" element={<ExpertProfile />} />
        <Route path="/auth" element={<UserAuth />} />
      </Route>
    </Routes>
  );
}
