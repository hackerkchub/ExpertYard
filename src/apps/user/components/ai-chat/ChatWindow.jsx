import React, { useRef, useEffect, useState } from 'react';
import useChatStore from '../../stores/chatStore';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import QuickReplies from './QuickReplies';
import {
  ChatWindowDesktop,
  ChatWindowMobile,
  InputForm,
  InputContainer,
  ChatInput,
  SendButton,
} from './chat.styles';

const ChatWindow = () => {
  const { messages, isLoading, sendMessage, closeChat } = useChatStore();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage;
    setInputMessage('');

    await sendMessage(message);
  };

  const handleQuickReply = (reply) => {
    sendMessage(reply);
  };

  return (
    <>
      <ChatWindowDesktop>
        <ChatHeader onClose={closeChat} />

        <MessageList messagesEndRef={messagesEndRef} />

        <QuickReplies onQuickReply={handleQuickReply} />

        <InputForm onSubmit={handleSend}>
          <InputContainer>
            <ChatInput
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              autoFocus
            />

            <SendButton
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? '...' : 'Send'}
            </SendButton>
          </InputContainer>
        </InputForm>
      </ChatWindowDesktop>

      <ChatWindowMobile>
        <ChatHeader onClose={closeChat} />

        <MessageList messagesEndRef={messagesEndRef} />

        <QuickReplies onQuickReply={handleQuickReply} />

        <InputForm onSubmit={handleSend}>
          <InputContainer>
            <ChatInput
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              autoFocus
            />

            <SendButton
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? '...' : 'Send'}
            </SendButton>
          </InputContainer>
        </InputForm>
      </ChatWindowMobile>
    </>
  );
};

export default ChatWindow;