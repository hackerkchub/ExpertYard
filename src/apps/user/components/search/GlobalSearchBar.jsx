import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

import { globalSearch } from "../../../../shared/api/userApi/searchV2.api";
import SearchDropdown from "./SearchDropdown";
import {
  buildUserSearchPath,
  flattenResults,
  getLocationDisplayName,
  getResultPath,
  getStoredLocationQuery,
  normalizeGlobalResults,
  normalizeSearchTerm,
} from "./searchUtils";
import "./GlobalSearch.css";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY = 400;

const emptyResults = {
  experts: [],
  categories: [],
  locations: [],
  subcategories: [],
};

const GlobalSearchBar = ({ className = "", onSearch, placeholder = "Search doctors, lawyers, astrologers, career experts..." }) => {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const requestIdRef = useRef(0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(emptyResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedQuery = normalizeSearchTerm(query);
  const flattenedResults = useMemo(() => flattenResults(results), [results]);
  const hasResults = flattenedResults.length > 0;
  const showDropdown = open && (trimmedQuery.length >= MIN_QUERY_LENGTH || loading || error);
  const showEmpty = trimmedQuery.length >= MIN_QUERY_LENGTH && !loading && !error && !hasResults;

  useEffect(() => {
    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      setResults(emptyResults);
      setLoading(false);
      setError(false);
      setActiveIndex(-1);
      return undefined;
    }

    const controller = new AbortController();
    const requestId = ++requestIdRef.current;

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await globalSearch({
          q: trimmedQuery,
          limit: 5,
          location: getStoredLocationQuery() || undefined,
          signal: controller.signal,
        });

        if (requestId !== requestIdRef.current) return;

        setResults(normalizeGlobalResults(response));
        setActiveIndex(-1);
      } catch (err) {
        if (controller.signal.aborted || requestId !== requestIdRef.current) return;
        setResults(emptyResults);
        setError(true);
      } finally {
        if (requestId === requestIdRef.current && !controller.signal.aborted) {
          setLoading(false);
          setOpen(true);
        }
      }
    }, SEARCH_DELAY);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  const navigateToSearch = () => {
    if (!trimmedQuery) return;
    setOpen(false);
    onSearch?.(trimmedQuery);
    navigate(buildUserSearchPath(trimmedQuery));
  };

  const navigateToResult = (group, item) => {
    setOpen(false);
    if (group === "locations") {
      const formatted = {
        city: item?.city || "",
        area: item?.area || "",
        state: item?.state || "",
        country: item?.country || "",
        pincode: item?.pincode || "",
        latitude: item?.latitude ? Number(item.latitude) : null,
        longitude: item?.longitude ? Number(item.longitude) : null,
        type: item?.type || "city",
        displayName: getLocationDisplayName(item),
      };
      localStorage.setItem("last_selected_location", JSON.stringify(formatted));
      window.dispatchEvent(new CustomEvent("g9-location-changed", { detail: formatted }));
      navigate(buildUserSearchPath(formatted.displayName, "location"));
      return;
    }
    navigate(getResultPath(group, item));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (activeIndex >= 0 && flattenedResults[activeIndex]) {
      const activeResult = flattenedResults[activeIndex];
      navigateToResult(activeResult.group, activeResult.item);
      return;
    }
    navigateToSearch();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        if (!hasResults) return -1;
        return current >= flattenedResults.length - 1 ? 0 : current + 1;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        if (!hasResults) return -1;
        return current <= 0 ? flattenedResults.length - 1 : current - 1;
      });
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults(emptyResults);
    setError(false);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className={`g9-global-search ${className}`} ref={rootRef}>
      <form className="g9-global-search__form" onSubmit={handleSubmit} role="search">
        <span className="g9-global-search__icon" aria-hidden="true">
          <FiSearch />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search experts, categories, and services"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            className="g9-global-search__clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
        <button type="submit" className="g9-global-search__submit">
          Search
        </button>
      </form>

      {showDropdown && (
        <SearchDropdown
          activeIndex={activeIndex}
          error={error}
          flattenedResults={flattenedResults}
          loading={loading}
          onItemClick={navigateToResult}
          onItemHover={setActiveIndex}
          results={results}
          showEmpty={showEmpty}
        />
      )}
    </div>
  );
};

export default GlobalSearchBar;
