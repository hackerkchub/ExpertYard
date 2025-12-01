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
