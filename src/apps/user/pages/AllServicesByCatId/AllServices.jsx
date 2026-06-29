import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiLayers,
  FiBriefcase,
  FiUser,
  FiSearch,
  FiShield,
  FiClock,
  FiHeadphones,
  FiCreditCard,
  FiMessageCircle,
  FiStar,
  FiFileText,
  FiVideo,
  FiDownload,
} from "react-icons/fi";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { usePublicExpert } from "../../context/PublicExpertContext";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";
import * as S from "./AllServices.style";
import { APP_CONFIG } from "../../../../config/appConfig";

const AllServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { experts, expertsLoading } = usePublicExpert();

  // Initial data loading from cache (Fast Loading Strategy)
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("expert_services_cache");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(services.length === 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const fetchAllServices = useCallback(async () => {
      try {
        // Background fetch: User ko purana data dikhta rahega tab tak naya load hoga
        const res = await axios.get(`${APP_CONFIG.API_BASE_URL}/services`);
        if (res.data && res.data.success) {
          const freshData = res.data.data || [];
          setServices(freshData);
          // Update cache for next time
          localStorage.setItem("expert_services_cache", JSON.stringify(freshData));
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchAllServices();
  }, [fetchAllServices]);

  useNetworkReconnect(fetchAllServices);

  const expertMap = useMemo(() => {
    const map = {};
    if (Array.isArray(experts)) {
      experts.forEach((e) => {
        map[e.id] = {
          name: e.name,
          slug: e.slug || e.expert_slug || e.expertSlug || e.profile_slug,
        };
      });
    }
    return map;
  }, [experts]);

  const handleGoToMyBookings = () => {
    isLoggedIn && user?.id
      ? navigate(`/user/my-booking/${user.id}`)
      : navigate("/user/auth", { state: { from: location } });
  };

  const getServiceDetailsPath = (service) =>
    `/user/service-details/${service.slug || service.service_slug || service.id}`;

  const getExpertDetailsPath = (service) => {
    const expert = expertMap[service.expert_id];
    const expertSlug =
      service.expert_slug ||
      service.expertSlug ||
      service.profile_slug ||
      service.expert?.slug ||
      expert?.slug ||
      service.expert_id;

    return `/user/experts/${expertSlug}`;
  };

  const serviceCategories = useMemo(() => {
    const categories = services
      .map((service) => service.category_name || service.category || service.service_category)
      .filter(Boolean);
    return ["All", ...Array.from(new Set(categories))];
  }, [services]);

  const visibleServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return services.filter((service) => {
      const category = service.category_name || service.category || service.service_category || "Digital Service";
      const matchesCategory = activeCategory === "All" || category === activeCategory;
      const matchesSearch =
        !query ||
        service.title?.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, services]);

  // Professional Skeleton Loader
  if (loading && services.length === 0) {
    return (
      <S.PageContainer className="all-services-page">
        <S.LoaderContainer>
          <div className="spinner"></div>
          <p>Fetching Professional Services...</p>
        </S.LoaderContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer className="all-services-page">
      <S.ContentWrapper>
        
      
          <S.TopActionButton onClick={handleGoToMyBookings}>
            <FiBriefcase /> <span>My Bookings</span>
          </S.TopActionButton>
       

        <S.ServiceGrid>
          {visibleServices.map((service) => {
            let deliverableList = [];
            try {
              deliverableList = typeof service.deliverables === "string" 
                ? JSON.parse(service.deliverables) : service.deliverables || [];
            } catch { deliverableList = []; }

            const expertName =
              service.expert_name ||
              service.expert?.name ||
              expertMap[service.expert_id]?.name ||
              "Expert Professional";
            const serviceCategory = service.category_name || service.category || service.service_category || "Digital Service";
            const serviceType = service.type_label || String(service.service_type || "consultation").replace("_", " ");
            const fileTypes = Array.isArray(service.file_types) ? service.file_types : [];
            const hasVideo = fileTypes.includes("mp4");
            const hasPdf = fileTypes.includes("pdf");
            const displayPrice = service.offer_price || service.price;

            return (
              <S.ServiceCard key={service.id}>
                <S.ExpertIdentitySection onClick={() => navigate(getExpertDetailsPath(service))}>
                  <div className="expert-avatar">
                    <FiUser size={18} />
                  </div>
                  <div className="expert-info">
                    <h4>{expertName}</h4>
                    <span>Verified Professional</span>
                  </div>
                </S.ExpertIdentitySection>

                <S.ImageWrapper onClick={() => navigate(getServiceDetailsPath(service))}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add('loaded')}
                    onError={(e) => e.target.src = "https://via.placeholder.com/400x200?text=Service+Image"} 
                  />
                  <S.TypeOverlay>{serviceType}</S.TypeOverlay>
                  <S.PriceBadge>
                    {service.offer_price && <small>₹{Math.floor(service.price || 0)}</small>}
                    ₹{Math.floor(displayPrice || 0)}
                  </S.PriceBadge>
                </S.ImageWrapper>

                <S.CardContent>
                  <S.CategoryTag>
                    <FiLayers size={12} /> {serviceCategory}
                  </S.CategoryTag>
                  <S.ProductMetaRow>
                    {hasPdf && <span><FiFileText /> PDF</span>}
                    {hasVideo && <span><FiVideo /> Video</span>}
                    {service.instant_access && <span><FiDownload /> Instant Access</span>}
                  </S.ProductMetaRow>
                  <S.RatingLine>
                    <span><FiStar /> 4.8</span>
                    <span>Verified service</span>
                  </S.RatingLine>
                  <h3>{service.title}</h3>
                  <p className="description">
                    {service.description?.substring(0, 90)}...
                  </p>

                  <S.DeliverablesContainer>
                    {deliverableList.slice(0, 2).map((item, i) => (
                      <span key={i} className="skill-pill">{item}</span>
                    ))}
                  </S.DeliverablesContainer>
                </S.CardContent>

                <S.CardFooter>
                  <S.PrimaryButton onClick={() => navigate(getServiceDetailsPath(service))}>
                    View Details <FiArrowRight />
                  </S.PrimaryButton>
                  <S.SecondaryButton onClick={() => navigate(getExpertDetailsPath(service))}>
                    <FiMessageCircle /> Talk to Expert
                  </S.SecondaryButton>
                </S.CardFooter>
              </S.ServiceCard>
            );
          })}
        </S.ServiceGrid>

        {visibleServices.length === 0 && (
          <S.EmptyState>
            <FiSearch />
            <h3>No services found.</h3>
            <p>Try another keyword or category.</p>
          </S.EmptyState>
        )}

        <S.CtaSection>
          <div>
            <h2>Need help choosing the right service?</h2>
            <p>Talk with verified experts and get the right solution instantly.</p>
          </div>
          <button type="button" onClick={() => navigate("/user/call-chat?page=1&mode=chat")}>
            Talk to Expert
          </button>
        </S.CtaSection>

      </S.ContentWrapper>
    </S.PageContainer>
  );
};

export default AllServices;
