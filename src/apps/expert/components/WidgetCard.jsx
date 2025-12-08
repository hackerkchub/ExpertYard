// src/apps/expert/components/WidgetCard.jsx

import React from "react";
import {
  WidgetCardWrap,
  WidgetInput,
  WidgetActions,
} from "../styles/Dashboard.styles";

export default function WidgetCard() {
  return (
    <WidgetCardWrap>
      <h3>Quick Share Widget</h3>
      <WidgetInput placeholder="Share your thoughts..." />
      <WidgetActions>
        <button>Post Now</button>
      </WidgetActions>
    </WidgetCardWrap>
  );
}
