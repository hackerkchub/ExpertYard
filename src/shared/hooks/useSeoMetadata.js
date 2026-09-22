import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const useSeoMetadata = (pathOverride = "") => {
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const currentPath = pathOverride || (typeof window !== "undefined" ? window.location.pathname : "/");

    const fetchSeo = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/seo/metadata`, {
          params: { path: currentPath }
        });
        if (isMounted && res.data && res.data.success) {
          setSeoData(res.data.data);
        }
      } catch (err) {
        console.warn("Could not fetch route SEO metadata:", err?.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSeo();

    return () => {
      isMounted = false;
    };
  }, [pathOverride]);

  return { seoData, loading };
};
