// MyOffer.styles.js - Updated for exact design requirements
import styled from "styled-components";

/* PAGE */
export const PageWrap = styled.div`
  background: #f4f7fb;
  padding: 40px 16px;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: auto;
`;

/* SECTION */
export const Section = styled.div`
  margin-bottom: 48px;
`;

export const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
`;

export const SubTitle = styled.p`
  color: #6b7280;
  margin-bottom: 20px;
`;

/* FOLLOWING */
export const FollowingRow = styled.div`
  display: flex;
  gap: 18px;
  padding: 18px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.08);
  overflow-x: auto;
`;

export const FollowAvatar = styled.div`
  min-width: 80px;
  text-align: center;

  img {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: 3px solid #4f7cff;
    margin-bottom: 6px;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    display: block;
    line-height: 1.2;
  }
`;

/* GRID */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 26px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* CARD */
export const Card = styled.div`
  background: #fff;
  border-radius: 18px;
  padding: 18px;
  border: 2px solid rgba(79,124,255,0.25);
  box-shadow: 0 14px 40px rgba(0,0,0,0.08);
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(79,124,255,0.4);
    box-shadow: 0 20px 50px rgba(0,0,0,0.12);
  }
`;

/* HEADER */
export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
`;

export const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const NameWrap = styled.div`
  flex: 1;
  cursor: pointer;
  padding: 4px 0;
`;

export const Name = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #1f2937;
  line-height: 1.3;
`;

export const Role = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  font-weight: 400;
`;

export const Time = styled.div`
  font-size: 12px;
  color: #9ca3af;
  font-weight: 400;
  white-space: nowrap;
`;

/* BODY */
export const CardBody = styled.div`
  margin-top: 12px;
`;

export const PostTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
  line-height: 1.4;
`;

export const PostDesc = styled.p`
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
`;

export const Thumb = styled.img`
  width: 100%;
  height: 180px;
  border-radius: 14px;
  margin-top: 12px;
  object-fit: cover;
`;

/* FOOTER */
export const CardFooter = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Actions = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

export const ActionBtn = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0,0,0,0.05);
  }

  /* ✅ Fix: Use $liked prop instead of liked */
  ${({ $liked }) => $liked && `
    color: #ef4444;
  `}

  svg {
    width: 18px;
    height: 18px;
  }
`;


/* INLINE */
export const InlineBox = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
`;

export const InlineInput = styled.input`
  width: 100%;
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  font-weight: 400;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #4f7cff;
    box-shadow: 0 0 0 3px rgba(79,124,255,0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const InlineComment = styled.div`
  font-size: 13px;
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
  color: #374151;
  line-height: 1.4;
`;

export const StarsRow = styled.div`
  display: flex;
  gap: 4px;
  margin-top: 4px;
`;

export const StarBtn = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const SendBtn = styled.button`
  background: #2563eb;
  border: none;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

/* COMMENT INPUT WRAPPER */
export const CommentInputWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-top: 12px;
`;

/* POST TIME */
export const PostTime = styled(Time)`
  font-size: 11px;
  font-weight: 400;
`;
