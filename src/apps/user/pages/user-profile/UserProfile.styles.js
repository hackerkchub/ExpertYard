import styled from 'styled-components';

import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  IconButton,
  Grid
} from '@mui/material';

import {
  Person as PersonIcon
} from '@mui/icons-material';

export const ProfileContainer = styled(Container)`
  width: 100%;
  max-width: 1180px !important;
  position: relative;
  z-index: 1;
  padding-top: clamp(18px, 4vw, 40px);
  padding-bottom: clamp(42px, 6vw, 76px);
  color: #111827;
  animation: fadeInUp 0.45s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 767px) {
    max-width: 100% !important;
    padding: 8px 12px 12px;
    overflow-x: hidden;
    animation: none;

    &,
    * {
      box-sizing: border-box;
    }
  }
`;

export const StyledPaper = styled(Paper)`
  overflow: hidden;
  padding: clamp(22px, 3vw, 34px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 28px !important;
  background:
    radial-gradient(circle at 92% 8%, rgba(37, 99, 235, 0.08), transparent 28%),
    linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow:
    0 24px 60px rgba(15, 23, 42, 0.10),
    0 8px 24px rgba(0, 0, 128, 0.06);
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 28px 68px rgba(15, 23, 42, 0.13);
  }

  @media (max-width: 767px) {
    padding: 0;
    border: 0;
    border-radius: 0 !important;
    background: transparent;
    box-shadow: none;
  }
`;

export const HeaderSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: clamp(18px, 3vw, 30px);
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  @media (max-width: 767px) {
    margin-bottom: 10px;
    padding: 0 2px 0;
    border-bottom: 0;
  }
`;

export const PageTitle = styled(Typography)`
  background: linear-gradient(135deg, #000080 0%, #2563eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: clamp(28px, 4vw, 36px) !important;
  font-weight: 800 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.5px;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const ActionButtonsGroup = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 767px) {
    width: 100%;
    justify-content: flex-end;
    gap: 7px;

    .edit-btn,
    .signout-btn {
      display: none;
    }
  }
`;

export const StyledIconButton = styled(IconButton)`
  width: 44px;
  height: 44px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 128, 0.10) !important;
  background: #ffffff !important;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease !important;

  &:hover {
    transform: translateY(-2px);
  }

  &.edit-btn:hover {
    color: #000080;
    background: #eff6ff !important;
  }

  &.delete-btn:hover {
    background: rgba(239, 68, 68, 0.08) !important;
  }

  &.signout-btn:hover {
    background: rgba(245, 158, 11, 0.10) !important;
  }

  @media (max-width: 767px) {
    width: 42px;
    height: 42px;
    border-radius: 14px !important;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  }
`;

export const ProfileCard = styled(Card)`
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 24px !important;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #000080, #2563eb);
  }

  @media (max-width: 767px) {
    border-radius: 22px !important;
    border-color: rgba(0, 0, 128, 0.08);
    background:
      radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.12), transparent 30%),
      linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.07);

    &::before {
      height: 0;
    }
  }
`;

export const StyledCardContent = styled(CardContent)`
  display: grid;
  grid-template-columns: minmax(240px, 0.75fr) minmax(0, 1.35fr);
  gap: clamp(18px, 3vw, 28px);
  align-items: stretch;
  padding: clamp(18px, 3vw, 30px) !important;

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 14px !important;
  }
`;

export const AvatarSection = styled(Box)`
  min-width: 0;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: clamp(18px, 3vw, 26px);
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 22px;
  background:
    radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.12), transparent 42%),
    linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  text-align: center;

  @media (max-width: 767px) {
    min-height: 0;
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 4px 2px 12px;
    border: 0;
    border-radius: 0;
    background: transparent;
    text-align: left;
  }
`;

export const StyledAvatar = styled(Avatar)`
  width: clamp(92px, 12vw, 112px) !important;
  height: clamp(92px, 12vw, 112px) !important;
  margin-right: 0 !important;
  background: linear-gradient(135deg, #000080, #2563eb) !important;
  box-shadow: 0 18px 34px rgba(0, 0, 128, 0.24);
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: scale(1.04);
    box-shadow: 0 22px 42px rgba(37, 99, 235, 0.26);
  }

  @media (max-width: 767px) {
    width: 78px !important;
    height: 78px !important;
    flex: 0 0 78px;
    box-shadow: 0 14px 28px rgba(0, 0, 128, 0.2);
  }
`;

export const AvatarIcon = styled(PersonIcon)`
  font-size: clamp(42px, 7vw, 54px) !important;

  @media (max-width: 767px) {
    font-size: 38px !important;
  }
`;

export const UserInfo = styled(Box)`
  width: 100%;
  min-width: 0;

  @media (max-width: 767px) {
    flex: 1;
  }
`;

export const UserName = styled(Typography)`
  margin-bottom: 8px !important;
  background: linear-gradient(135deg, #111827, #000080);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: clamp(22px, 3vw, 30px) !important;
  font-weight: 800 !important;
  line-height: 1.18 !important;
  word-break: break-word;

  @media (max-width: 767px) {
    margin-bottom: 4px !important;
    font-size: clamp(18px, 5.4vw, 21px) !important;
    line-height: 1.15 !important;
  }
`;

export const MobileUserMeta = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: grid;
    gap: 3px;
    margin-top: 3px;
    color: #64748b;
    font-size: 12px;
    line-height: 1.25;
    font-weight: 550;

    span {
      min-width: 0;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const ReferralBadge = styled(Box)`
  display: inline-block;
  max-width: 100%;
  margin-top: 8px;
  padding: 6px 14px;
  border: 1px solid rgba(37, 99, 235, 0.16);
  border-radius: 999px;
  background: #eff6ff;

  & .MuiTypography-root {
    overflow: hidden;
    color: #000080 !important;
    font-size: 12px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    margin-top: 4px;
    padding: 4px 9px;

    & .MuiTypography-root {
      font-size: 10.5px;
    }
  }
`;

export const InfoGrid = styled(Grid)`
  align-content: start;
  margin-top: 0 !important;

  @media (max-width: 767px) {
    width: calc(100% + 8px) !important;
    margin: -4px !important;

    & > .MuiGrid-item {
      padding: 4px !important;
    }

    & > .MuiGrid-item:last-child {
      display: none;
    }
  }
`;

export const InfoItem = styled(Box)`
  min-height: 100%;
  padding: 18px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.04);
  transition: transform 0.25s ease, border-color 0.25s ease;

  &:hover {
    border-color: rgba(37, 99, 235, 0.24);
    transform: translateY(-2px);
  }

  @media (max-width: 767px) {
    min-height: 82px;
    padding: 12px;
    border-radius: 16px;
    box-shadow: none;
  }
`;

export const InfoLabel = styled(Typography)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px !important;
  color: #64748b !important;
  font-size: 13px !important;
  font-weight: 700 !important;

  @media (max-width: 767px) {
    gap: 6px;
    margin-bottom: 6px !important;
    font-size: 12px !important;
    line-height: 1.25 !important;

    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

export const InfoValue = styled(Typography)`
  color: #111827 !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  line-height: 1.45 !important;
  word-break: break-word;

  @media (max-width: 767px) {
    font-size: 13.5px !important;
    line-height: 1.35 !important;
  }
`;

export const StyledForm = styled(Box)`
  padding: clamp(16px, 3vw, 24px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(14px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (max-width: 767px) {
    padding: 14px;
    border-radius: 20px;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);

    .MuiGrid-container {
      row-gap: 2px;
    }

    .MuiGrid-item {
      padding-top: 10px !important;
    }
  }
`;

export const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 14px;
    background: #ffffff;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;

    &:hover fieldset {
      border-color: #2563eb;
    }

    &.Mui-focused fieldset {
      border-color: #2563eb;
      border-width: 2px;
    }
  }

  & .MuiInputLabel-root.Mui-focused {
    color: #000080;
  }

  @media (max-width: 767px) {
    & .MuiOutlinedInput-root {
      min-height: 46px;
      border-radius: 14px;
    }

    & .MuiInputBase-input {
      font-size: 14px;
    }
  }
`;

export const FormActions = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  @media (max-width: 767px) {
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 16px;
    padding-top: 12px;

    & .MuiButton-root {
      width: 100%;
      min-height: 46px;
    }
  }
`;

export const CancelButton = styled(Button)`
  padding: 8px 24px !important;
  border-color: rgba(0, 0, 128, 0.28) !important;
  border-radius: 14px !important;
  color: #000080 !important;
  font-weight: 700 !important;
  text-transform: none !important;
  transition: transform 0.25s ease !important;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const SaveButton = styled(Button)`
  padding: 8px 32px !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg, #000080, #2563eb) !important;
  font-weight: 800 !important;
  text-transform: none !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
  }
`;

export const LoadingContainer = styled(Box)`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000080;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.6;
    }
  }
`;

export const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    max-width: min(92vw, 480px);
    padding: 8px;
    border-radius: 22px;
    background: linear-gradient(135deg, #ffffff, #f8fafc);
  }
`;

export const DialogTitleStyled = styled(DialogTitle)`
  border-bottom: 1px solid rgba(229, 62, 62, 0.12);
  color: #dc2626 !important;
  font-weight: 800 !important;
`;

export const DialogContentStyled = styled(DialogContent)`
  margin-top: 16px;
`;

export const WarningText = styled(Typography)`
  display: inline-block;
  margin-top: 16px !important;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(229, 62, 62, 0.06);
  color: #dc2626 !important;
  font-weight: 600 !important;
`;

export const StyledSnackbar = styled(Snackbar)`
  & .MuiAlert-root {
    border-radius: 14px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.14);
  }

  @media (max-width: 767px) {
    bottom: calc(78px + env(safe-area-inset-bottom, 0px)) !important;
  }
`;

export const DecorativeCircle = styled(Box)`
  position: fixed;
  z-index: 0;
  pointer-events: none;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 0, 128, 0.05), rgba(37, 99, 235, 0.05));

  &.circle-1 {
    width: 300px;
    height: 300px;
    top: -150px;
    right: -150px;
  }

  &.circle-2 {
    width: 200px;
    height: 200px;
    bottom: -100px;
    left: -100px;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

export const VerifyButton = styled(Button)`
  height: 56px;
  padding: 8px 16px !important;
  border-radius: 14px !important;
  background: ${props => props.$verified
    ? 'linear-gradient(135deg, #16a34a, #22c55e) !important'
    : 'linear-gradient(135deg, #000080, #2563eb) !important'
  };
  color: #ffffff !important;
  font-weight: 800 !important;
  text-transform: none !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.25);
  }

  &:disabled {
    opacity: 0.62;
    transform: none;
  }

  @media (max-width: 767px) {
    height: 46px;
    border-radius: 14px !important;
    font-size: 13px !important;
  }
`;

export const MobileShortcutGrid = styled.div`
  display: none;

  @media (max-width: 767px) {
    width: 100%;
    display: grid;
    gap: 9px;
    margin-top: 10px;
    padding-bottom: 0;
  }
`;

export const MobileShortcutButton = styled.button`
  width: 100%;
  min-height: 50px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 16px;
  background: #ffffff;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 12px;
  font: inherit;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.045);

  > span {
    width: 34px;
    height: 34px;
    flex: 0 0 34px;
    border-radius: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 128, 0.08);
    color: #000080;
  }

  strong {
    min-width: 0;
    flex: 1;
    color: #111827;
    font-size: 14px;
    line-height: 1.2;
    font-weight: 750;
  }

  svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    color: #64748b;
  }

  &.danger {
    border-color: rgba(220, 38, 38, 0.12);

    > span,
    svg {
      color: #dc2626;
    }

    > span {
      background: rgba(220, 38, 38, 0.08);
    }
  }

  &:active {
    transform: scale(0.985);
  }
`;

export const SignOutButton = styled(Button)`
  width: 100%;
  padding: 12px 24px !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg, #ed6c02, #f59e0b) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  text-transform: none !important;
  transition: transform 0.25s ease, box-shadow 0.25s ease !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -6px rgba(237, 108, 2, 0.5);
  }
`;
