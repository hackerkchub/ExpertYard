import styled from "styled-components";

/* OVERLAY */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px; /* Prevent modal touching edges on small devices */

  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);

  z-index: 2000;

  /* Prevent scroll + accidental right-side gap */
  overflow: hidden;

  @media (max-height: 500px) {
    align-items: flex-start; 
    padding-top: 30px; /* For landscape / small-height screens */
  }
`;

/* MODAL BOX */
export const Box = styled.div`
  width: 100%;
  max-width: 360px;

  background: rgba(255, 255, 255, 0.15);
  padding: 26px 24px;

  border-radius: 14px;
  position: relative;

  border: 1px solid rgba(255, 255, 255, 0.3);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  /* Prevent popup from going out of screen */
  max-height: 90vh;
  overflow-y: auto;
`;

/* CLOSE BUTTON */
export const Close = styled.div`
  position: absolute;
  right: 14px;
  top: 10px;

  font-size: 26px;
  color: white;
  cursor: pointer;

  padding: 4px;
  border-radius: 6px;

  &:active {
    background: rgba(255,255,255,0.2);
  }
`;

/* TITLE */
export const Title = styled.h3`
  text-align: center;
  color: #66b3ff;
  font-weight: 600;
  margin-bottom: 18px;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

/* INPUT */
export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;

  border-radius: 8px;
  border: 1px solid #ffffff40;
  background: rgba(255,255,255,0.18);
  color: white;

  font-size: 15px;

  &::placeholder {
    color: rgba(235, 235, 235, 0.85);
  }

  @media (max-width: 480px) {
    padding: 11px 12px;
  }
`;

/* BUTTON */
export const Btn = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 16px;

  background: #007bff;
  color: white;

  border: none;
  border-radius: 8px;
  font-size: 16px;

  cursor: pointer;
  transition: 0.25s;

  &:hover {
    background: #006ae0;
  }

  &:active {
    transform: scale(0.97);
  }
`;
