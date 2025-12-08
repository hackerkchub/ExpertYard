import { useState, useEffect } from "react";

export default function useFetch(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFn().then(res => {
      setData(res);
      setLoading(false);
    });
  }, deps);

  return { data, loading };
}
