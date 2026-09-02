import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Search,
  X,
  MapPin,
  Star,
  ArrowLeft,
  RefreshCw,
  SlidersHorizontal,
  RotateCcw,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Briefcase,
  CheckCircle2,
  HelpCircle as HelpIcon,
  ChevronRight,
  Mic
} from "lucide-react";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import PremiumCenterLoader from "../../../../shared/components/Loader/PremiumCenterLoader";
import { askG9Api } from "../../../../shared/api/userApi/ai.api";
import { getExpertPath, getInitials } from "../../components/search/searchUtils";
import "./SearchResultsPage.css";

// Helper: Dynamically resolve expert profile image URL with backend origin handling
export const resolveExpertProfileImage = (expert) => {
  if (!expert || typeof expert !== "object") return null;
  const rawUrl = expert.profile_photo || expert.profile_image || expert.image_url || expert.avatar || expert.photo;
  if (!rawUrl || typeof rawUrl !== "string") return null;

  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // Prepend API base URL host if relative path like /uploads/photo.jpg
  const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
  const cleanBase = baseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  return `${cleanBase}${cleanPath}`;
};

const getOrCreateSessionConvId = () => {
  try {
    let convId = sessionStorage.getItem("g9_search_session_id");
    if (!convId) {
      convId = `conv_search_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem("g9_search_session_id", convId);
    }
    return convId;
  } catch {
    return `conv_search_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
};

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(urlQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [experts, setExperts] = useState([]);
  const [services, setServices] = useState([]);
  const [activeFilters, setActiveFilters] = useState([]);
  const [intentSummary, setIntentSummary] = useState("");
  const [aiUnderstanding, setAiUnderstanding] = useState("");
  const [didYouMean, setDidYouMean] = useState(null);
  const [message, setMessage] = useState("");
  const [needsClarification, setNeedsClarification] = useState(false);
  const [clarifyingOptions, setClarifyingOptions] = useState([]);

  // Voice recognition and image fallback states
  const [isListening, setIsListening] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState({});
  const recognitionRef = useRef(null);

  // Microphone Voice Search Handler (Shared Home Page Speech Recognition logic)
  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setSearchInput(transcript);
      };

      recognition.onerror = (err) => {
        console.warn("[VOICE_SEARCH] Error:", err?.error || err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("[VOICE_SEARCH] Failed to start:", err);
      setIsListening(false);
    }
  };

  const handleImageError = (expId) => {
    setFailedImageIds((prev) => ({ ...prev, [expId]: true }));
  };

  // Race condition & request sequence safeguards
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);
  const searchInputRef = useRef(null);

  const executeSearch = useCallback(async (queryText, options = {}) => {
    const currentReqId = ++requestIdRef.current;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    // Stale result protection: Clear previous results immediately
    setExperts([]);
    setServices([]);
    setError(false);
    setDidYouMean(null);

    try {
      const convId = getOrCreateSessionConvId();
      console.log(`[ASK_G9][FE_REQUEST] requestId=${currentReqId} conversationId="${convId}" message="${queryText}"`);
      const data = await askG9Api(queryText, convId, {
        remove_filter: options.remove_filter || null,
        reset_context: options.reset_context || false,
        signal: controller.signal,
      });

      if (currentReqId !== requestIdRef.current) return;

      if (data?.success) {
        if (data.conversation_id) {
          sessionStorage.setItem("g9_search_session_id", data.conversation_id);
        }
        console.log(`[ASK_G9][FE_SERVICE_RENDER] responseServiceCount=${data.services?.length || 0} responseServiceIds=${JSON.stringify((data.services || []).map(s => s.id))}`);
        setExperts(data.experts || []);
        setServices(data.services || []);
        setActiveFilters(data.active_filters || []);
        setIntentSummary(data.intent_summary || "");
        setAiUnderstanding(data.ai_understanding || data.message || "Search results");
        setDidYouMean(data.did_you_mean || null);
        setMessage(data.message || "");
        setClarifyingOptions(data.clarifying_options || []);
        setNeedsClarification(data.needs_clarification || false);
      } else {
        setError(true);
        setMessage(data?.message || "Failed to load search results.");
      }
    } catch (err) {
      if (controller.signal?.aborted || currentReqId !== requestIdRef.current) return;
      console.error("[SEARCH_PAGE] Search error:", err);
      setError(true);
      setMessage("We encountered an error while searching. Please try again.");
    } finally {
      if (currentReqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Re-run search whenever URL q parameter changes
  useEffect(() => {
    if (urlQuery) {
      setSearchInput(urlQuery);
      executeSearch(urlQuery);
    } else {
      setSearchInput("");
      setExperts([]);
      setServices([]);
      setActiveFilters([]);
      setIntentSummary("");
      setAiUnderstanding("");
      setDidYouMean(null);
      setMessage("");
      setNeedsClarification(false);
      setClarifyingOptions([]);
      setError(false);
      setLoading(false);
    }
  }, [urlQuery, executeSearch]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    setSearchParams({ q });
    executeSearch(q);
  };

  const handleRemoveFilter = (filterKey) => {
    executeSearch("", { remove_filter: filterKey });
  };

  const handleNewSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    requestIdRef.current++;

    sessionStorage.removeItem("g9_search_session_id");
    setSearchInput("");
    setExperts([]);
    setServices([]);
    setActiveFilters([]);
    setIntentSummary("");
    setAiUnderstanding("");
    setDidYouMean(null);
    setMessage("");
    setNeedsClarification(false);
    setClarifyingOptions([]);
    setError(false);
    setLoading(false);

    setSearchParams({}, { replace: true });

    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 50);
  };

  const handleCategoryFilterClick = (queryVal) => {
    setSearchInput(queryVal);
    setSearchParams({ q: queryVal });
    executeSearch(queryVal);
  };

  return (
    <div className="g9-fullwidth-search-container">
      {/* Search Header Bar */}
      <header className="g9-search-header-bar">
        <button
          type="button"
          className="g9-search-back-btn"
          onClick={() => navigate("/user")}
          aria-label="Back to home"
        >
          <ArrowLeft size={20} />
        </button>

        <form className="g9-main-search-form" onSubmit={handleSearchSubmit}>
          <Search size={20} className="g9-search-input-icon" />
          <input
            ref={searchInputRef}
            type="text"
            className="g9-main-search-input"
            placeholder={isListening ? "Listening... Speak your query..." : "Search experts, services, categories..."}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button
              type="button"
              className="g9-search-clear-btn"
              onClick={() => setSearchInput("")}
              aria-label="Clear input"
            >
              <X size={18} />
            </button>
          )}

          {/* Microphone Voice Search Button */}
          <button
            type="button"
            className={`g9-search-mic-btn ${isListening ? "listening" : ""}`}
            onClick={startVoiceSearch}
            title={isListening ? "Listening... Click to stop" : "Voice Search"}
            aria-label="Voice Search"
          >
            <Mic size={18} className={isListening ? "animate-pulse" : ""} />
          </button>

          <button type="submit" className="g9-search-action-submit-btn" disabled={loading}>
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
            <span>Search</span>
          </button>
        </form>

        <button
          type="button"
          className="g9-reset-search-btn"
          onClick={handleNewSearch}
          title="Reset search session"
        >
          <RotateCcw size={16} />
          <span>New Search</span>
        </button>
      </header>

      {/* "Did You Mean?" Typo Suggestion Banner */}
      {didYouMean && !loading && (
        <div className="g9-did-you-mean-banner">
          <div className="g9-did-you-mean-text">
            <HelpIcon size={18} color="#0284c7" />
            <span>Did you mean <strong>"{didYouMean.suggested}"</strong>?</span>
          </div>
          <button
            type="button"
            className="g9-did-you-mean-btn"
            onClick={() => handleCategoryFilterClick(didYouMean.suggested)}
          >
            Search "{didYouMean.suggested}"
          </button>
        </div>
      )}

      {/* AI Understanding Banner */}
      {aiUnderstanding && !loading && (
        <div className="g9-ai-understanding-banner">
          <div className="g9-ai-badge">
            <Sparkles size={16} />
            <span>Ask G9 AI</span>
          </div>
          {intentSummary && <p className="g9-ai-intent-summary">"{intentSummary}"</p>}
          <p className="g9-ai-text">{aiUnderstanding}</p>
        </div>
      )}

      {/* Active Filter Chips Bar */}
      {activeFilters.length > 0 && (
        <div className="g9-active-filters-bar">
          <span className="g9-filters-label">Active Filters:</span>
          <div className="g9-chips-wrapper">
            {activeFilters.map((chip) => (
              <span key={chip.key} className="g9-filter-chip">
                <span>{chip.label}</span>
                <button
                  type="button"
                  className="g9-chip-remove"
                  onClick={() => handleRemoveFilter(chip.key)}
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="g9-clear-all-chip"
              onClick={handleNewSearch}
            >
              Reset All
            </button>
          </div>
        </div>
      )}

      {/* Related Services Section (Shown when matching services exist) */}
      {!loading && !error && services.length > 0 && (
        <section className="g9-related-services-section">
          <div className="g9-section-header">
            <h3 className="g9-section-title">
              <Briefcase size={18} />
              <span>Related Services</span>
            </h3>
          </div>
          <div className="g9-services-grid">
            {services.map((service) => (
              <div
                key={`service-${service.id || service.slug}`}
                className="g9-service-card"
                onClick={() => navigate(`/user/service-details/${service.slug || service.id}`)}
              >
                <div className="g9-service-info">
                  <h4>{service.title || service.name}</h4>
                  <p>{service.description || service.category_name}</p>
                  {service.price && <span className="g9-service-price">₹{service.price}</span>}
                </div>
                <ChevronRight size={16} className="g9-service-arrow" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Expert Results Section */}
      <section className="g9-expert-results-section">
        {!loading && experts.length > 0 && (
          <div className="g9-results-sub-header">
            <div className="g9-results-count-title">
              <h3>Expert Results</h3>
              <span className="g9-count-tag">Showing {experts.length} verified experts</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <PremiumCenterLoader />}

        {/* Needs Clarification State */}
        {!loading && needsClarification && (
          <div className="g9-clarification-box">
            <div className="g9-clarification-header">
              <HelpCircle size={22} color="#000080" />
              <h3>{message || "What specific expert or service are you looking for?"}</h3>
            </div>
            {clarifyingOptions.length > 0 && (
              <div className="g9-clarification-options">
                {clarifyingOptions.map((opt, idx) => {
                  const label = typeof opt === "string" ? opt : opt.label || opt.query;
                  const queryVal = typeof opt === "string" ? opt : opt.query || opt.label;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className="g9-option-btn"
                      onClick={() => handleCategoryFilterClick(queryVal)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="g9-search-error-box">
            <AlertCircle size={32} color="#dc2626" />
            <p>{message || "We encountered an issue fetching search results."}</p>
            <button type="button" className="g9-retry-btn" onClick={() => executeSearch(urlQuery)}>
              Retry Search
            </button>
          </div>
        )}

        {/* Expert Cards Grid */}
        {!loading && !error && experts.length > 0 && (
          <div className="g9-expert-grid">
            {experts.map((expert) => {
              const name = expert.name || expert.full_name || "Verified Expert";
              const expId = expert.expert_id || expert.id || expert.slug;
              const photoUrl = !failedImageIds[expId] ? resolveExpertProfileImage(expert) : null;
              const rating = expert.avg_rating || expert.rating || expert.average_rating;
              const reviews = expert.total_reviews || expert.review_count || 0;
              const position = expert.position || expert.speciality || expert.subcategory_name || "G9 Expert Professional";
              const locationText = expert.location || (expert.city ? (expert.area ? `${expert.area}, ${expert.city}` : expert.city) : "");
              const expertSlug = expert.slug || expert.expert_slug || expert.id || expert.expert_id;
              const matchPct = expert.match_percentage || "95% Match";
              const matchReasons = expert.match_reasons || [];

              return (
                <div key={`expert-${expert.expert_id || expert.id || expertSlug}`} className="g9-expert-card">
                  <div className="g9-expert-card-top-bar">
                    <span className="g9-relevance-chip" title="Search relevance score">
                      <CheckCircle2 size={12} />
                      <span>{matchPct}</span>
                    </span>
                  </div>

                  <div className="g9-expert-card-header">
                    <div className="g9-expert-avatar">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={name}
                          loading="lazy"
                          onError={() => handleImageError(expId)}
                        />
                      ) : (
                        <span>{getInitials(name)}</span>
                      )}
                    </div>

                    <div className="g9-expert-info">
                      <div className="g9-expert-name-row">
                        <h4 className="g9-expert-name">{name}</h4>
                        {expert.is_subscribed && (
                          <span className="g9-verified-badge" title="Verified Expert">
                            <UserCheck size={14} />
                          </span>
                        )}
                      </div>
                      <p className="g9-expert-position">{position}</p>
                      {expert.category_name && (
                        <span className="g9-category-tag">{expert.category_name}</span>
                      )}
                    </div>
                  </div>

                  {/* Match Reasons Tags */}
                  {matchReasons.length > 0 && (
                    <div className="g9-match-reasons-chips">
                      {matchReasons.map((reason, rIdx) => (
                        <span key={rIdx} className="g9-reason-chip">
                          ✓ {reason}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="g9-expert-card-body">
                    {locationText && (
                      <div className="g9-expert-meta-item">
                        <MapPin size={14} />
                        <span>{locationText}</span>
                      </div>
                    )}
                    {rating > 0 && (
                      <div className="g9-expert-meta-item">
                        <Star size={14} className="g9-star-icon" />
                        <span>{rating} ({reviews} reviews)</span>
                      </div>
                    )}
                  </div>

                  {/* Single View Profile Action Button (No Call/Chat buttons on search page) */}
                  <div className="g9-expert-card-footer">
                    <button
                      type="button"
                      className="g9-expert-view-profile-btn"
                      onClick={() => navigate(getExpertPath(expert))}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Controlled Empty State */}
        {!loading && !error && !needsClarification && experts.length === 0 && services.length === 0 && (
          <div className="g9-empty-state-card">
            <AlertCircle size={40} className="g9-empty-icon" />
            <h3>No matching experts found</h3>
            <p className="g9-empty-desc">
              {aiUnderstanding || "We couldn't find any experts matching your active search constraints."}
            </p>
            <div className="g9-empty-actions">
              {activeFilters.length > 0 && (
                <button type="button" className="g9-empty-btn" onClick={handleNewSearch}>
                  <RotateCcw size={16} />
                  <span>Start New Search</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
