import React from "react";
import { FiAward, FiSearch } from "react-icons/fi";
import ExpertCard from "./ExpertCard";

export default function ExpertSection({
  experts,
  processedExperts,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  serviceBasePrice,
  onBookExpert,
  onAutoBook
}) {
  return (
    <section id="experts-section" className="msp-section-card">
      <div className="msp-section-header-bar">
        <h2 className="msp-section-title">
          <FiAward className="msp-section-title-icon" />
          Recommended Experts ({processedExperts.length})
        </h2>

        {/* SEARCH & SORT FILTERS */}
        <div className="msp-filter-controls">
          <div className="msp-search-input-wrapper">
            <FiSearch className="msp-search-icon" />
            <input
              type="text"
              placeholder="Search expert by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="msp-search-input"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="msp-sort-select"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="sla_asc">SLA: Fastest Delivery</option>
            <option value="rating_desc">Rating: Highest First</option>
          </select>
        </div>
      </div>

      {/* EXPERT LIST / GRID / CAROUSEL */}
      {processedExperts.length === 0 ? (
        <div className="msp-empty-experts">
          <p>No experts match your search criteria. You can proceed with instant auto-assignment.</p>
          <button
            type="button"
            className="msp-btn-primary"
            onClick={onAutoBook}
            style={{ margin: "14px auto 0", maxWidth: 300 }}
          >
            Book with Top Verified Expert
          </button>
        </div>
      ) : (
        <div className="msp-experts-grid">
          {processedExperts.map((exp) => (
            <ExpertCard
              key={exp.id || exp.expert_id}
              expert={exp}
              serviceBasePrice={serviceBasePrice}
              onBookExpert={onBookExpert}
            />
          ))}
        </div>
      )}
    </section>
  );
}
