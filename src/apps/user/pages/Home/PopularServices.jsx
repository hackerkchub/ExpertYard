import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { usePublicExpert } from "../../context/PublicExpertContext";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";

const FALLBACK_SERVICE_IMAGE = "https://via.placeholder.com/640x420?text=Service";

const PopularServices = () => {
  const navigate = useNavigate();
  const { experts } = usePublicExpert();
  const servicesRowRef = useRef(null);

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("popular_services_cache");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(services.length === 0);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const fetchServices = useCallback(async (signal) => {
      try {
        const res = await axios.get("https://softmaxs.com/api/services", {
        signal,
        });

      if (res.data?.success) {
          const freshData = res.data.data || [];
          setServices(freshData);
          localStorage.setItem("popular_services_cache", JSON.stringify(freshData));
        }
      } catch (err) {
        if (!axios.isCancel(err) && err.name !== "CanceledError") {
          console.error("Error fetching services:", err);
        }
      } finally {
      setLoading(false);
      }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const hasIdleCallback = typeof window !== "undefined" && "requestIdleCallback" in window;
    const scheduledTask = hasIdleCallback
      ? window.requestIdleCallback(() => fetchServices(controller.signal), { timeout: 1200 })
      : window.setTimeout(() => fetchServices(controller.signal), 180);

    return () => {
      controller.abort();

      if (hasIdleCallback) {
        window.cancelIdleCallback(scheduledTask);
      } else {
        window.clearTimeout(scheduledTask);
      }
    };
  }, [fetchServices]);

  useNetworkReconnect(() => fetchServices());

  const expertMap = useMemo(() => {
    const map = {};

    if (Array.isArray(experts)) {
      experts.forEach((expert) => {
        map[expert.id] = expert.name;
      });
    }

    return map;
  }, [experts]);

  const visibleServices = useMemo(() => services.slice(0, 10), [services]);

  useEffect(() => {
    const row = servicesRowRef.current;
    if (!row) return undefined;

    const updateScrollState = () => {
      const maxScroll = row.scrollWidth - row.clientWidth;
      setScrollState({
        canScrollLeft: row.scrollLeft > 2,
        canScrollRight: maxScroll > 2 && row.scrollLeft < maxScroll - 2,
      });
    };

    updateScrollState();
    row.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      row.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [loading, visibleServices.length]);

  const scrollServices = (direction) => {
    const row = servicesRowRef.current;
    if (!row) return;

    const card = row.firstElementChild;
    const gap = Number.parseFloat(window.getComputedStyle(row).columnGap || "0") || 0;
    const cardWidth = card?.getBoundingClientRect().width || row.clientWidth / 2;

    row.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) * 2 : (cardWidth + gap) * 2,
      behavior: "smooth",
    });
  };

  return (
    <SectionWrapper>
      <div className="section-topline">
        <div>
          <span className="section-kicker">Services</span>
          <h2>Popular Services</h2>
          <p className="services-subtitle">Ready-to-book services from verified professionals</p>
        </div>
        <button type="button" className="section-link" onClick={() => navigate("/user/all-services")}>
          View All
        </button>
      </div>

      <ServiceScrollShell>
        <ScrollArrow
          type="button"
          $side="left"
          $hidden={!scrollState.canScrollLeft}
          onClick={() => scrollServices("left")}
          aria-label="Scroll services left"
          disabled={!scrollState.canScrollLeft}
        >
          <FiChevronLeft aria-hidden="true" />
        </ScrollArrow>

        <HorizontalScrollContainer ref={servicesRowRef}>
          {loading && visibleServices.length === 0
            ? Array.from({ length: 5 }).map((_, index) => (
                <ServiceSkeleton key={index} aria-hidden="true">
                  <div className="media" />
                  <div className="line title" />
                  <div className="line copy" />
                  <div className="line footer" />
                </ServiceSkeleton>
              ))
            : visibleServices.map((service, index) => (
                <ServiceCard
                  key={service.id}
                  onClick={() => navigate(`/user/service-details/${service.slug || service.id}`)}
                >
                  <ImageContainer>
                    <img
                      src={service.image || FALLBACK_SERVICE_IMAGE}
                      alt={service.title || "Service"}
                      loading="lazy"
                      decoding="async"
                      fetchPriority={index < 2 ? "high" : "auto"}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_SERVICE_IMAGE;
                      }}
                    />
                    <span className="service-badge">Verified service</span>
                  </ImageContainer>

                  <CardBody>
                    <h4 className="service-title">{service.title || "Professional Service"}</h4>
                    <p className="service-description">
                      {service.description?.trim()
                        ? service.description.substring(0, 92)
                        : "Book a focused professional service session tailored to your requirement."}
                      {service.description?.length > 92 ? "..." : ""}
                    </p>
                    <div className="footer-row">
                      <p className="expert-name">
                        by {expertMap[service.expert_id] || "Expert Professional"}
                      </p>
                      {Number(service.price) > 0 && (
                        <span className="price-tag">{`\u20B9${Math.floor(service.price)}`}</span>
                      )}
                    </div>
                  </CardBody>
                </ServiceCard>
              ))}
          {!loading && visibleServices.length === 0 && (
            <EmptyState>No services available right now.</EmptyState>
          )}
        </HorizontalScrollContainer>

        <ScrollArrow
          type="button"
          $side="right"
          $hidden={!scrollState.canScrollRight}
          onClick={() => scrollServices("right")}
          aria-label="Scroll services right"
          disabled={!scrollState.canScrollRight}
        >
          <FiChevronRight aria-hidden="true" />
        </ScrollArrow>
      </ServiceScrollShell>
    </SectionWrapper>
  );
};

export default PopularServices;

const SectionWrapper = styled.section`
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid var(--home-border);
  border-radius: 28px;
  box-shadow: var(--home-shadow);
  padding: 18px 0;
  overflow: hidden;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  content-visibility: auto;
  contain-intrinsic-size: 360px;

  .section-topline {
    padding: 0 18px;
  }

  .services-subtitle {
    margin: 6px 0 0;
    color: #526071;
    font-size: 0.9rem;
    line-height: 1.45;
  }

  @media (min-width: 1024px) {
    padding: 22px 0;

    .section-topline {
      padding: 0 22px;
    }
  }

  @media (max-width: 480px) {
    border-radius: 24px;
    padding: 16px 0;

    .section-topline {
      padding: 0 16px;
    }
  }
`;

const ServiceScrollShell = styled.div`
  position: relative;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
`;

const ScrollArrow = styled.button`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === "left" ? "left: 8px;" : "right: 8px;")}
  z-index: 3;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(244, 197, 66, 0.28);
  border-radius: 999px;
  background:
    radial-gradient(circle at top left, rgba(244, 197, 66, 0.24), transparent 42%),
    rgba(0, 0, 128, 0.9);
  color: #ffffff;
  box-shadow:
    0 14px 28px rgba(0, 0, 128, 0.22),
    0 0 18px rgba(244, 197, 66, 0.12);
  backdrop-filter: blur(10px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translateY(-50%) ${({ $hidden }) => ($hidden ? "scale(0.94)" : "scale(1)")};
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  pointer-events: ${({ $hidden }) => ($hidden ? "none" : "auto")};
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  svg {
    width: 19px;
    height: 19px;
    stroke-width: 2.6;
  }

  &:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.06);
    border-color: rgba(244, 197, 66, 0.58);
    box-shadow:
      0 18px 34px rgba(0, 0, 128, 0.28),
      0 0 24px rgba(244, 197, 66, 0.18);
  }

  &:disabled {
    cursor: default;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    ${({ $side }) => ($side === "left" ? "left: 6px;" : "right: 6px;")}

    svg {
      width: 17px;
      height: 17px;
    }
  }
`;

const HorizontalScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 0.25rem 18px 0.35rem;
  scroll-behavior: smooth;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  align-items: stretch;

  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    flex: 0 0 230px;
    scroll-snap-align: start;
  }

  @media (min-width: 1024px) {
    padding-inline: 22px;

    & > div {
      flex-basis: 228px;
    }
  }

  @media (min-width: 1280px) {
    & > div {
      flex-basis: 220px;
    }
  }

  @media (max-width: 768px) {
    & > div {
      flex-basis: 180px;
    }
  }

  @media (max-width: 480px) {
    padding-inline: 16px;

    & > div {
      flex-basis: 168px;
    }
  }
`;

const ServiceCard = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  border-radius: 22px;
  border: 1px solid var(--home-border);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 284px;
  height: 100%;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 0, 128, 0.12);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    min-height: 264px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.4), transparent 35%),
    linear-gradient(135deg, #e8eefc, #f7fafc);
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }

  ${ServiceCard}:hover & img {
    transform: scale(1.04);
  }

  .service-badge {
    position: absolute;
    left: 0.65rem;
    top: 0.65rem;
    display: inline-flex;
    align-items: center;
    min-height: 26px;
    padding: 0.24rem 0.58rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.9);
    color: #14213d;
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.03em;
  }

  @media (max-width: 768px) {
    aspect-ratio: 16 / 10;
  }
`;

const CardBody = styled.div`
  padding: 0.9rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;

  .service-title {
    font-size: 0.96rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.5rem;
  }

  .service-description {
    margin: 0;
    font-size: 0.86rem;
    line-height: 1.5;
    color: #526071;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.6rem;
  }

  .price-tag {
    color: #000080;
    font-size: 0.96rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .expert-name {
    font-size: 0.78rem;
    color: #475467;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 68%;
  }

  .footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.6rem;
    margin-top: auto;
    padding-top: 0.15rem;
  }

  @media (max-width: 768px) {
    padding: 0.8rem;

    .service-title {
      font-size: 0.9rem;
      min-height: 2.35rem;
    }

    .service-description {
      font-size: 0.8rem;
      min-height: 2.45rem;
    }

    .price-tag {
      font-size: 0.9rem;
    }

    .expert-name {
      font-size: 0.74rem;
      max-width: 58%;
    }
  }
`;

const ServiceSkeleton = styled.div`
  background: #ffffff;
  border-radius: 22px;
  border: 1px solid var(--home-border);
  overflow: hidden;
  padding-bottom: 1rem;
  min-height: 284px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);

  .media,
  .line {
    position: relative;
    overflow: hidden;
    background: #e9eef5;
  }

  .media {
    aspect-ratio: 16 / 9;
    margin-bottom: 1rem;
  }

  .line {
    height: 0.9rem;
    border-radius: 999px;
    margin: 0 1rem 0.8rem;
  }

  .title {
    width: calc(100% - 2rem);
    height: 1rem;
  }

  .copy {
    width: 72%;
  }

  .footer {
    width: 40%;
    margin-top: 1.1rem;
  }

  .media::after,
  .line::after {
    content: "";
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.65), transparent);
    animation: shimmer 1.4s infinite;
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }

  @media (max-width: 768px) {
    min-height: 264px;

    .media {
      aspect-ratio: 16 / 10;
    }
  }
`;

const EmptyState = styled.div`
  min-height: 120px;
  border: 1px dashed rgba(0, 0, 128, 0.16);
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667085;
  font-size: 0.9rem;
  background: #ffffff;
`;
