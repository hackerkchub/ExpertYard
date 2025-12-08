// src/apps/expert/pages/Dashboard.jsx

import React from "react";
import Sidebar from "../components/ExpertSidebar";
import Topbar from "../components/ExpertTopbar";

import StatsCard from "../components/StatsCard";
import QueueCard from "../components/QueueCard";
import FeedCard from "../components/FeedCard";
import WidgetCard from "../components/WidgetCard";

import {
  Layout,
  MainContent,
  ContentInner,
  Welcome,
  StatsRow,
  FeedArea,
} from "../styles/Dashboard.styles";

export default function Dashboard() {
  return (
    <Layout>
      
      <Sidebar />

      <MainContent>

        <Topbar />

        <ContentInner>

          <Welcome>Welcome back, Dr. Sharma.</Welcome>

          {/* Stats Section */}
          <StatsRow>
            <StatsCard label="Live Call Requests" value="03" />
            <StatsCard label="Pending Chats" value="12" />
            <StatsCard label="Today's Sessions" value="2 Scheduled" />
            <StatsCard label="Month's Earnings" value="₹45,500" />
          </StatsRow>

          {/* Requests Queue */}
          <QueueCard />

          {/* Activity + Widget */}
          <FeedArea>
            <FeedCard />
            <WidgetCard />
          </FeedArea>

        </ContentInner>
      </MainContent>
      
    </Layout>
  );
}
