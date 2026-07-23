import React, { useState, useEffect, useRef, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { 
  FiSend, FiInbox, FiArrowLeft, FiMessageCircle, FiCheckCircle, 
  FiSearch, FiClock, FiUser, FiTag, FiMail, FiPhone, FiInfo, 
  FiCalendar, FiCheck, FiX, FiBriefcase 
} from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { APP_CONFIG } from "../../../../config/appConfig";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const typingBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// Skeleton component
const Skeleton = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
  height: ${props => props.$height || "16px"};
  width: ${props => props.$width || "100%"};
  margin-bottom: ${props => props.$margin || "0"};
`;

const PageBackground = styled.div`
  background: #f3f2ef;
  min-height: calc(100vh - 72px);
  padding: 24px 0;

  @media (max-width: 768px) {
    padding: 0;
    min-height: 100vh;
    min-height: 100dvh;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 24px;
  height: calc(100vh - 120px);

  @media (max-width: 1024px) {
    padding: 0 16px;
    gap: 16px;
  }

  @media (max-width: 768px) {
    padding: 0;
    gap: 0;
    height: 100vh;
    height: 100dvh;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 400px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0dfdc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);

  @media (max-width: 1024px) {
    flex: 0 0 340px;
  }

  @media (max-width: 768px) {
    flex: 1;
    border-radius: 0;
    border: none;
    display: ${props => (props.$active ? "none" : "flex")};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    animation: ${fadeIn} 0.3s ease-out;
  }
`;

const SidebarHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e0dfdc;
  background: #ffffff;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #191919;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #f3f2ef;
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const ListTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    background: #eef3f8;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    color: #5e5e5e;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px 10px 40px;
  border-radius: 8px;
  border: 1px solid #e0dfdc;
  background: #fafafa;
  font-size: 0.875rem;
  color: #191919;
  outline: none;
  transition: all 0.2s;

  &:focus {
    background: #ffffff;
    border-color: #0a66c2;
    box-shadow: 0 0 0 2px rgba(10, 102, 194, 0.1);
  }

  &::placeholder {
    color: #848482;
  }

  @media (max-width: 768px) {
    padding: 8px 12px 8px 36px;
    font-size: 0.8rem;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #5e5e5e;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    left: 12px;
    font-size: 1rem;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
  
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const FilterChip = styled.button`
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${props => props.$active ? "transparent" : "#d1d5db"};
  background: ${props => props.$active ? "#0a66c2" : "#ffffff"};
  color: ${props => props.$active ? "#ffffff" : "#5e5e5e"};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.$active ? "#004182" : "#f3f2ef"};
    border-color: ${props => props.$active ? "transparent" : "#9ca3af"};
  }

  @media (max-width: 768px) {
    padding: 4px 12px;
    font-size: 0.75rem;
  }
`;

const InquiryList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #ffffff;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

const InquiryItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f2ef;
  cursor: pointer;
  background: ${props => props.$selected ? "#f3f7f9" : "#ffffff"};
  border-left: 4px solid ${props => props.$selected ? "#0a66c2" : "transparent"};
  transition: all 0.2s;
  display: flex;
  gap: 14px;

  &:hover {
    background: ${props => props.$selected ? "#eef3f8" : "#fafafa"};
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    gap: 12px;
  }
`;

const ExpertAvatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
  border: 2px solid #e0dfdc;
  background: linear-gradient(135deg, #0a66c2, #004182);

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }
`;

const ExpertPhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ExpertPhotoFallback = styled.div`
  width: 100%;
  height: 100%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 4px;
`;

const ExpertName = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #191919;
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const VerifiedBadge = styled.span`
  color: #0a66c2;
  display: inline-flex;
  align-items: center;
  font-size: 0.8rem;
`;

const StatusBadge = styled.span`
  font-size: 0.7rem;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: capitalize;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$status) {
      case "new": return "#e8f4fd";
      case "opened": return "#fff3e0";
      case "expert_replied": return "#e1f0e4";
      case "user_replied": return "#e8f4fd";
      case "converted": return "#f3e8ff";
      case "closed": return "#f3f2ef";
      case "rejected": return "#fef2f2";
      default: return "#f3f2ef";
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case "new": return "#0a66c2";
      case "opened": return "#e65100";
      case "expert_replied": return "#057642";
      case "user_replied": return "#0a66c2";
      case "converted": return "#6b21a8";
      case "closed": return "#5e5e5e";
      case "rejected": return "#b91c1c";
      default: return "#5e5e5e";
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case "new": return "#cce5ff";
      case "opened": return "#ffe0b2";
      case "expert_replied": return "#c8e6c9";
      case "user_replied": return "#cce5ff";
      case "converted": return "#e9d5ff";
      case "closed": return "#d1d5db";
      case "rejected": return "#fecaca";
      default: return "#d1d5db";
    }
  }};

  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 2px 8px;
  }
`;

const CategoryTag = styled.div`
  font-size: 0.75rem;
  color: #5e5e5e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 0.7rem;
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const SubjectText = styled.p`
  margin: 0 0 2px 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #191919;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const MessagePreview = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #5e5e5e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const DateText = styled.div`
  font-size: 0.7rem;
  color: #848482;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;

  svg {
    font-size: 0.6rem;
  }
`;

/* ------------------ MAIN CHAT DISPLAY (WHATSAPP STYLE) ------------------ */
const MainContent = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e0dfdc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);

  @media (max-width: 768px) {
    display: ${props => props.$active ? "flex" : "none"};
    border-radius: 0;
    border: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    background: #ffffff;
    animation: ${slideIn} 0.3s ease-out;
  }
`;

const WhatsAppHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f0f2f5;
  border-bottom: 1px solid #e9edef;
  flex-shrink: 0;
  gap: 12px;
  min-height: 60px;

  @media (max-width: 768px) {
    padding: 8px 12px;
    min-height: 54px;
    padding-top: max(8px, env(safe-area-inset-top, 0px));
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

const HeaderBackBtn = styled.button`
  background: none;
  border: none;
  color: #191919;
  padding: 6px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #e9edef;
  }
`;

const HeaderAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0a66c2, #004182);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const HeaderIconButton = styled.button`
  background: none;
  border: none;
  color: #54656f;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: #e9edef;
  }
`;

const ActionPill = styled.button`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => props.$primary ? "transparent" : "#d1d5db"};
  background: ${props => props.$primary ? "#00a884" : "#ffffff"};
  color: ${props => props.$primary ? "#ffffff" : "#54656f"};
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${props => props.$primary ? "#008069" : "#f3f2ef"};
    border-color: ${props => props.$primary ? "transparent" : "#9ca3af"};
    color: ${props => props.$primary ? "#ffffff" : "#191919"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 3px 8px;
    font-size: 0.65rem;
  }
`;

/* ------------------ MESSAGES SCROLL AREA ------------------ */
const MessagesArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
  background: #e5ddd6;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c9c0' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
`;

const DatePill = styled.div`
  align-self: center;
  background: rgba(255, 255, 255, 0.92);
  color: #54656f;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(11, 20, 26, 0.12);
  margin: 6px 0;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-self: ${(props) => (props.$isMe ? "flex-end" : "flex-start")};
  max-width: 82%;
  animation: ${fadeIn} 0.2s ease-out;
`;

const MessageBubble = styled.div`
  background: ${(props) => (props.$isMe ? "#dcf8c6" : "#ffffff")};
  color: #111b21;
  padding: 8px 12px;
  border-radius: ${(props) => (props.$isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px")};
  box-shadow: 0 1px 2px rgba(11, 20, 26, 0.13);
  position: relative;
  word-break: break-word;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const MessageSenderName = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => (props.$isMe ? "#075e54" : "#00a884")};
  margin-bottom: 2px;
`;

const MessageFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 2px;
  float: right;
  margin-left: 12px;
`;

const TimeStamp = styled.span`
  font-size: 0.66rem;
  color: #667781;
`;

const ReadStatus = styled.span`
  font-size: 0.72rem;
  color: ${(props) => (props.$seen ? "#53bdeb" : "#8696a0")};
  display: inline-flex;
  align-items: center;
`;

/* ------------------ TYPING INDICATOR ------------------ */
const TypingBubble = styled.div`
  align-self: flex-start;
  background: #ffffff;
  padding: 8px 14px;
  border-radius: 12px 12px 12px 2px;
  box-shadow: 0 1px 2px rgba(11, 20, 26, 0.13);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: #8696a0;
  border-radius: 50%;
  display: inline-block;
  animation: ${typingBounce} 1.4s infinite ease-in-out both;
  animation-delay: ${(props) => props.$delay || "0s"};
`;

/* ------------------ FIXED MESSAGING INPUT BAR ------------------ */
const InputArea = styled.form`
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
  background: #f0f2f5;
  border-top: 1px solid #e9edef;
  padding-top: 8px;
  padding-bottom: max(8px, env(safe-area-inset-bottom, 0px));
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 20;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding-left: 8px;
    padding-right: 8px;
    gap: 6px;
  }
`;

const TextInput = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  background: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 0.92rem;
  color: #111b21;
  outline: none;
  box-sizing: border-box;
  box-shadow: inset 0 0 0 1px #e9edef;

  @media (max-width: 480px) {
    padding: 9px 12px;
    font-size: 0.88rem;
  }

  &:focus {
    box-shadow: inset 0 0 0 1.5px #00a884;
  }

  &:disabled {
    background: #f5f6f6;
    color: #8696a0;
  }
`;

const SendTextButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #00a884;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 9px 16px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
  box-sizing: border-box;
  transition: background 0.15s, transform 0.15s;
  box-shadow: 0 2px 4px rgba(0, 168, 132, 0.2);

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.82rem;
  }

  &:hover:not(:disabled) {
    background: #008069;
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    background: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

/* ------------------ COLLAPSIBLE MODERN INQUIRY CARDS ------------------ */
const InfoCardsDrawer = styled.div`
  flex: 0 0 auto;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 16px;
  max-height: 45vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.2s ease-out;
  z-index: 15;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
`;

const ModernCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
`;

const CardRow = styled.div`
  font-size: 0.78rem;
  color: #475569;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  gap: 8px;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 24px;
  color: #5e5e5e;
  text-align: center;
  height: 100%;

  svg {
    opacity: 0.6;
  }

  h3 {
    margin: 0;
    color: #191919;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    max-width: 320px;
    color: #848482;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: #5e5e5e;
  text-align: center;
  height: 100%;

  svg {
    opacity: 0.6;
  }

  h3 {
    margin: 0;
    color: #191919;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    max-width: 320px;
    color: #848482;
  }
`;

const ErrorMessage = styled.div`
  padding: 8px 24px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.85rem;
  border-top: 1px solid #fecaca;
  flex-shrink: 0;

  @media (max-width: 768px) {
    padding: 6px 16px;
    font-size: 0.8rem;
  }
`;

const LoadingContainer = styled.div`
  padding: 20px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

/* ------------------ MAIN COMPONENT ------------------ */
export default function UserInquiriesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id");

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInfoCards, setShowInfoCards] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  /* ------------------ KEYBOARD & VISUAL VIEWPORT ------------------ */
  useEffect(() => {
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const height = window.visualViewport.height;
        document.documentElement.style.setProperty("--chat-viewport-height", `${height}px`);
      }
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      window.visualViewport.addEventListener("scroll", handleViewportResize);
      handleViewportResize();
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
        window.visualViewport.removeEventListener("scroll", handleViewportResize);
      }
    };
  }, []);

  /* ------------------ FETCH INQUIRIES ------------------ */
  const fetchInquiries = async (autoSelectId = null) => {
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/my`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (res.ok) {
        setInquiries(data.data || []);
        
        const selId = autoSelectId || initialId;
        if (selId && data.data) {
          const match = data.data.find(item => Number(item.id) === Number(selId));
          if (match) {
            handleSelectInquiry(match);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [initialId]);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ------------------ SELECT INQUIRY ------------------ */
  const handleSelectInquiry = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setMessages([]);
    setError("");
    setShowInfoCards(false);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/${inquiry.id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setMessages(data.data.messages || []);
        setSelectedInquiry(data.data.inquiry);
        setInquiries(prev => 
          prev.map(item => 
            item.id === inquiry.id ? { ...item, status: data.data.inquiry.status } : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ SEND MESSAGE ------------------ */
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedInquiry) return;

    const messageContent = replyText.trim();
    setReplyText("");
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/${selectedInquiry.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message: messageContent }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        const newMessage = {
          ...data.data,
          sender_type: "user"
        };
        setMessages(prev => [...prev, newMessage]);
        setReplyText("");
        setInquiries(prev => 
          prev.map(item => 
            item.id === selectedInquiry.id 
              ? { ...item, status: "user_replied", message: messageContent } 
              : item
          )
        );
      } else {
        setError(data.message || "Failed to send reply");
      }
    } catch (err) {
      setError("Failed to send message. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ INQUIRY ACTIONS ------------------ */
  const handleCloseInquiry = async () => {
    if (!selectedInquiry) return;
    if (!window.confirm("Are you sure you want to close this inquiry?")) return;

    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/${selectedInquiry.id}/close`, {
        method: "PATCH",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        setSelectedInquiry(prev => ({ ...prev, status: "closed" }));
        setInquiries(prev => 
          prev.map(item => 
            item.id === selectedInquiry.id ? { ...item, status: "closed" } : item
          )
        );
        setShowInfoCards(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      const matchesSearch = 
        item.expert_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && item.status !== "closed" && item.status !== "rejected") ||
        (statusFilter === "closed" && item.status === "closed") ||
        (statusFilter === "rejected" && item.status === "rejected");

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchText, statusFilter]);

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + (words[1]?.charAt(0) || "")).toUpperCase();
  };

  const getStatusCount = (status) => {
    if (status === "all") return inquiries.length;
    if (status === "active") return inquiries.filter(i => i.status !== "closed" && i.status !== "rejected").length;
    if (status === "closed") return inquiries.filter(i => i.status === "closed").length;
    if (status === "rejected") return inquiries.filter(i => i.status === "rejected").length;
    return 0;
  };

  const isInactive = selectedInquiry?.status === "closed" || selectedInquiry?.status === "rejected";

  // Get the display name for a message
  const getMessageSenderName = (msg) => {
    if (msg.sender_type === "user") {
      return "You";
    }
    return selectedInquiry?.expert_name || "Expert";
  };

  return (
    <PageBackground>
      <Container>
        {/* Sidebar */}
        <Sidebar $active={!!selectedInquiry}>
          <SidebarHeader>
            <HeaderTop>
              <BackButton onClick={() => navigate("/user")}>
                <FiArrowLeft size={20} />
              </BackButton>
              <ListTitle>
                My Inquiries
                <span>{inquiries.length}</span>
              </ListTitle>
            </HeaderTop>
            <SearchWrapper>
              <SearchIcon />
              <SearchInput 
                type="text" 
                value={searchText} 
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search by expert or subject..." 
              />
            </SearchWrapper>
            <FilterContainer>
              <FilterChip $active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
                All ({getStatusCount("all")})
              </FilterChip>
              <FilterChip $active={statusFilter === "active"} onClick={() => setStatusFilter("active")}>
                Active ({getStatusCount("active")})
              </FilterChip>
              <FilterChip $active={statusFilter === "closed"} onClick={() => setStatusFilter("closed")}>
                Closed ({getStatusCount("closed")})
              </FilterChip>
              <FilterChip $active={statusFilter === "rejected"} onClick={() => setStatusFilter("rejected")}>
                Rejected ({getStatusCount("rejected")})
              </FilterChip>
            </FilterContainer>
          </SidebarHeader>
          
          <InquiryList>
            {listLoading ? (
              <LoadingContainer>
                <Skeleton $height="76px" $margin="12px" />
                <Skeleton $height="76px" $margin="12px" />
                <Skeleton $height="76px" $margin="12px" />
                <Skeleton $height="76px" $margin="12px" />
              </LoadingContainer>
            ) : filteredInquiries.length === 0 ? (
              <EmptyState>
                <FiInbox size={48} color="#848482" />
                <h3>No inquiries found</h3>
                <p>{searchText ? "Try adjusting your search or filters" : "You haven't sent any inquiries yet"}</p>
              </EmptyState>
            ) : (
              filteredInquiries.map(item => (
                <InquiryItem
                  key={item.id}
                  $selected={selectedInquiry?.id === item.id}
                  onClick={() => handleSelectInquiry(item)}
                >
                  <ExpertAvatar>
                    {item.expert_photo ? (
                      <ExpertPhoto src={item.expert_photo} alt={item.expert_name} />
                    ) : (
                      <ExpertPhotoFallback>{getInitials(item.expert_name)}</ExpertPhotoFallback>
                    )}
                  </ExpertAvatar>
                  <ItemContent>
                    <ItemHeader>
                      <ExpertName>
                        {item.expert_name}
                        <VerifiedBadge><FiCheckCircle size={12} /></VerifiedBadge>
                      </ExpertName>
                      <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                    </ItemHeader>
                    <CategoryTag>
                      <FiTag size={12} />
                      {item.category_name || "Expert"}
                    </CategoryTag>
                    <SubjectText>{item.subject}</SubjectText>
                    <MessagePreview>{item.message}</MessagePreview>
                    <DateText>
                      <FiClock size={12} />
                      {new Date(item.last_message_at).toLocaleDateString("en-US", { 
                        month: "short", 
                        day: "numeric",
                        year: "numeric"
                      })}
                    </DateText>
                  </ItemContent>
                </InquiryItem>
              ))
            )}
          </InquiryList>
        </Sidebar>

        {/* Main Content */}
        <MainContent $active={!!selectedInquiry}>
          {selectedInquiry ? (
            <>
              {/* WhatsApp Header */}
              <WhatsAppHeader>
                <HeaderLeft>
                  <HeaderBackBtn onClick={() => setSelectedInquiry(null)}>
                    <FiArrowLeft size={20} />
                  </HeaderBackBtn>
                  <HeaderAvatar onClick={() => setShowInfoCards((prev) => !prev)}>
                    {getInitials(selectedInquiry.expert_name)}
                  </HeaderAvatar>
                  <div style={{ marginLeft: 4 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#111b21" }}>
                      {selectedInquiry.expert_name}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#667781" }}>
                      {selectedInquiry.status}
                    </div>
                  </div>
                </HeaderLeft>

                <HeaderActions>
                  <HeaderIconButton onClick={() => setShowInfoCards((prev) => !prev)} title="Inquiry Info">
                    <FiInfo size={18} />
                  </HeaderIconButton>
                  {selectedInquiry.status !== "closed" && selectedInquiry.status !== "rejected" && (
                    <ActionPill onClick={handleCloseInquiry}>Close</ActionPill>
                  )}
                  <ActionPill 
                    $primary 
                    onClick={() => navigate(`/user/experts/${selectedInquiry.expert_slug || selectedInquiry.expert_id}`)}
                  >
                    <FiBriefcase size={12} style={{ marginRight: 4 }} />
                    Profile
                  </ActionPill>
                </HeaderActions>
              </WhatsAppHeader>

              {/* Collapsible Modern Inquiry Cards */}
              {showInfoCards && (
                <InfoCardsDrawer>
                  <CardsGrid>
                    <ModernCard>
                      <CardHeader>
                        <FiUser color="#00a884" /> Expert Overview
                      </CardHeader>
                      <CardRow>
                        <span>Name:</span> <strong>{selectedInquiry.expert_name}</strong>
                      </CardRow>
                      <CardRow>
                        <span>Specialization:</span> <strong>{selectedInquiry.category_name || "General"}</strong>
                      </CardRow>
                    </ModernCard>

                    <ModernCard>
                      <CardHeader>
                        <FiTag color="#00a884" /> Inquiry Details
                      </CardHeader>
                      <CardRow>
                        <span>Subject:</span> <strong>{selectedInquiry.subject}</strong>
                      </CardRow>
                      <CardRow>
                        <span>Status:</span> <strong>{selectedInquiry.status}</strong>
                      </CardRow>
                      <CardRow>
                        <span>Created:</span> <strong>{new Date(selectedInquiry.created_at).toLocaleDateString()}</strong>
                      </CardRow>
                    </ModernCard>

                    <ModernCard>
                      <CardHeader>
                        <FiClock color="#00a884" /> Timeline
                      </CardHeader>
                      <CardRow>
                        <span>Last Activity:</span> <strong>{new Date(selectedInquiry.last_message_at).toLocaleDateString()}</strong>
                      </CardRow>
                      <CardRow>
                        <span>Total Messages:</span> <strong>{messages.length}</strong>
                      </CardRow>
                    </ModernCard>
                  </CardsGrid>
                </InfoCardsDrawer>
              )}

              {/* Messages Area */}
              <MessagesArea>
                <DatePill>{new Date(selectedInquiry.created_at).toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</DatePill>

                {messages.map((msg) => {
                  const isMe = msg.sender_type === "user";
                  const timeStr = new Date(msg.created_at).toLocaleTimeString([], { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  });
                  const senderName = getMessageSenderName(msg);
                  
                  return (
                    <MessageGroup key={msg.id} $isMe={isMe}>
                      <MessageBubble $isMe={isMe}>
                        <MessageSenderName $isMe={isMe}>
                          {senderName}
                        </MessageSenderName>
                        <div>{msg.message}</div>
                        <MessageFooter>
                          <TimeStamp>{timeStr}</TimeStamp>
                          {isMe && <ReadStatus $seen={true}>✓✓</ReadStatus>}
                        </MessageFooter>
                      </MessageBubble>
                    </MessageGroup>
                  );
                })}

                {isTyping && (
                  <TypingBubble>
                    <Dot $delay="0s" />
                    <Dot $delay="0.2s" />
                    <Dot $delay="0.4s" />
                  </TypingBubble>
                )}

                <div ref={messagesEndRef} />
              </MessagesArea>

              {error && (
                <ErrorMessage>{error}</ErrorMessage>
              )}

              {/* Fixed WhatsApp Messaging Input Bar */}
              <InputArea onSubmit={handleSendReply}>
                <TextInput
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isInactive
                      ? "This inquiry is inactive"
                      : "Type your message..."
                  }
                  disabled={isInactive || loading}
                />
                <SendTextButton
                  type="submit"
                  disabled={isInactive || !replyText.trim() || loading}
                >
                  <FiSend size={15} style={{ marginRight: 6 }} />
                  Send
                </SendTextButton>
              </InputArea>
            </>
          ) : (
            <EmptyStateContainer>
              <FiInbox size={52} color="#0a66c2" />
              <h3 style={{ margin: "0", color: "#111b21", fontSize: "1.25rem", fontWeight: 600 }}>
                Select an Inquiry
              </h3>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                Choose an inquiry from the sidebar to view the conversation.
              </p>
            </EmptyStateContainer>
          )}
        </MainContent>
      </Container>
    </PageBackground>
  );
}