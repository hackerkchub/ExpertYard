import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getCategoriesApi, getSubCategoriesApi } from "../api/expertapi/category.api";

const CategoryContext = createContext(null);
export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const subCatCache = useRef({}); 
  const isFetched = useRef(false); 

  /* ================= LOAD CATEGORIES ================= */
  const loadCategories = useCallback(async (forceRefresh = false) => {
    // Agar data pehle se state mein hai, toh API call skip karein
    if (categories.length > 0 && !forceRefresh) return;
    if (isFetched.current && !forceRefresh) return;

    try {
      setLoading(true);
      const res = await getCategoriesApi();
      
      // ✅ Fix: getCategoriesApi direct data return kar raha hai ya wrapped, dono handle honge
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

  /* ================= LOAD SUBCATEGORIES ================= */
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

  return (
    <CategoryContext.Provider
      value={{
        categories,
        subCategories,
        loadSubCategories,
        loading,
        refreshCategories: () => loadCategories(true)
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};