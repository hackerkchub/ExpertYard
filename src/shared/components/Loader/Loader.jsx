import PremiumCenterLoader from "./PremiumCenterLoader";
import { LoaderText, LoaderWrap, Spinner } from "./Loader.styles";

const Loader = ({
  label = "Loading...",
  variant = "inline",
  size = "md",
}) => {
  if (variant === "page" || variant === "overlay") {
    return <PremiumCenterLoader label={label} />;
  }

  return (
    <LoaderWrap
      className="loader-overlay"
      $variant={variant}
      role="status"
      aria-live="polite"
    >
      <Spinner $size={size} aria-hidden="true" />
      {label ? <LoaderText $size={size}>{label}</LoaderText> : null}
    </LoaderWrap>
  );
};

export default Loader;

