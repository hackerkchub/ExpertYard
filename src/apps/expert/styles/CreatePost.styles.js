import styled from "styled-components";

/* Wrapper Card */
export const CreatePostCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.96),
    rgba(248, 250, 252, 0.9)
  );
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 22px;
  padding: 22px 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow:
    0 22px 60px rgba(15, 23, 42, 0.16),
    0 0 0 1px rgba(255, 255, 255, 0.9);
  color: #0f172a;

  @media (max-width: 768px) {
    padding: 18px 16px;
  }
`;

/* Header */
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: #020617;
  }

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

/* Inputs */
export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid #dbeafe;
  background: rgba(255, 255, 255, 0.95);
  color: #020617;
  font-size: 14px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.04);

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.4);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const Textarea = styled.textarea`
  ${Input};
  resize: vertical;
  min-height: 160px;
  line-height: 1.5;
`;

/* Media Buttons */
export const MediaActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

/* Small helper text */
export const PreviewNote = styled.span`
  font-size: 12px;
  color: #64748b;
`;

/* Image Preview */


/* Footer */
export const FooterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    justify-content: stretch;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const ImageActionRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #0b1220;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #111827;
  }
`;

export const ImagePreview = styled.div`
  position: relative;
  margin-top: 10px;
  border-radius: 14px;
  overflow: hidden;

  img {
    width: 100%;
    max-height: 240px;
    object-fit: cover;
    display: block;
  }
`;

export const ImageRemoveBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(15, 23, 42, 0.85);
  border: none;
  border-radius: 999px;
  width: 28px;
  height: 28px;
  color: #fff;
  cursor: pointer;
`;
