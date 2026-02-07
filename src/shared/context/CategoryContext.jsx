// src/shared/context/CategoryContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback
} from "react";

import {
  getCategoriesApi,
  getSubCategoriesApi
} from "../api/expertapi/category.api";

const CategoryContext = createContext(null);

export const useCategory = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD CATEGORIES (ONCE) ================= */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategoriesApi();
        setCategories(res?.data?.data || []);
      } catch (err) {
        console.error("Category load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* ================= LOAD SUBCATEGORIES (MEMOIZED) ================= */
  const loadSubCategories = useCallback(async (categoryId) => {
    if (!categoryId) return;

    try {
      const res = await getSubCategoriesApi(categoryId);
      setSubCategories(res?.data?.data || []);
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
        loading
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
