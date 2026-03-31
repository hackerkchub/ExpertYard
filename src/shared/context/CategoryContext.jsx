import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getCategoriesApi, getSubCategoriesApi } from "../api/expertapi/category.api";

const CategoryContext = createContext(null);
export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ⚡ Cache for Subcategories: { categoryId: data }
  const subCatCache = useRef({}); 
  const isFetched = useRef(false); // To prevent double execution in StrictMode

  /* ================= LOAD CATEGORIES (With Cache Check) ================= */
  const loadCategories = useCallback(async (forceRefresh = false) => {
    // Agar data pehle se hai aur force refresh nahi maanga, toh return karein
    if (categories.length > 0 && !forceRefresh) return;
    if (isFetched.current && !forceRefresh) return;

    try {
      setLoading(true);
      const res = await getCategoriesApi();
      const data = res?.data || [];
      setCategories(data);
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

  /* ================= LOAD SUBCATEGORIES (With Smart Caching) ================= */
  const loadSubCategories = useCallback(async (categoryId) => {
    if (!categoryId) return;

    // 1. Check if already in cache
    if (subCatCache.current[categoryId]) {
      setSubCategories(subCatCache.current[categoryId]);
      return;
    }

    try {
      // Optional: loading state for subcategories specifically
      const res = await getSubCategoriesApi(categoryId);
      const data = res?.data?.data || res?.data || [];
      
      // 2. Save to cache
      subCatCache.current[categoryId] = data;
      setSubCategories(data);
    } catch (err) {
      console.error("Subcategory load failed", err);
      setSubCategories([]);
    }
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        categories,
        subCategories,
        loadSubCategories,
        loading,
        refreshCategories: () => loadCategories(true) // Manual refresh option
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};