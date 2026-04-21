import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePublicExpert } from "../../context/PublicExpertContext";

const FALLBACK_SERVICE_IMAGE = "https://via.placeholder.com/640x420?text=Service";

const PopularServices = () => {
  const navigate = useNavigate();
  const { experts } = usePublicExpert();

  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("popular_services_cache");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(services.length === 0);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        const res = await axios.get("https://softmaxs.com/api/services", {
          signal: controller.signal,
        });

        if (!cancelled && res.data?.success) {
          const freshData = res.data.data || [];
          setServices(freshData);
          localStorage.setItem("popular_services_cache", JSON.stringify(freshData));
        }
      } catch (err) {
        if (!axios.isCancel(err) && err.name !== "CanceledError") {
          console.error("Error fetching services:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const hasIdleCallback = typeof window !== "undefined" && "requestIdleCallback" in window;
    const scheduledTask = hasIdleCallback
      ? window.requestIdleCallback(fetchServices, { timeout: 1200 })
      : window.setTimeout(fetchServices, 180);

    return () => {
      cancelled = true;
      controller.abort();

      if (hasIdleCallback) {
        window.cancelIdleCallback(scheduledTask);
      } else {
        window.clearTimeout(scheduledTask);
      }
    };
  }, []);

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

  return (
    <SectionWrapper>
      <Header>
        <div className="heading-copy">
          <h2 className="main-title">Popular Services</h2>
          <p className="section-subtitle">
            Curated service offers with upfront pricing and clearer expert attribution.
          </p>
        </div>
        <ViewAllBtn onClick={() => navigate("/user/all-services")}>View All</ViewAllBtn>
      </Header>

      <HorizontalScrollContainer>
        {loading && visibleServices.length === 0
          ? Array.from({ length: 4 }).map((_, index) => (
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
                onClick={() => navigate(`/user/service-details/${service.id}`)}
              >
                <ImageContainer>
                  <img
                    src={service.image}
                    alt={service.title}
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
                  <h4 className="service-title">{service.title}</h4>
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
                    <span className="price-tag">₹{Math.floor(service.price)}</span>
                  </div>
                </CardBody>
              </ServiceCard>
            ))}
      </HorizontalScrollContainer>
    </SectionWrapper>
  );
};

export default PopularServices;

const SectionWrapper = styled.section`
  padding: 0;
  background-color: transparent;
  max-width: 100%;
  margin: 0 auto;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  content-visibility: auto;
  contain-intrinsic-size: 720px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 1.5rem;
  width: 100%;

  .heading-copy {
    max-width: 48rem;
  }

  .main-title {
    font-size: clamp(1.5rem, 2vw, 1.9rem);
    font-weight: 700;
    color: #101828;
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    letter-spacing: -0.02em;
  }

  .section-subtitle {
    margin: 0.45rem 0 0;
    color: #526071;
    font-size: 0.98rem;
    line-height: 1.65;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 1rem;
  }
`;

const ViewAllBtn = styled.button`
  background: #ffffff;
  border: 1px solid rgba(0, 0, 128, 0.16);
  color: #000080;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.78rem 1.15rem;
  border-radius: 999px;
  white-space: nowrap;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    border-color: rgba(0, 0, 128, 0.35);
    box-shadow: 0 16px 34px rgba(15, 23, 42, 0.1);
    transform: translateY(-1px);
  }
`;

const HorizontalScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding: 0.25rem 1.5rem 0.25rem;
  scroll-behavior: smooth;
  scrollbar-width: none;
  scroll-snap-type: x proximity;

  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    flex: 0 0 min(320px, calc(33.33% - 0.75rem));
    scroll-snap-align: start;
  }

  @media (max-width: 768px) {
    padding: 0.25rem 1rem 0.25rem;

    & > div {
      flex: 0 0 74%;
      min-width: 250px;
    }
  }

  @media (max-width: 520px) {
    & > div {
      flex: 0 0 86%;
      min-width: 240px;
    }
  }
`;

const ServiceCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 0, 128, 0.2);
    box-shadow: 0 24px 52px rgba(15, 23, 42, 0.14);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
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
    left: 0.9rem;
    top: 0.9rem;
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.88);
    border: 1px solid rgba(255, 255, 255, 0.9);
    color: #14213d;
    font-size: 0.74rem;
    font-weight: 700;
    letter-spacing: 0.03em;
  }
`;

const CardBody = styled.div`
  padding: 1rem 1rem 1.1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .service-title {
    font-size: 1.06rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
    line-height: 1.35;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.8rem;
    font-family: Georgia, "Times New Roman", serif;
  }

  .service-description {
    margin: 0;
    font-size: 0.93rem;
    line-height: 1.65;
    color: #526071;
    min-height: 3rem;
  }

  .price-tag {
    color: #000080;
    font-size: 1.05rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .expert-name {
    font-size: 0.83rem;
    color: #475467;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 70%;
  }

  .footer-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: auto;
    padding-top: 0.2rem;
  }

  @media (max-width: 600px) {
    padding: 0.9rem;

    .service-title {
      font-size: 0.98rem;
    }

    .service-description {
      font-size: 0.88rem;
      min-height: 2.8rem;
    }

    .price-tag {
      font-size: 0.98rem;
    }
  }
`;

const ServiceSkeleton = styled.div`
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.16);
  overflow: hidden;
  padding-bottom: 1rem;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);

  .media,
  .line {
    position: relative;
    overflow: hidden;
    background: #e9eef5;
  }

  .media {
    aspect-ratio: 16 / 10;
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
`;
