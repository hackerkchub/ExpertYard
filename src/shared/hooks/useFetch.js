import { useState, useEffect } from "react";
import useNetworkReconnect from "./useNetworkReconnect";

export default function useFetch(apiFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    apiFn().then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, deps);

  useNetworkReconnect(loadData);

  return { data, loading };
}
