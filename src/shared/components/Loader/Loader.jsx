import { LoaderText, LoaderWrap, Spinner } from "./Loader.styles";

const Loader = ({
  label = "Loading...",
  variant = "inline",
  size = "md",
}) => (
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

export default Loader;
