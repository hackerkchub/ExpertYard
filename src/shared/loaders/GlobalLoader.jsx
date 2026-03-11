import { useLoader } from "./LoaderContext";
import "./loader.css";

export default function GlobalLoader() {

  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="global-loader">
      <div className="loader-spinner"/>
    </div>
  );
}