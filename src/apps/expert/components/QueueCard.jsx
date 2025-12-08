// src/apps/expert/components/QueueCard.jsx

import React from "react";
import {
  QueueCardWrap,
  QueueTabs,
  QueueItem,
  ActionBtn,
} from "../styles/Dashboard.styles";

export default function QueueCard() {
  return (
    <QueueCardWrap>
      <QueueTabs>
        <button className="active">Call Requests (Priority)</button>
        <button>Chat Requests</button>
      </QueueTabs>

      <QueueItem>
        <div>
          <strong>Rahul Verma</strong>
          <span>Career Advice · 5 min ago</span>
        </div>

        <div>
          <ActionBtn className="accept">Accept Call</ActionBtn>
          <ActionBtn>Decline</ActionBtn>
        </div>
      </QueueItem>
    </QueueCardWrap>
  );
}
