import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronRight, FiUsers, FiBriefcase } from "react-icons/fi";
import { IoChatbubble, IoGridOutline } from "react-icons/io5";

import { getSubCategoriesApi } from "../../../../shared/api/expertapi/category.api";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import NeedHelpForm from "../../components/NeedHelpForm/NeedHelpForm";
import { useSeo } from "../../../../shared/seo/useSeo";
import { buildTrackingPayload, trackLeadEvent } from "../../../../shared/utils/leadTracking";
import {
  buildCategoryCanonicalPath,
  getCategorySeoData,
} from "../../../../shared/seo/categorySeoData";
import {
  buildCategorySeoDescription,
  findCategoryById,
  findCategoryBySlug,
  getCategoryPath,
} from "../../../../shared/utils/categoryRoutes";
import {
  PageContainer,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  CategoryDetailHero,
  CategoryHeroCopy,
  CategoryKicker,
  CategoryTitle,
  CategoryDescription,
  CategoryMetaRow,
  CategoryMetaPill,
  SectionCard,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  SubcategoryGrid,
  SubcategoryCard,
  SubcategoryCardContainer,
  SubcategoryHeader,
  SubcategoryActionButtons,
  ConnectExpertButton,
  ViewServicesButton,
  SubcategoryImage,
  SubcategoryName,
  LoadingGrid,
  SkeletonCard,
  EmptyStateBox,
  EmptyStateTitle,
  EmptyStateText,
  ClearFiltersButton,
} from "./SubcategoryPage.styles";
import APP_CONFIG from "../../../../config/appConfig";

const DEFAULT_CATEGORY_IMAGE =
  "https://placehold.co/160x160/eef2ff/000080?text=G9";

const getServiceImageUrl = (url) => {
  if (!url) return DEFAULT_CATEGORY_IMAGE;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const cleanPath = url.startsWith("/") ? url : `/${url}`;
  const base = APP_CONFIG?.API_BASE_URL ? APP_CONFIG.API_BASE_URL.replace(/\/api\/?$/, "") : "http://localhost:5000";
  return `${base}${cleanPath}`;
};

const getImage = (item) => {
  const raw = item?.image_url || item?.thumbnail_url || item?.image || item?.icon || item?.thumbnail;
  return getServiceImageUrl(raw);
};

const extractSubcategories = (response) => {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

export default function SubcategoryPage() {
  const { categoryId, slug, subcategoryId } = useParams();
  const navigate = useNavigate();
  const requestRef = useRef(0);
  const abortRef = useRef(null);
  const trackedCategoryRef = useRef(null);

  const { categories, loading: categoriesLoading } = useCategory();
  const { user } = useAuth();
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const routeCategoryKey = categoryId || slug;
  const matchedCategory = useMemo(() => {
    if (!routeCategoryKey) return null;
    return (
      findCategoryById(categories, routeCategoryKey) ||
      findCategoryBySlug(categories, routeCategoryKey)
    );
  }, [categories, routeCategoryKey]);

  const resolvedCategoryId = matchedCategory?.id || categoryId || "";
  const categorySeoData = useMemo(
    () => getCategorySeoData(matchedCategory || slug || "Expert"),
    [matchedCategory, slug]
  );

  useSeo({
    title: matchedCategory
      ? `${matchedCategory.name} Subcategories | G9Expert`
      : categorySeoData.title,
    description: matchedCategory
      ? buildCategorySeoDescription(matchedCategory)
      : categorySeoData.description,
    canonicalPath: matchedCategory
      ? getCategoryPath(matchedCategory)
      : buildCategoryCanonicalPath(slug || "expert"),
  });

  const loadSubcategories = useCallback(async () => {
    if (!resolvedCategoryId) return;

    const requestId = ++requestRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");

    try {
      const response = await getSubCategoriesApi(resolvedCategoryId, {
        signal: controller.signal,
      });
      if (requestId !== requestRef.current) return;
      setSubcategories(extractSubcategories(response));
    } catch (err) {
      if (controller.signal.aborted || err?.code === "ERR_CANCELED") return;
      if (requestId !== requestRef.current) return;
      console.error("Subcategory page load failed", err);
      setSubcategories([]);
      setError("Failed to load subcategories. Please try again.");
    } finally {
      if (requestId === requestRef.current) {
        setLoading(false);
      }
    }
  }, [resolvedCategoryId]);

  const loadServices = useCallback(async () => {
    if (!subcategoryId) {
      setServices([]);
      return;
    }

    setServicesLoading(true);
    try {
      const response = await fetch(`/api/master-services/search?subcategory_id=${encodeURIComponent(subcategoryId)}&limit=100`);
      const data = await response.json();
      const serviceRows = data?.data?.services || data?.data?.data || data?.services || [];
      setServices(Array.isArray(serviceRows) ? serviceRows : []);
    } catch (err) {
      console.error("Subcategory services load failed", err);
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  }, [subcategoryId]);

  useEffect(() => {
    loadSubcategories();
    return () => abortRef.current?.abort();
  }, [loadSubcategories]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (!resolvedCategoryId || trackedCategoryRef.current === resolvedCategoryId) return;
    trackedCategoryRef.current = resolvedCategoryId;
    trackLeadEvent(
      "category-view",
      buildTrackingPayload({
        user,
        sourcePage: "category_page",
        actionLabel: "Category Page Open",
        extra: { category_id: resolvedCategoryId },
      })
    );
  }, [resolvedCategoryId, user]);

  const handleSubcategoryClick = useCallback(
    (subcategory) => {
      if (!matchedCategory || !subcategory) return;
      navigate(`/user/category/${matchedCategory.id}/subcategory/${subcategory.id}`);
    },
    [navigate, matchedCategory]
  );

  const selectedSubcategory = useMemo(
    () => subcategories.find((item) => String(item.id) === String(subcategoryId)),
    [subcategories, subcategoryId]
  );

  const isInitialCategoryLoading = categoriesLoading && categories.length === 0;
  const categoryMissing =
    !isInitialCategoryLoading &&
    routeCategoryKey &&
    categories.length > 0 &&
    !matchedCategory &&
    !categoryId;

  if (categoryMissing) {
    return (
      <PageContainer className="subcategory-page">
        <EmptyStateBox>
          <EmptyStateTitle>Category not found</EmptyStateTitle>
          <EmptyStateText>The selected category is unavailable or has moved.</EmptyStateText>
          <ClearFiltersButton onClick={() => navigate("/user/categories")}>
            Browse categories
          </ClearFiltersButton>
        </EmptyStateBox>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="subcategory-page">
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate("/user")}>Home</BreadcrumbItem>
        <BreadcrumbSeparator><FiChevronRight /></BreadcrumbSeparator>
        <BreadcrumbItem onClick={() => navigate("/user/categories")}>Categories</BreadcrumbItem>
        <BreadcrumbSeparator><FiChevronRight /></BreadcrumbSeparator>
        <BreadcrumbItem $active>{matchedCategory?.name || "Category"}</BreadcrumbItem>
      </Breadcrumb>

      <CategoryDetailHero>
        <CategoryHeroCopy>
          <CategoryKicker>Expert Category</CategoryKicker>
          <CategoryTitle>{matchedCategory?.name || categorySeoData.label}</CategoryTitle>
          <CategoryDescription>
            {matchedCategory
              ? buildCategorySeoDescription(matchedCategory)
              : categorySeoData.description}
          </CategoryDescription>
          <CategoryMetaRow>
            <CategoryMetaPill><IoGridOutline /> {subcategories.length} subcategories</CategoryMetaPill>
            <CategoryMetaPill><IoChatbubble /> Choose a topic to view experts</CategoryMetaPill>
          </CategoryMetaRow>
        </CategoryHeroCopy>
      </CategoryDetailHero>

      {!subcategoryId && <SectionCard>
        <SectionHeader>
          <div>
            <SectionTitle>Choose a subcategory</SectionTitle>
            <SectionSubtitle>
              Only subcategories related to this category are shown here.
            </SectionSubtitle>
          </div>
        </SectionHeader>

        {loading || isInitialCategoryLoading ? (
          <LoadingGrid>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </LoadingGrid>
        ) : error ? (
          <EmptyStateBox>
            <EmptyStateTitle>Unable to load subcategories</EmptyStateTitle>
            <EmptyStateText>{error}</EmptyStateText>
            <ClearFiltersButton onClick={loadSubcategories}>Try again</ClearFiltersButton>
          </EmptyStateBox>
        ) : subcategories.length > 0 ? (
          <SubcategoryGrid>
            {subcategories.map((subcategory) => {
              const catKey = matchedCategory?.id || resolvedCategoryId;
              return (
                <SubcategoryCardContainer key={subcategory.id}>
                  <SubcategoryHeader>
                    <SubcategoryImage src={getImage(subcategory)} alt={subcategory.name} />
                    <SubcategoryName>{subcategory.name}</SubcategoryName>
                  </SubcategoryHeader>
                  
                  <SubcategoryActionButtons>
                    <ConnectExpertButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/category/${catKey}/subcategory/${subcategory.id}/experts`);
                      }}
                    >
                      <FiUsers size={15} />
                      <span>Expert</span>
                    </ConnectExpertButton>

                    <ViewServicesButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/category/${catKey}/subcategory/${subcategory.id}`);
                      }}
                    >
                      <FiBriefcase size={15} />
                      <span>Services</span>
                    </ViewServicesButton>
                  </SubcategoryActionButtons>
                </SubcategoryCardContainer>
              );
            })}
          </SubcategoryGrid>
        ) : (
          <EmptyStateBox>
            <EmptyStateTitle>No subcategories found</EmptyStateTitle>
            <EmptyStateText>Please check another category or try again later.</EmptyStateText>
          </EmptyStateBox>
        )}
      </SectionCard>}

      {subcategoryId && (
        <SectionCard>
          <SectionHeader>
            <div>
              <SectionTitle>{selectedSubcategory?.name || "Services"}</SectionTitle>
              <SectionSubtitle>
                Services linked to this subcategory. Experts are shown only after opening a service.
              </SectionSubtitle>
            </div>
          </SectionHeader>

          {servicesLoading ? (
            <LoadingGrid>
              {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </LoadingGrid>
          ) : services.length > 0 ? (
            <SubcategoryGrid>
              {services.map((service) => (
                <SubcategoryCard
                  key={service.id}
                  type="button"
                  onClick={() => navigate(`/user/service/${service.slug || service.id}`)}
                >
                  <SubcategoryImage src={getImage(service)} alt={service.title} />
                  <SubcategoryName>{service.title}</SubcategoryName>
                  <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    Starts at Rs. {Number(service.base_price || 0).toLocaleString("en-IN")}
                  </span>
                </SubcategoryCard>
              ))}
            </SubcategoryGrid>
          ) : (
            <EmptyStateBox>
              <EmptyStateTitle>No services found</EmptyStateTitle>
              <EmptyStateText>This subcategory does not have published services yet.</EmptyStateText>
              <ClearFiltersButton onClick={() => navigate(`/user/category/${matchedCategory?.id || resolvedCategoryId}`)}>
                View subcategories
              </ClearFiltersButton>
            </EmptyStateBox>
          )}
        </SectionCard>
      )}

      {resolvedCategoryId && (
        <NeedHelpForm
          categoryId={resolvedCategoryId}
          categoryName={matchedCategory?.name || categorySeoData.label}
          sourcePage="category_page"
        />
      )}
    </PageContainer>
  );
}
