import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useSeo } from "../../../../shared/seo/useSeo";

const PrivacyPolicy = () => {
  useSeo({
    title: "Privacy Policy - G9Expert",
    description:
      "Read the G9Expert Privacy Policy to understand how Softmaxs Solution LLP collects, uses, protects, and manages information across the G9Expert website, mobile applications, and services.",
    canonicalPath: "/privacy-policy",
    og: {
      title: "Privacy Policy - G9Expert",
      description:
        "Read the G9Expert Privacy Policy to understand how Softmaxs Solution LLP collects, uses, protects, and manages information across the G9Expert website, mobile applications, and services.",
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tocItems = [
    { id: "sec-1", label: "1. Introduction" },
    { id: "sec-2", label: "2. Developer & Identity" },
    { id: "sec-3", label: "3. Information We Collect" },
    { id: "sec-4", label: "4. Location Information" },
    { id: "sec-5", label: "5. How We Use Info" },
    { id: "sec-6", label: "6. Consultations" },
    { id: "sec-7", label: "7. Payments & Transactions" },
    { id: "sec-8", label: "8. Information Sharing" },
    { id: "sec-9", label: "9. Third-Party Services" },
    { id: "sec-10", label: "10. Data Security" },
    { id: "sec-11", label: "11. Data Retention" },
    { id: "sec-12", label: "12. Account Deletion" },
    { id: "sec-13", label: "13. Your Rights & Choices" },
    { id: "sec-14", label: "14. Children's Privacy" },
    { id: "sec-15", label: "15. Cookies & Local Storage" },
    { id: "sec-16", label: "16. Communications" },
    { id: "sec-17", label: "17. Policy Changes" },
    { id: "sec-18", label: "18. Contact Us" },
  ];

  return (
    <Box
      sx={{
        py: { xs: 2, sm: 3, md: 4 },
        bgcolor: "#f8fafc",
        width: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          px: { xs: 1.5, sm: 2.5, md: 3.5 },
          boxSizing: "border-box",
        }}
      >
        {/* Page Hero - Compact & Fully Responsive */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 3.5 },
            mb: { xs: 2, md: 3 },
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              mb: 1,
              fontSize: { xs: "1.35rem", sm: "1.75rem", md: "2.25rem" },
              letterSpacing: "-0.5px",
              lineHeight: 1.25,
            }}
          >
            Privacy Policy
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#475569",
              fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1.05rem" },
              lineHeight: 1.6,
              maxWidth: 850,
              mb: 1.75,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            Your privacy matters to us. This Privacy Policy explains how G9Expert collects, uses, protects, and manages information when you use our website, mobile applications, and related services.
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "#2563eb",
              bgcolor: "#eff6ff",
              display: "inline-block",
              px: 1.5,
              py: 0.5,
              borderRadius: 1.5,
              border: "1px solid #dbeafe",
              fontSize: { xs: "0.75rem", sm: "0.825rem" },
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            Effective Date: September 22, 2026
          </Typography>
        </Paper>

        {/* Content Grid - Left Column & Right Column start at exact same Y position on Desktop */}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          alignItems="flex-start"
          sx={{ width: "100%", margin: 0 }}
        >
          {/* TOC Sidebar / Mobile Accordion */}
          <Grid
            item
            xs={12}
            md={3.5}
            sx={{
              pl: "0 !important",
              pt: "0 !important",
              width: "100%",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 1.75, md: 2 },
                borderRadius: 2.5,
                border: "1px solid #e2e8f0",
                position: { xs: "static", md: "sticky" },
                top: { xs: "auto", md: "5.5rem" },
                height: "fit-content",
                overflow: "visible",
                bgcolor: "#ffffff",
                boxSizing: "border-box",
                width: "100%",
              }}
            >
              <Box
                onClick={() => isMobile && setMobileTocOpen(!mobileTocOpen)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justify: "space-between",
                  cursor: isMobile ? "pointer" : "default",
                  userSelect: "none",
                  mb: { xs: mobileTocOpen || !isMobile ? 1 : 0, md: 1 },
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    fontSize: "0.75rem",
                  }}
                >
                  On This Page {isMobile ? `(${tocItems.length})` : ""}
                </Typography>
                {isMobile && (
                  <Box sx={{ display: "flex", alignItems: "center", color: "#2563eb" }}>
                    {mobileTocOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>
                )}
              </Box>

              <Collapse in={!isMobile || mobileTocOpen} timeout="auto" unmountOnExit={false}>
                <Box
                  component="nav"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.25,
                    pt: { xs: 0.5, md: 0 },
                  }}
                >
                  {tocItems.map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        if (isMobile) setMobileTocOpen(false);
                      }}
                      sx={{
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        cursor: "pointer",
                        fontSize: { xs: "0.8rem", md: "0.825rem" },
                        color: "#475569",
                        transition: "all 0.15s ease",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                        "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" },
                      }}
                    >
                      {item.label}
                    </Box>
                  ))}
                </Box>
              </Collapse>
            </Paper>
          </Grid>

          {/* Main Content Column */}
          <Grid
            item
            xs={12}
            md={8.5}
            sx={{
              pl: { xs: "0 !important", md: "24px !important" },
              pt: { xs: "16px !important", md: "0 !important" },
              width: "100%",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 2.5 } }}>
              {/* 1. Introduction */}
              <Paper
                id="sec-1"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  1. INTRODUCTION
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Welcome to G9Expert, operated by Softmaxs Solution LLP ("Company", "we", "us", or "our").
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  This Privacy Policy explains how we collect, use, disclose, protect, and manage personal information when you use G9Expert through our website, mobile applications, and related services.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  By using G9Expert, you acknowledge that you have read and understood this Privacy Policy.
                </Typography>
              </Paper>

              {/* 2. Developer & Company Identity */}
              <Paper
                id="sec-2"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  2. DEVELOPER &amp; COMPANY IDENTITY
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, mb: 1.5 }}>
                  G9Expert is operated by:
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#eff6ff",
                    borderLeft: "4px solid #2563eb",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: "0 6px 6px 0",
                    mb: 1.5,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1d4ed8" }}>
                    Softmaxs Solution LLP
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#334155", mt: 0.5 }}>
                    Website:{" "}
                    <a
                      href="https://g9expert.com"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb", overflowWrap: "anywhere", wordBreak: "break-word" }}
                    >
                      https://g9expert.com
                    </a>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#334155", mt: 0.25 }}>
                    Privacy Contact:{" "}
                    <a
                      href="mailto:support@g9expert.com"
                      style={{ color: "#2563eb", overflowWrap: "anywhere", wordBreak: "break-word" }}
                    >
                      support@g9expert.com
                    </a>
                  </Typography>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  G9Expert provides a platform through which users can discover experts, explore services, communicate with experts, make bookings, access consultations, and use other services made available through the platform.
                </Typography>
              </Paper>

              {/* 3. Information We Collect */}
              <Paper
                id="sec-3"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  3. INFORMATION WE COLLECT
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Depending on how you use G9Expert, we may collect information such as:
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mt: 1.5 }}>
                  Account and profile information:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Profession or profile information</li>
                  <li>Profile information voluntarily provided by you</li>
                  <li>Referral information where applicable</li>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mt: 1.5 }}>
                  Authentication information:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>OTP verification information</li>
                  <li>Authentication identifiers and session information</li>
                  <li>Information necessary to maintain account security</li>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mt: 1.5 }}>
                  Service and booking information:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Services searched or viewed</li>
                  <li>Expert profiles viewed</li>
                  <li>Bookings and consultations</li>
                  <li>Service-related requests</li>
                  <li>Reviews and feedback</li>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mt: 1.5 }}>
                  Communication information:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Chat messages and consultation-related communications</li>
                  <li>Information associated with voice or video consultations where required to provide the service</li>
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mt: 1.5 }}>
                  Payment and transaction information:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Wallet transactions</li>
                  <li>Recharge and payment records</li>
                  <li>Booking/payment history</li>
                  <li>Transaction identifiers</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  We use payment providers to process payments. G9Expert does not intentionally store complete card numbers, CVV numbers, banking passwords, or other sensitive payment credentials when those are handled directly by payment providers.
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a", mt: 1.5 }}>
                  Technical information may include:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 0,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Device information</li>
                  <li>Operating system information</li>
                  <li>IP address</li>
                  <li>Browser/application information</li>
                  <li>Push notification tokens</li>
                  <li>Technical logs required for security and service operation</li>
                </Box>
              </Paper>

              {/* 4. Location Information */}
              <Paper
                id="sec-4"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  4. LOCATION INFORMATION
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  G9Expert may use location-related information that you provide or select, such as city, state, or preferred location, to improve expert discovery, service relevance, and recommendations.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Where precise device location is not required, G9Expert does not need to continuously track your real-time location.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  Location permissions, where applicable, are requested only when required for a particular feature.
                </Typography>
              </Paper>

              {/* 5. How We Use Information */}
              <Paper
                id="sec-5"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  5. HOW WE USE INFORMATION
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  We may use information to:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    m: 0,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Create and manage your account</li>
                  <li>Authenticate users</li>
                  <li>Provide and improve G9Expert services</li>
                  <li>Help users discover relevant experts and services</li>
                  <li>Process bookings and consultations</li>
                  <li>Enable chat, voice, and video consultation features</li>
                  <li>Process payments and wallet transactions</li>
                  <li>Send important service and account notifications</li>
                  <li>Provide customer support</li>
                  <li>Prevent fraud, abuse, and unauthorized activity</li>
                  <li>Maintain platform security</li>
                  <li>Diagnose technical problems</li>
                  <li>Improve application and website performance</li>
                  <li>Comply with legal and regulatory requirements</li>
                </Box>
              </Paper>

              {/* 6. Consultations */}
              <Paper
                id="sec-6"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  6. CHAT, VOICE &amp; VIDEO CONSULTATIONS
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  G9Expert may provide chat, voice, and video consultation functionality.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Depending on the feature used:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Chat messages may be processed to provide the communication service.</li>
                  <li>Voice and video data may be transmitted through the technology providers used to enable real-time consultations.</li>
                  <li>Consultation-related records may be retained where necessary for billing, dispute resolution, security, service management, or legal requirements.</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  We do not use consultation content for unrelated purposes.
                </Typography>
              </Paper>

              {/* 7. Payments & Transactions */}
              <Paper
                id="sec-7"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  7. PAYMENTS &amp; TRANSACTIONS
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Payments may be processed through third-party payment providers such as Razorpay and other supported payment services.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Payment providers may collect and process payment information according to their own privacy policies and terms.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  G9Expert may receive transaction-related information such as:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Transaction ID</li>
                  <li>Payment status</li>
                  <li>Amount</li>
                  <li>Date/time</li>
                  <li>Payment method information provided by the payment gateway</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  G9Expert does not intentionally store complete card numbers, CVV numbers, or banking passwords.
                </Typography>
              </Paper>

              {/* 8. Information Sharing */}
              <Paper
                id="sec-8"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  8. INFORMATION SHARING
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  We may share information only when reasonably necessary to provide, maintain, secure, or improve our services.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Information may be shared with:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Experts or service providers when necessary to provide a requested service</li>
                  <li>Payment processors</li>
                  <li>Authentication and notification providers</li>
                  <li>Communication/consultation technology providers</li>
                  <li>Hosting, infrastructure, analytics, security, or technical service providers where applicable</li>
                  <li>Government authorities or law enforcement when legally required</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  We do not sell personal information to third parties.
                </Typography>
              </Paper>

              {/* 9. Third-Party Services */}
              <Paper
                id="sec-9"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  9. THIRD-PARTY SERVICES
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  G9Expert may use third-party technology providers to support platform functionality.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Depending on the feature and implementation, these may include:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Firebase for authentication and push notifications</li>
                  <li>ZEGOCLOUD/WebRTC-based technology for real-time voice/video consultations</li>
                  <li>Razorpay and supported payment providers for payment processing</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  Third-party providers process information according to their own applicable privacy policies and agreements.
                </Typography>
              </Paper>

              {/* 10. Data Security */}
              <Paper
                id="sec-10"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  10. DATA SECURITY
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  We use reasonable technical and organizational measures to protect personal information against unauthorized access, misuse, alteration, disclosure, or destruction.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Security measures may include:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Encrypted connections</li>
                  <li>Authentication controls</li>
                  <li>Access restrictions</li>
                  <li>Secure server infrastructure</li>
                  <li>Monitoring and logging</li>
                  <li>Security updates</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  However, no internet-based service can guarantee absolute security.
                </Typography>
              </Paper>

              {/* 11. Data Retention */}
              <Paper
                id="sec-11"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  11. DATA RETENTION
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  We retain personal information only for as long as reasonably necessary to:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Provide requested services</li>
                  <li>Maintain accounts</li>
                  <li>Complete transactions</li>
                  <li>Resolve disputes</li>
                  <li>Prevent fraud and abuse</li>
                  <li>Meet legal and regulatory obligations</li>
                  <li>Maintain security and business records</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  Retention periods may vary depending on the type and purpose of the information.
                </Typography>
              </Paper>

              {/* 12. Account Deletion */}
              <Paper
                id="sec-12"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  12. ACCOUNT DELETION &amp; DATA DELETION
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  You may request deletion of your G9Expert account.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Where the feature is available, account deletion can be initiated from your G9Expert account settings.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  You may also contact:
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#eff6ff",
                    borderLeft: "4px solid #2563eb",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: "0 6px 6px 0",
                    mb: 1.5,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1d4ed8" }}>
                    support@g9expert.com
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#334155", mt: 0.25 }}>
                    Subject: Account Deletion Request
                  </Typography>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  We may need to verify your identity before processing a deletion request.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  Some information may be retained where required by law, for legitimate security purposes, or to resolve disputes and financial records.
                </Typography>
              </Paper>

              {/* 13. Your Rights & Choices */}
              <Paper
                id="sec-13"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  13. YOUR RIGHTS &amp; CHOICES
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Depending on applicable law, you may have rights to:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Withdraw certain permissions</li>
                  <li>Manage notification preferences</li>
                  <li>Request information about how your data is processed</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  To submit a privacy-related request, contact:{" "}
                  <a
                    href="mailto:support@g9expert.com"
                    style={{ color: "#2563eb", overflowWrap: "anywhere", wordBreak: "break-word" }}
                  >
                    support@g9expert.com
                  </a>
                  .
                </Typography>
              </Paper>

              {/* 14. Children's Privacy */}
              <Paper
                id="sec-14"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  14. CHILDREN'S PRIVACY
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  G9Expert is not intended for children who are below the minimum age required to independently use such services under applicable law.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  We do not knowingly collect personal information from children in violation of applicable laws.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  If you believe a child has provided personal information to us improperly, contact:{" "}
                  <a
                    href="mailto:support@g9expert.com"
                    style={{ color: "#2563eb", overflowWrap: "anywhere", wordBreak: "break-word" }}
                  >
                    support@g9expert.com
                  </a>
                  .
                </Typography>
              </Paper>

              {/* 15. Cookies & Local Storage */}
              <Paper
                id="sec-15"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  15. COOKIES &amp; LOCAL STORAGE
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Our website and applications may use cookies, local storage, session storage, or similar technologies to:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Maintain sessions</li>
                  <li>Remember preferences</li>
                  <li>Improve functionality</li>
                  <li>Maintain security</li>
                  <li>Understand service usage where applicable</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  These technologies do not necessarily identify you by name.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  You may be able to control cookies through your browser settings.
                </Typography>
              </Paper>

              {/* 16. Communications */}
              <Paper
                id="sec-16"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  16. COMMUNICATIONS &amp; NOTIFICATIONS
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  G9Expert may send service-related communications such as:
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    color: "#475569",
                    pl: { xs: 2, sm: 2.5 },
                    mb: 1.5,
                    "& li": { mb: 0.25, fontSize: { xs: "0.85rem", sm: "0.925rem" } },
                  }}
                >
                  <li>Account notifications</li>
                  <li>Booking updates</li>
                  <li>Consultation notifications</li>
                  <li>Payment notifications</li>
                  <li>Security alerts</li>
                  <li>Important service updates</li>
                </Box>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  Push notifications may use Firebase Cloud Messaging or other supported notification infrastructure.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  You can control notification permissions through your device settings where applicable.
                </Typography>
              </Paper>

              {/* 17. Changes to Privacy Policy */}
              <Paper
                id="sec-17"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  17. CHANGES TO THIS PRIVACY POLICY
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  We may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements, or privacy practices.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  When we make material changes, we may update the effective date and provide additional notice where appropriate.
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" }, m: 0 }}>
                  You should periodically review this page for the latest version.
                </Typography>
              </Paper>

              {/* 18. Contact Us */}
              <Paper
                id="sec-18"
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5, md: 3 },
                  borderRadius: 2.5,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  scrollMarginTop: "5.5rem",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    pb: 0.75,
                    mb: 1.5,
                    borderBottom: "2px solid #eff6ff",
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                  }}
                >
                  18. CONTACT US
                </Typography>
                <Typography paragraph sx={{ color: "#475569", lineHeight: 1.6, fontSize: { xs: "0.875rem", sm: "0.95rem" } }}>
                  For privacy questions, data requests, account deletion requests, or concerns regarding this Privacy Policy, contact:
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#eff6ff",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    border: "1px solid #dbeafe",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0f172a" }}>
                    Softmaxs Solution LLP
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#475569", mt: 0.5 }}>
                    Email:{" "}
                    <a
                      href="mailto:support@g9expert.com"
                      style={{ color: "#2563eb", overflowWrap: "anywhere", wordBreak: "break-word" }}
                    >
                      support@g9expert.com
                    </a>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#475569", mt: 0.25 }}>
                    Website:{" "}
                    <a
                      href="https://g9expert.com"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#2563eb", overflowWrap: "anywhere", wordBreak: "break-word" }}
                    >
                      https://g9expert.com
                    </a>
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
