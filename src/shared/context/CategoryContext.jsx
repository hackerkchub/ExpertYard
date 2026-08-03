import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getCategoriesApi,
  getSubCategoriesApi,
} from "../api/expertapi/category.api";
import useNetworkReconnect from "../hooks/useNetworkReconnect";

const CategoryContext = createContext(null);

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);

  const subCatCache = useRef({});
  const isFetched = useRef(false);
  const activeSubCategoryRequest = useRef(0);
  const lastSubCategoryId = useRef(null);

  const loadCategories = useCallback(async (forceRefresh = false) => {
    if (categories.length > 0 && !forceRefresh) return;
    if (isFetched.current && !forceRefresh) return;

    try {
      setLoading(true);
      setError(null);
      const res = await getCategoriesApi();
      const actualData = res?.data || res || [];
      const sortedData = Array.isArray(actualData) 
        ? [...actualData].sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0))
        : [];

      setCategories(sortedData);
      isFetched.current = true;
    } catch (err) {
      console.error("Category load failed", err);
      setError(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [categories.length]);

  useEffect(() => {
    loadCategories();
    const handleUpdated = () => {
      loadCategories(true);
    };
    window.addEventListener("categories_updated", handleUpdated);
    return () => {
      window.removeEventListener("categories_updated", handleUpdated);
    };
  }, [loadCategories]);

  const loadSubCategories = useCallback(async (categoryId, forceRefresh = false) => {
    if (!categoryId) return;

    const normalizedCategoryId = String(categoryId);
    lastSubCategoryId.current = normalizedCategoryId;

    if (subCatCache.current[normalizedCategoryId] && !forceRefresh) {
      setSubCategories(subCatCache.current[normalizedCategoryId]);
      setSubCategoriesLoading(false);
      return;
    }

    const requestId = ++activeSubCategoryRequest.current;

    try {
      setSubCategories([]);
      setSubCategoriesLoading(true);
      const res = await getSubCategoriesApi(categoryId);
      const data = res?.data?.data || res?.data || [];

      if (requestId !== activeSubCategoryRequest.current) return;

      subCatCache.current[normalizedCategoryId] = data;
      setSubCategories(data);
    } catch (err) {
      console.error("Subcategory load failed", err);
      if (requestId === activeSubCategoryRequest.current) {
        setSubCategories([]);
      }
    } finally {
      if (requestId === activeSubCategoryRequest.current) {
        setSubCategoriesLoading(false);
      }
    }
  }, []);

  const refreshCategories = useCallback(() => loadCategories(true), [loadCategories]);

  useNetworkReconnect(() => {
    loadCategories(true);
    if (lastSubCategoryId.current) {
      loadSubCategories(lastSubCategoryId.current, true);
    }
  });

  const value = useMemo(
    () => ({
      categories,
      error,
      subCategories,
      subCategoriesLoading,
      loadSubCategories,
      loading,
      refreshCategories,
    }),
    [
      categories,
      error,
      subCategories,
      subCategoriesLoading,
      loadSubCategories,
      loading,
      refreshCategories,
    ]
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
