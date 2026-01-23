// src/apps/user/pages/Home/Home.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  background: #ffffff;
`;

/* ===== ACTION SECTION ===== */
export const HomeActionsSection = styled.section`
  padding: 80px 60px;
  text-align: center;
`;

export const HomeActionsTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
`;

export const HomeActionsSubTitle = styled.p`
  margin-top: 10px;
  color: #4b5563;
`;

export const HomeActions = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 30px;
`;

export const HomeActionCard = styled.div`
  background: #ffffff;
  width: 260px;
  padding: 30px;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(109, 40, 217, 0.2);
  }
`;

export const HomeActionIcon = styled.div`
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #6d28d9, #3b82f6);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto 15px;
`;

export const HomeActionTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;
