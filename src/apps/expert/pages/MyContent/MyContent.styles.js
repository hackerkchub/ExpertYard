import styled from "styled-components";

/* PAGE */
export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, #dbeafe 0%, #f9fafb 40%, #ffffff 100%);
  display: flex;
  justify-content: center;
`;

export const Content = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 32px auto 40px;
  padding: 0 24px;
  color: #0f172a;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

/* HEADER */
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  letter-spacing: 0.01em;
  color: #020617;
`;

export const MetricsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const MetricChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.3);
  box-shadow: 0 14px 30px rgba(148, 163, 184, 0.25);

  span {
    font-size: 12px;
    color: #64748b;
  }

  strong {
    font-size: 13px;
    color: #0f172a;
  }

  svg {
    color: #0ea5e9;
  }
`;

/* CREATION HUB */
export const CreationCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9),
    rgba(248, 250, 252, 0.75)
  );
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
  border-radius: 24px;
  padding: 18px 22px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.14),
    0 0 0 1px rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;

  h4 {
    margin: 0 0 10px;
    font-size: 15px;
    color: #0f172a;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CreationInputFake = styled.div`
  width: 100%;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: rgba(241, 245, 249, 0.7);
  color: #94a3b8;
  font-size: 14px;
  cursor: text;
`;

export const CreationActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(226, 232, 240, 0.9);
  color: #475569;
  cursor: pointer;

  &:hover {
    background: rgba(209, 213, 219, 0.9);
  }
`;

export const PrimaryButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #f9fafb;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  box-shadow: 0 14px 36px rgba(59, 130, 246, 0.5);

  &:hover {
    opacity: 0.96;
    transform: translateY(-1px);
  }
`;

/* TABS */
export const Tabs = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.85);
`;

export const Tab = styled.button`
  border: none;
  background: transparent;
  padding: 0 0 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: ${p => (p.active ? "#0ea5e9" : "#94a3b8")};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 3px;
    border-radius: 999px;
    background: ${p =>
      p.active
        ? "linear-gradient(90deg,#0ea5e9,#6366f1)"
        : "transparent"};
    box-shadow: ${p =>
      p.active ? "0 0 10px rgba(59,130,246,0.5)" : "none"};
  }
`;

/* MASONRY GRID */
export const GridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 22px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/* POST CARD */
export const PostCard = styled.div`
  background: #ffffff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow:
    0 18px 50px rgba(15, 23, 42, 0.08),
    0 0 0 1px rgba(226, 232, 240, 0.9);
  transition: all 0.18s ease;
  border: 1px solid rgba(226, 232, 240, 0.9);

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 26px 70px rgba(59, 130, 246, 0.2),
      0 0 0 1px rgba(59, 130, 246, 0.45);
  }
`;

export const Thumb = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardBody = styled.div`
  padding: 14px 16px 14px;
`;

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  color: #020617;
`;

export const CardExcerpt = styled.p`
  margin: 6px 0 10px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  color: #94a3b8;
`;

export const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

/* STATUS + ACTIONS */
export const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  background: ${p =>
    p.status === "published"
      ? "rgba(22, 163, 74, 0.12)"
      : "rgba(251, 191, 36, 0.15)"};
  color: ${p =>
    p.status === "published" ? "#15803d" : "#92400e"};
`;

export const MoreButton = styled.button`
  border: none;
  background: rgba(248, 250, 252, 0.9);
  border-radius: 999px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;

  &:hover {
    background: rgba(226, 232, 240, 0.9);
  }
`;

// upar ke exports ke niche add karo

export const Menu = styled.div`
  position: absolute;
  right: 0;
  bottom: 36px;
  background: #0f1620;
  border-radius: 12px;
  padding: 6px;
  width: 160px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  z-index: 10;
`;

export const MenuButton = styled.button`
  display: flex;
  gap: 8px;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  background: none;
  border: none;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 13px;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const QuickImagePreview = styled.div`
  position: relative;
  width: 68px;
  height: 68px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.08);
  background: #f8fafc;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const QuickImageRemove = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: #ef4444;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;