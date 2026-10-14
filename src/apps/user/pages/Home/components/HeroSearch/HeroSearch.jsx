import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  PhoneCall,
  Video,
  BriefcaseBusiness,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  MapPin,
  ChevronRight
} from "lucide-react";
import GlobalSearchBar from "../../../../components/search/GlobalSearchBar";
import { LocationSelector } from "../../../../../../shared/components";
import { buildUserSearchPath } from "../../../../components/search/searchUtils";
import "./HeroSearch.css";

const TRENDING_TAGS = [
  { label: "Property Lawyers", query: "Property Lawyer", icon: "⚖️" },
  { label: "Income Tax Filing", query: "Income Tax Filing", icon: "💼" },
  { label: "Doctor Consultation", query: "Doctor", icon: "🩺" },
  { label: "Astrologer / Kundli", query: "Astrologer", icon: "🔮" },
  { label: "GST Registration", query: "GST Registration", icon: "🏢" },
  { label: "Business Advisory", query: "Business Consultant", icon: "📈" },
  { label: "Career Guidance", query: "Career Guidance", icon: "🎓" },
];

export default function HeroSearch({ onLocationSelect }) {
  const navigate = useNavigate();

  const handleTagClick = (query) => {
    navigate(buildUserSearchPath(query));
  };

  return (
    <section className="g9-hero-search-section" aria-label="Find and consult experts">
      {/* TRUST BADGE */}
      <div className="g9-hero-trust-badge">
        <ShieldCheck size={14} className="badge-shield-icon" />
        <span>Verified Network &bull; Instant Consultation &bull; Secure Payments</span>
      </div>

      {/* HEADLINE */}
      <div className="g9-hero-title-wrap">
        <h1 className="g9-hero-main-title">
          Find &amp; Consult Trusted <span className="title-highlight">Experts</span>
        </h1>
        <p className="g9-hero-main-subtitle">
          Connect via instant chat, voice call, or video consultation with verified professionals across India.
        </p>
      </div>

      {/* JUSTDIAL-INSPIRED DUAL SEARCH UNIT */}
      <div className="g9-hero-dual-search-card">
        <div className="g9-hero-search-inputs-row">
          {/* Location Trigger */}
          <div className="g9-hero-location-picker">
            <span className="picker-label">Location</span>
            <div className="picker-widget-wrap">
              <LocationSelector
                onLocationSelect={onLocationSelect}
                fallbackText="Select City / Area"
              />
            </div>
          </div>

          <div className="g9-hero-search-divider" />

          {/* Autocomplete Global Search Bar */}
          <div className="g9-hero-search-field-wrap">
            <GlobalSearchBar
              className="g9-hero-embedded-search"
              placeholder="Search lawyers, doctors, CA, astrologers, services..."
            />
          </div>
        </div>

        {/* TRENDING QUICK SEARCH TAGS */}
        <div className="g9-hero-quick-tags-strip">
          <div className="quick-tags-lead">
            <TrendingUp size={14} className="trend-icon" />
            <span>Popular:</span>
          </div>
          <div className="quick-tags-scroll">
            {TRENDING_TAGS.map((tag) => (
              <button
                type="button"
                key={tag.label}
                className="g9-quick-tag-chip"
                onClick={() => handleTagClick(tag.query)}
              >
                <span className="tag-emoji">{tag.icon}</span>
                <span className="tag-text">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK 4-ACTION BUTTONS STRIP */}
      <div className="g9-hero-actions-grid">
        <button
          type="button"
          className="hero-action-pill-btn chat-action"
          onClick={() => navigate("/user/call-chat?page=1&mode=chat")}
        >
          <div className="action-icon-circle blue">
            <MessageSquare size={17} />
          </div>
          <div className="action-label-wrap">
            <strong>Chat Consultation</strong>
            <small>Instant reply</small>
          </div>
          <ChevronRight size={14} className="action-caret" />
        </button>

        <button
          type="button"
          className="hero-action-pill-btn call-action"
          onClick={() => navigate("/user/call-chat?page=1&mode=call")}
        >
          <div className="action-icon-circle green">
            <PhoneCall size={17} />
          </div>
          <div className="action-label-wrap">
            <strong>Voice Call</strong>
            <small>100% Private</small>
          </div>
          <ChevronRight size={14} className="action-caret" />
        </button>

        <button
          type="button"
          className="hero-action-pill-btn video-action"
          onClick={() => navigate("/user/call-chat?page=1&mode=video")}
        >
          <div className="action-icon-circle purple">
            <Video size={17} />
          </div>
          <div className="action-label-wrap">
            <strong>Video Call</strong>
            <small>Face-to-face</small>
          </div>
          <ChevronRight size={14} className="action-caret" />
        </button>

        <button
          type="button"
          className="hero-action-pill-btn service-action"
          onClick={() => navigate("/user/all-services")}
        >
          <div className="action-icon-circle amber">
            <BriefcaseBusiness size={17} />
          </div>
          <div className="action-label-wrap">
            <strong>Book a Service</strong>
            <small>Guaranteed delivery</small>
          </div>
          <ChevronRight size={14} className="action-caret" />
        </button>
      </div>
    </section>
  );
}
