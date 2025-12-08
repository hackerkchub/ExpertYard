import { createContext, useContext, useEffect, useState } from "react";
import { getAllExperts } from "../services/expertService";

const ExpertContext = createContext(null);

export const useExperts = () => useContext(ExpertContext);

export const ExpertProvider = ({ children }) => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GLOBAL LOAD (dummy → API-ready)
    getAllExperts().then((data) => {
      setExperts(data);
      setLoading(false);
    });
  }, []);

  return (
    <ExpertContext.Provider value={{ experts, loading }}>
      {children}
    </ExpertContext.Provider>
  );
};
