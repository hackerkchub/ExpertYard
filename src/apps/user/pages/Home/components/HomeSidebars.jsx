import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CreditCard,
  Grid3X3,
  Home,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Home", to: "/user", icon: Home, end: true },
  { label: "Experts", to: "/user/call-chat?page=1", icon: Users },
  { label: "Services", to: "/user/all-services", icon: BriefcaseBusiness },
  { label: "Wallet", to: "/user/wallet", icon: CreditCard },
  { label: "My Consultations", to: "/user/chat-history", icon: Sparkles },
  { label: "Category", to: "/user/categories", icon: Grid3X3 },
  { label: "Notifications", to: "/user/notifications", icon: Bell },
  { label: "Settings", to: "/user/user-profile", icon: Settings },
];

export function HomeLeftSidebar() {
  return (
    <aside className="home-left-sidebar" aria-label="Home navigation">
      <div className="home-sidebar-card home-sidebar-card--nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.to} end={item.end}>
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}

export function HomeRightSidebar({ experts = [], services = [] }) {
  return (
    <aside className="home-right-sidebar" aria-label="Home suggestions">
      <section className="home-widget">
        <div className="home-widget-head">
          <h2>Suggested Experts</h2>
          <Link to="/user/call-chat?page=1">View</Link>
        </div>
        {experts.slice(0, 4).map((item) => {
          const data = item.data || {};
          return (
            <Link className="home-suggested-expert" to={`/user/experts/${data.expert_slug || data.id}`} key={`${item.type}-${item.id}`}>
              {data.profile_photo ? <img src={data.profile_photo} alt="" loading="lazy" /> : <span>{String(data.name || data.expert_name || "GE").slice(0, 2)}</span>}
              <div>
                <strong>{data.name || data.expert_name}</strong>
                <small>{data.category_name || data.position || "Verified Expert"}</small>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="home-widget">
        <div className="home-widget-head">
          <h2>Trending Services</h2>
          <Link to="/user/all-services">View</Link>
        </div>
        {services.slice(0, 4).map((item) => {
          const data = item.data || {};
          return (
            <Link className="home-trending-service" to={`/user/service-details/${data.slug || data.service_id}`} key={`${item.type}-${item.id}`}>
              <strong>{data.title}</strong>
              <small>{data.category_name || "Service"} | Rs {Math.round(Number(data.price || 0)) || "View"}</small>
            </Link>
          );
        })}
      </section>

      <section className="home-widget home-invite-widget">
        <h2>Invite & Earn</h2>
        <p>Share G9Expert with friends and manage rewards from your wallet.</p>
        <Link to="/user/wallet">Open wallet</Link>
      </section>
    </aside>
  );
}
