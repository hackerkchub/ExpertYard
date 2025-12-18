// src/apps/expert/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/ExpertSidebar";
import Topbar from "../components/ExpertTopbar";

import StatsCard from "../components/StatsCard";
import QueueCard from "../components/QueueCard";
import FeedCard from "../components/FeedCard";
import WidgetCard from "../components/WidgetCard";

import { useExpert } from "../../../shared/context/ExpertContext";

import {
  Layout,
  MainContent,
  ContentInner,
  Welcome,
  StatsRow,
  FeedArea,
} from "../styles/Dashboard.styles";

export default function Dashboard() {

  const { expertData, profileLoading } = useExpert();

  // 🔹 SAFE NAME HANDLING (NO FLASH / NO CRASH)
 const expertName =
  expertData?.profile?.name ||
  expertData?.name ||
  "Expert";


  return (
    <Layout>

      <Sidebar />

      <MainContent>

        <Topbar />

        <ContentInner>

          {/* 🔥 DYNAMIC WELCOME */}
          <Welcome>
            {profileLoading
              ? "Welcome back..."
              : `Welcome back, ${expertName}`}
          </Welcome>

          {/* 📊 STATS SECTION */}
          <StatsRow>
            <StatsCard label="Live Call Requests" value="03" />
            <StatsCard label="Pending Chats" value="12" />
            <StatsCard label="Today's Sessions" value="2 Scheduled" />
            <StatsCard label="Month's Earnings" value="₹45,500" />
          </StatsRow>

          {/* 🧾 REQUEST QUEUE */}
          <QueueCard />

          {/* 📰 FEED + WIDGET */}
          <FeedArea>
            <FeedCard />
            <WidgetCard />
          </FeedArea>

        </ContentInner>

      </MainContent>

    </Layout>
  );
}
