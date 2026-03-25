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

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);

        const res = await getCategoriesApi();

        // ✅ FIX HERE
        setCategories(res?.data || []);

      } catch (err) {
        console.error("Category load failed", err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  /* ================= LOAD SUBCATEGORIES ================= */
  const loadSubCategories = useCallback(async (categoryId) => {
    if (!categoryId) return;

    try {
      const res = await getSubCategoriesApi(categoryId);

      // ⚠️ subcategory API axios raw return karta hai
      setSubCategories(res?.data?.data || res?.data || []);

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