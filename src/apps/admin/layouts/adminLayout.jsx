import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { LayoutWrap, ContentWrap } from "./AdminLayout.styles";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageTitle =
    location.pathname
      .split("/")
      .filter(Boolean)
      .slice(-1)[0]
      ?.replace(/-/g, " ")
      ?.toUpperCase() || "DASHBOARD";

  return (
    <LayoutWrap>
      <Topbar setMobileOpen={setMobileOpen} />

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <ContentWrap>
        {/* You can show pageTitle here if you like */}
        {/* <PageHeading>{pageTitle}</PageHeading> */}
        <Outlet />
      </ContentWrap>
    </LayoutWrap>
  );
}
