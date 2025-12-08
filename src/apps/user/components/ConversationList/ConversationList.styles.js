import styled from "styled-components";

export const Panel = styled.div`
  width: 300px;
  background: rgba(255,255,255,0.07);
  border-right: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;

  @media (max-width: 820px) {
    position: absolute;
    left: ${(p) => (p.show ? "0" : "-100%")};
    top: 0;
    height: 100%;
    transition: 0.3s ease;
    z-index: 3000;
  }
`;

export const Header = styled.div`
  padding: 18px;
  font-size: 18px;
  font-weight: 600;
  color: #c9eaff;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

export const CloseBtn = styled.span`
  cursor: pointer;

  @media (min-width: 820px) {
    display: none;
  }
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.08);
  }
`;

export const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
`;

export const Info = styled.div`
  flex: 1;
  color: white;

  strong {
    font-size: 15px;
  }
`;

export const LastMsg = styled.div`
  opacity: 0.55;
  font-size: 13px;
`;

export const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  background: ${(p) => (p.active ? "#3bff9d" : "#888")};
  border-radius: 50%;
`;
