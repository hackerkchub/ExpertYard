import {
  FiCpu,
  FiHeart,
  FiUsers,
  FiBriefcase,
  FiSmile,
  FiActivity,
  FiGlobe,
} from "react-icons/fi";

export const CATEGORY_ICON_MAP = {
  engineers: FiCpu,
  doctors: FiHeart,
  mentors: FiUsers,
  lawyers: FiBriefcase,
  therapists: FiSmile,
  fitness: FiActivity,
  business: FiBriefcase,
  global: FiGlobe,
};

export const prettyLabel = (key) =>
  key.charAt(0).toUpperCase() + key.slice(1);
