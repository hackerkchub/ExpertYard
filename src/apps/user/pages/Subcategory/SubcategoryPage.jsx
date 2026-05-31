import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { IoChatbubble, IoGridOutline } from "react-icons/io5";

import { getSubCategoriesApi } from "../../../../shared/api/expertapi/category.api";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import {
  buildCategoryCanonicalPath,
  getCategorySeoData,
} from "../../../../shared/seo/categorySeoData";
import {
  buildCategorySeoDescription,
  findCategoryById,
  findCategoryBySlug,
  getCategoryPath,
  getSubcategoryExpertsPath,
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
  SubcategoryImage,
  SubcategoryName,
  LoadingGrid,
  SkeletonCard,
  EmptyStateBox,
  EmptyStateTitle,
  EmptyStateText,
  ClearFiltersButton,
} from "./SubcategoryPage.styles";
import "./SubcategorySeo.css";

const DEFAULT_CATEGORY_IMAGE =
  "https://placehold.co/160x160/eef2ff/000080?text=G9";

const getImage = (item) =>
  item?.image_url || item?.image || item?.icon || item?.thumbnail || DEFAULT_CATEGORY_IMAGE;

const extractSubcategories = (response) => {
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
};

export default function SubcategoryPage() {
  const { categoryId, slug } = useParams();
  const navigate = useNavigate();
  const requestRef = useRef(0);
  const abortRef = useRef(null);

  const { categories, loading: categoriesLoading } = useCategory();
  const [subcategories, setSubcategories] = useState([]);
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

  useEffect(() => {
    loadSubcategories();
    return () => abortRef.current?.abort();
  }, [loadSubcategories]);

  const handleSubcategoryClick = useCallback(
    (subcategoryId) => {
      if (!resolvedCategoryId || !subcategoryId) return;
      navigate(
        getSubcategoryExpertsPath(resolvedCategoryId, subcategoryId, {
          page: 1,
          mode: "chat",
        })
      );
    },
    [navigate, resolvedCategoryId]
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
      <PageContainer>
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
    <PageContainer>
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

      <SectionCard>
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
            {subcategories.map((subcategory) => (
              <SubcategoryCard
                key={subcategory.id}
                type="button"
                onClick={() => handleSubcategoryClick(subcategory.id)}
              >
                <SubcategoryImage src={getImage(subcategory)} alt={subcategory.name} />
                <SubcategoryName>{subcategory.name}</SubcategoryName>
              </SubcategoryCard>
            ))}
          </SubcategoryGrid>
        ) : (
          <EmptyStateBox>
            <EmptyStateTitle>No subcategories found</EmptyStateTitle>
            <EmptyStateText>Please check another category or try again later.</EmptyStateText>
          </EmptyStateBox>
        )}
      </SectionCard>
    </PageContainer>
  );
}
