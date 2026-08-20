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
  Chip,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem
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
  Work as WorkIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import {
  getUserProfileApi,
  updateUserProfileApi,
  updateUserProfessionApi,
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

const PROFESSIONS = [
  "Student",
  "Engineer",
  "Doctor",
  "Business Owner",
  "Working Professional",
  "Freelancer",
  "Teacher",
  "Government Employee",
  "Homemaker",
  "Other"
];

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
  const { logout, updateUser } = useAuth();
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
    referral_code: '',
    profession: '',
    location: ''
  });
  
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: ''
  });
  
  const [originalForm, setOriginalForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    location: ''
  });
  
  const [errors, setErrors] = useState({});

  // Profession Dialog State
  const [professionDialogOpen, setProfessionDialogOpen] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [savingProfession, setSavingProfession] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfileApi();
      
      if (response.success && response.data) {
        const fullName = response.data.full_name || '';
        const fullNameParts = fullName.split(' ');
        const firstName = fullNameParts[0] || '';
        const lastName = fullNameParts.slice(1).join(' ') || '';
        
        setUserData({
          ...response.data,
          profession: response.data.profession || '',
          location: response.data.location || 'Indore, Madhya Pradesh'
        });
        
        const newForm = {
          first_name: firstName,
          last_name: lastName,
          email: response.data.email || '',
          phone: response.data.phone || '',
          location: response.data.location || 'Indore, Madhya Pradesh'
        };
        setEditForm(newForm);
        setOriginalForm(newForm);
        setSelectedProfession(response.data.profession || '');
        
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
  };

  const handleCancelClick = () => {
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
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'email' && value !== originalForm.email) {
      setNeedsVerification(prev => ({ ...prev, email: true }));
    } else if (name === 'email' && value === originalForm.email) {
      setNeedsVerification(prev => ({ ...prev, email: false }));
    }

    if (name === 'phone' && value !== originalForm.phone) {
      setNeedsVerification(prev => ({ ...prev, phone: true }));
    } else if (name === 'phone' && value === originalForm.phone) {
      setNeedsVerification(prev => ({ ...prev, phone: false }));
    }
  };

  const handleVerifyClick = async (type) => {
    const value = type === 'email' ? editForm.email : editForm.phone;
    if (!value) return;

    setLoadingType(type);
    try {
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [type]: value,
          type: type,
          userType: 'user',
          purpose: 'account_verify'
        })
      });

      const data = await response.json();
      if (data.success || response.ok) {
        setVerifyType(type);
        setShowOtp(true);
        showSnackbar(`OTP sent to your ${type}`, 'info');
      } else {
        showSnackbar(data.message || `Failed to send OTP to ${type}`, 'error');
      }
    } catch (error) {
      console.error(`Error sending OTP to ${type}:`, error);
      showSnackbar(`Error sending OTP to ${type}`, 'error');
    } finally {
      setLoadingType(null);
    }
  };

  const handleOtpVerifySuccess = () => {
    setShowOtp(false);
    if (verifyType === 'email') {
      setNeedsVerification(prev => ({ ...prev, email: false }));
      showSnackbar('Email verified successfully!', 'success');
    } else if (verifyType === 'phone') {
      setNeedsVerification(prev => ({ ...prev, phone: false }));
      showSnackbar('Phone number verified successfully!', 'success');
    }
    setVerifyType(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editForm.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!editForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editForm.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!editForm.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const payload = {
        first_name: editForm.first_name.trim(),
        last_name: editForm.last_name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        location: editForm.location.trim()
      };
      
      const response = await updateUserProfileApi(payload);
      if (response.success) {
        showSnackbar('Profile updated successfully', 'success');
        setEditing(false);
        await fetchUserProfile();
      } else {
        showSnackbar(response.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar(getErrorMessage(error, 'Error updating profile'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Profession Dialog & Update Handlers
  const handleOpenProfessionDialog = () => {
    setSelectedProfession(userData.profession || '');
    setProfessionDialogOpen(true);
  };

  const handleSaveProfession = async () => {
    if (!selectedProfession) {
      showSnackbar('Please select a profession', 'warning');
      return;
    }

    setSavingProfession(true);
    try {
      const res = await updateUserProfessionApi(selectedProfession);
      if (res?.success) {
        showSnackbar('Profession updated successfully!', 'success');
        setUserData(prev => ({ ...prev, profession: selectedProfession }));
        if (typeof updateUser === 'function' && res.data) {
          updateUser(res.data);
        }
        setProfessionDialogOpen(false);
      } else {
        showSnackbar(res?.message || 'Failed to update profession', 'error');
      }
    } catch (err) {
      console.error('Error updating profession:', err);
      showSnackbar(getErrorMessage(err, 'Failed to update profession'), 'error');
    } finally {
      setSavingProfession(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await deleteUserProfileApi();
      if (response.success) {
        showSnackbar('Profile deleted successfully', 'success');
        setTimeout(() => {
          logout();
          navigate('/user/auth');
        }, 1500);
      } else {
        showSnackbar(response.message || 'Failed to delete profile', 'error');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      showSnackbar(getErrorMessage(error, 'Error deleting profile'), 'error');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleSignOutClick = () => {
    setSignOutDialogOpen(true);
  };

  const handleSignOutConfirm = async () => {
    try {
      setSignOutDialogOpen(false);
      showSnackbar("Signing out...", "info");
      logout();
      setTimeout(() => {
        window.location.href = "/user/auth";
      }, 500);
    } catch (error) {
      console.error("Error signing out:", error);
      showSnackbar(getErrorMessage(error, "Error signing out"), "error");
    }
  };

  const isSaveDisabled = () => {
    if (loading) return true;
    if (needsVerification.email) return true;
    if (needsVerification.phone) return true;
    const hasChanges = 
      editForm.first_name !== originalForm.first_name ||
      editForm.last_name !== originalForm.last_name ||
      editForm.email !== originalForm.email ||
      editForm.phone !== originalForm.phone ||
      editForm.location !== originalForm.location;
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
                  aria-label="edit profile"
                  title="Edit Profile"
                >
                  <EditIcon />
                </StyledIconButton>
                <StyledIconButton 
                  className="delete-btn"
                  color="error" 
                  onClick={handleDeleteClick}
                  aria-label="delete account"
                  title="Delete Account"
                >
                  <DeleteIcon />
                </StyledIconButton>
                <StyledIconButton 
                  className="signout-btn"
                  color="warning" 
                  onClick={handleSignOutClick}
                  aria-label="sign out"
                  title="Sign Out"
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
                      {userData.full_name || 'G9Expert User'}
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
                  {/* Email */}
                  <Grid item xs={12} md={6}>
                    <InfoItem>
                      <InfoLabel variant="subtitle2">
                        <EmailIcon fontSize="small" color="primary" />
                        Email Address
                      </InfoLabel>
                      <InfoValue variant="body1">
                        {userData.email || 'Not provided'}
                      </InfoValue>
                    </InfoItem>
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} md={6}>
                    <InfoItem>
                      <InfoLabel variant="subtitle2">
                        <PhoneIcon fontSize="small" color="primary" />
                        Phone Number
                      </InfoLabel>
                      <InfoValue variant="body1">
                        {userData.phone || 'Not provided'}
                      </InfoValue>
                    </InfoItem>
                  </Grid>

                  {/* Profession */}
                  <Grid item xs={12} md={6}>
                    <InfoItem>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <InfoLabel variant="subtitle2">
                          <WorkIcon fontSize="small" color="primary" />
                          Profession
                        </InfoLabel>
                        <Button 
                          size="small" 
                          startIcon={<EditIcon fontSize="inherit" />}
                          onClick={handleOpenProfessionDialog}
                          sx={{ fontSize: '0.75rem', py: 0.2 }}
                        >
                          {userData.profession ? 'Change' : 'Add'}
                        </Button>
                      </Box>
                      <InfoValue variant="body1" sx={{ fontWeight: 600, color: userData.profession ? '#0f172a' : '#64748b' }}>
                        {userData.profession ? (
                          <Chip 
                            label={userData.profession} 
                            color="primary" 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontWeight: 600, mt: 0.5 }} 
                          />
                        ) : (
                          'Not set (Click Add to specify profession)'
                        )}
                      </InfoValue>
                    </InfoItem>
                  </Grid>

                  {/* Location */}
                  <Grid item xs={12} md={6}>
                    <InfoItem>
                      <InfoLabel variant="subtitle2">
                        <LocationIcon fontSize="small" color="primary" />
                        Location
                      </InfoLabel>
                      <InfoValue variant="body1">
                        {userData.location || 'Indore, Madhya Pradesh'}
                      </InfoValue>
                    </InfoItem>
                  </Grid>

                  {/* User ID */}
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
              <MobileShortcutButton type="button" onClick={handleOpenProfessionDialog}>
                <span><WorkIcon /></span>
                <strong>Update Profession</strong>
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

          {/* Edit Mode Form */}
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
                
                <Grid item xs={12} md={6}>
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
                    InputProps={{
                      endAdornment: needsVerification.email ? (
                        <VerifyButton
                          size="small"
                          onClick={() => handleVerifyClick('email')}
                          disabled={loadingType === 'email' || !editForm.email}
                        >
                          {loadingType === 'email' ? <CircularProgress size={16} /> : 'Verify'}
                        </VerifyButton>
                      ) : null
                    }}
                  />
                  {needsVerification.email && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                      Email changed. Please verify before saving.
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
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
                    InputProps={{
                      endAdornment: needsVerification.phone ? (
                        <VerifyButton
                          size="small"
                          onClick={() => handleVerifyClick('phone')}
                          disabled={loadingType === 'phone' || !editForm.phone}
                        >
                          {loadingType === 'phone' ? <CircularProgress size={16} /> : 'Verify'}
                        </VerifyButton>
                      ) : null
                    }}
                  />
                  {needsVerification.phone && (
                    <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: 'block' }}>
                      Phone number changed. Please verify before saving.
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={editForm.location}
                    onChange={handleInputChange}
                    disabled={loading}
                    variant="outlined"
                    placeholder="e.g. Indore, Madhya Pradesh"
                  />
                </Grid>
              </Grid>

              <FormActions>
                <CancelButton
                  variant="outlined"
                  onClick={handleCancelClick}
                  disabled={loading}
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </CancelButton>
                <SaveButton
                  variant="contained"
                  onClick={handleSaveClick}
                  disabled={isSaveDisabled()}
                  startIcon={<SaveIcon />}
                >
                  Save Changes
                </SaveButton>
              </FormActions>
            </StyledForm>
          )}
        </StyledPaper>
      </ProfileContainer>

      {/* Edit Profession Dialog */}
      <Dialog
        open={professionDialogOpen}
        onClose={() => !savingProfession && setProfessionDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkIcon color="primary" /> Select Your Profession
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2, fontSize: '0.875rem' }}>
            Select your profession to personalize your G9Expert experience.
          </DialogContentText>
          <TextField
            select
            fullWidth
            label="Profession"
            value={selectedProfession}
            onChange={(e) => setSelectedProfession(e.target.value)}
            disabled={savingProfession}
            variant="outlined"
          >
            {PROFESSIONS.map((prof) => (
              <MenuItem key={prof} value={prof}>
                {prof}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setProfessionDialogOpen(false)} 
            disabled={savingProfession}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfession}
            variant="contained"
            disabled={savingProfession || !selectedProfession}
            startIcon={savingProfession ? <CircularProgress size={16} /> : <CheckIcon />}
          >
            {savingProfession ? "Saving..." : "Save Profession"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <StyledDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitleStyled id="delete-dialog-title">
          Delete Profile
        </DialogTitleStyled>
        <DialogContentStyled>
          <DialogContentText>
            Are you sure you want to delete your profile? This action cannot be undone and all your data will be permanently removed.
          </DialogContentText>
          <WarningText variant="caption">
            Warning: You will lose access to all your account information, chat history, and saved preferences.
          </WarningText>
        </DialogContentStyled>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleDeleteCancel} disabled={loading} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} disabled={loading} color="error" variant="contained">
            Delete Profile
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* Sign Out Confirmation Dialog */}
      <StyledDialog
        open={signOutDialogOpen}
        onClose={() => setSignOutDialogOpen(false)}
        aria-labelledby="signout-dialog-title"
      >
        <DialogTitleStyled id="signout-dialog-title">
          Sign Out
        </DialogTitleStyled>
        <DialogContentStyled>
          <DialogContentText>
            Are you sure you want to sign out of your G9Expert account?
          </DialogContentText>
        </DialogContentStyled>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={() => setSignOutDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSignOutConfirm} color="warning" variant="contained">
            Sign Out
          </Button>
        </DialogActions>
      </StyledDialog>

      {/* OTP Modal */}
      {showOtp && (
        <OtpModal
          email={editForm.email}
          phone={editForm.phone}
          type={verifyType}
          userType="user"
          purpose="account_verify"
          onClose={() => setShowOtp(false)}
          onSuccess={handleOtpVerifySuccess}
        />
      )}

      {/* Snackbar Notifications */}
      <StyledSnackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </StyledSnackbar>
    </>
  );
};

export default UserProfile;
