import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ExpertSidebar from "../components/ExpertSidebar";
import ExpertTopbar from "../components/ExpertTopbar";
import { LayoutWrapper, ContentWrapper } from "./expertLayout.styles";

// ✅ IMPORT SHARED CONTEXT
import { ExpertProvider } from "../../../shared/context/ExpertContext";

export default function ExpertLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ExpertProvider>
      <LayoutWrapper>
        <ExpertTopbar setMobileOpen={setMobileOpen} />

        <ExpertSidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </LayoutWrapper>
    </ExpertProvider>
  );
}
