/**
 * G9Expert Platform Knowledge Engine & Intent Router
 * Provides strict separation between AI Search (Expert & Service discovery)
 * and Ask G9 (G9Expert Platform Assistant & Workflow Guide).
 */

// Intent Types for AI Search
export const SEARCH_INTENTS = {
  EXPERT_SEARCH: "EXPERT_SEARCH",
  SERVICE_SEARCH: "SERVICE_SEARCH",
  EXPERT_AND_SERVICE_SEARCH: "EXPERT_AND_SERVICE_SEARCH",
  PLATFORM_HELP_REDIRECT: "PLATFORM_HELP_REDIRECT",
};

// Intent Types for Ask G9 Assistant
export const ASSISTANT_INTENTS = {
  BOOK_SERVICE_HELP: "BOOK_SERVICE_HELP",
  ORDER_HELP: "ORDER_HELP",
  EXPERT_DISCOVERY_GUIDANCE: "EXPERT_DISCOVERY_GUIDANCE",
  CONSULTATION_HELP: "CONSULTATION_HELP",
  EXPERT_REGISTRATION: "EXPERT_REGISTRATION",
  EXPERT_APPROVAL: "EXPERT_APPROVAL",
  ADMIN_SUPPORT: "ADMIN_SUPPORT",
  SERVICE_HELP: "SERVICE_HELP",
  OUT_OF_SCOPE: "OUT_OF_SCOPE",
  GENERAL_PLATFORM_HELP: "GENERAL_PLATFORM_HELP",
};

/**
 * Classify input query for AI Search
 */
export function classifySearchQuery(queryText = "") {
  const q = queryText.toLowerCase().trim();

  // Detect platform workflow questions typed in AI Search
  if (
    q.includes("kaise book") ||
    q.includes("how to book") ||
    q.includes("order kaha") ||
    q.includes("where is my order") ||
    q.includes("expert kaise banu") ||
    q.includes("how to register") ||
    q.includes("admin se") ||
    q.includes("approval kaise")
  ) {
    return {
      intent: SEARCH_INTENTS.PLATFORM_HELP_REDIRECT,
      message: "Looking for G9Expert platform help? For booking guidance, order status, expert registration, or admin support, please use Ask G9 (the floating assistant at bottom-right). Use AI Search below for finding Experts and Services.",
    };
  }

  const isServiceKeyword = /gst|pan|itr|tax filing|registration|certificate|licence|license|trademark|audit/i.test(q);
  const isExpertKeyword = /lawyer|law|lawyer|doctor|dr|ca|chartered accountant|advocate|consultant|expert|vakeel|wakeel/i.test(q);

  if (isServiceKeyword && isExpertKeyword) {
    return { intent: SEARCH_INTENTS.EXPERT_AND_SERVICE_SEARCH };
  } else if (isServiceKeyword) {
    return { intent: SEARCH_INTENTS.SERVICE_SEARCH };
  } else if (isExpertKeyword) {
    return { intent: SEARCH_INTENTS.EXPERT_SEARCH };
  }

  return { intent: SEARCH_INTENTS.EXPERT_AND_SERVICE_SEARCH };
}

/**
 * Classify input query and generate verified G9Expert response for Ask G9 Assistant
 */
export function processAskG9Query(queryText = "") {
  const q = queryText.toLowerCase().trim();

  // 1. HOW TO BOOK A SERVICE
  if (
    q.includes("book") ||
    q.includes("order karni") ||
    q.includes("order kaise") ||
    q.includes("service kaise lene") ||
    q.includes("booking flow") ||
    q.includes("how to buy")
  ) {
    return {
      intent: ASSISTANT_INTENTS.BOOK_SERVICE_HELP,
      text: "To book a service on G9Expert:\n\n1. Browse or use AI Search to find your required Service (e.g., GST Registration, ITR Filing).\n2. Open the Service Details page to check pricing and scope.\n3. Click 'Book Now' / 'Order Service'.\n4. Provide the required information and confirm booking.\n5. Track progress anytime under My Orders.",
      actionLabel: "Find Services",
      actionUrl: "/user/all-services",
    };
  }

  // 2. HOW TO VIEW ORDERS
  if (
    q.includes("order") ||
    q.includes("mere order") ||
    q.includes("my orders") ||
    q.includes("booking history") ||
    q.includes("status kaha")
  ) {
    return {
      intent: ASSISTANT_INTENTS.ORDER_HELP,
      text: "You can view and manage all your active and past orders easily:\n\n1. Go to the Bottom Navigation Bar.\n2. Tap on 'Orders' or 'My Bookings'.\n3. Select any order to view details, active workspace, and status.",
      actionLabel: "View My Orders",
      actionUrl: "/user/my-orders",
    };
  }

  // 3. HOW TO FIND EXPERTS (REDIRECT TO AI SEARCH)
  if (
    (q.includes("expert") || q.includes("lawyer") || q.includes("doctor") || q.includes("ca")) &&
    (q.includes("dhundo") || q.includes("search") || q.includes("kaha milenge") || q.includes("find") || q.includes("chahiye"))
  ) {
    return {
      intent: ASSISTANT_INTENTS.EXPERT_DISCOVERY_GUIDANCE,
      text: "To search and compare verified Experts or Services on G9Expert, please use AI Search on the Home page or Search bar!\n\nAI Search quickly finds lawyers, CAs, doctors, and services based on your query.",
      actionLabel: "Open AI Search",
      actionUrl: "/user/search",
    };
  }

  // 4. HOW TO TAKE CONSULTATION
  if (
    q.includes("consultation") ||
    q.includes("baat kaise") ||
    q.includes("video call kaise") ||
    q.includes("call par") ||
    q.includes("chat kaise")
  ) {
    return {
      intent: ASSISTANT_INTENTS.CONSULTATION_HELP,
      text: "G9Expert offers 3 consultation channels depending on expert availability:\n\n• Audio Call: Tap 'Call' on the expert profile for instant audio consultation.\n• Video Call: Tap 'Video Call' for face-to-face online video consultation.\n• Chat: Tap 'Chat' to initiate instant messaging with the expert.",
      actionLabel: "Explore Experts",
      actionUrl: "/user/experts",
    };
  }

  // 5. HOW TO REGISTER AS AN EXPERT
  if (
    q.includes("register as expert") ||
    q.includes("expert kaise ban") ||
    q.includes("expert banna hai") ||
    q.includes("join as expert") ||
    q.includes("expert registration")
  ) {
    return {
      intent: ASSISTANT_INTENTS.EXPERT_REGISTRATION,
      text: "To register as a verified Expert on G9Expert:\n\n1. Open the Menu / Side Drawer or Footer.\n2. Tap 'Become an Expert' (or navigate to Expert Registration).\n3. Fill in your professional details, qualifications, and mobile number.\n4. Upload ID proof and professional certificates.\n5. Submit for G9Expert verification.\n\n⚠️ Important Safety Notice:\nG9Expert kabhi bhi kisi individual ke personal mobile number, WhatsApp, UPI ID ya personally shared QR code par direct payment karne ke liye nahi kehta. Agar koi person G9Expert ke naam par aise payment ki demand kare, to payment na karein — ye fraud ho sakta hai. Payments sirf G9Expert ke official platform/payment flow ke through hi karein.",
      actionLabel: "Become an Expert",
      actionUrl: "/expert/register",
    };
  }

  // 6. EXPERT APPROVAL
  if (
    q.includes("approval") ||
    q.includes("approve") ||
    q.includes("verification process") ||
    q.includes("account approve")
  ) {
    return {
      intent: ASSISTANT_INTENTS.EXPERT_APPROVAL,
      text: "G9Expert verification process for experts:\n\n1. Submission: Registration details and certificates are submitted.\n2. Admin Verification: Our team verifies submitted credentials and background.\n3. Activation: Upon approval, your expert profile goes live to receive consultation requests.",
    };
  }

  // 7. ADMIN CONSULTATION / SUPPORT
  if (
    q.includes("admin") ||
    q.includes("support") ||
    q.includes("help") ||
    q.includes("problem") ||
    q.includes("contact")
  ) {
    return {
      intent: ASSISTANT_INTENTS.ADMIN_SUPPORT,
      text: "For platform support or queries regarding your bookings, you can reach G9Expert Support:\n\n1. Go to 'My Inquiries' or 'Support' from your user menu.\n2. Submit a new ticket or inquiry message.\n3. Our support team will review and respond directly.",
      actionLabel: "Go to My Inquiries",
      actionUrl: "/user/my-inquiries",
    };
  }

  // 8. OUT OF SCOPE (NON-PLATFORM UNRELATED QUESTIONS)
  if (
    q.includes("weather") ||
    q.includes("news") ||
    q.includes("recipe") ||
    q.includes("python") ||
    q.includes("code") ||
    q.includes("movie") ||
    q.includes("song") ||
    q.includes("cricket")
  ) {
    return {
      intent: ASSISTANT_INTENTS.OUT_OF_SCOPE,
      text: "I am Ask G9, your dedicated G9Expert Platform Assistant! I can help you with service bookings, orders, consultations, expert registration, and platform navigation. For finding experts or services, please use AI Search.",
    };
  }

  // DEFAULT GENERAL PLATFORM HELP
  return {
    intent: ASSISTANT_INTENTS.GENERAL_PLATFORM_HELP,
    text: "Welcome to Ask G9! How can I assist you with the G9Expert platform today?\n\nYou can ask me about:\n• How to book services\n• Checking order status\n• Taking Call/Video/Chat consultations\n• Becoming a verified expert\n• Support & Inquiries",
  };
}
