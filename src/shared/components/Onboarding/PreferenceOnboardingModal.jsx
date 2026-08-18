import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiMapPin,
  FiNavigation,
  FiSearch,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiLoader,
  FiZap,
  FiDollarSign,
  FiGlobe,
  FiAlertCircle
} from "react-icons/fi";
import {
  getUserPreferencesApi,
  updateUserPreferencesApi,
  fetchCatalogCategoriesApi,
  fetchCatalogSubcategoriesApi,
  fetchCatalogServicesApi
} from "../../api/userApi/userPreferences.api";
import { reverseGeocode, autocompleteLocation } from "../../api/userApi/locationDiscovery.api";
import "./PreferenceOnboardingModal.css";

const LANGUAGES = [
  { code: "English", name: "English" },
  { code: "Hindi", name: "Hindi (हिंदी)" },
  { code: "Hinglish", name: "Hinglish" },
  { code: "Marathi", name: "Marathi (मराठी)" },
  { code: "Gujarati", name: "Gujarati (ગુજરાતી)" },
  { code: "Bengali", name: "Bengali (বাংলা)" },
  { code: "Tamil", name: "Tamil (தமிழ்)" },
  { code: "Telugu", name: "Telugu (తెలుగు)" },
  { code: "Kannada", name: "Kannada (કન્નડ)" }
];

export default function PreferenceOnboardingModal({ isOpen, onClose, onSaveSuccess }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Catalog Data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);

  // Selected State
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  // Location State
  const [locationStatus, setLocationStatus] = useState("idle"); // 'idle' | 'detecting' | 'detected' | 'failed' | 'manual'
  const [detectedCity, setDetectedCity] = useState("");
  const [detectedState, setDetectedState] = useState("");
  const [detectedPincode, setDetectedPincode] = useState("");
  const [manualCityInput, setManualCityInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [searchingCity, setSearchingCity] = useState(false);

  // Language & Budget State
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  // Load catalog data when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const loadCatalog = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const cats = await fetchCatalogCategoriesApi();
        if (isMounted) {
          setCategories(cats || []);
          if ((cats || []).length === 0) {
            setErrorMsg("Unable to load categories. Please check your internet connection and try again.");
          }
        }
      } catch (err) {
        if (isMounted) setErrorMsg("Failed to load category data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // When selected categories change, fetch relevant subcategories & clean up un-selected subcategories
  useEffect(() => {
    if (selectedCategoryIds.length === 0) {
      setSubcategories([]);
      setSelectedSubcategoryIds([]);
      setServices([]);
      setSelectedServiceIds([]);
      return;
    }

    let isMounted = true;

    const loadSubcategories = async () => {
      try {
        const subs = await fetchCatalogSubcategoriesApi(selectedCategoryIds);
        if (isMounted) {
          setSubcategories(subs || []);

          // Automatically prune selected subcategories that no longer belong to selected categories
          const validSubIds = (subs || []).map((s) => s.id);
          setSelectedSubcategoryIds((prev) => prev.filter((id) => validSubIds.includes(id)));
        }
      } catch (err) {
        console.error("Subcategory fetch error:", err);
      }
    };

    loadSubcategories();

    return () => {
      isMounted = false;
    };
  }, [selectedCategoryIds]);

  // When selected subcategories change, fetch relevant services
  useEffect(() => {
    if (selectedSubcategoryIds.length === 0 && selectedCategoryIds.length === 0) {
      setServices([]);
      setSelectedServiceIds([]);
      return;
    }

    let isMounted = true;

    const loadServices = async () => {
      try {
        const srvs = await fetchCatalogServicesApi(selectedSubcategoryIds, selectedCategoryIds);
        if (isMounted) {
          setServices(srvs || []);

          // Prune selected services that no longer match selected subcategories
          const validSrvIds = (srvs || []).map((s) => s.id);
          setSelectedServiceIds((prev) => prev.filter((id) => validSrvIds.includes(id)));
        }
      } catch (err) {
        console.error("Services fetch error:", err);
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, [selectedSubcategoryIds, selectedCategoryIds]);

  // City autocomplete search
  useEffect(() => {
    if (!manualCityInput || manualCityInput.trim().length < 2) {
      setCitySuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingCity(true);
      try {
        const res = await autocompleteLocation(manualCityInput.trim());
        if (res.data?.success) {
          setCitySuggestions(res.data.data || []);
        }
      } catch (err) {
        console.error("City autocomplete error:", err);
      } finally {
        setSearchingCity(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [manualCityInput]);

  // Auto-detect Geolocation on Step 4 (Location)
  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("failed");
      return;
    }

    setLocationStatus("detecting");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await reverseGeocode(latitude, longitude);
          if (res.data?.success && res.data.data) {
            const loc = res.data.data;
            setDetectedCity(loc.city || loc.area || "");
            setDetectedState(loc.state || "");
            setDetectedPincode(loc.pincode || "");
            setLocationStatus("detected");
          } else {
            setLocationStatus("failed");
          }
        } catch (err) {
          console.error("Location geocoding error:", err);
          setLocationStatus("failed");
        }
      },
      (err) => {
        console.warn("Geolocation permission or error:", err.message);
        setLocationStatus("failed");
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  useEffect(() => {
    if (step === 4 && locationStatus === "idle") {
      autoDetectLocation();
    }
  }, [step, locationStatus]);

  // Category Toggle
  const toggleCategory = (catId) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // Subcategory Toggle
  const toggleSubcategory = (subId) => {
    setSelectedSubcategoryIds((prev) =>
      prev.includes(subId) ? prev.filter((id) => id !== subId) : [...prev, subId]
    );
  };

  // Service Toggle
  const toggleService = (srvId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(srvId) ? prev.filter((id) => id !== srvId) : [...prev, srvId]
    );
  };

  // Save Preferences API Submission
  const handleSave = async () => {
    setSaving(true);
    setErrorMsg("");

    const finalCity =
      locationStatus === "detected"
        ? detectedCity
        : manualCityInput.trim() || detectedCity || "";

    const payload = {
      categoryIds: selectedCategoryIds,
      subcategoryIds: selectedSubcategoryIds,
      serviceIds: selectedServiceIds,
      defaultLocation: {
        city: finalCity,
        pincode: detectedPincode || ""
      },
      preferredLanguage: preferredLanguage || null,
      maxBudget: maxBudget ? Number(maxBudget) : null
    };

    try {
      const res = await updateUserPreferencesApi(payload);
      if (res?.success) {
        if (onSaveSuccess) onSaveSuccess(res.data);
        if (onClose) onClose();
      } else {
        setErrorMsg(res?.message || "Failed to save preferences. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error saving preferences.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const totalSteps = 5;

  return (
    <div className="pref-modal-overlay">
      <div className="pref-modal-container">
        {/* Header */}
        <div className="pref-modal-header">
          <div className="pref-brand-badge">
            <FiZap className="pref-sparkle-icon" />
            <span>G9Expert Personalization</span>
          </div>
          <button className="pref-close-btn" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="pref-progress-wrapper">
          <div className="pref-progress-bar" style={{ width: `${(step / totalSteps) * 100}%` }} />
          <span className="pref-progress-text">Step {step} of {totalSteps}</span>
        </div>

        {/* Body */}
        <div className="pref-modal-body">
          {errorMsg && (
            <div className="pref-error-banner">
              <FiAlertCircle />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="pref-loading-state">
              <FiLoader className="pref-spinner" />
              <p>Loading catalog options...</p>
            </div>
          ) : (
            <>
              {/* STEP 1: CATEGORIES */}
              {step === 1 && (
                <div className="pref-step-content">
                  <h2 className="pref-step-title">What are you looking for?</h2>
                  <p className="pref-step-subtitle">
                    Select one or more categories that interest you to customize your experience.
                  </p>

                  <div className="pref-category-grid">
                    {categories.map((cat) => {
                      const isSelected = selectedCategoryIds.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={`pref-chip-card ${isSelected ? "selected" : ""}`}
                          onClick={() => toggleCategory(cat.id)}
                        >
                          <div className="pref-chip-info">
                            {cat.image_url && (
                              <img src={cat.image_url} alt="" className="pref-chip-icon" />
                            )}
                            <span className="pref-chip-name">{cat.name}</span>
                          </div>
                          {isSelected && <FiCheck className="pref-check-icon" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: SUBCATEGORIES */}
              {step === 2 && (
                <div className="pref-step-content">
                  <h2 className="pref-step-title">What exactly do you need?</h2>
                  <p className="pref-step-subtitle">
                    {selectedCategoryIds.length > 0
                      ? "Choose subcategories matching your selected categories."
                      : "Please go back and select a category first."}
                  </p>

                  {selectedCategoryIds.length === 0 ? (
                    <div className="pref-empty-notice">
                      <p>No category selected. Please go back to Step 1 and choose a category.</p>
                    </div>
                  ) : subcategories.length === 0 ? (
                    <div className="pref-empty-notice">
                      <p>Loading or no subcategories found for your selection.</p>
                    </div>
                  ) : (
                    <div className="pref-subcat-group-list">
                      {/* Group subcategories by category */}
                      {categories
                        .filter((cat) => selectedCategoryIds.includes(cat.id))
                        .map((cat) => {
                          const catSubcats = subcategories.filter(
                            (s) => Number(s.category_id) === Number(cat.id)
                          );
                          if (catSubcats.length === 0) return null;
                          return (
                            <div key={cat.id} className="pref-cat-section">
                              <h3 className="pref-cat-section-title">{cat.name}</h3>
                              <div className="pref-chip-grid">
                                {catSubcats.map((sub) => {
                                  const isSelected = selectedSubcategoryIds.includes(sub.id);
                                  return (
                                    <button
                                      key={sub.id}
                                      type="button"
                                      className={`pref-chip-item ${isSelected ? "selected" : ""}`}
                                      onClick={() => toggleSubcategory(sub.id)}
                                    >
                                      <span>{sub.name}</span>
                                      {isSelected && <FiCheck className="pref-check-icon" />}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: OPTIONAL SERVICES */}
              {step === 3 && (
                <div className="pref-step-content">
                  <h2 className="pref-step-title">Which services are you interested in?</h2>
                  <p className="pref-step-subtitle">
                    Optional: Pick specific master services to get faster recommendations.
                  </p>

                  {services.length === 0 ? (
                    <div className="pref-empty-notice">
                      <p>No specific service catalog items for these subcategories. You can skip to the next step!</p>
                    </div>
                  ) : (
                    <div className="pref-chip-grid">
                      {services.map((srv) => {
                        const isSelected = selectedServiceIds.includes(srv.id);
                        return (
                          <button
                            key={srv.id}
                            type="button"
                            className={`pref-chip-card service-chip ${isSelected ? "selected" : ""}`}
                            onClick={() => toggleService(srv.id)}
                          >
                            <div className="pref-chip-info">
                              <span className="pref-chip-name">{srv.title}</span>
                              {srv.price && <span className="pref-service-price">₹{srv.price}</span>}
                            </div>
                            {isSelected && <FiCheck className="pref-check-icon" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: LOCATION */}
              {step === 4 && (
                <div className="pref-step-content">
                  <h2 className="pref-step-title">Where are you located?</h2>
                  <p className="pref-step-subtitle">
                    We use your location to show relevant local experts and top services near you.
                  </p>

                  {locationStatus === "detecting" && (
                    <div className="pref-location-card detecting">
                      <FiLoader className="pref-spinner" />
                      <div>
                        <strong>Detecting your location...</strong>
                        <p>Requesting GPS permission from your browser</p>
                      </div>
                    </div>
                  )}

                  {locationStatus === "detected" && (
                    <div className="pref-location-card detected">
                      <FiMapPin className="pref-loc-pin" />
                      <div className="pref-loc-details">
                        <span className="pref-loc-tag">📍 Detected Location</span>
                        <strong>{detectedCity}{detectedState ? `, ${detectedState}` : ""}</strong>
                      </div>
                      <button
                        type="button"
                        className="pref-loc-change-btn"
                        onClick={() => setLocationStatus("manual")}
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {(locationStatus === "failed" || locationStatus === "manual") && (
                    <div className="pref-location-manual">
                      {locationStatus === "failed" && (
                        <div className="pref-loc-notice">
                          <FiAlertCircle />
                          <span>Location detection unavailable or permission denied. Enter your city manually:</span>
                        </div>
                      )}

                      <div className="pref-search-box">
                        <FiSearch className="pref-search-icon" />
                        <input
                          type="text"
                          className="pref-search-input"
                          placeholder="Search your city or pincode..."
                          value={manualCityInput}
                          onChange={(e) => setManualCityInput(e.target.value)}
                        />
                        {searchingCity && <FiLoader className="pref-spinner right" />}
                      </div>

                      {citySuggestions.length > 0 && (
                        <div className="pref-city-suggestions">
                          {citySuggestions.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="pref-suggestion-item"
                              onClick={() => {
                                setManualCityInput(item.city || item.search_text);
                                setDetectedCity(item.city || item.search_text);
                                if (item.pincode) setDetectedPincode(item.pincode);
                                setCitySuggestions([]);
                                setLocationStatus("detected");
                              }}
                            >
                              <FiMapPin />
                              <span>{item.search_text || `${item.city}, ${item.state}`}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        className="pref-retry-gps-btn"
                        onClick={autoDetectLocation}
                      >
                        <FiNavigation /> Try GPS Auto-Detect
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: PERSONALIZATION (LANGUAGE & BUDGET) */}
              {step === 5 && (
                <div className="pref-step-content">
                  <h2 className="pref-step-title">Personalize your experience</h2>
                  <p className="pref-step-subtitle">
                    Optional preferences for preferred language and maximum budget limit.
                  </p>

                  <div className="pref-field-group">
                    <label className="pref-field-label">
                      <FiGlobe /> Preferred Language
                    </label>
                    <div className="pref-chip-grid">
                      {LANGUAGES.map((lang) => {
                        const isSelected = preferredLanguage === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            className={`pref-chip-item ${isSelected ? "selected" : ""}`}
                            onClick={() => setPreferredLanguage(isSelected ? "" : lang.code)}
                          >
                            <span>{lang.name}</span>
                            {isSelected && <FiCheck className="pref-check-icon" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pref-field-group" style={{ marginTop: "24px" }}>
                    <label className="pref-field-label">
                      <FiDollarSign /> Maximum Budget Limit (Optional)
                    </label>
                    <input
                      type="number"
                      className="pref-text-input"
                      placeholder="e.g. 5000 (₹)"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(e.target.value)}
                      min="0"
                    />
                    <span className="pref-field-hint">Helps match expert consultation rates within your preferred budget.</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="pref-modal-footer">
          {step > 1 ? (
            <button
              type="button"
              className="pref-btn pref-btn-secondary"
              onClick={() => setStep((prev) => prev - 1)}
              disabled={saving}
            >
              <FiChevronLeft /> Back
            </button>
          ) : (
            <span />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              className="pref-btn pref-btn-primary"
              onClick={() => setStep((prev) => prev + 1)}
              disabled={loading}
            >
              Continue <FiChevronRight />
            </button>
          ) : (
            <button
              type="button"
              className="pref-btn pref-btn-save"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <FiLoader className="pref-spinner" /> Saving...
                </>
              ) : (
                <>
                  Save Preferences <FiCheck />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
