import React from "react";
import SectionHeader from "./SectionHeader";
import HorizontalScroller from "./HorizontalScroller";
import ServiceCard from "./ServiceCard";
import ExpertCard from "./ExpertCard";
import "./CategorySection.css";

export default function CategorySection({ category }) {
  if (!category) return null;

  const { services = [], experts = [] } = category;

  if (services.length === 0 && experts.length === 0) {
    return null; // Skip empty category blocks
  }

  return (
    <section className="category-block-section">
      <SectionHeader category={category} />

      {/* MASTER SERVICES CAROUSEL */}
      {services.length > 0 && (
        <div className="category-subsection">
          <div className="subsection-label-row">
            <h4 className="subsection-title">Services</h4>
          </div>

          <HorizontalScroller className="services-scroller">
            {services.map((svc) => (
              <ServiceCard key={svc.id || svc.slug} service={svc} />
            ))}
          </HorizontalScroller>
        </div>
      )}

      {/* TOP EXPERTS CAROUSEL */}
      {experts.length > 0 && (
        <div className="category-subsection">
          <div className="subsection-label-row">
            <h4 className="subsection-title">Top Experts</h4>
            <span className="subsection-count">{experts.length} verified</span>
          </div>

          <HorizontalScroller className="experts-scroller">
            {experts.map((exp) => (
              <ExpertCard key={exp.id || exp.slug} expert={exp} />
            ))}
          </HorizontalScroller>
        </div>
      )}
    </section>
  );
}
