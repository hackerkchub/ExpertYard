export const normalizeVideoCallPrice = (expert = {}) => {
  if (!expert) return null;
  const raw =
    expert?.video_call_price_per_minute ??
    expert?.videoCallPricePerMinute ??
    expert?.video_call_per_minute ??
    expert?.videoCallPerMinute ??
    expert?.video_price_per_minute ??
    expert?.videoPricePerMinute ??
    expert?.video_call?.per_minute ??
    expert?.video_call ??
    expert?.videoCallPrice ??
    expert?.video_call_price ??
    expert?.videoPrice ??
    expert?.video_price ??
    expert?.price_per_minute ??
    expert?.pricePerMinute ??
    expert?.call_per_minute ??
    expert?.callPerMinute ??
    expert?.chat_per_minute ??
    expert?.chatPerMinute ??
    expert?.price ??
    null;

  if (raw === null || raw === undefined || raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
};
