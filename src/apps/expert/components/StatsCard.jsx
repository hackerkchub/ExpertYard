// src/apps/expert/components/StatsCard.jsx

import React from "react";
import { StatCard } from "../styles/Dashboard.styles";

export default function StatsCard({ label, value }) {
  return (
    <StatCard>
      <span>{label}</span>
      <h2>{value}</h2>
    </StatCard>
  );
}
