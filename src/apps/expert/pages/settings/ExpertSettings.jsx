import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiBell,
  FiLock,
  FiDollarSign,
  FiGlobe,
  FiHelpCircle,
  FiShield,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCamera,
  FiCheck,
  FiAlertCircle,
  FiLogOut,
  FiMoon,
  FiSun,
  FiEye,
  FiEyeOff,
  FiSave,
  FiX,
  FiSettings,
  FiDownload,
  FiUpload,
  FiCreditCard,
} from "react-icons/fi";
import { MdVerified, MdNotificationsActive } from "react-icons/md";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { BsGraphUp } from "react-icons/bs";

import {
  PremiumContainer,
  SettingsContainer,
  Header,
  Title,
  Subtitle,
  SettingsGrid,
  SettingsSidebar,
  SidebarTitle,
  NavItem,
  SettingsContent,
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  Form,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  ToggleSwitch,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  ButtonGroup,
  AvatarSection,
  Avatar,
  NotificationItem,
  NotificationInfo,
  NotificationTitle,
  NotificationDescription,
  PricingCard,
  PopularBadge,
  SecurityItem,
  SecurityInfo,
  SecurityIcon,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  ModalText,
  SuccessMessage,
  Spinner,
} from "./ExpertSettings.styles";

const ExpertSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Form States
  const [profileForm, setProfileForm] = useState({
    fullName: "Dr. Sarah Johnson",
    email: "sarah.johnson@expertyard.com",
    phone: "+1 234 567 8900",
    location: "New York, USA",
    bio: "Expert financial advisor with 10+ years of experience in investment banking and wealth management.",
    expertise: ["Financial Planning", "Investment Strategy", "Retirement Planning"],
    languages: ["English", "Spanish"],
    hourlyRate: "150",
    currency: "USD",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    chatNotifications: true,
    callNotifications: true,
    paymentAlerts: true,
    marketingEmails: false,
    sessionReminders: true,
    weeklyDigest: true,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    deviceManagement: true,
  });

  const [pricingSettings, setPricingSettings] = useState({
    chatRate: 2.5,
    callRate: 3.5,
    videoRate: 4.5,
    currency: "USD",
    instantPayout: false,
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    compactView: false,
    fontSize: "medium",
    showEarnings: true,
  });

  // Track window width for responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityToggle = (key) => {
    setSecuritySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setPricingSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAppearanceChange = (key, value) => {
    setAppearanceSettings(prev => ({ ...prev, [key]: value }));
  };

  // Save handlers
  const handleSave = (section) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalType(null);
  };

  const handleLogout = () => {
    // Add logout logic
    console.log("Logging out...");
  };

  const handleDeleteAccount = () => {
    // Add delete account logic
    console.log("Deleting account...");
    handleModalClose();
  };

  const navItems = [
    { id: "profile", icon: FiUser, label: "Profile Information" },
    { id: "notifications", icon: FiBell, label: "Notifications" },
    { id: "security", icon: FiLock, label: "Security & Privacy" },
    { id: "pricing", icon: FiDollarSign, label: "Pricing & Payouts" },
    { id: "appearance", icon: FiGlobe, label: "Appearance" },
    { id: "help", icon: FiHelpCircle, label: "Help & Support" },
  ];

  const renderProfile = () => (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>
            <FiUser /> Profile Information
          </SectionTitle>
          <SectionDescription>
            Manage your personal information and public profile
          </SectionDescription>
        </div>
        <Button $primary onClick={() => handleSave('profile')} disabled={loading}>
          {loading ? <Spinner /> : <FiSave />}
          Save Changes
        </Button>
      </SectionHeader>

      <AvatarSection>
        <Avatar>
          {!profileForm.avatar && "SJ"}
        </Avatar>
        <div>
          <Button $small>
            <FiUpload /> Upload Photo
          </Button>
          <Button $small style={{ marginLeft: '12px' }}>
            <FiCamera /> Take Photo
          </Button>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
            Recommended: Square JPG or PNG, at least 500x500px
          </p>
        </div>
      </AvatarSection>

      <Form>
        <FormGrid>
          <FormGroup>
            <Label><FiUser /> Full Name</Label>
            <Input
              type="text"
              name="fullName"
              value={profileForm.fullName}
              onChange={handleProfileChange}
              placeholder="Enter your full name"
            />
          </FormGroup>

          <FormGroup>
            <Label><FiMail /> Email Address</Label>
            <Input
              type="email"
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              placeholder="Enter your email"
            />
          </FormGroup>

          <FormGroup>
            <Label><FiPhone /> Phone Number</Label>
            <Input
              type="tel"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
              placeholder="Enter your phone number"
            />
          </FormGroup>

          <FormGroup>
            <Label><FiMapPin /> Location</Label>
            <Input
              type="text"
              name="location"
              value={profileForm.location}
              onChange={handleProfileChange}
              placeholder="City, Country"
            />
          </FormGroup>
        </FormGrid>

        <FormGroup>
          <Label>Bio</Label>
          <TextArea
            name="bio"
            value={profileForm.bio}
            onChange={handleProfileChange}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </FormGroup>

        <FormGrid>
          <FormGroup>
            <Label>Expertise (comma separated)</Label>
            <Input
              type="text"
              name="expertise"
              value={profileForm.expertise.join(", ")}
              onChange={(e) => setProfileForm(prev => ({ 
                ...prev, 
                expertise: e.target.value.split(",").map(s => s.trim()) 
              }))}
              placeholder="Financial Planning, Investment Strategy"
            />
          </FormGroup>

          <FormGroup>
            <Label>Languages</Label>
            <Input
              type="text"
              name="languages"
              value={profileForm.languages.join(", ")}
              onChange={(e) => setProfileForm(prev => ({ 
                ...prev, 
                languages: e.target.value.split(",").map(s => s.trim()) 
              }))}
              placeholder="English, Spanish"
            />
          </FormGroup>
        </FormGrid>
      </Form>
    </Section>
  );

  const renderNotifications = () => (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>
            <FiBell /> Notification Preferences
          </SectionTitle>
          <SectionDescription>
            Choose how and when you want to be notified
          </SectionDescription>
        </div>
        <Button $primary onClick={() => handleSave('notifications')} disabled={loading}>
          {loading ? <Spinner /> : <FiSave />}
          Save Preferences
        </Button>
      </SectionHeader>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Receive updates via email</CardDescription>
          </div>
        </CardHeader>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>New Chat Messages</NotificationTitle>
            <NotificationDescription>Get notified when you receive new messages</NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={() => handleNotificationToggle('emailNotifications')}
            />
            <span />
          </ToggleSwitch>
        </NotificationItem>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Payment Alerts</NotificationTitle>
            <NotificationDescription>Get notified about payments and payouts</NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={notificationSettings.paymentAlerts}
              onChange={() => handleNotificationToggle('paymentAlerts')}
            />
            <span />
          </ToggleSwitch>
        </NotificationItem>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Weekly Digest</NotificationTitle>
            <NotificationDescription>Receive a weekly summary of your activity</NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={notificationSettings.weeklyDigest}
              onChange={() => handleNotificationToggle('weeklyDigest')}
            />
            <span />
          </ToggleSwitch>
        </NotificationItem>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>In-app notifications</CardDescription>
          </div>
        </CardHeader>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Session Reminders</NotificationTitle>
            <NotificationDescription>Get reminders before scheduled sessions</NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={notificationSettings.sessionReminders}
              onChange={() => handleNotificationToggle('sessionReminders')}
            />
            <span />
          </ToggleSwitch>
        </NotificationItem>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Call Notifications</NotificationTitle>
            <NotificationDescription>Notify when someone wants to call</NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={notificationSettings.callNotifications}
              onChange={() => handleNotificationToggle('callNotifications')}
            />
            <span />
          </ToggleSwitch>
        </NotificationItem>
      </Card>
    </Section>
  );

  const renderSecurity = () => (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>
            <FiLock /> Security & Privacy
          </SectionTitle>
          <SectionDescription>
            Manage your account security and privacy settings
          </SectionDescription>
        </div>
        <Button $primary onClick={() => handleSave('security')} disabled={loading}>
          {loading ? <Spinner /> : <FiSave />}
          Update Security
        </Button>
      </SectionHeader>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Two-Factor Authentication</CardTitle>
            <CardDescription>Add an extra layer of security to your account</CardDescription>
          </div>
        </CardHeader>

        <SecurityItem>
          <SecurityInfo>
            <SecurityIcon $success={securitySettings.twoFactorAuth}>
              <FiShield />
            </SecurityIcon>
            <div>
              <NotificationTitle>Enable 2FA</NotificationTitle>
              <NotificationDescription>
                {securitySettings.twoFactorAuth 
                  ? "Your account is protected with two-factor authentication" 
                  : "Protect your account with an additional verification step"}
              </NotificationDescription>
            </div>
          </SecurityInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={securitySettings.twoFactorAuth}
              onChange={() => handleSecurityToggle('twoFactorAuth')}
            />
            <span />
          </ToggleSwitch>
        </SecurityItem>

        <SecurityItem>
          <SecurityInfo>
            <SecurityIcon $warning>
              <FiEye />
            </SecurityIcon>
            <div>
              <NotificationTitle>Login Alerts</NotificationTitle>
              <NotificationDescription>Get notified about new login attempts</NotificationDescription>
            </div>
          </SecurityInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={securitySettings.loginAlerts}
              onChange={() => handleSecurityToggle('loginAlerts')}
            />
            <span />
          </ToggleSwitch>
        </SecurityItem>

        <SecurityItem>
          <SecurityInfo>
            <SecurityIcon>
              <FiEyeOff />
            </SecurityIcon>
            <div>
              <NotificationTitle>Hide Profile from Search</NotificationTitle>
              <NotificationDescription>Make your profile private and not discoverable</NotificationDescription>
            </div>
          </SecurityInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={securitySettings.hideProfile}
              onChange={() => handleSecurityToggle('hideProfile')}
            />
            <span />
          </ToggleSwitch>
        </SecurityItem>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Session Management</CardTitle>
            <CardDescription>Manage your active sessions</CardDescription>
          </div>
        </CardHeader>

        <SecurityItem>
          <SecurityInfo>
            <div>
              <NotificationTitle>Current Session</NotificationTitle>
              <NotificationDescription>Windows • Chrome • New York, USA</NotificationDescription>
            </div>
          </SecurityInfo>
          <Button $small $danger>Logout</Button>
        </SecurityItem>

        <SecurityItem>
          <SecurityInfo>
            <div>
              <NotificationTitle>Mobile App</NotificationTitle>
              <NotificationDescription>iPhone 14 • Last active 2 hours ago</NotificationDescription>
            </div>
          </SecurityInfo>
          <Button $small>Revoke</Button>
        </SecurityItem>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </div>
        </CardHeader>

        <ButtonGroup>
          <Button $danger onClick={() => handleModalOpen('logout')}>
            <FiLogOut /> Logout from all devices
          </Button>
          <Button $danger onClick={() => handleModalOpen('delete')}>
            Delete Account
          </Button>
        </ButtonGroup>
      </Card>
    </Section>
  );

  const renderPricing = () => (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>
            <FiDollarSign /> Pricing & Payouts
          </SectionTitle>
          <SectionDescription>
            Set your rates and manage payout preferences
          </SectionDescription>
        </div>
        <Button $primary onClick={() => handleSave('pricing')} disabled={loading}>
          {loading ? <Spinner /> : <FiSave />}
          Update Pricing
        </Button>
      </SectionHeader>

      <FormGrid>
        <PricingCard $popular>
          <PopularBadge>Most Popular</PopularBadge>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
              ${pricingSettings.chatRate}
            </div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>per minute • chat</div>
          </div>
          <FormGroup>
            <Label>Chat Rate (per min)</Label>
            <Input
              type="number"
              name="chatRate"
              value={pricingSettings.chatRate}
              onChange={handlePricingChange}
              step="0.5"
              min="1"
            />
          </FormGroup>
        </PricingCard>

        <PricingCard>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
              ${pricingSettings.callRate}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>per minute • voice call</div>
          </div>
          <FormGroup>
            <Label>Call Rate (per min)</Label>
            <Input
              type="number"
              name="callRate"
              value={pricingSettings.callRate}
              onChange={handlePricingChange}
              step="0.5"
              min="1"
            />
          </FormGroup>
        </PricingCard>

        <PricingCard>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, marginBottom: '8px' }}>
              ${pricingSettings.videoRate}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>per minute • video call</div>
          </div>
          <FormGroup>
            <Label>Video Rate (per min)</Label>
            <Input
              type="number"
              name="videoRate"
              value={pricingSettings.videoRate}
              onChange={handlePricingChange}
              step="0.5"
              min="1"
            />
          </FormGroup>
        </PricingCard>
      </FormGrid>

      <Card style={{ marginTop: '24px' }}>
        <CardHeader>
          <div>
            <CardTitle>Payout Preferences</CardTitle>
            <CardDescription>Manage how you receive payments</CardDescription>
          </div>
        </CardHeader>

        <FormGrid>
          <FormGroup>
            <Label><HiOutlineCurrencyRupee /> Preferred Currency</Label>
            <Select
              name="currency"
              value={pricingSettings.currency}
              onChange={handlePricingChange}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label><FiCreditCard /> Payout Method</Label>
            <Select>
              <option value="bank">Bank Transfer (3-5 days)</option>
              <option value="paypal">PayPal (Instant)</option>
              <option value="wise">Wise (1-2 days)</option>
            </Select>
          </FormGroup>
        </FormGrid>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Instant Payouts</NotificationTitle>
            <NotificationDescription>Enable instant payouts (small fee applies)</NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={pricingSettings.instantPayout}
              onChange={() => setPricingSettings(prev => ({ ...prev, instantPayout: !prev.instantPayout }))}
            />
            <span />
          </ToggleSwitch>
        </NotificationItem>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Payout Summary</CardTitle>
            <CardDescription>Your earnings and pending payouts</CardDescription>
          </div>
          <Button $small>
            <FiDownload /> Download Statement
          </Button>
        </CardHeader>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Total Earnings</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>$12,450</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>This Month</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>$2,340</div>
          </div>
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Pending</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>$890</div>
          </div>
        </div>

        <ButtonGroup style={{ marginTop: '24px' }}>
          <Button $primary>Request Payout</Button>
          <Button>View History</Button>
        </ButtonGroup>
      </Card>
    </Section>
  );

  const renderAppearance = () => (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>
            <FiGlobe /> Appearance
          </SectionTitle>
          <SectionDescription>
            Customize how the app looks and feels
          </SectionDescription>
        </div>
        <Button $primary onClick={() => handleSave('appearance')} disabled={loading}>
          {loading ? <Spinner /> : <FiSave />}
          Save Preferences
        </Button>
      </SectionHeader>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Theme Preferences</CardTitle>
            <CardDescription>Choose your preferred theme</CardDescription>
          </div>
        </CardHeader>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
          <Button
            $primary={appearanceSettings.theme === 'light'}
            onClick={() => handleAppearanceChange('theme', 'light')}
            style={{ flex: 1 }}
          >
            <FiSun /> Light
          </Button>
          <Button
            $primary={appearanceSettings.theme === 'dark'}
            onClick={() => handleAppearanceChange('theme', 'dark')}
            style={{ flex: 1 }}
          >
            <FiMoon /> Dark
          </Button>
          <Button
            $primary={appearanceSettings.theme === 'system'}
            onClick={() => handleAppearanceChange('theme', 'system')}
            style={{ flex: 1 }}
          >
            System
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>Adjust how content is displayed</CardDescription>
          </div>
        </CardHeader>

        <FormGrid>
          <FormGroup>
            <Label>Font Size</Label>
            <Select
              value={appearanceSettings.fontSize}
              onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Compact View</Label>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={appearanceSettings.compactView}
                onChange={() => handleAppearanceChange('compactView', !appearanceSettings.compactView)}
              />
              <span />
            </ToggleSwitch>
          </FormGroup>
        </FormGrid>

        <NotificationItem>
          <NotificationInfo>
            <NotificationTitle>Show Earnings Dashboard</NotificationTitle>
            <NotificationDescription>Display earnings summary in sidebar</NotificationDescription>
          </NotificationInfo>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={appearanceSettings.showEarnings}
              onChange={() => handleAppearanceChange('showEarnings', !appearanceSettings.showEarnings)}
            />
            <span />
          </ToggleSwitch>
        </NotificationItem>
      </Card>
    </Section>
  );

  const renderHelp = () => (
    <Section>
      <SectionHeader>
        <div>
          <SectionTitle>
            <FiHelpCircle /> Help & Support
          </SectionTitle>
          <SectionDescription>
            Get help and learn more about the platform
          </SectionDescription>
        </div>
      </SectionHeader>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Quick Links</CardTitle>
          </div>
        </CardHeader>

        <div style={{ display: 'grid', gap: '12px' }}>
          <Button $small style={{ justifyContent: 'flex-start' }}>
            📚 Documentation
          </Button>
          <Button $small style={{ justifyContent: 'flex-start' }}>
            🎥 Video Tutorials
          </Button>
          <Button $small style={{ justifyContent: 'flex-start' }}>
            💬 Community Forum
          </Button>
          <Button $small style={{ justifyContent: 'flex-start' }}>
            📧 Contact Support
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </div>
        </CardHeader>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div>
            <NotificationTitle>How do I change my payout method?</NotificationTitle>
            <NotificationDescription>Go to Pricing & Payouts section and update your preferences.</NotificationDescription>
          </div>
          <div>
            <NotificationTitle>When will I receive my payments?</NotificationTitle>
            <NotificationDescription>Payouts are processed every Monday and Thursday.</NotificationDescription>
          </div>
          <div>
            <NotificationTitle>How do I enable two-factor authentication?</NotificationTitle>
            <NotificationDescription>Visit Security & Privacy section to enable 2FA.</NotificationDescription>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>System Status</CardTitle>
          </div>
        </CardHeader>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          <div>
            <NotificationTitle>All Systems Operational</NotificationTitle>
            <NotificationDescription>Last checked: 2 minutes ago</NotificationDescription>
          </div>
        </div>
      </Card>
    </Section>
  );

  const renderModal = () => {
    if (modalType === 'logout') {
      return (
        <ModalContent>
          <ModalTitle>Logout from all devices?</ModalTitle>
          <ModalText>
            This will sign you out from all active sessions. You'll need to log in again on each device.
          </ModalText>
          <ButtonGroup>
            <Button $danger onClick={handleLogout}>Yes, Logout</Button>
            <Button onClick={handleModalClose}>Cancel</Button>
          </ButtonGroup>
        </ModalContent>
      );
    }

    if (modalType === 'delete') {
      return (
        <ModalContent>
          <ModalTitle>Delete Account?</ModalTitle>
          <ModalText>
            This action cannot be undone. All your data, earnings, and history will be permanently deleted.
          </ModalText>
          <ButtonGroup>
            <Button $danger onClick={handleDeleteAccount}>Delete Permanently</Button>
            <Button onClick={handleModalClose}>Cancel</Button>
          </ButtonGroup>
        </ModalContent>
      );
    }

    return null;
  };

  return (
    <PremiumContainer>
      <SettingsContainer>
        <Header>
          <Title>
            <FiSettings />
            Settings
          </Title>
          <Subtitle>
            Manage your account settings, preferences, and security options
          </Subtitle>
        </Header>

        <SettingsGrid>
          <SettingsSidebar>
            <SidebarTitle>Settings Menu</SidebarTitle>
            {navItems.map(item => (
              <NavItem
                key={item.id}
                $active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon />
                {windowWidth > 480 ? item.label : ''}
              </NavItem>
            ))}
          </SettingsSidebar>

          <SettingsContent>
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'security' && renderSecurity()}
            {activeTab === 'pricing' && renderPricing()}
            {activeTab === 'appearance' && renderAppearance()}
            {activeTab === 'help' && renderHelp()}
          </SettingsContent>
        </SettingsGrid>
      </SettingsContainer>

      {/* Success Message */}
      {showSuccess && (
        <SuccessMessage>
          <FiCheck size={24} />
          <div>
            <strong>Success!</strong> Your changes have been saved.
          </div>
        </SuccessMessage>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <ModalOverlay onClick={handleModalClose}>
          {renderModal()}
        </ModalOverlay>
      )}
    </PremiumContainer>
  );
};

export default ExpertSettings;