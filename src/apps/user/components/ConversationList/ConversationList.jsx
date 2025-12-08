import React from "react";
import {
  Panel,
  Header,
  CloseBtn,
  Item,
  Avatar,
  Info,
  LastMsg,
  StatusDot
} from "./ConversationList.styles";

const ConversationList = ({ show, close, items, onSelect }) => {
  return (
    <Panel show={show}>
      <Header>
        <span>Chats</span>
        <CloseBtn onClick={close}>✕</CloseBtn>
      </Header>

      {items.map((c) => (
        <Item key={c.id} onClick={() => onSelect(c)}>
          <Avatar src={c.avatar} />
          <Info>
            <strong>{c.name}</strong>
            <LastMsg>{c.lastMsg}</LastMsg>
          </Info>
          <StatusDot active={c.online} />
        </Item>
      ))}
    </Panel>
  );
};

export default ConversationList;
