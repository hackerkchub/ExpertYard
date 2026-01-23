import styled from "styled-components";

/* ================= PAGE ================= */

export const Wrapper = styled.div`
  height: 100vh; /* full screen */
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f8fbff, #eef5fb);
`;

/* ================= STICKY HEADER ================= */
/* Title + Filter always top */

export const StickyHeader = styled.div`
  position: sticky;
  top: 0 ;
  z-index: 50;

  background: linear-gradient(180deg, #f8fbff, #eef5fb);

  padding: 10px 20px 14px;

  border-bottom: 1px solid #e2e8f0;

  backdrop-filter: blur(12px); /* premium glass feel */
`;

/* ================= TITLE ================= */

export const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
`;

export const Badge = styled.span`
  background: #ef4444;
  color: white;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
`;

/* ================= FILTER ================= */

export const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const FilterBtn = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;

  background: ${({ $active }) => ($active ? "#0f172a" : "#e2e8f0")};
  color: ${({ $active }) => ($active ? "white" : "#334155")};

  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

/* ================= SCROLL AREA (IMPORTANT 🔥) ================= */
/* ONLY THIS scrolls */

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;

  padding: 24px 20px 80px;

  scrollbar-width: thin;
`;

/* ================= TIMELINE ================= */

export const Timeline = styled.div`
  position: relative;
  max-width: 760px;
  margin: auto;

  &:before {
    content: "";
    position: absolute;
    left: 28px;
    top: 0;
    bottom: 0;
    width: 4px;
    background: #cbd5e1;
  }
`;

/* ================= ITEMS ================= */

export const Item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
`;

export const Dot = styled.div`
  width: 80px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  background: ${({ color }) => color};
  z-index: 2;
`;

export const Card = styled.div`
  flex: 1;
  background: white;
  margin-left: 18px;
  padding: 18px 20px;
  border-radius: 18px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  opacity: ${({ $read }) => ($read ? 0.55 : 1)};
  border-left: ${({ $read }) =>
    $read ? "4px solid transparent" : "4px solid #3b82f6"};

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  }
`;

export const Content = styled.div``;

export const Heading = styled.div`
  font-weight: 700;
`;

export const Message = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
`;

export const Time = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

export const MarkReadBtn = styled.button`
  margin-left: 14px;
  font-size: 12px;
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  opacity: 0.5;
  padding: 50px 0;
`;
