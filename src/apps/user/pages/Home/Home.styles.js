import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

export const LoginSection = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 25px auto;
  padding: 20px;
  border-radius: 14px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.2);
`;

/* FIXED ROW */
export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  /* prevents cropping */
  overflow: hidden;

  /* keeps items properly spaced */
  justify-content: space-between;
`;

/* COUNTRY SELECT */
export const CountrySelect = styled.select`
  width: 95px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;

  @media (max-width: 400px) {
    width: 85px;
    padding: 10px;
  }
`;

/* MOBILE INPUT (auto width) */
export const MobileInput = styled.input`
  flex: 1;
  min-width: 0; /* prevents overflowing */
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

/* BUTTON (no shrink + slight left shift) */
export const LoginBtnSmall = styled.button`
  padding: 12px 18px;
  background: #0077ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 15px;
  height: 46px;

  /* solution: prevents cropping */
  flex-shrink: 0;

  /* slight left pull so right cut never happens */
  margin-left: -2px;

  &:hover {
    background: #005dcc;
  }

  @media (max-width: 400px) {
    padding: 11px 14px;
    font-size: 14px;
  }
`;

export const ErrorText = styled.div`
  color: red;
  margin-top: 6px;
  font-size: 13px;
`;

/* HOME QUICK ACTIONS */
export const HomeActions = styled.div`
  max-width: 1280px;
  margin: 32px auto 24px;
  padding: 0 16px;

  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
`;

export const HomeActionCard = styled.div`
  min-width: 240px;
  height: 110px;

  display: flex;
  align-items: center;
  gap: 14px;

  padding: 16px 18px;
  border-radius: 18px;

  background: linear-gradient(135deg, #eef2ff, #ffffff);
  border: 1px solid rgba(99, 102, 241, 0.25);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.18);

  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(99, 102, 241, 0.3);
  }

  @media (max-width: 480px) {
    min-width: 100%;
    height: 96px;
  }
`;

export const HomeActionIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 999px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
`;

export const HomeActionTitle = styled.div`
  font-size: 17px;
  font-weight: 600;
  color: #0f172a;
`;
/* BEST EXPERTS SECTION */
export const HomeActionsSection = styled.section`
  max-width: 1280px;
  margin: 36px auto 32px;
  padding: 0 16px;
  text-align: center;
`;

export const HomeActionsTitle = styled.h2`
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #020617;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

export const HomeActionsSubTitle = styled.p`
  margin-top: 6px;
  margin-bottom: 22px;
  font-size: 14px;
  color: #475569;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
`;
