import { useLoader } from "./LoaderContext";
import { useEffect, useState } from "react";
import "./loader.css";

export default function GlobalLoader() {

  const { loading } = useLoader();
  const [slowNetwork, setSlowNetwork] = useState(false);

  useEffect(() => {

    if (!loading) {
      setSlowNetwork(false);
      return;
    }

    const timer = setTimeout(() => {
      setSlowNetwork(true);
    }, 4000); // 4 sec

    return () => clearTimeout(timer);

  }, [loading]);

  if (!loading) return null;

  return (
  <div className="global-loader">

    <div className="loader-spinner"/>

    <div className="loader-text">
      Loading...
    </div>

    {slowNetwork && (
      <p className="slow-network-text">
        Network is slow, please wait...
      </p>
    )}

  </div>
);
}