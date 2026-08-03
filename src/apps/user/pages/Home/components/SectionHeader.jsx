import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Scale,
  Stethoscope,
  Briefcase,
  Activity,
  Cpu,
  GraduationCap,
  HeartHandshake,
  Grid3X3,
  ArrowRight,
} from "lucide-react";
import { getCategoryPath } from "../../../../../shared/utils/categoryRoutes";
import "./SectionHeader.css";

const CATEGORY_ICON_MAP = {
  astrology: Sparkles,
  astro: Sparkles,
  lawyer: Scale,
  legal: Scale,
  doctor: Stethoscope,
  medical: Stethoscope,
  business: Briefcase,
  yoga: Activity,
  health: Activity,
  technology: Cpu,
  it: Cpu,
  education: GraduationCap,
  relationship: HeartHandshake,
  marriage: HeartHandshake,
};

const getCategoryIcon = (name = "") => {
  const lower = name.toLowerCase();
  for (const [key, IconComp] of Object.entries(CATEGORY_ICON_MAP)) {
    if (lower.includes(key)) return IconComp;
  }
  return Grid3X3;
};

export default function SectionHeader({ category }) {
  if (!category) return null;

  const { id, name, slug, image } = category;
  const IconComponent = getCategoryIcon(name);
  const viewAllLink = getCategoryPath(category) || (slug ? `/user/category/${slug}` : `/user/category/${id}`);

  return (
    <div className="category-section-header">
      <div className="header-left-block">
     

        <div className="category-header-text">
          <h3 className="category-header-title">{name}</h3>
       
        </div>
      </div>

      <Link to={viewAllLink} className="category-view-all-btn">
        <span>View All</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
