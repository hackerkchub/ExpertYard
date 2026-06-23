import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { socket } from '../api/socket';
import { getActiveChatSession, clearActiveChatSession } from '../utils/chatSession';
import { hotToast } from '../utils/lazyNotifications';
import { FiMessageSquare, FiX, FiPlay } from 'react-icons/fi';

const slideInTop = keyframes`
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const slideInRight = keyframes`
  from { transform: translateX(100%) translateY(0); opacity: 0; }
  to { transform: translateX(0) translateY(0); opacity: 1; }
`;

const slideInBottom = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const BannerWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 12px 18px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    ${({ $module }) => $module === 'user' ? css`
      left: 12px;
      right: 12px;
      bottom: calc(76px + env(safe-area-inset-bottom));
      border-radius: 14px;
      animation: ${slideInBottom} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    ` : css`
      top: 0;
      left: 0;
      right: 0;
      border-radius: 0;
      border-top: none;
      border-left: none;
      border-right: none;
      animation: ${slideInTop} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    `}
  }

  @media (min-width: 769px) {
    ${({ $module }) => $module === 'user' ? css`
      top: 76px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 14px;
      width: min(520px, calc(100vw - 48px));
      animation: ${slideInTop} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    ` : css`
      bottom: 24px;
      right: 24px;
      border-radius: 16px;
      width: 320px;
      animation: ${slideInRight} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    `}
  }
`;

const PulseDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  display: inline-block;
  animation: ${pulse} 2s infinite;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const Title = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Desc = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
    background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: #f1f5f9;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  @media (max-width: 640px) {
    align-items: flex-end;
    padding: 12px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
`;

const ConfirmDialog = styled.div`
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.28);
  border: 1px solid rgba(226, 232, 240, 0.92);
  padding: 24px;
  color: #0f172a;
  animation: ${fadeIn} 0.18s ease-out;

  @media (max-width: 640px) {
    border-radius: 18px;
    padding: 20px;
  }
`;

const ConfirmTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 20px;
  line-height: 1.25;
  font-weight: 700;
  color: #0f172a;
`;

const ConfirmMessage = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 8px;
  }
`;

const ConfirmButton = styled.button`
  min-height: 42px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
  background: #ffffff;
  color: #334155;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }

  ${({ $danger }) => $danger && css`
    background: #dc2626;
    border-color: #dc2626;
    color: #ffffff;

    &:hover {
      background: #b91c1c;
      border-color: #b91c1c;
    }
  `}

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

const notifyChatEnded = () => {
  void hotToast('success', 'Chat ended', { id: 'chat-ended' });
};

export default function ContinueChatBanner() {
  const [session, setSession] = useState(getActiveChatSession());
  const [dismissed, setDismissed] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [ending, setEnding] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const activeSession = getActiveChatSession();
      setSession(activeSession);
    };

    window.addEventListener('active_chat_session_changed', checkSession);
    window.addEventListener('storage', checkSession);

    const handleChatEnded = (data = {}) => {
      const endedRoomId = data.room_id || data.roomId;
      const currentSession = getActiveChatSession();
      if (currentSession && (!endedRoomId || String(endedRoomId) === String(currentSession.room_id))) {
        clearActiveChatSession();
        setShowEndConfirm(false);
        setEnding(false);
        setDismissed(true);
        notifyChatEnded();
      }
    };

    socket.on('chat_ended', handleChatEnded);

    return () => {
      window.removeEventListener('active_chat_session_changed', checkSession);
      window.removeEventListener('storage', checkSession);
      socket.off('chat_ended', handleChatEnded);
    };
  }, []);

  useEffect(() => {
    setDismissed(false);
    setShowEndConfirm(false);
    setEnding(false);
  }, [session?.room_id]);

  if (!session || dismissed) {
    return <Toaster position="top-center" />;
  }

  const sessionChatPath = session.chatPath || (
    session.module === 'expert'
      ? `/expert/chat/${session.room_id}`
      : `/user/chat/${session.room_id}`
  );
  const isSameChatPage = location.pathname === sessionChatPath;
  const isExpertChatPage = session.module === 'expert' && location.pathname.startsWith('/expert/chat');
  
  if (isSameChatPage || isExpertChatPage) {
    return <Toaster position="top-center" />;
  }

  const handleContinue = () => {
    navigate(sessionChatPath);
  };

  const handleDismiss = () => {
    setShowEndConfirm(true);
  };

  const handleCancelEnd = () => {
    if (ending) return;
    setShowEndConfirm(false);
  };

  const handleConfirmEnd = () => {
    if (ending) return;

    const currentModule = session?.module;
    const roomId = session?.room_id;
    setEnding(true);

    if (socket && roomId) {
      const emitEndChat = () => {
        socket.emit("end_chat", {
          room_id: String(roomId)
        });
      };

      if (socket.connected) {
        emitEndChat();
      } else {
        socket.once("connect", emitEndChat);
        socket.connect();
      }
    }

    clearActiveChatSession();
    setShowEndConfirm(false);
    setDismissed(true);
    notifyChatEnded();
    if (currentModule === 'expert') {
      navigate('/expert/chat-history');
    } else {
      navigate('/user/chat-history');
    }
  };

  const titleText = session.module === 'expert' ? 'Active Chat Open' : 'Chat Still Active';
  const descText = session.participantName ? `Continue with ${session.participantName}` : 'Continue Chat';

  return (
    <>
      <Toaster position="top-center" />
      <BannerWrapper $module={session.module}>
        <PulseDot />
        <Content>
          <Title>
            <FiMessageSquare size={12} />
            {titleText}
          </Title>
          <Desc>{descText}</Desc>
        </Content>
        <ActionButton onClick={handleContinue}>
          <FiPlay size={12} />
          Continue
        </ActionButton>
        <CloseButton onClick={handleDismiss} title="End chat">
          <FiX size={16} />
        </CloseButton>
      </BannerWrapper>

      {showEndConfirm && (
        <ConfirmOverlay role="presentation" onClick={handleCancelEnd}>
          <ConfirmDialog
            role="dialog"
            aria-modal="true"
            aria-labelledby="end-chat-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <ConfirmTitle id="end-chat-confirm-title">End chat?</ConfirmTitle>
            <ConfirmMessage>
              Are you sure you want to disconnect this chat? The current chat session will be ended, but your chat history will remain available.
            </ConfirmMessage>
            <ConfirmActions>
              <ConfirmButton type="button" onClick={handleCancelEnd} disabled={ending}>
                No, continue chat
              </ConfirmButton>
              <ConfirmButton type="button" onClick={handleConfirmEnd} disabled={ending} $danger>
                {ending ? 'Ending...' : 'Yes, end chat'}
              </ConfirmButton>
            </ConfirmActions>
          </ConfirmDialog>
        </ConfirmOverlay>
      )}
    </>
  );
}
