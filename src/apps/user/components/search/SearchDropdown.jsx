import React from "react";

import SearchResultItem from "./SearchResultItem";
import { SEARCH_GROUPS } from "./searchUtils";

const SearchDropdown = ({
  activeIndex,
  error,
  flattenedResults,
  loading,
  onItemClick,
  onItemHover,
  results,
  showEmpty,
}) => (
  <div className="g9-search-dropdown" role="listbox" aria-label="Search suggestions">
    {loading ? (
      <div className="g9-search-loading" aria-live="polite">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="g9-search-skeleton" key={index}>
            <span />
            <div>
              <i />
              <i />
            </div>
          </div>
        ))}
      </div>
    ) : error ? (
      <div className="g9-search-state" role="status">
        Search is temporarily unavailable. Please try again.
      </div>
    ) : showEmpty ? (
      <div className="g9-search-state" role="status">
        No results found. Try searching another service.
      </div>
    ) : (
      SEARCH_GROUPS.map((group) => {
        const groupResults = results[group.key] || [];
        if (groupResults.length === 0) return null;

        return (
          <section className="g9-search-group" key={group.key} aria-label={group.label}>
            <h3>{group.label}</h3>
            {groupResults.map((item) => {
              const flatIndex = flattenedResults.findIndex((entry) => entry.item === item);
              const key = flattenedResults[flatIndex]?.key || `${group.key}-${flatIndex}`;

              return (
                <SearchResultItem
                  key={key}
                  group={group.key}
                  item={item}
                  active={activeIndex === flatIndex}
                  onClick={() => onItemClick(group.key, item)}
                  onMouseEnter={() => onItemHover(flatIndex)}
                />
              );
            })}
          </section>
        );
      })
    )}
  </div>
);

export default SearchDropdown;
