import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

const FALLBACK_SERVICE_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420' viewBox='0 0 640 420'><rect width='100%' height='100%' fill='%23eef4ff'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='28' fill='%23000080'>G9 Expert Service</text></svg>";
const SCROLL_DISTANCE = 300;

const fallbackServices = [
  {
    id: "legal",
    slug: "legal",
    titleKey: "home.popularServices.fallbackServices.legalTitle",
    descriptionKey: "home.popularServices.fallbackServices.legalDescription",
  },
  {
    id: "health",
    slug: "health",
    titleKey: "home.popularServices.fallbackServices.healthTitle",
    descriptionKey: "home.popularServices.fallbackServices.healthDescription",
  },
  {
    id: "astrology",
    slug: "astrology",
    titleKey: "home.popularServices.fallbackServices.astrologyTitle",
    descriptionKey: "home.popularServices.fallbackServices.astrologyDescription",
  },
  {
    id: "business",
    slug: "business",
    titleKey: "home.popularServices.fallbackServices.businessTitle",
    descriptionKey: "home.popularServices.fallbackServices.businessDescription",
  },
  {
    id: "career",
    slug: "career-guidance",
    titleKey: "home.popularServices.fallbackServices.careerTitle",
    descriptionKey: "home.popularServices.fallbackServices.careerDescription",
  },
  {
    id: "finance",
    slug: "finance",
    titleKey: "home.popularServices.fallbackServices.financeTitle",
    descriptionKey: "home.popularServices.fallbackServices.financeDescription",
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

function getServiceName(service, t) {
  return (service?.titleKey ? t(service.titleKey) : "") || service?.title || service?.name || service?.service_name || "Professional Service";
}

function getServiceSlug(service, t) {
  return service?.slug?.trim() || toSeoSlug(getServiceName(service, t)) || String(service?.id || "");
}

function getServiceDescription(service, t) {
  const description = (service?.descriptionKey ? t(service.descriptionKey) : service?.description)?.trim();

  if (description) {
    return description.length > 104 ? `${description.substring(0, 104)}...` : description;
  }

  return t("home.popularServices.fallbackDescription", { service: getServiceName(service, t) });
}

function getServiceIcon(service, t) {
  const haystack = `${service?.id || ""} ${getServiceName(service, t)} ${service?.category_name || ""}`.toLowerCase();
  return serviceIconMap.find((item) => item.match.some((keyword) => haystack.includes(keyword)))?.icon || FiMessageCircle;
}

const PopularServices = ({ services = [], loading = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
          <span className="section-kicker">{t("home.popularServices.kicker")}</span>
          <h2 id="popular-services-title">{t("home.popularServices.title")}</h2>
        </div>
        <button type="button" className="section-link" onClick={() => navigate("/user/all-services")}>
          {t("common.viewAll")}
        </button>
      </div>

      <SliderShell>
        <ScrollArrow
          type="button"
          className="scroll-arrow scroll-arrow--left"
          $hidden={!scrollState.canScrollLeft}
          onClick={scrollLeft}
          aria-label={t("home.popularServices.previousAria")}
          disabled={!scrollState.canScrollLeft}
        >
          <FiChevronLeft aria-hidden="true" />
        </ScrollArrow>

        <CardsTrack ref={containerRef} aria-label={t("home.popularServices.sliderAria")}>
          {loading && services.length === 0
            ? Array.from({ length: 6 }).map((_, index) => <ServiceSkeleton key={index} aria-hidden="true" />)
            : visibleServices.map((service, index) => {
                const Icon = getServiceIcon(service, t);
                const serviceName = getServiceName(service, t);
                const slug = getServiceSlug(service, t);
                const servicePath = slug ? `/user/service-details/${slug}` : "/user/all-services";

                return (
                  <ServiceCard key={service.id || slug || serviceName} to={servicePath}>
                    <div className="service-card__media">
                      {service.image ? (
                        <img
                          src={service.image || FALLBACK_SERVICE_IMAGE}
                          alt={t("home.popularServices.imageAlt", { service: serviceName })}
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
                        <p>{getServiceDescription(service, t)}</p>
                      </div>

                      <div className="service-card__footer">
                        <span>{expertMap[service.expert_id] || t("home.popularServices.trustedExpert")}</span>
                        <strong>{t("home.popularServices.consultNow")}</strong>
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
          aria-label={t("home.popularServices.nextAria")}
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
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
  padding: 22px 0 18px;
  content-visibility: auto;
  contain-intrinsic-size: 360px;

  .section-topline {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    padding: 0 24px 14px;
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
    margin: 8px 0 0;
    color: #111827;
    font-size: clamp(1.45rem, 2.2vw, 2rem);
    line-height: 1.15;
    font-weight: 800;
    letter-spacing: 0;
  }

  .services-subtitle {
    max-width: 680px;
    margin: 7px 0 0;
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
    border-radius: 20px;
    padding: 16px 0 12px;
    contain-intrinsic-size: 318px;

    .section-topline {
      padding: 0 14px 10px;
      flex-direction: column;
      gap: 10px;
    }

    h2 {
      margin-top: 7px;
      font-size: 1.32rem;
    }

    .services-subtitle {
      font-size: 0.9rem;
      line-height: 1.48;
    }
  }

  @media (max-width: 768px) {
    .section-topline {
      align-items: flex-start;
      gap: 14px;
    }

    .section-link {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      max-width: 100%;
      min-height: 42px;
      padding: 0 clamp(14px, 4vw, 18px);
      border: 1px solid rgba(0, 0, 128, 0.1);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.72);
      color: #000080;
      font-size: 0.86rem;
      font-weight: 800;
      line-height: 1;
      white-space: nowrap;
      text-align: center;
      box-shadow: 0 8px 18px rgba(0, 0, 128, 0.04);
    }

    .section-link:hover,
    .section-link:focus-visible {
      color: #1b2ba6;
      border-color: rgba(0, 0, 128, 0.1);
      box-shadow: 0 8px 18px rgba(0, 0, 128, 0.04);
    }
  }

  @media (max-width: 640px) {
    .section-topline {
      gap: 12px;
      padding-bottom: 14px;
    }

  }

  @media (max-width: 360px) {
    .section-link {
      min-width: 0;
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
  gap: 18px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 24px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 24px 8px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 1180px) {
    gap: 20px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    gap: 16px;
    scroll-padding-inline: 20px;
    padding: 4px 20px 8px;
  }

  @media (max-width: 640px) {
    gap: 12px;
    scroll-padding-inline: 14px;
    padding: 3px 14px 4px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 12px;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior-x: contain;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-overflow-scrolling: touch;
    touch-action: pan-x pan-y;
    padding: 2px 14px 10px;
  }

  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ScrollArrow = styled.button`
  position: absolute;
  top: calc(50% + 2px);
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
  box-shadow: 0 16px 30px rgba(0, 0, 128, 0.22);
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
    box-shadow: 0 20px 38px rgba(0, 0, 128, 0.3);
  }

  &:disabled {
    cursor: default;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ServiceCard = styled(Link)`
  display: flex;
  flex-direction: column;
  flex: 0 0 calc((100% - 60px) / 4);
  min-width: 248px;
  min-height: 274px;
  scroll-snap-align: start;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  background: #ffffff;
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 0, 128, 0.18);
    box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
  }

  .service-card__media {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 108px;
    background:
      radial-gradient(circle at 70% 24%, rgba(244, 197, 66, 0.34), transparent 34%),
      linear-gradient(135deg, #eef4ff, #fff8df);
    overflow: hidden;
  }

  .service-card__media img {
    width: 100%;
    height: 124px;
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
    width: 60px;
    height: 60px;
    border-radius: 18px;
    background: #ffffff;
    color: #000080;
    box-shadow: 0 16px 30px rgba(0, 0, 128, 0.12);
  }

  .service-card__icon svg {
    width: 28px;
    height: 28px;
  }

  .service-card__body {
    flex: 1;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 14px;
    padding: 15px;
  }

  .service-card__body > div:first-child {
    display: flex;
    flex-direction: column;
  }

  h3 {
    margin: 0;
    color: #101828;
    min-height: 2.6em;
    font-size: 1rem;
    line-height: 1.3;
    font-weight: 800;
    letter-spacing: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  p {
    margin: 7px 0 0;
    color: #5b6678;
    min-height: 4.5em;
    font-size: 0.88rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .service-card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
    margin-top: auto;
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
    min-height: 34px;
    border-radius: 999px;
    background: #000080;
    color: #ffffff;
    padding: 0 12px;
    font-size: 0.8rem;
    font-weight: 800;
    box-shadow: 0 12px 22px rgba(0, 0, 128, 0.18);
  }

  @media (min-width: 1024px) and (max-width: 1179px) {
    flex-basis: calc((100% - 36px) / 3);
    min-width: 250px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    flex-basis: calc((100% - 16px) / 2);
    min-width: 0;
  }

  @media (max-width: 640px) {
    flex-basis: calc(100% - 28px);
    min-width: 0;
    min-height: 0;
    border-radius: 18px;

    .service-card__body {
      min-height: 144px;
      gap: 12px;
      padding: 14px;
    }

    .service-card__media img {
      height: 108px;
    }

    .service-card__media {
      min-height: 104px;
    }

    h3 {
      min-height: 2.52em;
      font-size: 0.98rem;
      line-height: 1.26;
    }

    p {
      margin-top: 6px;
      min-height: 2.84em;
      font-size: 0.84rem;
      line-height: 1.42;
      -webkit-line-clamp: 2;
    }

    .service-card__footer {
      align-items: flex-end;
    }

    .service-card__footer strong {
      min-height: 32px;
      padding: 0 11px;
      font-size: 0.76rem;
    }
  }

  @media (max-width: 768px) {
    display: flex;
    flex: 0 0 calc((100% - 12px) / 2);
    flex-direction: column;
    width: calc((100% - 12px) / 2);
    min-width: 0;
    max-width: calc((100% - 12px) / 2);
    height: 100%;
    min-height: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    border-radius: 18px;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);

    .service-card__media {
      min-height: 92px;
    }

    .service-card__media img {
      height: 96px;
    }

    .service-card__icon {
      width: 46px;
      height: 46px;
      border-radius: 15px;
    }

    .service-card__icon svg {
      width: 22px;
      height: 22px;
    }

    .service-card__body {
      flex: 1;
      min-height: 0;
      gap: 10px;
      padding: 12px;
    }

    h3 {
      min-height: 2.5em;
      font-size: 0.88rem;
      line-height: 1.25;
    }

    p {
      margin-top: 5px;
      min-height: 2.8em;
      font-size: 0.78rem;
      line-height: 1.4;
      -webkit-line-clamp: 2;
    }

    .service-card__footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
    }

    .service-card__footer span {
      width: 100%;
      max-width: 100%;
      font-size: 0.72rem;
    }

    .service-card__footer strong {
      min-height: 30px;
      padding: 0 10px;
      font-size: 0.72rem;
    }
  }
`;

const ServiceSkeleton = styled.div`
  flex: 0 0 calc((100% - 60px) / 4);
  min-width: 248px;
  min-height: 274px;
  scroll-snap-align: start;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.08);
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    height: 124px;
    background: linear-gradient(100deg, #edf2f7 0%, #f8fafc 48%, #edf2f7 100%);
    background-size: 220% 100%;
    animation: shimmer 1.3s ease-in-out infinite;
  }

  &::after {
    content: "";
    display: block;
    height: 104px;
    margin: 15px;
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

  @media (min-width: 1024px) and (max-width: 1179px) {
    flex-basis: calc((100% - 36px) / 3);
    min-width: 250px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    flex-basis: calc((100% - 16px) / 2);
    min-width: 0;
  }

  @media (max-width: 640px) {
    flex-basis: calc(100% - 28px);
    min-width: 0;
    min-height: 252px;
  }

  @media (max-width: 768px) {
    flex: 0 0 calc((100% - 12px) / 2);
    width: calc((100% - 12px) / 2);
    min-width: 0;
    max-width: calc((100% - 12px) / 2);
    min-height: 220px;
    scroll-snap-align: start;
  }
`;
