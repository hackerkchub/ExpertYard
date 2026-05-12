import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiHome,
  FiMessageCircle,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import { usePublicExpert } from "../../context/PublicExpertContext";

const FALLBACK_SERVICE_IMAGE = "https://via.placeholder.com/640x420?text=Service";
const SCROLL_DISTANCE = 300;

const fallbackServices = [
  {
    id: "legal",
    title: "Legal",
    description: "Get practical legal guidance, documentation direction, and next steps from verified professionals.",
  },
  {
    id: "health",
    title: "Health",
    description: "Connect with trusted health and wellness experts for lifestyle and general guidance.",
  },
  {
    id: "astrology",
    title: "Astrology",
    description: "Consult astrologers for personal guidance, compatibility, timing, and life direction.",
  },
  {
    id: "business",
    title: "Business",
    description: "Speak with consultants for startup, operations, marketing, and growth decisions.",
  },
  {
    id: "career",
    title: "Career Guidance",
    description: "Plan interviews, resumes, job switches, and professional growth with expert support.",
  },
  {
    id: "finance",
    title: "Finance",
    description: "Get money management, budgeting, investment awareness, and planning guidance.",
  },
];

const serviceIconMap = [
  { match: ["legal", "law"], icon: FiBriefcase },
  { match: ["health", "doctor", "wellness", "fitness"], icon: FiHeart },
  { match: ["astro", "kundli", "horoscope"], icon: FiStar },
  { match: ["business", "startup", "marketing"], icon: FiTrendingUp },
  { match: ["property", "real estate"], icon: FiHome },
];

function toSeoSlug(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getServiceName(service) {
  return service?.title || service?.name || service?.service_name || "Professional Service";
}

function getServiceSlug(service) {
  return service?.slug?.trim() || toSeoSlug(getServiceName(service)) || String(service?.id || "");
}

function getServiceDescription(service) {
  const description = service?.description?.trim();

  if (description) {
    return description.length > 104 ? `${description.substring(0, 104)}...` : description;
  }

  return `Get instant ${getServiceName(service)} advice from trusted professionals.`;
}

function getServiceIcon(service) {
  const haystack = `${getServiceName(service)} ${service?.category_name || ""}`.toLowerCase();
  return serviceIconMap.find((item) => item.match.some((keyword) => haystack.includes(keyword)))?.icon || FiMessageCircle;
}

const PopularServices = ({ services = [], loading = false }) => {
  const navigate = useNavigate();
  const { experts } = usePublicExpert();
  const containerRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const expertMap = useMemo(() => {
    const map = {};

    if (Array.isArray(experts)) {
      experts.forEach((expert) => {
        map[expert.id] = expert.name;
      });
    }

    return map;
  }, [experts]);

  const visibleServices = useMemo(() => {
    const list = services.length > 0 ? services : fallbackServices;
    return list.slice(0, 12);
  }, [services]);

  const updateScrollState = () => {
    const container = containerRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    setScrollState({
      canScrollLeft: container.scrollLeft > 4,
      canScrollRight: maxScroll > 4 && container.scrollLeft < maxScroll - 4,
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    updateScrollState();
    container.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [loading, visibleServices.length]);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -SCROLL_DISTANCE, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: SCROLL_DISTANCE, behavior: "smooth" });
  };

  return (
    <SectionWrapper aria-labelledby="popular-services-title">
      <div className="section-topline">
        <div>
          <span className="section-kicker">Popular Services</span>
          <h2 id="popular-services-title">Popular Expert Services</h2>
          <p className="services-subtitle">
            Choose from a wide range of expert services and connect instantly with trusted professionals.
          </p>
        </div>
        <button type="button" className="section-link" onClick={() => navigate("/user/all-services")}>
          View All
        </button>
      </div>

      <SliderShell>
        <ScrollArrow
          type="button"
          className="scroll-arrow scroll-arrow--left"
          $hidden={!scrollState.canScrollLeft}
          onClick={scrollLeft}
          aria-label="Previous popular expert services"
          disabled={!scrollState.canScrollLeft}
        >
          <FiChevronLeft aria-hidden="true" />
        </ScrollArrow>

        <CardsTrack ref={containerRef} aria-label="Popular expert services slider">
          {loading && services.length === 0
            ? Array.from({ length: 6 }).map((_, index) => <ServiceSkeleton key={index} aria-hidden="true" />)
            : visibleServices.map((service, index) => {
                const Icon = getServiceIcon(service);
                const serviceName = getServiceName(service);
                const slug = getServiceSlug(service);
                const servicePath = slug ? `/user/service-details/${slug}` : "/user/all-services";

                return (
                  <ServiceCard key={service.id || slug || serviceName} to={servicePath}>
                    <div className="service-card__media">
                      {service.image ? (
                        <img
                          src={service.image || FALLBACK_SERVICE_IMAGE}
                          alt={`Consult for ${serviceName}`}
                          loading="lazy"
                          decoding="async"
                          fetchPriority={index < 2 ? "high" : "auto"}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_SERVICE_IMAGE;
                          }}
                        />
                      ) : (
                        <span className="service-card__icon" aria-hidden="true">
                          <Icon />
                        </span>
                      )}
                    </div>

                    <div className="service-card__body">
                      <div>
                        <h3>{serviceName}</h3>
                        <p>{getServiceDescription(service)}</p>
                      </div>

                      <div className="service-card__footer">
                        <span>{expertMap[service.expert_id] || "Trusted Expert"}</span>
                        <strong>Consult Now</strong>
                      </div>
                    </div>
                  </ServiceCard>
                );
              })}
        </CardsTrack>

        <ScrollArrow
          type="button"
          className="scroll-arrow scroll-arrow--right"
          $hidden={!scrollState.canScrollRight}
          onClick={scrollRight}
          aria-label="Next popular expert services"
          disabled={!scrollState.canScrollRight}
        >
          <FiChevronRight aria-hidden="true" />
        </ScrollArrow>
      </SliderShell>
    </SectionWrapper>
  );
};

export default PopularServices;

const SectionWrapper = styled.section`
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 28px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.96)),
    radial-gradient(circle at 12% 8%, rgba(244, 197, 66, 0.16), transparent 30%);
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.08);
  padding: 24px 0 26px;
  content-visibility: auto;
  contain-intrinsic-size: 390px;

  .section-topline {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    padding: 0 24px 18px;
  }

  .section-kicker {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    background: rgba(0, 0, 128, 0.08);
    color: #000080;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  h2 {
    margin: 10px 0 0;
    color: #111827;
    font-size: clamp(1.45rem, 2.2vw, 2rem);
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: 0;
  }

  .services-subtitle {
    max-width: 680px;
    margin: 8px 0 0;
    color: #5b6678;
    font-size: 0.98rem;
    line-height: 1.6;
  }

  .section-link {
    flex: 0 0 auto;
    min-height: 40px;
    border: 1px solid rgba(0, 0, 128, 0.14);
    border-radius: 999px;
    background: #ffffff;
    color: #000080;
    padding: 0 16px;
    font: inherit;
    font-size: 0.9rem;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
    transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  }

  .section-link:hover {
    transform: translateY(-1px);
    border-color: rgba(0, 0, 128, 0.28);
    box-shadow: 0 14px 28px rgba(15, 23, 42, 0.1);
  }

  @media (max-width: 640px) {
    border-radius: 22px;
    padding: 20px 0 22px;

    .section-topline {
      padding: 0 16px 14px;
      flex-direction: column;
      gap: 12px;
    }

    .services-subtitle {
      font-size: 0.92rem;
    }
  }
`;

const SliderShell = styled.div`
  position: relative;
  min-width: 0;
`;

const CardsTrack = styled.div`
  display: flex;
  align-items: stretch;
  gap: 20px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 24px 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 640px) {
    gap: 16px;
    padding: 4px 16px 8px;
  }
`;

const ScrollArrow = styled.button`
  position: absolute;
  top: 50%;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.66);
  border-radius: 999px;
  background: #000080;
  color: #ffffff;
  box-shadow: 0 18px 34px rgba(0, 0, 128, 0.22);
  cursor: pointer;
  transform: translateY(-50%) ${({ $hidden }) => ($hidden ? "scale(0.94)" : "scale(1)")};
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
  transition: opacity 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;

  &.scroll-arrow--left {
    left: 10px;
  }

  &.scroll-arrow--right {
    right: 10px;
  }

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 2.8;
  }

  &:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.06);
    box-shadow: 0 22px 42px rgba(0, 0, 128, 0.3);
  }

  &:disabled {
    cursor: default;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

const ServiceCard = styled(Link)`
  flex: 0 0 min(284px, 78vw);
  min-height: 292px;
  scroll-snap-align: start;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  background: #ffffff;
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 0, 128, 0.18);
    box-shadow: 0 22px 46px rgba(15, 23, 42, 0.13);
  }

  .service-card__media {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 118px;
    background:
      radial-gradient(circle at 70% 24%, rgba(244, 197, 66, 0.34), transparent 34%),
      linear-gradient(135deg, #eef4ff, #fff8df);
    overflow: hidden;
  }

  .service-card__media img {
    width: 100%;
    height: 132px;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  &:hover .service-card__media img {
    transform: scale(1.04);
  }

  .service-card__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 66px;
    height: 66px;
    border-radius: 20px;
    background: #ffffff;
    color: #000080;
    box-shadow: 0 16px 30px rgba(0, 0, 128, 0.12);
  }

  .service-card__icon svg {
    width: 30px;
    height: 30px;
  }

  .service-card__body {
    min-height: 174px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    padding: 18px;
  }

  h3 {
    margin: 0;
    color: #101828;
    font-size: 1.05rem;
    line-height: 1.3;
    font-weight: 800;
    letter-spacing: 0;
  }

  p {
    margin: 8px 0 0;
    color: #5b6678;
    font-size: 0.9rem;
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .service-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .service-card__footer span {
    min-width: 0;
    color: #667085;
    font-size: 0.78rem;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .service-card__footer strong {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    border-radius: 999px;
    background: #000080;
    color: #ffffff;
    padding: 0 13px;
    font-size: 0.82rem;
    font-weight: 800;
    box-shadow: 0 12px 22px rgba(0, 0, 128, 0.18);
  }

  @media (min-width: 1180px) {
    flex-basis: 292px;
  }

  @media (max-width: 640px) {
    flex-basis: 82vw;
    min-height: 278px;
    border-radius: 20px;

    .service-card__body {
      min-height: 164px;
      padding: 16px;
    }

    .service-card__media img {
      height: 122px;
    }
  }
`;

const ServiceSkeleton = styled.div`
  flex: 0 0 min(284px, 78vw);
  min-height: 292px;
  scroll-snap-align: start;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    height: 132px;
    background: linear-gradient(100deg, #edf2f7 0%, #f8fafc 48%, #edf2f7 100%);
    background-size: 220% 100%;
    animation: shimmer 1.3s ease-in-out infinite;
  }

  &::after {
    content: "";
    display: block;
    height: 118px;
    margin: 18px;
    border-radius: 16px;
    background:
      linear-gradient(#edf2f7, #edf2f7) 0 0 / 78% 18px no-repeat,
      linear-gradient(#edf2f7, #edf2f7) 0 38px / 100% 12px no-repeat,
      linear-gradient(#edf2f7, #edf2f7) 0 60px / 74% 12px no-repeat,
      linear-gradient(#edf2f7, #edf2f7) 0 98px / 46% 18px no-repeat;
  }

  @keyframes shimmer {
    100% {
      background-position: -220% 0;
    }
  }

  @media (min-width: 1180px) {
    flex-basis: 292px;
  }

  @media (max-width: 640px) {
    flex-basis: 82vw;
    min-height: 278px;
  }
`;
