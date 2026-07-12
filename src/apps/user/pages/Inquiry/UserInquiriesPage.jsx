import React, { useState, useEffect, useRef, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { FiSend, FiInbox, FiArrowLeft, FiMessageCircle, FiCheckCircle, FiSearch } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { APP_CONFIG } from "../../../../config/appConfig";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

// Skeleton component
const Skeleton = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
  height: ${props => props.$height || "16px"};
  width: ${props => props.$width || "100%"};
  margin-bottom: ${props => props.$margin || "0"};
`;

const PageBackground = styled.div`
  background-color: #f3f2ef; /* LinkedIn Gray */
  min-height: calc(100vh - 72px);
  padding: 24px 0;

  @media (max-width: 768px) {
    padding: 0;
    min-height: 100vh;
    min-height: 100dvh;
  }
`;

const Container = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  gap: 24px;
  height: calc(100vh - 120px);

  @media (max-width: 768px) {
    padding: 0;
    gap: 0;
    height: 100vh;
    height: 100dvh;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 380px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e0dfdc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 4px 4px rgba(0,0,0,0.02);

  @media (max-width: 768px) {
    flex: 1;
    border-radius: 0;
    border: none;
    display: ${props => (props.$active ? "none" : "flex")};
  }
`;

const ListHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e0dfdc;
  background: #ffffff;
`;

const ListTitle = styled.h2`
  margin: 0 0 12px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border-radius: 4px;
  border: 1px solid #848482;
  background: #eef3f8;
  font-size: 0.875rem;
  color: #191919;
  outline: none;
  transition: all 0.2s;

  &:focus {
    background: #ffffff;
    border-color: #0a66c2;
    box-shadow: 0 0 0 1px #0a66c2;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #5e5e5e;
  font-size: 1rem;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChip = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid ${props => (props.$active ? "transparent" : "#5e5e5e")};
  background: ${props => (props.$active ? "#057642" : "#ffffff")};
  color: ${props => (props.$active ? "#ffffff" : "#5e5e5e")};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: ${props => (props.$active ? "#046237" : "#f3f2ef")};
    border-color: ${props => (props.$active ? "transparent" : "#5e5e5e")};
  }
`;

const InquiryList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #ffffff;

  @media (max-width: 768px) {
    padding-bottom: 0;
  }
`;

const InquiryItem = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f3f2ef;
  cursor: pointer;
  background: ${props => (props.$selected ? "#f3f7f9" : "#ffffff")};
  border-left: 4px solid ${props => (props.$selected ? "#0a66c2" : "transparent")};
  transition: all 0.2s;
  display: flex;
  gap: 12px;

  &:hover {
    background: #f8f9fa;
  }
`;

const ExpertPhoto = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e0dfdc;
  flex-shrink: 0;
`;

const ExpertPhotoFallback = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #0a66c2;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
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
`;

const VerifiedBadge = styled.span`
  color: #0a66c2;
  display: inline-flex;
  align-items: center;
`;

const CategoryText = styled.div`
  font-size: 0.75rem;
  color: #5e5e5e;
  margin-bottom: 6px;
`;

const StatusBadge = styled.span`
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: capitalize;
  background: ${props => {
    switch (props.$status) {
      case "new": return "#e8f4fd";
      case "opened": return "#fff3e0";
      case "expert_replied": return "#e1f0e4";
      case "user_replied": return "#e8f4fd";
      case "converted": return "#f3e8ff";
      case "closed": return "#f3f2ef";
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
      default: return "#d1d5db";
    }
  }};
`;

const SubjectText = styled.p`
  margin: 0 0 2px 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #191919;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessagePreview = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #5e5e5e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DateText = styled.span`
  font-size: 0.75rem;
  color: #5e5e5e;
`;

const MainContent = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e0dfdc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.08), 0 4px 4px rgba(0,0,0,0.02);

  @media (max-width: 768px) {
    display: ${props => (props.$active ? "flex" : "none")};
    border-radius: 0;
    border: none;
  }
`;

const MobileBackBar = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #f3f2ef;
    background: #ffffff;
  }
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #191919;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  border-radius: 50%;

  &:hover {
    background: #f3f2ef;
  }
`;

const MobileListHeader = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #f3f2ef;
    background: #ffffff;
  }
`;

const DetailHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #f3f2ef;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const DetailTitleBlock = styled.div`
  flex: 1;
`;

const SubjectTitle = styled.h3`
  margin: 0 0 6px 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #191919;
`;

const ActionHeaderBlock = styled.div`
  display: flex;
  gap: 8px;
`;

const HeaderBtn = styled.button`
  padding: 6px 16px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => (props.$primary ? "transparent" : "#5e5e5e")};
  background: ${props => (props.$primary ? "#0a66c2" : "#ffffff")};
  color: ${props => (props.$primary ? "#ffffff" : "#5e5e5e")};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => (props.$primary ? "#004182" : "#f3f2ef")};
    border-color: ${props => (props.$primary ? "transparent" : "#191919")};
    color: ${props => (props.$primary ? "#ffffff" : "#191919")};
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const MessageList = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const MessageGroup = styled.div`
  display: flex;
  gap: 12px;
  align-self: ${props => (props.$isMe ? "flex-end" : "flex-start")};
  max-width: 80%;
  flex-direction: ${props => (props.$isMe ? "row-reverse" : "row")};
  animation: ${fadeIn} 0.25s ease-out;
`;

const MessageBubble = styled.div`
  background: ${props => (props.$isMe ? "#eef3f8" : "#f3f2ef")};
  color: #191919;
  padding: 12px 16px;
  border-radius: ${props => (props.$isMe ? "12px 12px 0 12px" : "12px 12px 12px 0")};
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid ${props => (props.$isMe ? "#dce6f1" : "#e0dfdc")};
`;

const MessageSender = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #191919;
  margin-bottom: 4px;
`;

const MessageMeta = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 4px;
  font-size: 0.7rem;
  color: #5e5e5e;
`;

const InputBar = styled.form`
  padding: 16px 24px;
  border-top: 1px solid #f3f2ef;
  display: flex;
  gap: 12px;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
    margin-bottom: 0;
  }
`;

const ReplyInput = styled.input`
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #848482;
  border-radius: 20px;
  outline: none;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:focus {
    border-color: #0a66c2;
    box-shadow: 0 0 0 1px #0a66c2;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0a66c2;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #004182;
  }

  &:disabled {
    opacity: 0.6;
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 24px;
  color: #5e5e5e;
  text-align: center;
  height: 100%;
`;

const BookingBanner = styled.div`
  background: #f3f7f9;
  border: 1px solid #dce6f1;
  padding: 14px 20px;
  border-radius: 8px;
  margin: 16px 24px 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    margin: 12px 16px 0 16px;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BookingText = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #191919;
  font-weight: 500;
`;

const BookBtn = styled.button`
  background: #0073b1;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: #00598a;
  }
`;

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

  const messageEndRef = useRef(null);

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

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSelectInquiry = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setMessages([]);
    setError("");
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/${inquiry.id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setMessages(data.data.messages || []);
        setInquiries(prev => prev.map(item => item.id === inquiry.id ? { ...item, status: data.data.inquiry.status } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedInquiry) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/${selectedInquiry.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message: replyText }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setMessages(prev => [...prev, data.data]);
        setReplyText("");
        setInquiries(prev => prev.map(item => item.id === selectedInquiry.id ? { ...item, status: "user_replied", message: replyText } : item));
      } else {
        setError(data.message || "Failed to send reply");
      }
    } catch (err) {
      setError("Failed to send message. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

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
        setInquiries(prev => prev.map(item => item.id === selectedInquiry.id ? { ...item, status: "closed" } : item));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered List
  const filteredInquiries = useMemo(() => {
    return inquiries.filter(item => {
      const matchesSearch = 
        item.expert_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && item.status !== "closed") ||
        (statusFilter === "closed" && item.status === "closed");

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchText, statusFilter]);

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + (words[1]?.charAt(0) || "")).toUpperCase();
  };

  return (
    <PageBackground>
      <Container>
        <Sidebar $active={!!selectedInquiry}>
          <MobileListHeader>
            <BackBtn onClick={() => navigate("/user")}>
              <FiArrowLeft size={20} />
            </BackBtn>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#191919" }}>My Inquiries</div>
          </MobileListHeader>
          <ListHeader>
            <ListTitle>My Inquiries</ListTitle>
            <SearchContainer>
              <SearchIcon />
              <SearchInput 
                type="text" 
                value={searchText} 
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search by expert or subject..." 
              />
            </SearchContainer>
            <FilterRow>
              <FilterChip $active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All</FilterChip>
              <FilterChip $active={statusFilter === "active"} onClick={() => setStatusFilter("active")}>Active</FilterChip>
              <FilterChip $active={statusFilter === "closed"} onClick={() => setStatusFilter("closed")}>Closed</FilterChip>
            </FilterRow>
          </ListHeader>
          
          <InquiryList>
            {listLoading ? (
              <div style={{ padding: "20px" }}>
                <Skeleton $height="70px" $margin="12px" />
                <Skeleton $height="70px" $margin="12px" />
                <Skeleton $height="70px" $margin="12px" />
              </div>
            ) : filteredInquiries.length === 0 ? (
              <EmptyState>
                <FiInbox size={36} color="#848482" />
                <p style={{ margin: 0, fontSize: "0.9rem" }}>You haven't sent any inquiries yet.</p>
              </EmptyState>
            ) : (
              filteredInquiries.map(item => (
                <InquiryItem
                  key={item.id}
                  $selected={selectedInquiry?.id === item.id}
                  onClick={() => handleSelectInquiry(item)}
                >
                  {item.expert_photo ? (
                    <ExpertPhoto src={item.expert_photo} alt="" />
                  ) : (
                    <ExpertPhotoFallback>{getInitials(item.expert_name)}</ExpertPhotoFallback>
                  )}
                  <ItemContent>
                    <ItemHeader>
                      <ExpertName>
                        {item.expert_name}
                        <VerifiedBadge><FiCheckCircle size={12} /></VerifiedBadge>
                      </ExpertName>
                      <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                    </ItemHeader>
                    <CategoryText>{item.category_name || "Expert"}</CategoryText>
                    <SubjectText>{item.subject}</SubjectText>
                    <MessagePreview>{item.message}</MessagePreview>
                    <div style={{ marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                      <DateText>{new Date(item.last_message_at).toLocaleDateString()}</DateText>
                    </div>
                  </ItemContent>
                </InquiryItem>
              ))
            )}
          </InquiryList>
        </Sidebar>

        <MainContent $active={!!selectedInquiry}>
          {selectedInquiry ? (
            <>
              <MobileBackBar>
                <BackBtn onClick={() => setSelectedInquiry(null)}>
                  <FiArrowLeft size={20} />
                </BackBtn>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#191919" }}>{selectedInquiry.expert_name}</div>
              </MobileBackBar>

              <DetailHeader>
                <DetailTitleBlock>
                  <SubjectTitle>{selectedInquiry.subject}</SubjectTitle>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#5e5e5e" }}>
                    <span>Expert: <strong>{selectedInquiry.expert_name}</strong></span>
                    <span>•</span>
                    <span>{selectedInquiry.category_name || "Expert"}</span>
                  </div>
                </DetailTitleBlock>
                <ActionHeaderBlock>
                  {selectedInquiry.status !== "closed" && (
                    <HeaderBtn onClick={handleCloseInquiry}>Close Inquiry</HeaderBtn>
                  )}
                  <HeaderBtn $primary onClick={() => navigate(`/user/experts/${selectedInquiry.expert_slug || selectedInquiry.expert_id}`)}>View Profile</HeaderBtn>
                </ActionHeaderBlock>
              </DetailHeader>

              {selectedInquiry.status !== "closed" && (
                <BookingBanner>
                  <BookingText>Need immediate live consultation with {selectedInquiry.expert_name}?</BookingText>
                  <BookBtn onClick={() => navigate(`/user/experts/${selectedInquiry.expert_slug || selectedInquiry.expert_id}`)}>
                    <FiMessageCircle size={14} /> Book Live Chat / Call
                  </BookBtn>
                </BookingBanner>
              )}

              <MessageList>
                {messages.map(msg => {
                  const isMe = msg.sender_type === "user";
                  return (
                    <MessageGroup key={msg.id} $isMe={isMe}>
                      <MessageBubble $isMe={isMe}>
                        <MessageSender>{isMe ? "You" : selectedInquiry.expert_name}</MessageSender>
                        <div style={{ wordBreak: "break-word", fontSize: "0.9rem", lineHeight: "1.4" }}>{msg.message}</div>
                        <MessageMeta>
                          <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </MessageMeta>
                      </MessageBubble>
                    </MessageGroup>
                  );
                })}
                <div ref={messageEndRef} />
              </MessageList>

              {error && <div style={{ padding: "8px 24px", background: "#fef2f2", color: "#b91c1c", fontSize: "0.85rem" }}>{error}</div>}

              <InputBar onSubmit={handleSendReply}>
                <ReplyInput
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={selectedInquiry.status === "closed" ? "This inquiry is closed" : "Write a reply..."}
                  disabled={selectedInquiry.status === "closed" || loading}
                />
                <SendButton type="submit" disabled={selectedInquiry.status === "closed" || !replyText.trim() || loading}>
                  <FiSend size={16} />
                </SendButton>
              </InputBar>
            </>
          ) : (
            <EmptyState>
              <FiInbox size={48} color="#848482" />
              <h3 style={{ margin: "0 0 8px 0", color: "#191919", fontSize: "1.2rem", fontWeight: 500 }}>Select an Inquiry</h3>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>Choose an inquiry from the left sidebar to view the conversation details.</p>
            </EmptyState>
          )}
        </MainContent>
      </Container>
    </PageBackground>
  );
}
