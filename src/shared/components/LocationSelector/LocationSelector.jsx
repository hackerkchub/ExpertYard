import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiMapPin, FiNavigation, FiSearch, FiX, FiCheck, FiLoader, FiGlobe } from "react-icons/fi";
import { autocompleteLocation, reverseGeocode } from "../../api/userApi/locationDiscovery.api";
import "./LocationSelector.css";

const GLOBAL_LOCATION = {
  type: "global",
  displayName: "Global",
  city: "",
  area: "",
  state: "",
  country: "",
  pincode: "",
  latitude: null,
  longitude: null
};

export default function LocationSelector({ onLocationSelect, currentSelected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Selected location state (synced with localStorage)
  const [selectedLoc, setSelectedLoc] = useState(() => {
    try {
      const saved = localStorage.getItem("last_selected_location");
      return saved ? JSON.parse(saved) : GLOBAL_LOCATION;
    } catch {
      return GLOBAL_LOCATION;
    }
  });

  const searchInputRef = useRef(null);

  // Sync external state changes if any
  useEffect(() => {
    if (currentSelected) {
      setSelectedLoc(currentSelected);
    }
  }, [currentSelected]);

  // Sync state across multiple selector instances
  useEffect(() => {
    const handleLocationChange = (e) => {
      if (e.detail) {
        setSelectedLoc(e.detail);
      }
    };
    window.addEventListener("g9-location-changed", handleLocationChange);
    return () => window.removeEventListener("g9-location-changed", handleLocationChange);
  }, []);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await autocompleteLocation(searchTerm.trim());
        if (res.data?.success) {
          setSuggestions(res.data.data || []);
        }
      } catch (err) {
        console.error("Autocomplete fetch failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelect = (loc) => {
    let displayName = loc.search_text;
    if (!displayName) {
      if (loc.type === "global") {
        displayName = "Global";
      } else if (loc.type === "coordinates") {
        displayName = `Current Location (${Number(loc.latitude).toFixed(4)}, ${Number(loc.longitude).toFixed(4)})`;
      } else {
        displayName = `${loc.area ? loc.area + ', ' : ''}${loc.city}, ${loc.state}`;
      }
    }

    const formatted = {
      city: loc.city || "",
      area: loc.area || "",
      state: loc.state || "",
      country: loc.country || "",
      pincode: loc.pincode || "",
      latitude: loc.latitude ? Number(loc.latitude) : null,
      longitude: loc.longitude ? Number(loc.longitude) : null,
      type: loc.type || "city",
      displayName
    };

    setSelectedLoc(formatted);
    localStorage.setItem("last_selected_location", JSON.stringify(formatted));
    
    if (onLocationSelect) {
      onLocationSelect(formatted);
    }
    window.dispatchEvent(new CustomEvent("g9-location-changed", { detail: formatted }));
    setIsOpen(false);
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);
    setErrorMsg("");

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await reverseGeocode(latitude, longitude);
          if (res.data?.success && res.data.data) {
            const loc = res.data.data;
            const formatted = {
              city: loc.city || "",
              area: loc.area || "",
              state: loc.state || "",
              country: loc.country || "",
              pincode: loc.pincode || "",
              latitude: Number(latitude),
              longitude: Number(longitude),
              type: "coordinates",
              displayName: loc.search_text || `${loc.area ? loc.area + ', ' : ''}${loc.city}, ${loc.state}`
            };
            setSelectedLoc(formatted);
            localStorage.setItem("last_selected_location", JSON.stringify(formatted));
            if (onLocationSelect) {
              onLocationSelect(formatted);
            }
            setIsOpen(false);
          } else {
            const fallbackLoc = {
              city: "",
              area: "",
              state: "",
              country: "",
              pincode: "",
              latitude: Number(latitude),
              longitude: Number(longitude),
              type: "coordinates",
              displayName: `Current Location (${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)})`
            };
            setSelectedLoc(fallbackLoc);
            localStorage.setItem("last_selected_location", JSON.stringify(fallbackLoc));
            if (onLocationSelect) {
              onLocationSelect(fallbackLoc);
            }
            setIsOpen(false);
          }
        } catch (err) {
          console.error("Reverse geocoding failed", err);
          setErrorMsg("Could not resolve address. Using coordinates directly.");
          // Use coordinate fallback
          const rawLoc = {
            city: "",
            area: "",
            state: "",
            country: "",
            pincode: "",
            latitude: Number(latitude),
            longitude: Number(longitude),
            type: "coordinates",
            displayName: `Location (${Number(latitude).toFixed(4)}, ${Number(longitude).toFixed(4)})`
          };
          setSelectedLoc(rawLoc);
          localStorage.setItem("last_selected_location", JSON.stringify(rawLoc));
          if (onLocationSelect) {
            onLocationSelect(rawLoc);
          }
          setIsOpen(false);
        } finally {
          setGpsLoading(false);
        }
      },
      (error) => {
        setGpsLoading(false);
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMsg("Location permission denied. Please search manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMsg("GPS location unavailable. Please search manually.");
            break;
          case error.TIMEOUT:
            setErrorMsg("Request timed out. Please try again or search manually.");
            break;
          default:
            setErrorMsg("An error occurred. Please search manually.");
        }
      },
      options
    );
  };

  const handleClearLocation = (e) => {
    e.stopPropagation();
    setSelectedLoc(GLOBAL_LOCATION);
    localStorage.setItem("last_selected_location", JSON.stringify(GLOBAL_LOCATION));
    if (onLocationSelect) {
      onLocationSelect(GLOBAL_LOCATION);
    }
    window.dispatchEvent(new CustomEvent("g9-location-changed", { detail: GLOBAL_LOCATION }));
  };

  return (
    <div className="g9-location-selector-container">
      {/* Location Trigger Chip */}
      <button 
        type="button" 
        className={`g9-location-trigger-chip ${selectedLoc && selectedLoc.type !== 'global' ? 'active' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Select location"
      >
        <FiMapPin className="pin-icon" />
        <span className="location-name truncate">
          {selectedLoc && selectedLoc.type !== "global" ? selectedLoc.displayName : "Set Location"}
        </span>
        {selectedLoc && selectedLoc.type !== "global" && (
          <span className="clear-icon" onClick={handleClearLocation} aria-label="Clear location">
            <FiX />
          </span>
        )}
      </button>

      {/* Modal Dialog */}
      {isOpen && typeof document !== "undefined" && createPortal(
        <div className="g9-location-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="g9-location-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="g9-location-modal-header">
              <h3>Select Location</h3>
              <button type="button" className="close-btn" onClick={() => setIsOpen(false)}>
                <FiX />
              </button>
            </div>

            {/* Current Location / Geolocation Button */}
            <div className="g9-location-modal-body">
              <button 
                type="button" 
                className="g9-gps-btn"
                onClick={handleGetCurrentLocation}
                disabled={gpsLoading}
              >
                {gpsLoading ? (
                  <FiLoader className="spin action-icon" />
                ) : (
                  <FiNavigation className="action-icon" />
                )}
                <span>{gpsLoading ? "Detecting location..." : "Use Current Location / Near Me"}</span>
              </button>

              <button 
                type="button" 
                className="g9-gps-btn g9-global-location-btn"
                onClick={() => handleSelect({ type: "global", search_text: "Global" })}
                style={{ marginTop: "10px", background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)", color: "#ffffff" }}
              >
                <FiGlobe className="action-icon" />
                <span>Global (Show All Experts)</span>
              </button>

              {errorMsg && (
                <div className="g9-location-error">
                  {errorMsg}
                </div>
              )}

              {/* Search input field */}
              <div className="g9-location-search-box">
                <FiSearch className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search city, area, state, or pincode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {searchTerm && (
                  <button type="button" className="clear-search-btn" onClick={() => setSearchTerm("")}>
                    <FiX />
                  </button>
                )}
              </div>

              {/* Suggestions dropdown list */}
              <div className="g9-location-suggestions-container">
                {loading && (
                  <div className="g9-suggestions-loading">
                    <FiLoader className="spin" /> Searching...
                  </div>
                )}

                {!loading && suggestions.length > 0 && (
                  <ul className="g9-suggestions-list">
                    {suggestions.map((loc) => (
                      <li key={loc.id} onClick={() => handleSelect(loc)}>
                        <FiMapPin className="list-pin-icon" />
                        <div className="suggestion-details">
                          <span className="main-text">
                            {loc.type === "area" && loc.area}
                            {loc.type === "city" && loc.city}
                            {loc.type === "pincode" && loc.pincode}
                          </span>
                          <span className="sub-text">
                            {loc.type === "area" && `${loc.city}, ${loc.state}, ${loc.pincode}`}
                            {loc.type === "city" && `${loc.state}, ${loc.country}`}
                            {loc.type === "pincode" && `(${loc.city}, ${loc.state})`}
                          </span>
                        </div>
                        {selectedLoc && selectedLoc.displayName === loc.search_text && (
                          <FiCheck className="check-icon" />
                        )}
                      </li>
                    ))}
                  </ul>
                )}

                {!loading && searchTerm && suggestions.length === 0 && (
                  <div className="g9-no-suggestions">
                    No matching locations found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
