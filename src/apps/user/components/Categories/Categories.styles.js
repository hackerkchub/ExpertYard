// src/components/Categories/Categories.styles.js
import styled, { css, keyframes } from "styled-components";

/* OUTER WRAP */
export const Wrap = styled.section`
  max-width: 1280px;
  margin: 40px auto 50px;
  padding: 80px 0 16px;

  @media (max-width: 768px) {
    margin: 28px auto 40px;
  }
`;

/* HEADER */
export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

export const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const Subtitle = styled.p`
  margin-top: 8px;
  font-size: 14px;
  opacity: 0.8;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

/* QUICK ACTION CARDS */
export const ActionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px;
  margin-bottom: 28px;

  @media (max-width: 480px) {
    gap: 14px;
  }
`;

export const ActionCard = styled.div`
  min-width: 220px;
  max-width: 260px;
  height: 110px;

  display: flex;
  align-items: center;

  border-radius: 16px;
  padding: 16px;

  background: linear-gradient(135deg, #fff3e6, #ffe5cc);
  box-shadow: 0 10px 28px rgba(255, 148, 74, 0.18);

  cursor: pointer;
  gap: 14px;
  transition: 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 30px rgba(255, 148, 74, 0.26);
  }

  @media (max-width: 480px) {
    min-width: 100%;
    height: 95px;
    padding: 14px;
  }
`;

export const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;

  background: #ff7a1a;
  color: white;

  @media (max-width: 480px) {
    width: 42px;
    height: 42px;
  }
`;

export const ActionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

/* PROFESSION TABS */
export const TabsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;

    padding: 4px; /* prevents first tab from being hidden */
    gap: 8px;

    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    scroll-snap-type: x mandatory;

    & > * {
      scroll-snap-align: start;
      flex-shrink: 0; /* VERY IMPORTANT */
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;



export const TabButton = styled.button`
  border: none;
  padding: 8px 14px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  background: #f1f5f9;
  color: #0f172a;

  font-size: 13px;
  cursor: pointer;
  transition: 0.18s ease;

  ${({ $active }) =>
    $active &&
    css`
      background: #0f172a;
      color: #ffffff;
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.35);
    `}

  @media (max-width: 480px) {
    padding: 7px 12px;
    font-size: 12px;
  }
`;

/* SPECIALITY FILTER */
export const FiltersRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;

    padding: 4px;

    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;

    & > * {
      scroll-snap-align: start;
      flex-shrink: 0;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const FilterChip = styled.button`
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid transparent;

  background: #e5e7eb;
  color: #111827;
  font-size: 12px;
  cursor: pointer;

  transition: 0.16s ease;

  ${({ $active }) =>
    $active &&
    css`
      background: #0ea5e9;
      color: white;
      border-color: #0284c7;
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.4);
    `}

  @media (max-width: 480px) {
    padding: 5px 12px;
    font-size: 11px;
  }
`;

/* EXPERT STRIP */
export const ExpertsStrip = styled.div`
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding: 12px 6px 4px;

  scroll-behavior: smooth;

  & > * {
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    gap: 14px;
    scroll-snap-type: x mandatory;

    & > * {
      scroll-snap-align: start;
    }
  }

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.8);
    border-radius: 999px;
  }
`;


export const ExpertCard = styled.div`
  min-width: 130px;
  max-width: 140px;

  background: white;
  border-radius: 18px;

  box-shadow: 0 10px 28px rgba(148, 163, 184, 0.28);

  padding: 12px 10px 14px;
  text-align: center;
  flex-shrink: 0;

  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 32px rgba(15, 23, 42, 0.28);
  }

  @media (max-width: 480px) {
    min-width: 120px;
    max-width: 130px;
    padding: 10px 8px 12px;
  }
`;

export const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 999px;
  object-fit: cover;
  margin-bottom: 8px;

  border: 2px solid #0ea5e9;

  @media (max-width: 480px) {
    width: 64px;
    height: 64px;
  }
`;

export const ExpertName = styled.div`
  font-size: 14px;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const ExpertMeta = styled.div`
  font-size: 11px;
  opacity: 0.8;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const ExpertProfession = styled(ExpertMeta)`
  margin-top: 3px;
`;

export const ExpertSpeciality = styled(ExpertMeta)`
  margin-top: 2px;
`;

export const ExpertTag = styled.div`
  margin-top: 6px;
  font-size: 10px;

  padding: 3px 8px;
  border-radius: 999px;
  display: inline-block;

  background: rgba(22, 163, 74, 0.12);
  color: #15803d;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

/* SKELETON */
const shimmer = keyframes`
  0% { background-position: -120px 0; }
  100% { background-position: 120px 0; }
`;

export const SkeletonCard = styled.div`
  min-width: 130px;
  max-width: 140px;
  background: #0f172a;
  border-radius: 18px;
  padding: 12px;
  flex-shrink: 0;
`;

export const SkeletonAvatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 999px;
  margin: 0 auto 8px;

  background: linear-gradient(90deg, #1f2937, #4b5563, #1f2937);
  background-size: 200% 100%;
  animation: ${shimmer} 1.3s infinite;
`;

export const SkeletonLine = styled.div`
  height: 10px;
  border-radius: 999px;

  margin: 6px auto 0;

  background: linear-gradient(90deg, #1f2937, #4b5563, #1f2937);
  background-size: 200% 100%;
  animation: ${shimmer} 1.3s infinite;
`;
