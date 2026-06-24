const truthyFlag = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value || "").toLowerCase() === "true";

const hasValue = (value) => value !== undefined && value !== null;

export const getExpertAccessFlags = (expert = {}) => {
  const subscriptionStatus = String(
    expert.subscription_status ?? expert.subscriptionStatus ?? ""
  ).toLowerCase();
  const accessLevel = String(
    expert.access_level ?? expert.accessLevel ?? ""
  ).toLowerCase();
  const planExpiresAt = expert.plan_expires_at ?? expert.planExpiresAt ?? null;
  const expiresAt = planExpiresAt ? new Date(planExpiresAt) : null;
  const isExpired =
    subscriptionStatus === "expired" ||
    subscriptionStatus === "cancelled" ||
    (expiresAt instanceof Date && !Number.isNaN(expiresAt.getTime()) && expiresAt.getTime() <= Date.now());

  const isPaidExpert =
    !isExpired &&
    (
      expert.isPaidExpert === true ||
      subscriptionStatus === "active" ||
      truthyFlag(expert.is_subscribed) ||
      truthyFlag(expert.isSubscribed) ||
      ["paid_basic", "paid_growth"].includes(accessLevel)
    );

  const rawCanChat = expert.can_chat ?? expert.canChat ?? expert.chat_enabled ?? expert.chatEnabled;
  const rawCanCall = expert.can_call ?? expert.canCall ?? expert.call_enabled ?? expert.callEnabled;
  const rawCanViewContact =
    expert.can_view_contact ?? expert.canViewContact ?? expert.contact_enabled ?? expert.contactEnabled;
  const activePaidPlan = isPaidExpert && subscriptionStatus === "active";

  return {
    isPaidExpert,
    canChat: isPaidExpert && (activePaidPlan || !hasValue(rawCanChat) || truthyFlag(rawCanChat)),
    canCall: isPaidExpert && (activePaidPlan || !hasValue(rawCanCall) || truthyFlag(rawCanCall)),
    canViewContact: isPaidExpert && (activePaidPlan || !hasValue(rawCanViewContact) || truthyFlag(rawCanViewContact)),
    subscriptionStatus: subscriptionStatus || (isPaidExpert ? "active" : "free"),
    accessLevel: accessLevel || (isPaidExpert ? "paid_basic" : "free_limited"),
  };
};

export const normalizeExpertAccess = (expert = {}) => {
  const access = getExpertAccessFlags(expert);

  return {
    ...expert,
    ...access,
    subscription_status: access.subscriptionStatus,
    subscriptionStatus: access.subscriptionStatus,
    access_level: access.accessLevel,
    accessLevel: access.accessLevel,
    is_subscribed: access.isPaidExpert ? 1 : 0,
    isSubscribed: access.isPaidExpert,
    can_chat: access.canChat,
    can_call: access.canCall,
    can_view_contact: access.canViewContact,
    chat_enabled: access.canChat,
    call_enabled: access.canCall,
    chatEnabled: access.canChat,
    callEnabled: access.canCall,
    canViewContact: access.canViewContact,
  };
};
