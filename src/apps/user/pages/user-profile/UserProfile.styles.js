// UserProfile.styles.js

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

/* ========================= */
/* PROFILE CONTAINER */
/* ========================= */

export const ProfileContainer = styled(Container)`
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/* ========================= */
/* STYLED PAPER */
/* ========================= */

export const StyledPaper = styled(Paper)`
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 24px !important;
 padding: 32px;
  box-shadow:
    0 20px 35px -8px rgba(0, 0, 0, 0.1),
    0 5px 12px -4px rgba(0, 0, 0, 0.05);

  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      0 25px 40px -12px rgba(0, 0, 0, 0.15);
  }
`;

/* ========================= */
/* HEADER */
/* ========================= */

export const HeaderSection = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 32px;
  padding-bottom: 16px;

  border-bottom: 2px solid rgba(0, 0, 0, 0.08);

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const PageTitle = styled(Typography)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-weight: 800 !important;
  letter-spacing: -0.5px;
`;

/* ========================= */
/* ACTION BUTTONS */
/* ========================= */

export const ActionButtonsGroup = styled(Box)`
  display: flex;
  gap: 8px;
`;

export const StyledIconButton = styled(IconButton)`
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';

    position: absolute;

    top: 50%;
    left: 50%;

    width: 0;
    height: 0;

    border-radius: 50%;

    background: rgba(0, 0, 0, 0.1);

    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover::before {
    width: 100%;
    height: 100%;
  }

  &.edit-btn:hover {
    background:
      linear-gradient(135deg, #667eea20, #764ba220);
  }

  &.delete-btn:hover {
    background:
      linear-gradient(135deg, #f5656520, #ed64a620);
  }
`;

/* ========================= */
/* PROFILE CARD */
/* ========================= */

export const ProfileCard = styled(Card)`
  background:
    linear-gradient(135deg, #ffffff 0%, #ffffff 100%);

  border-radius: 20px !important;

  border: 1px solid rgba(102, 126, 234, 0.1);

  transition: all 0.3s ease;

  overflow: hidden;
  position: relative;

  &::before {
    content: '';

    position: absolute;

    top: 0;
    left: 0;
    right: 0;

    height: 4px;

    background:
      linear-gradient(
        90deg,
        #667eea,
        #764ba2,
        #f093fb
      );
  }
`;

export const StyledCardContent = styled(CardContent)`
  padding: 32px !important;
`;

/* ========================= */
/* AVATAR */
/* ========================= */

export const AvatarSection = styled(Box)`
  display: flex;
  align-items: center;

  margin-bottom: 32px;

  position: relative;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const StyledAvatar = styled(Avatar)`
  width: 100px !important;
  height: 100px !important;

  margin-right: 24px !important;

  background:
    linear-gradient(135deg, #667eea, #764ba2) !important;

  box-shadow:
    0 8px 20px -6px rgba(102, 126, 234, 0.4);

  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);

    box-shadow:
      0 12px 28px -8px rgba(102, 126, 234, 0.6);
  }

  @media (max-width: 600px) {
    margin-right: 0 !important;
    margin-bottom: 16px !important;
  }
`;

export const AvatarIcon = styled(PersonIcon)`
  font-size: 50px !important;
`;

export const UserInfo = styled(Box)`
  flex: 1;
`;

export const UserName = styled(Typography)`
  font-weight: 700 !important;

  background:
    linear-gradient(135deg, #2d3748, #4a5568);

  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  margin-bottom: 8px !important;
`;

export const ReferralBadge = styled(Box)`
  display: inline-block;

  background:
    linear-gradient(
      135deg,
      #667eea10,
      #764ba210
    );

  padding: 4px 16px;

  border-radius: 20px;

  border: 1px solid rgba(102, 126, 234, 0.2);

  margin-top: 8px;
`;

/* ========================= */
/* INFO GRID */
/* ========================= */

export const InfoGrid = styled(Grid)`
  margin-top: 16px !important;
`;

export const InfoItem = styled(Box)`
  padding: 16px;

  background: rgba(102, 126, 234, 0.03);

  border-radius: 12px;

  transition: all 0.3s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.06);
    transform: translateX(5px);
  }
`;

export const InfoLabel = styled(Typography)`
  font-weight: 600 !important;

  margin-bottom: 8px !important;

  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InfoValue = styled(Typography)`
  color: #2d3748 !important;

  font-weight: 500 !important;

  word-break: break-word;
`;

/* ========================= */
/* FORM */
/* ========================= */

export const StyledForm = styled(Box)`
  animation: slideIn 0.4s ease-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 12px;

    transition: all 0.3s ease;

    &:hover fieldset {
      border-color: #667eea;
    }

    &.Mui-focused fieldset {
      border-color: #667eea;
      border-width: 2px;
    }
  }

  & .MuiInputLabel-root.Mui-focused {
    color: #667eea;
  }
`;

export const FormActions = styled(Box)`
  display: flex;
  justify-content: flex-end;

  gap: 16px;

  margin-top: 32px;
  padding-top: 16px;

  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;

export const CancelButton = styled(Button)`
  border-radius: 12px !important;

  padding: 8px 24px !important;

  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const SaveButton = styled(Button)`
  border-radius: 12px !important;

  padding: 8px 32px !important;

  background:
    linear-gradient(135deg, #667eea, #764ba2) !important;

  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-2px);

    box-shadow:
      0 8px 20px -6px rgba(102, 126, 234, 0.5);
  }
`;

/* ========================= */
/* LOADING */
/* ========================= */

export const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;

  min-height: 60vh;

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

/* ========================= */
/* DIALOG */
/* ========================= */

export const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 20px;

    padding: 8px;

    background:
      linear-gradient(135deg, #ffffff, #f8f9ff);
  }
`;

export const DialogTitleStyled = styled(DialogTitle)`
  font-weight: 700 !important;

  color: #e53e3e !important;

  border-bottom:
    2px solid rgba(229, 62, 62, 0.1);
`;

export const DialogContentStyled = styled(DialogContent)`
  margin-top: 16px;
`;

export const WarningText = styled(Typography)`
  color: #e53e3e !important;

  font-weight: 500 !important;

  margin-top: 16px !important;

  padding: 8px 16px;

  background:
    rgba(229, 62, 62, 0.05);

  border-radius: 8px;

  display: inline-block;
`;

/* ========================= */
/* SNACKBAR */
/* ========================= */

export const StyledSnackbar = styled(Snackbar)`
  & .MuiAlert-root {
    border-radius: 12px;

    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  & .MuiAlert-standardSuccess {
    background:
      linear-gradient(135deg, #48bb78, #38a169);

    color: white;
  }

  & .MuiAlert-standardError {
    background:
      linear-gradient(135deg, #f56565, #e53e3e);

    color: white;
  }
`;

/* ========================= */
/* DECORATIVE CIRCLES */
/* ========================= */

export const DecorativeCircle = styled(Box)`
  position: fixed;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.05),
      rgba(118, 75, 162, 0.05)
    );

  pointer-events: none;

  z-index: 0;

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
`;
// Add to UserProfile.styles.js

export const VerifyButton = styled(Button)`
  border-radius: 12px !important;
  padding: 8px 16px !important;
  height: 56px;
  background: ${props => props.$verified 
    ? 'linear-gradient(135deg, #48bb78, #38a169) !important'
    : 'linear-gradient(135deg, #667eea, #764ba2) !important'
  };
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -6px rgba(102, 126, 234, 0.5);
  }
  
  &:disabled {
    opacity: 0.6;
    transform: none;
  }
`;

// Add to UserProfile.styles.js

export const SignOutButton = styled(Button)`
  border-radius: 12px !important;
  padding: 12px 24px !important;
  background: linear-gradient(135deg, #ed6c02, #f59e0b) !important;
  color: white !important;
  text-transform: none !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px -6px rgba(237, 108, 2, 0.5);
  }
`;