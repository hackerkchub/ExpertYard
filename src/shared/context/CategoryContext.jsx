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

const CategoryContext = createContext(null);

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const subCatCache = useRef({});
  const isFetched = useRef(false);

  const loadCategories = useCallback(async (forceRefresh = false) => {
    if (categories.length > 0 && !forceRefresh) return;
    if (isFetched.current && !forceRefresh) return;

    try {
      setLoading(true);
      const res = await getCategoriesApi();
      const actualData = res?.data || res || [];

      setCategories(actualData);
      isFetched.current = true;
    } catch (err) {
      console.error("Category load failed", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [categories.length]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const loadSubCategories = useCallback(async (categoryId) => {
    if (!categoryId) return;

    if (subCatCache.current[categoryId]) {
      setSubCategories(subCatCache.current[categoryId]);
      return;
    }

    try {
      const res = await getSubCategoriesApi(categoryId);
      const data = res?.data?.data || res?.data || [];

      subCatCache.current[categoryId] = data;
      setSubCategories(data);
    } catch (err) {
      console.error("Subcategory load failed", err);
      setSubCategories([]);
    }
  }, []);

  const refreshCategories = useCallback(() => loadCategories(true), [loadCategories]);

  const value = useMemo(
    () => ({
      categories,
      subCategories,
      loadSubCategories,
      loading,
      refreshCategories,
    }),
    [categories, subCategories, loadSubCategories, loading, refreshCategories]
  );

  return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};
