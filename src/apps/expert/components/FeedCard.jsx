// src/apps/expert/components/FeedCard.jsx

import React from "react";
import { FeedCardWrap } from "../styles/Dashboard.styles";

export default function FeedCard() {
  return (
    <FeedCardWrap>
      <h3>Recent Activity Feed</h3>
      <p>Your post "Future of AI" got 50 new likes</p>
      <p>System: Your profile verification is complete</p>
    </FeedCardWrap>
  );
}
