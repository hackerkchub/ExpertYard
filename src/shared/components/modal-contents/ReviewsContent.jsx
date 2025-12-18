// src/shared/components/modal-contents/ReviewsContent.jsx
import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
  max-height: 60vh;
  overflow-y: auto;
`;

const Summary = styled.div`
  font-size: 13px;
  color: #0f172a;
  margin-bottom: 10px;
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  margin: 8px 0 14px;
  background: linear-gradient(
    90deg,
    rgba(148,163,184,0),
    rgba(148,163,184,0.5),
    rgba(148,163,184,0)
  );
  backdrop-filter: blur(2px);
`;

const Row = styled.div`
  padding: 10px 6px 12px;
  border-radius: 14px;
  background: rgba(248,250,252,0.8);
  margin-bottom: 10px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #0f172a;
`;

const Stars = styled.div`
  color: #fbbf24;
  font-size: 14px;
`;

const Text = styled.p`
  margin: 6px 0 0;
  font-size: 13px;
  color: #475569;
`;

// dummy data fallback
const dummyReviews = [
  { id: 1, name: "Amit Verma", rating: 5, text: "Very helpful consultation." },
  { id: 2, name: "Sneha Gupta", rating: 4, text: "Clear explanation on blockchain basics." }
];

export default function ReviewsContent({ reviews = [] }) {
  const list = reviews.length ? reviews : dummyReviews;

  const avg =
    list.reduce((sum, r) => sum + (r.rating || 0), 0) / (list.length || 1);

  return (
    <Wrap>
      <Summary>
        Average rating {avg.toFixed(1)} · {list.length} reviews
      </Summary>
      <Divider />
      {list.map(r => (
        <Row key={r.id}>
          <Top>
            <span>{r.name}</span>
            <Stars>
              {"★".repeat(r.rating || 0)}
              {"☆".repeat(5 - (r.rating || 0))}
            </Stars>
          </Top>
          <Text>{r.text}</Text>
        </Row>
      ))}
    </Wrap>
  );
}
