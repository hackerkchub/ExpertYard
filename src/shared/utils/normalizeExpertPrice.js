export const normalizeVideoCallPrice = (expert = {}) => {
  const raw =
    expert?.video_call_price_per_minute ??
    expert?.videoCallPricePerMinute ??
    expert?.video_call_per_minute ??
    expert?.videoCallPerMinute ??
    expert?.video_price_per_minute ??
    expert?.videoPricePerMinute ??
    expert?.video_call?.per_minute ??
    expert?.videoCallPrice ??
    expert?.video_call_price ??
    expert?.videoPrice ??
    expert?.video_price ??
    expert?.price_per_minute ??
    expert?.pricePerMinute ??
    expert?.price ??
    null;

  if (raw === null || raw === undefined || raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};
