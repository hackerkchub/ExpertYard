import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CreditCard,
  Grid3X3,
  Heart,
  Home,
  PhoneCall,
  MessageCircle,
  Settings,
  Sparkles,
  Users,
  ChevronRight,
} from "lucide-react";
import TrustBanner from "./TrustBanner";
import WalletCard from "./WalletCard";
/* =====================================================
   LEFT SIDEBAR
===================================================== */

const navItems = [
  {
    label: "Home",
    to: "/user",
    icon: Home,
    end: true,
  },
  {
    label: "Experts",
    to: "/user/call-chat?page=1",
    icon: Users,
  },
  {
    label: "Chat Experts",
    to: "/user/call-chat?page=1&mode=chat",
    icon: MessageCircle,
  },
  {
    label: "Call Experts",
    to: "/user/call-chat?page=1&mode=call",
    icon: PhoneCall,
  },
  {
    label: "Services",
    to: "/user/all-services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Wallet",
    to: "/user/wallet",
    icon: CreditCard,
  },
  {
    label: "My Consultations",
    to: "/user/chat-history",
    icon: Sparkles,
  },
  {
    label: "Categories",
    to: "/user/categories",
    icon: Grid3X3,
  },
  {
    label: "Wishlist",
    to: "/user/wishlist",
    icon: Heart,
  },
  {
    label: "Notifications",
    to: "/user/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    to: "/user/user-profile",
    icon: Settings,
  },
];

export function HomeLeftSidebar() {

  return (

    <aside className="home-left-sidebar">

      {/* Scrollable Menu */}

      <div className="home-left-scroll">

        <div className="home-sidebar-card">

          <h3 className="home-sidebar-title">

            Quick Menu

          </h3>

          <nav className="home-sidebar-nav">

            {navItems.map((item) => {

              const Icon = item.icon;

              return (

                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `home-sidebar-link ${isActive ? "active" : ""}`
                  }
                >

                  <div className="home-sidebar-link-left">

                    <Icon size={18} />

                    <span>

                      {item.label}

                    </span>

                  </div>

                  <ChevronRight size={16} />

                </NavLink>

              );

            })}

          </nav>

        </div>

      </div>

      {/* Fixed Bottom Trust Banner */}

      <div className="home-left-bottom">

        <TrustBanner />

      </div>

    </aside>

  );

}
/* =====================================================
   RIGHT SIDEBAR
===================================================== */

export function HomeRightSidebar({

  experts = [],
  services = [],
  balance = 0,

}) {

  return (

    <aside className="home-right-sidebar">

      {/* Scrollable Area */}

      <div className="home-right-scroll">

        {/* Top Experts */}

        <section className="home-widget">

          <div className="home-widget-head">

            <h3>

              Top Experts

            </h3>

            <Link to="/user/call-chat?page=1">

              View All

            </Link>

          </div>

          {experts.length === 0 ? (

            <div className="home-widget-empty">

              No Experts

            </div>

          ) : (

            experts.slice(0, 5).map((item) => {

              const expert = item.data || item;

              return (

                <Link
                  key={expert.id}
                  className="home-suggested-expert"
                  to={`/user/experts/${expert.expert_slug || expert.id}`}
                >

                  {expert.profile_photo ? (

                    <img
                      src={expert.profile_photo}
                      alt=""
                    />

                  ) : (

                    <span>

                      {(expert.name || "GE")
                        .substring(0, 2)
                        .toUpperCase()}

                    </span>

                  )}

                  <div>

                    <strong>

                      {expert.name}

                    </strong>

                    <small>

                      {expert.category_name ||
                        expert.position ||
                        "Verified Expert"}

                    </small>

                  </div>

                </Link>

              );

            })

          )}

        </section>

        {/* Trending */}

        <section className="home-widget">

          <div className="home-widget-head">

            <h3>

              Trending Services

            </h3>

            <Link to="/user/all-services">

              View All

            </Link>

          </div>

          {services.length === 0 ? (

            <div className="home-widget-empty">

              No Services

            </div>

          ) : (

            services.slice(0, 5).map((item) => {

              const service = item.data || item;

              return (

                <Link
                  key={service.id}
                  className="home-trending-service"
                  to={`/user/service-details/${service.slug || service.service_id}`}
                >

                  <strong>

                    {service.title}

                  </strong>

                  <small>

                    {service.category_name || "Service"}

                    {" • "}

                    ₹{Math.round(service.price || 0)}

                  </small>

                </Link>

              );

            })

          )}

        </section>

      </div>

      {/* Bottom Fixed Area */}

      <div className="home-right-bottom">

        <WalletCard

          compact

          balance={balance}

        />

        <section className="home-widget home-invite-widget">

          <h3>

            Invite & Earn

          </h3>

          <p>

            Invite your friends and earn rewards on every successful signup.

          </p>

          <Link
            to="/user/referral"
            className="home-primary-btn"
          >

            Invite Friends

          </Link>

        </section>

      </div>

    </aside>

  );

}