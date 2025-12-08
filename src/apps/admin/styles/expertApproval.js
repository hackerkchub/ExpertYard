import styled from "styled-components";

export const ProfileImage = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0ea5ff;
`;

export const ActionsBox = styled.div`
  display: flex;
  gap: 10px;

  button {
    padding: 6px 10px;
    border-radius: 8px;
    background: #1e293b;
    color: #fff;
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 14px;
  }

  .approve {
    background: #10b981;
  }

  .disable {
    background: #ef4444;
  }
`;
