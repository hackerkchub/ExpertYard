import React from "react";

export default function HomeSkeleton() {
  return (
    <div className="home-page">
      <div className="home-layout">
        {/* Sidebar Skeleton */}
        <aside className="home-sidebar">
          <div className="home-sidebar-nav skeleton-sidebar">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="skeleton-nav-item">
                <div className="skeleton-icon" />
                <div className="skeleton-text" />
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="home-main">
          {/* Banner Skeleton */}
          <div className="hero-banner hero-banner-loading">
            <div className="hero-content">
              <div className="hero-badge-skeleton" />
              <div className="hero-title-skeleton" />
              <div className="hero-subtitle-skeleton" />
              <div className="hero-actions-skeleton">
                <div />
                <div />
                <div />
              </div>
              <div className="hero-stats-skeleton">
                <div />
                <div />
                <div />
              </div>
            </div>
            <div className="hero-image-skeleton" />
          </div>

          {/* Categories Skeleton */}
          <section className="category-section">
            <div className="category-section-header">
              <div className="skeleton-text" style={{ width: 200, height: 20 }} />
              <div className="skeleton-text" style={{ width: 60, height: 14 }} />
            </div>
            <div className="category-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="category-item">
                  <div className="category-circle" style={{ background: "#e2e8f0" }} />
                  <span className="category-name">Loading</span>
                </div>
              ))}
            </div>
          </section>

          {/* Card Skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-line" style={{ width: "30%", height: 20 }} />
              <div className="skeleton-line" style={{ width: "70%", height: 16 }} />
              <div className="skeleton-line" style={{ width: "90%", height: 14 }} />
              <div className="skeleton-line" style={{ width: "50%", height: 40 }} />
            </div>
          ))}
        </main>

        {/* Right Sidebar Skeleton */}
        <aside className="home-right-sidebar">
          <div className="skeleton-wallet">
            <div className="skeleton-line" style={{ width: "50%", height: 16 }} />
            <div className="skeleton-line" style={{ width: "60%", height: 32 }} />
            <div className="skeleton-line" style={{ width: "40%", height: 14 }} />
            <div className="skeleton-line" style={{ width: "80%", height: 40 }} />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-expert">
              <div className="skeleton-avatar" />
              <div className="skeleton-info">
                <div className="skeleton-line" style={{ width: "60%", height: 14 }} />
                <div className="skeleton-line" style={{ width: "40%", height: 12 }} />
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* Bottom Nav Skeleton */}
      <nav className="bottom-nav">
        <div className="bottom-nav-items">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bottom-nav-item">
              <div className="skeleton-icon" style={{ width: 22, height: 22 }} />
              <div className="skeleton-text" style={{ width: 30, height: 10 }} />
            </div>
          ))}
        </div>
      </nav>

      <style>{`
        .skeleton-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 10px;
        }
        .skeleton-icon {
          width: 20px;
          height: 20px;
          background: #e2e8f0;
          border-radius: 4px;
        }
        .skeleton-text {
          height: 14px;
          background: #e2e8f0;
          border-radius: 4px;
          flex: 1;
        }
        .skeleton-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .skeleton-line {
          height: 14px;
          background: #e2e8f0;
          border-radius: 4px;
        }
        .skeleton-wallet {
          background: linear-gradient(135deg, #e2e8f0, #f1f5f9);
          border-radius: 16px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .skeleton-expert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
        }
        .skeleton-avatar {
          width: 48px;
          height: 48px;
          background: #e2e8f0;
          border-radius: 50%;
        }
        .skeleton-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 4px 12px;
        }
        @media (max-width: 992px) {
          .home-sidebar { display: none; }
          .home-right-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}