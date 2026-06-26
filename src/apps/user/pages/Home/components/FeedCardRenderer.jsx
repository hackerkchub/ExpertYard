import React from "react";
import {
  ExpertOfferFeedCard,
  ExpertProfileFeedCard,
  ExpertTipFeedCard,
  ServicePostFeedCard,
} from "./FeedCards";

const FeedCardRenderer = React.memo(function FeedCardRenderer({ item }) {
  switch (item?.type) {
    case "service_post":
      return <ServicePostFeedCard item={item} />;
    case "expert_offer":
      return <ExpertOfferFeedCard item={item} />;
    case "expert_post":
      return <ExpertTipFeedCard item={item} />;
    case "promoted_expert":
    case "expert_profile":
      return <ExpertProfileFeedCard item={item} />;
    default:
      return null;
  }
});

export default FeedCardRenderer;
