import React from "react";
import { StyledButton } from "./Button.styles";

const Button = ({ children, ...rest }) => {
  return <StyledButton {...rest}>{children}</StyledButton>;
};

export default Button;
