import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const NAVY = "#000080";
const YELLOW = "#FFC107";

export const PageContainer = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.08), transparent 30%),
    radial-gradient(circle at 94% 10%, rgba(255, 193, 7, 0.14), transparent 28%),
    #f8fafc;
  padding: 28px 0 52px;
  color: #111827;

  @media (max-width: 640px) {
    padding: 18px 0 36px;
  }
`;

export const ContentWrapper = styled.div`
  width: min(1180px, calc(100% - 36px));
  margin: 0 auto;
  animation: ${fadeIn} 0.45s ease;

  @media (max-width: 640px) {
    width: min(100% - 24px, 560px);
  }
`;

export const HeaderSection = styled.section`
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 22px;
  margin-bottom: 18px;
  padding: clamp(24px, 4vw, 36px);
  border-radius: 26px;
  color: #ffffff;
  background:
    radial-gradient(circle at 85% 0%, rgba(255, 210, 63, 0.26), transparent 28%),
    linear-gradient(135deg, ${NAVY} 0%, #080866 54%, #020229 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 54px rgba(0, 0, 128, 0.2);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 58px 58px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.82), transparent 80%);
  }

  .title-area {
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 11px;
    margin-bottom: 12px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.16);
    color: #ffd23f;
    font-size: 0.78rem;
    font-weight: 900;
  }

  .title-area h2 {
    max-width: 760px;
    margin: 0;
    color: #ffffff;
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 0.98;
    letter-spacing: -0.06em;
    font-weight: 950;
  }

  .title-area p {
    max-width: 660px;
    color: rgba(255, 255, 255, 0.76);
    margin: 14px 0 0;
    font-size: 1rem;
    line-height: 1.65;
  }

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 560px) {
    border-radius: 22px;
    padding: 22px;
  }
`;

export const HeroSearch = styled.label`
  max-width: 620px;
  min-height: 52px;
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.16);

  svg {
    color: ${NAVY};
    flex: 0 0 auto;
    font-size: 18px;
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #111827;
    font-size: 0.95rem;
    font-weight: 700;

    &::placeholder {
      color: #64748b;
    }
  }

  @media (max-width: 560px) {
    min-height: 48px;
    border-radius: 16px;
  }
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-top: 16px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 32px;
    padding: 0 11px;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.88);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.14);
    font-size: 0.78rem;
    font-weight: 850;

    svg {
      color: #ffd23f;
    }
  }
`;

export const TopActionButton = styled.button`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, #ffd23f, ${YELLOW});
  color: #111827;
  font-weight: 950;
  cursor: pointer;
  box-shadow: 0 16px 32px rgba(255, 193, 7, 0.24);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 38px rgba(255, 193, 7, 0.32);
  }

  @media (max-width: 560px) {
    width: 100%;
  }
`;

export const CategoryStrip = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 2px 14px;
  margin-bottom: 8px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CategoryChip = styled.button`
  flex: 0 0 auto;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? "rgba(0, 0, 128, 0.8)" : "#e5e7eb")};
  background: ${({ $active }) =>
    $active ? "linear-gradient(135deg, #000080, #1111a8)" : "#ffffff"};
  color: ${({ $active }) => ($active ? "#ffffff" : "#1f2937")};
  font-size: 0.9rem;
  font-weight: 850;
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active ? "0 14px 28px rgba(0, 0, 128, 0.16)" : "0 8px 20px rgba(15, 23, 42, 0.05)"};
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(0, 0, 128, 0.32);
  }
`;

export const ServicesToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin: 8px 0 18px;
  padding: 15px 18px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);

  div {
    color: #1f2937;
    font-weight: 900;

    span {
      color: ${NAVY};
    }
  }

  p {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 650;
  }

  @media (max-width: 680px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`;

export const ServiceCard = styled.article`
  min-width: 0;
  min-height: 100%;
  background: #ffffff;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.07);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 0, 128, 0.14);
    box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12);
  }
`;

export const ExpertIdentitySection = styled.div`
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
  border-bottom: 1px solid #eef2f7;

  .expert-avatar {
    width: 38px;
    height: 38px;
    flex: 0 0 auto;
    background: linear-gradient(135deg, ${NAVY}, #1515a8);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffd23f;
    box-shadow: 0 12px 24px rgba(0, 0, 128, 0.16);
  }

  .expert-info {
    min-width: 0;
  }

  .expert-info h4 {
    margin: 0;
    color: #111827;
    font-size: 0.92rem;
    font-weight: 900;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .expert-info span {
    display: inline-flex;
    margin-top: 3px;
    color: #047857;
    font-size: 0.76rem;
    font-weight: 800;
  }
`;

export const ImageWrapper = styled.div`
  height: 178px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #e5e7eb;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease, filter 0.25s ease;
  }

  &:hover img {
    transform: scale(1.05);
    filter: saturate(1.06);
  }

  @media (max-width: 680px) {
    height: 170px;
  }
`;

export const PriceBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  color: #111827;
  background: linear-gradient(135deg, #ffd23f, ${YELLOW});
  padding: 7px 11px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 0.9rem;
  box-shadow: 0 12px 24px rgba(255, 193, 7, 0.24);
`;

export const CardContent = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;

  h3 {
    margin: 10px 0 8px;
    color: #111827;
    font-size: 1.12rem;
    line-height: 1.35;
    font-weight: 950;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .description {
    min-height: 40px;
    margin: 0 0 14px;
    color: #4b5563;
    font-size: 0.88rem;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const CategoryTag = styled.div`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 5px;
  max-width: 100%;
  background: rgba(0, 0, 128, 0.07);
  color: ${NAVY};
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export const RatingLine = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 780;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  svg {
    color: #f59e0b;
    fill: currentColor;
  }
`;

export const DeliverablesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;

  .skill-pill {
    background: #f8fafc;
    color: #334155;
    font-size: 0.75rem;
    font-weight: 780;
    padding: 5px 9px;
    border-radius: 999px;
    border: 1px solid #e5e7eb;
  }
`;

export const CardFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 15px 16px 16px;
  border-top: 1px solid #eef2f7;
  margin-top: auto;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const PrimaryButton = styled.button`
  min-height: 42px;
  width: 100%;
  padding: 0 12px;
  background: linear-gradient(135deg, ${NAVY}, #1111a8);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 12px 24px rgba(0, 0, 128, 0.16);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 28px rgba(0, 0, 128, 0.22);
  }
`;

export const SecondaryButton = styled.button`
  min-height: 42px;
  width: 100%;
  padding: 0 12px;
  background: #ffffff;
  color: ${NAVY};
  border: 1px solid rgba(0, 0, 128, 0.18);
  border-radius: 14px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(0, 0, 128, 0.06);
    border-color: rgba(0, 0, 128, 0.34);
  }
`;

export const EmptyState = styled.div`
  margin: 28px 0;
  padding: 44px 18px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  text-align: center;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

  svg {
    color: ${NAVY};
    font-size: 36px;
  }

  h3 {
    margin: 12px 0 6px;
    color: #111827;
    font-size: 1.25rem;
  }

  p {
    margin: 0;
    color: #64748b;
  }
`;

export const CtaSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 34px;
  padding: clamp(22px, 4vw, 32px);
  border-radius: 24px;
  color: #ffffff;
  background:
    radial-gradient(circle at 86% 0%, rgba(255, 210, 63, 0.24), transparent 28%),
    linear-gradient(135deg, ${NAVY}, #05054d);
  box-shadow: 0 22px 48px rgba(0, 0, 128, 0.18);

  h2 {
    margin: 0;
    color: #ffffff;
    font-size: clamp(1.35rem, 3vw, 2rem);
    letter-spacing: -0.03em;
  }

  p {
    margin: 8px 0 0;
    color: rgba(255, 255, 255, 0.76);
  }

  button {
    min-height: 46px;
    padding: 0 20px;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(135deg, #ffd23f, ${YELLOW});
    color: #111827;
    font-weight: 950;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 14px 30px rgba(255, 193, 7, 0.26);
  }

  @media (max-width: 680px) {
    align-items: stretch;
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;

  .spinner {
    width: 44px;
    height: 44px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid ${NAVY};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    margin-top: 15px;
    color: #64748b;
    font-weight: 800;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
