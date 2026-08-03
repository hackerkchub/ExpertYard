import React from "react";
import { Link } from "react-router-dom";
import { Film, Play, Eye, Heart, ArrowRight } from "lucide-react";
import HorizontalScroller from "./HorizontalScroller";
import "./ReelsSection.css";

const FALLBACK_REEL_THUMB = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80";

export default function ReelsSection({ reels = [] }) {
  if (!Array.isArray(reels) || reels.length === 0) return null;

  return (
    <section className="homepage-reels-section">
      <div className="reels-header">
        <div className="reels-header-left">
          <div className="reels-icon-badge">
            <Film size={20} />
          </div>
          <div>
            <h3 className="reels-title">Expert Short Reels</h3>
            <span className="reels-subtitle">Quick 60-second video tips from verified advisors</span>
          </div>
        </div>

        <Link to="/user/reels" className="reels-view-all">
          <span>Watch All Reels</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <HorizontalScroller className="reels-scroller">
        {reels.map((reel) => (
          <Link key={reel.id} to={`/user/reels?id=${reel.id}`} className="reel-card-item">
            <div className="reel-card-thumb-wrap">
              <img
                src={reel.thumbnail_url || FALLBACK_REEL_THUMB}
                alt={reel.title || "Expert Reel"}
                className="reel-card-thumb"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_REEL_THUMB;
                }}
              />
              <div className="reel-play-overlay">
                <Play size={20} className="play-icon" />
              </div>

              <div className="reel-card-top-badges">
                <div className="reel-stat-pill">
                  <Eye size={12} />
                  <span>{reel.views_count || 120}</span>
                </div>
              </div>

              <div className="reel-card-bottom-info">
                <p className="reel-card-title">{reel.title || reel.caption || "Expert Insights"}</p>
                <div className="reel-expert-meta">
                  <span>by {reel.expert_name || "G9Expert Advisor"}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </HorizontalScroller>
    </section>
  );
}
