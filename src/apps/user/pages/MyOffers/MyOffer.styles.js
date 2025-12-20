import styled from "styled-components";

export const PageWrap = styled.div`
  padding: 32px;
  background: radial-gradient(circle at top, #eef4ff, #ffffff);
`;

export const Section = styled.div`
  margin-bottom: 48px;
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
`;

export const SubTitle = styled.p`
  color: #6b7280;
  margin-bottom: 22px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 22px;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  border-radius: 18px;
  box-shadow: 0 25px 45px rgba(15, 23, 42, 0.12);
  padding: 16px;
`;

export const CardHeader = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
`;

export const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
`;

export const NameWrap = styled.div`
  flex: 1;
`;

export const Name = styled.div`
  font-weight: 600;
`;

export const Role = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const Time = styled.div`
  font-size: 12px;
  color: #9ca3af;
`;

export const CardBody = styled.div`
  margin-bottom: 12px;
`;

export const PostTitle = styled.h4`
  font-size: 15px;
`;

export const PostDesc = styled.p`
  font-size: 13px;
  color: #4b5563;
`;

export const Thumb = styled.img`
  width: 100%;
  height: 160px;
  border-radius: 14px;
  margin-top: 10px;
  object-fit: cover;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Actions = styled.div`
  display: flex;
  gap: 18px;
`;

export const ActionBtn = styled.button`
  background: none;
  border: none;
  display: flex;
  gap: 6px;
  cursor: pointer;
  color: ${({ liked }) => (liked ? "#ef4444" : "#374151")};
`;

export const Rating = styled.div`
  cursor: pointer;
`;

export const FollowBtn = styled.button`
  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
`;

export const InlineBox = styled.div`
  margin-top: 14px;
  padding: 14px;
  background: #f9fafb;
  border-radius: 14px;
`;

export const InlineInput = styled.input`
  width: 100%;
  margin-top: 10px;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
`;

export const InlineComment = styled.div`
  font-size: 13px;
  padding: 6px 0;
  border-bottom: 1px solid #e5e7eb;
`;

export const StarsRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const StarBtn = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#facc15" : "#9ca3af")};
  cursor: pointer;
`;

export const SendBtn = styled.button`
  margin-top: 8px;
  background: #2563eb;
  border: none;
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
`;
