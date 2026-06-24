const truthyFlag = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value || "").toLowerCase() === "true";

const hasValue = (value) => value !== undefined && value !== null;

export const getExpertAccessFlags = (expert = {}) => {
  const effective = expert.effective_access || expert.effectiveAccess || {};
  const subscriptionStatus = String(
    effective.subscription_status ?? expert.subscription_status ?? expert.subscriptionStatus ?? ""
  ).toLowerCase();
  const accessLevel = String(
    effective.access_level ?? expert.access_level ?? expert.accessLevel ?? ""
  ).toLowerCase();
  const planExpiresAt = effective.plan_expires_at ?? expert.plan_expires_at ?? expert.planExpiresAt ?? null;
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

  const rawCanChat = effective.can_chat ?? expert.can_chat ?? expert.canChat ?? expert.chat_enabled ?? expert.chatEnabled;
  const rawCanCall = effective.can_call ?? expert.can_call ?? expert.canCall ?? expert.call_enabled ?? expert.callEnabled;
  const rawCanViewContact =
    effective.can_view_contact ?? expert.can_view_contact ?? expert.canViewContact ?? expert.contact_enabled ?? expert.contactEnabled;
  const rawShowChat = effective.show_chat_button ?? expert.show_chat_button ?? expert.showChatButton;
  const rawShowCall = effective.show_call_button ?? expert.show_call_button ?? expert.showCallButton;
  const rawShowInUserModule = effective.show_in_user_module ?? expert.show_in_user_module ?? expert.showInUserModule;
  const rawShowOnListing = effective.show_on_listing ?? expert.show_on_listing ?? expert.showOnListing;
  const rawPublicProfile = effective.public_profile_enabled ?? expert.public_profile_enabled ?? expert.publicProfileEnabled;
  const rawProfileEdit = effective.profile_edit_enabled ?? effective.can_edit_profile ?? expert.profile_edit_enabled ?? expert.can_edit_profile ?? expert.profileEditEnabled ?? expert.canEditProfile;
  const activePaidPlan = isPaidExpert && subscriptionStatus === "active";
  const canChat = hasValue(rawShowChat)
    ? truthyFlag(rawShowChat)
    : hasValue(rawCanChat)
      ? truthyFlag(rawCanChat)
      : isPaidExpert && activePaidPlan;
  const canCall = hasValue(rawShowCall)
    ? truthyFlag(rawShowCall)
    : hasValue(rawCanCall)
      ? truthyFlag(rawCanCall)
      : isPaidExpert && activePaidPlan;

  return {
    isPaidExpert,
    canChat,
    canCall,
    canViewContact: isPaidExpert && (activePaidPlan || !hasValue(rawCanViewContact) || truthyFlag(rawCanViewContact)),
    showChatButton: canChat,
    showCallButton: canCall,
    showInUserModule: hasValue(rawShowInUserModule) ? truthyFlag(rawShowInUserModule) : true,
    showOnListing: hasValue(rawShowOnListing) ? truthyFlag(rawShowOnListing) : true,
    publicProfileEnabled: hasValue(rawPublicProfile) ? truthyFlag(rawPublicProfile) : true,
    profileEditEnabled: hasValue(rawProfileEdit) ? truthyFlag(rawProfileEdit) : isPaidExpert,
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
    show_chat_button: access.showChatButton,
    show_call_button: access.showCallButton,
    show_in_user_module: access.showInUserModule,
    show_on_listing: access.showOnListing,
    public_profile_enabled: access.publicProfileEnabled,
    profile_edit_enabled: access.profileEditEnabled,
    can_edit_profile: access.profileEditEnabled,
    chat_enabled: access.canChat,
    call_enabled: access.canCall,
    chatEnabled: access.canChat,
    callEnabled: access.canCall,
    canViewContact: access.canViewContact,
    showChatButton: access.showChatButton,
    showCallButton: access.showCallButton,
    showInUserModule: access.showInUserModule,
    showOnListing: access.showOnListing,
    publicProfileEnabled: access.publicProfileEnabled,
    profileEditEnabled: access.profileEditEnabled,
    canEditProfile: access.profileEditEnabled,
  };
};
