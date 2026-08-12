import React from "react";
import { Link } from "react-router-dom";
import { Package, MessageCircle, PhoneCall } from "lucide-react";

const actions = [
  {
    title: "Quick Chat",
    text: "Instant replies from active experts",
    to: "/user/call-chat?page=1&mode=chat",
    icon: MessageCircle,
  },
  {
    title: "Quick Call",
    text: "Talk live with verified experts",
    to: "/user/call-chat?page=1&mode=call",
    icon: PhoneCall,
  },
  {
    title: "My Orders",
    text: "Book and manage your orders",
    to: "/user/my-services",
    icon: Package,
  },
];

const QuickActions = React.memo(function QuickActions() {
  return (
    <section className="home-quick-actions" aria-label="Quick chat, call, and services">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link className="home-quick-card" to={action.to} key={action.title}>
            <span>
              <Icon size={22} />
            </span>
            <strong>{action.title}</strong>
            <small>{action.text}</small>
          </Link>
        );
      })}
    </section>
  );
});

export default QuickActions;
