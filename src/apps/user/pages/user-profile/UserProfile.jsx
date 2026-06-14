// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  CircularProgress,
  Alert,
  DialogActions,
  DialogContentText,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon,
  Logout as LogoutIcon,
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  SupportAgent as SupportIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  getUserProfileApi,
  updateUserProfileApi,
  deleteUserProfileApi
} from '../../../../shared/api/userApi/auth.api';
import { useAuth } from '../../../../shared/context/UserAuthContext';
import OtpModal from '../../../expert/components/OtpModal';
import { APP_CONFIG } from '../../../../config/appConfig';

// Import styled components
import {
  ProfileContainer,
  StyledPaper,
  HeaderSection,
  PageTitle,
  ActionButtonsGroup,
  StyledIconButton,
  ProfileCard,
  StyledCardContent,
  AvatarSection,
  StyledAvatar,
  AvatarIcon,
  UserInfo,
  UserName,
  MobileUserMeta,
  ReferralBadge,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  StyledForm,
  StyledTextField,
  FormActions,
  CancelButton,
  SaveButton,
  LoadingContainer,
  StyledDialog,
  DialogTitleStyled,
  DialogContentStyled,
  WarningText,
  StyledSnackbar,
  DecorativeCircle,
  VerifyButton,
  MobileShortcutGrid,
  MobileShortcutButton,
} from './UserProfile.styles';

// Helper function to get error message
const getErrorMessage = (error, fallback = "Something went wrong") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // OTP states
  const [showOtp, setShowOtp] = useState(false);
  const [verifyType, setVerifyType] = useState(null);
  const [loadingType, setLoadingType] = useState(null);
  
  // Track which fields need verification
  const [needsVerification, setNeedsVerification] = useState({ email: false, phone: false });
  
  const [userData, setUserData] = useState({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    referral_code: ''
  });
  
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  
  const [originalForm, setOriginalForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfileApi();
      
      if (response.success) {
        const fullNameParts = response.data.full_name.split(' ');
        const firstName = fullNameParts[0] || '';
        const lastName = fullNameParts.slice(1).join(' ') || '';
        
        setUserData(response.data);
        const newForm = {
          first_name: firstName,
          last_name: lastName,
          email: response.data.email,
          phone: response.data.phone
        };
        setEditForm(newForm);
        setOriginalForm(newForm);
        
        // No verification needed initially since values haven't changed
        setNeedsVerification({ email: false, phone: false });
      } else {
        showSnackbar('Failed to load profile', 'error');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showSnackbar(getErrorMessage(error, 'Error loading profile'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditing(true);
    setErrors({});
    // Reset verification needs - no fields need verification initially
    setNeedsVerification({ email: false, phone: false });
  };

  const handleCancelEdit = () => {
    setEditForm(originalForm);
    setEditing(false);
    setErrors({});
    setNeedsVerification({ email: false, phone: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check if email or phone changed from original
    if (name === 'email') {
      const isChanged = value !== originalForm.email;
      setNeedsVerification(prev => ({ ...prev, email: isChanged }));
    }
    if (name === 'phone') {
      const isChanged = value !== originalForm.phone;
      setNeedsVerification(prev => ({ ...prev, phone: isChanged }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editForm.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!editForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!editForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{10,}$/.test(editForm.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open OTP modal
  const openOtp = async (type) => {
    if (type === "email" && !editForm.email) {
      showSnackbar("Please enter an email address.", "error");
      return;
    }
    
    if (type === "phone" && !editForm.phone) {
      showSnackbar("Please enter a phone number.", "error");
      return;
    }

    try {
      setLoadingType(type);
      let apiUrl = "";
      let payload = {};

      if (type === "email") {
        apiUrl = `${APP_CONFIG.API_BASE_URL}/otp/email/send`;
        payload = { email: editForm.email.trim().toLowerCase() };
      } else {
        apiUrl = `${APP_CONFIG.API_BASE_URL}/otp/sms/send`;
        const sanitizedPhone = editForm.phone.replace(/\D/g, "");
        payload = { countryCode: "91", mobile: sanitizedPhone };
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setVerifyType(type);
        setShowOtp(true);
      } else {
        showSnackbar(data?.message || "Failed to send OTP", "error");
      }
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Server error while sending OTP."), "error");
    } finally {
      setLoadingType(null);
    }
  };

  // Handle OTP verification success
  const handleOtpVerifySuccess = () => {
    setNeedsVerification(prev => ({
      ...prev,
      [verifyType]: false
    }));
    setShowOtp(false);
    showSnackbar(`${verifyType === "email" ? "Email" : "Phone"} verified successfully`, "success");
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    // Check if changed fields are verified
    if (needsVerification.email) {
      showSnackbar('Please verify your new email address first', 'error');
      return;
    }
    
    if (needsVerification.phone) {
      showSnackbar('Please verify your new phone number first', 'error');
      return;
    }
    
    try {
      const payload = {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim().toLowerCase(),
        phone: editForm.phone.trim()
      };
      
      const response = await updateUserProfileApi(payload);
      
      if (response.success) {
        showSnackbar('Profile updated successfully!', 'success');
        await fetchUserProfile();
        setEditing(false);
      } else {
        showSnackbar(response.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar(getErrorMessage(error, 'Error updating profile'), 'error');
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteUserProfileApi();

      if (response.success) {
        showSnackbar("Your account has been deleted successfully", "success");
        setDeleteDialogOpen(false);
        
        await logout();
        
        setTimeout(() => {
          window.location.href = "/user/auth";
        }, 1200);
      } else {
        showSnackbar(response.message || "Failed to delete profile", "error");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      showSnackbar(getErrorMessage(error, "Error deleting profile"), "error");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // Sign Out handlers
  const handleSignOutClick = () => {
    setSignOutDialogOpen(true);
  };

  const handleSignOutConfirm = async () => {
    try {
      showSnackbar("Logging out...", "success");
      await logout();
      setSignOutDialogOpen(false);
      
      setTimeout(() => {
        window.location.href = "/user/auth";
      }, 500);
    } catch (error) {
      console.error("Error signing out:", error);
      showSnackbar(getErrorMessage(error, "Error signing out"), "error");
    }
  };

  const handleSignOutCancel = () => {
    setSignOutDialogOpen(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Check if save should be disabled
  const isSaveDisabled = () => {
    if (loading) return true;
    // Check if any field that needs verification is pending
    if (needsVerification.email) return true;
    if (needsVerification.phone) return true;
    // Check if any actual changes were made
    const hasChanges = 
      editForm.first_name !== originalForm.first_name ||
      editForm.last_name !== originalForm.last_name ||
      editForm.email !== originalForm.email ||
      editForm.phone !== originalForm.phone;
    return !hasChanges;
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress size={60} thickness={4} />
      </LoadingContainer>
    );
  }

  return (
    <>
      <DecorativeCircle className="circle-1" />
      <DecorativeCircle className="circle-2" />
      
      <ProfileContainer maxWidth="lg">
        <StyledPaper elevation={0}>
          <HeaderSection>
            <PageTitle variant="h3">
              My Profile
            </PageTitle>
            {!editing && (
              <ActionButtonsGroup>
                <StyledIconButton 
                  className="edit-btn"
                  color="primary" 
                  onClick={handleEditClick}
                  aria-label="edit"
                >
                  <EditIcon />
                </StyledIconButton>
                <StyledIconButton 
                  className="delete-btn"
                  color="error" 
                  onClick={handleDeleteClick}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </StyledIconButton>
                <StyledIconButton 
                  className="signout-btn"
                  color="warning" 
                  onClick={handleSignOutClick}
                  aria-label="sign out"
                >
                  <LogoutIcon />
                </StyledIconButton>
              </ActionButtonsGroup>
            )}
          </HeaderSection>

          {/* Profile Info Display Mode */}
          {!editing && (
            <ProfileCard variant="outlined">
              <StyledCardContent>
                <AvatarSection>
                  <StyledAvatar>
                    <AvatarIcon />
                  </StyledAvatar>
                  <UserInfo>
                    <UserName variant="h4">
                      {userData.full_name}
                    </UserName>
                    <MobileUserMeta>
                      {userData.email && <span>{userData.email}</span>}
                      {userData.phone && <span>{userData.phone}</span>}
                    </MobileUserMeta>
                    {userData.referral_code && (
                      <ReferralBadge>
                        <Typography variant="body2" color="textSecondary">
                          Referral Code: {userData.referral_code}
                        </Typography>
                      </ReferralBadge>
                    )}
                  </UserInfo>
                </AvatarSection>

                <InfoGrid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoItem>
                      <InfoLabel variant="subtitle2">
                        <EmailIcon fontSize="small" color="primary" />
                        Email Address
                      </InfoLabel>
                      <InfoValue variant="body1">
                        {userData.email}
                      </InfoValue>
                    </InfoItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem>
                      <InfoLabel variant="subtitle2">
                        <PhoneIcon fontSize="small" color="primary" />
                        Phone Number
                      </InfoLabel>
                      <InfoValue variant="body1">
                        {userData.phone}
                      </InfoValue>
                    </InfoItem>
                  </Grid>
                  <Grid item xs={12}>
                    <InfoItem>
                      <InfoLabel variant="subtitle2">
                        <BadgeIcon fontSize="small" color="primary" />
                        User ID
                      </InfoLabel>
                      <InfoValue variant="body2" color="textSecondary">
                        {userData.id}
                      </InfoValue>
                    </InfoItem>
                  </Grid>
                </InfoGrid>
              </StyledCardContent>
            </ProfileCard>
          )}

          {!editing && (
            <MobileShortcutGrid aria-label="Profile quick actions">
              <MobileShortcutButton type="button" onClick={handleEditClick}>
                <span><EditIcon /></span>
                <strong>Edit Profile</strong>
                <ChevronRightIcon />
              </MobileShortcutButton>
              <MobileShortcutButton type="button" onClick={() => navigate('/user/wallet')}>
                <span><WalletIcon /></span>
                <strong>Wallet</strong>
                <ChevronRightIcon />
              </MobileShortcutButton>
              <MobileShortcutButton type="button" onClick={() => navigate('/user/chat-history')}>
                <span><HistoryIcon /></span>
                <strong>Chat History</strong>
                <ChevronRightIcon />
              </MobileShortcutButton>
              <MobileShortcutButton type="button" onClick={() => navigate('/user/support')}>
                <span><SupportIcon /></span>
                <strong>Support</strong>
                <ChevronRightIcon />
              </MobileShortcutButton>
              <MobileShortcutButton type="button" className="danger" onClick={handleSignOutClick}>
                <span><LogoutIcon /></span>
                <strong>Logout</strong>
                <ChevronRightIcon />
              </MobileShortcutButton>
            </MobileShortcutGrid>
          )}

          {/* Edit Mode */}
          {editing && (
            <StyledForm component="form" noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="First Name *"
                    name="first_name"
                    value={editForm.first_name}
                    onChange={handleInputChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    disabled={loading}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={editForm.last_name}
                    onChange={handleInputChange}
                    disabled={loading}
                    variant="outlined"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={8}>
                      <StyledTextField
                        fullWidth
                        label="Email Address *"
                        name="email"
                        type="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={loading}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <VerifyButton
                        type="button"
                        onClick={() => openOtp("email")}
                        disabled={
                          loadingType === "email" || 
                          !editForm.email || 
                          editForm.email === originalForm.email
                        }
                        $verified={!needsVerification.email}
                        fullWidth
                      >
                        {!needsVerification.email ? "Verified" : 
                         loadingType === "email" ? "Sending..." : "Verify Email"}
                      </VerifyButton>
                    </Grid>
                  </Grid>
                  {needsVerification.email && editForm.email !== originalForm.email && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Verify this new email address before saving
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={8}>
                      <StyledTextField
                        fullWidth
                        label="Phone Number *"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        disabled={loading}
                        variant="outlined"
                        placeholder="+1234567890"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <VerifyButton
                        type="button"
                        onClick={() => openOtp("phone")}
                        disabled={
                          loadingType === "phone" || 
                          !editForm.phone || 
                          editForm.phone === originalForm.phone
                        }
                        $verified={!needsVerification.phone}
                        fullWidth
                      >
                        {!needsVerification.phone ? "Verified" : 
                         loadingType === "phone" ? "Sending..." : "Verify Phone"}
                      </VerifyButton>
                    </Grid>
                  </Grid>
                  {needsVerification.phone && editForm.phone !== originalForm.phone && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
                      Verify this new phone number before saving
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <FormActions>
                <CancelButton
                  variant="outlined"
                  onClick={handleCancelEdit}
                  startIcon={<CancelIcon />}
                  disabled={loading}
                >
                  Cancel
                </CancelButton>
                <SaveButton
                  variant="contained"
                  onClick={handleSave}
                  startIcon={<SaveIcon />}
                  disabled={isSaveDisabled()}
                >
                  Save Changes
                </SaveButton>
              </FormActions>
            </StyledForm>
          )}
        </StyledPaper>

        {/* Delete Confirmation Dialog */}
        <StyledDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitleStyled id="delete-dialog-title">
            Delete Account?
          </DialogTitleStyled>
          <DialogContentStyled>
            <DialogContentText>
              Are you sure you want to permanently delete your account?
            </DialogContentText>
            <WarningText variant="body2">
              This action cannot be undone. All your data will be lost forever.
            </WarningText>
          </DialogContentStyled>
          <DialogActions>
            <CancelButton onClick={handleDeleteCancel} variant="outlined">
              Cancel
            </CancelButton>
            <SaveButton 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              sx={{ background: 'linear-gradient(135deg, #f56565, #e53e3e) !important' }}
            >
              Delete Permanently
            </SaveButton>
          </DialogActions>
        </StyledDialog>

        {/* Sign Out Confirmation Dialog */}
        <StyledDialog
          open={signOutDialogOpen}
          onClose={handleSignOutCancel}
          aria-labelledby="signout-dialog-title"
        >
          <DialogTitleStyled id="signout-dialog-title" sx={{ color: '#ed6c02 !important' }}>
            Sign Out?
          </DialogTitleStyled>
          <DialogContentStyled>
            <DialogContentText>
              Are you sure you want to sign out of your account?
            </DialogContentText>
            <WarningText variant="body2" sx={{ color: '#ed6c02 !important', background: 'rgba(237, 108, 2, 0.05)' }}>
              You'll need to login again to access your account.
            </WarningText>
          </DialogContentStyled>
          <DialogActions>
            <CancelButton onClick={handleSignOutCancel} variant="outlined">
              Stay Signed In
            </CancelButton>
            <SaveButton 
              onClick={handleSignOutConfirm} 
              variant="contained"
              sx={{ background: 'linear-gradient(135deg, #ed6c02, #f59e0b) !important' }}
            >
              Sign Out
            </SaveButton>
          </DialogActions>
        </StyledDialog>

        {/* Snackbar for notifications */}
        <StyledSnackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </StyledSnackbar>
      </ProfileContainer>

      {/* OTP Modal */}
      {showOtp && (
        <OtpModal
          email={editForm.email}
          phone={editForm.phone}
          type={verifyType}
          onClose={() => setShowOtp(false)}
          onSuccess={handleOtpVerifySuccess}
        />
      )}
    </>
  );
};

export default UserProfile;
