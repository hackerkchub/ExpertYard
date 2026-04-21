import React from "react";
import { ButtonContent, ButtonSpinner, StyledButton } from "./Button.styles";

const Button = ({
  children,
  loading = false,
  loadingText,
  disabled,
  fullWidth = false,
  ...rest
}) => {
  const resolvedLabel = loadingText || children;

  return (
    <StyledButton disabled={disabled || loading} $fullWidth={fullWidth} {...rest}>
      {loading ? <ButtonSpinner $overlay aria-hidden="true" /> : null}
      <ButtonContent $hidden={loading}>{loading ? resolvedLabel : children}</ButtonContent>
    </StyledButton>
  );
};

export default Button;
