import { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {

  const [loadingCount, setLoadingCount] = useState(0);

  const showLoader = () => {
    setLoadingCount((c) => c + 1);
  };

  const hideLoader = () => {
    setLoadingCount((c) => Math.max(0, c - 1));
  };

  const loading = loadingCount > 0;

  return (
    <LoaderContext.Provider
      value={{ loading, showLoader, hideLoader }}
    >
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);