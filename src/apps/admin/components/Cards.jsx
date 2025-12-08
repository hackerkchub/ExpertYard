import React from "react";
import {
  Grid,
  StatCard,
  StatLabel,
  StatValue,
  StatIcon,
  StatBody,
} from "../styles/Cards.styles.js";

export default function Cards({ stats = [] }) {
  return (
    <Grid>
      {stats.map((s, i) => (
        <StatCard key={i} highlight={s.highlight}>
          {s.icon && <StatIcon>{s.icon}</StatIcon>}
          <StatBody>
            <StatLabel>{s.label}</StatLabel>
            <StatValue>{s.value}</StatValue>
          </StatBody>
        </StatCard>
      ))}
    </Grid>
  );
}
