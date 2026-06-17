import React from "react";
import { FiArrowRight, FiBriefcase, FiGrid, FiMapPin, FiStar } from "react-icons/fi";

import { getInitials } from "./searchUtils";

const getText = (...values) => values.find((value) => String(value || "").trim()) || "";

const SearchResultItem = ({ group, item, active, onClick, onMouseEnter }) => {
  const name = getText(item?.name, item?.full_name, item?.expert_name, item?.title);
  const image = getText(item?.profile_photo, item?.profile_image, item?.image_url, item?.icon_url, item?.image);

  if (group === "experts") {
    const position = getText(item?.position, item?.speciality, item?.specialty, item?.title);
    const location = getText(item?.location, item?.city, item?.state);
    const category = getText(item?.category_name, item?.subcategory_name, item?.sub_category_name);
    const rating = getText(item?.rating, item?.avg_rating, item?.average_rating);

    return (
      <button
        type="button"
        className={`g9-search-result ${active ? "g9-search-result--active" : ""}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <span className="g9-search-result__avatar">
          {image ? <img src={image} alt={name} loading="lazy" /> : <span>{getInitials(name)}</span>}
        </span>
        <span className="g9-search-result__body">
          <strong>{name || "Verified Expert"}</strong>
          {position && <small>{position}</small>}
          <span className="g9-search-result__meta">
            {location && (
              <span>
                <FiMapPin aria-hidden="true" />
                {location}
              </span>
            )}
            {category && <span>{category}</span>}
            {rating && (
              <span>
                <FiStar aria-hidden="true" />
                {rating}
              </span>
            )}
          </span>
        </span>
        <span className="g9-search-result__cta">View Profile</span>
      </button>
    );
  }

  if (group === "categories") {
    const description = getText(item?.meta_title, item?.meta_desc, item?.description);

    return (
      <button
        type="button"
        className={`g9-search-result ${active ? "g9-search-result--active" : ""}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <span className="g9-search-result__avatar g9-search-result__avatar--icon">
          {image ? <img src={image} alt={name} loading="lazy" /> : <FiGrid aria-hidden="true" />}
        </span>
        <span className="g9-search-result__body">
          <strong>{name || "Expert Category"}</strong>
          {description && <small>{description}</small>}
        </span>
        <span className="g9-search-result__cta">Explore</span>
      </button>
    );
  }

  if (group === "locations") {
    const displayName = getText(item?.search_text, item?.displayName, item?.area, item?.city, item?.pincode);
    const detail = [
      item?.area && item?.city ? item.city : "",
      item?.state,
      item?.pincode,
    ].filter(Boolean).join(", ");

    return (
      <button
        type="button"
        className={`g9-search-result ${active ? "g9-search-result--active" : ""}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
      >
        <span className="g9-search-result__avatar g9-search-result__avatar--icon">
          <FiMapPin aria-hidden="true" />
        </span>
        <span className="g9-search-result__body">
          <strong>{displayName || "Location"}</strong>
          <small>{detail || "Location"}</small>
        </span>
        <span className="g9-search-result__cta">Set Location</span>
      </button>
    );
  }

  const parent = getText(item?.category_name, item?.parent_category_name);

  return (
    <button
      type="button"
      className={`g9-search-result ${active ? "g9-search-result--active" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <span className="g9-search-result__avatar g9-search-result__avatar--icon">
        <FiBriefcase aria-hidden="true" />
      </span>
      <span className="g9-search-result__body">
        <strong>{name || "Expert Service"}</strong>
        {parent && <small>{parent}</small>}
      </span>
      <span className="g9-search-result__cta">
        Explore <FiArrowRight aria-hidden="true" />
      </span>
    </button>
  );
};

export default SearchResultItem;
