import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { BackButtonRoot } from "./BackButton.styles";

const USER_HOME_PATH = "/user";

export default function BackButton({
  label = "Back",
  fallbackTo = USER_HOME_PATH,
  onClick,
  iconOnly = false,
  className,
}) {
  const navigate = useNavigate();

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
      return;
    }

    const historyIndex = window.history.state?.idx;
    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo, { replace: true });
  };

  return (
    <BackButtonRoot
      type="button"
      aria-label="Go back"
      title={label || "Go back"}
      onClick={handleClick}
      $iconOnly={iconOnly}
      className={className}
    >
      <FiArrowLeft aria-hidden="true" />
      {!iconOnly && <span className="back-button__label">{label}</span>}
    </BackButtonRoot>
  );
}
