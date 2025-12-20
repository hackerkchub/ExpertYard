// src/shared/components/modal-contents/FollowersContent.jsx
import React from "react";
import styled from "styled-components";
import { FiUser } from "react-icons/fi";

const List = styled.div`
  max-height: 320px;
  overflow-y: auto;
  margin-top: 6px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 6px;
  border-radius: 12px;

  &:hover {
    background: rgba(241, 245, 249, 0.7);
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.div`
  font-size: 14px;
  color: #0f172a;
  font-weight: 500;
`;

const Empty = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
`;

const Loader = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #475569;
`;

export default function FollowersContent({
  followers = [],
  loading = false,
  total = 0
}) {
  if (loading) {
    return <Loader>Loading followers…</Loader>;
  }

  if (!followers.length) {
    return <Empty>No followers yet</Empty>;
  }

  return (
    <List>
      {followers.map(f => (
        <Item key={f.id}>
           <Avatar>
            <FiUser size={35} />
          </Avatar>
          <Name>{f.name}</Name>
        </Item>
      ))}
    </List>
  );
}
