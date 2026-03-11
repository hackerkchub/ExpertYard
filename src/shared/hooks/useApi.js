import { useState } from "react";

const useApi = (apiFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(...args);

      return response.data;

    } catch (err) {

      const message =
        err?.response?.data?.message ||
        err?.message ||
        err ||
        "Something went wrong";

      setError(message);

      throw message;

    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
};

export default useApi;