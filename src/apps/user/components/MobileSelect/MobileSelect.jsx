import React, { useEffect, useMemo, useState } from "react";
import { FiCheck, FiChevronDown, FiX } from "react-icons/fi";
import "./MobileSelect.css";

const MOBILE_QUERY = "(max-width: 768px)";

function useIsMobileSelect() {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY).matches : false
  ));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobile(media.matches);
    handleChange();

    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  return isMobile;
}

const normalizeOptions = (options) =>
  (options || []).map((option) => {
    if (typeof option === "string" || typeof option === "number") {
      return { value: String(option), label: String(option) };
    }

    return {
      value: option?.value == null ? "" : String(option.value),
      label: option?.label == null ? "" : String(option.label),
      disabled: Boolean(option?.disabled),
    };
  });

export default function MobileSelect({
  title,
  label,
  value = "",
  options = [],
  onChange,
  placeholder = "Select",
  disabled = false,
  className = "",
  selectClassName = "",
  style,
  name,
  ariaLabel,
  DesktopSelectComponent = "select",
}) {
  const isMobile = useIsMobileSelect();
  const [open, setOpen] = useState(false);
  const normalizedOptions = useMemo(() => normalizeOptions(options), [options]);
  const selectedValue = value == null ? "" : String(value);
  const selectedOption = normalizedOptions.find((option) => option.value === selectedValue);
  const displayLabel = selectedOption?.label || placeholder;
  const sheetTitle = title || label || placeholder;

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!isMobile && open) setOpen(false);
  }, [isMobile, open]);

  const emitChange = (nextValue) => {
    onChange?.({
      target: {
        name,
        value: nextValue,
      },
      currentTarget: {
        name,
        value: nextValue,
      },
    });
  };

  const handleSelect = (option) => {
    if (option.disabled) return;
    emitChange(option.value);
    setOpen(false);
  };

  if (!isMobile) {
    const SelectComponent = DesktopSelectComponent;

    return (
      <SelectComponent
        name={name}
        value={selectedValue}
        onChange={onChange}
        disabled={disabled}
        className={selectClassName || className}
        style={style}
        aria-label={ariaLabel || sheetTitle}
      >
        {normalizedOptions.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </SelectComponent>
    );
  }

  return (
    <div className={`g9-mobile-select ${className}`.trim()}>
      <button
        type="button"
        className="g9-mobile-select__trigger"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        aria-label={ariaLabel || sheetTitle}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{displayLabel}</span>
        <FiChevronDown aria-hidden="true" />
      </button>

      {open && (
        <div className="g9-mobile-select__overlay" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="g9-mobile-select__sheet"
            role="dialog"
            aria-modal="true"
            aria-label={sheetTitle}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="g9-mobile-select__handle" aria-hidden="true" />
            <div className="g9-mobile-select__header">
              <h3>{sheetTitle}</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close selection popup">
                <FiX />
              </button>
            </div>

            <div className="g9-mobile-select__options" role="listbox" aria-label={sheetTitle}>
              {normalizedOptions.map((option) => {
                const selected = option.value === selectedValue;

                return (
                  <button
                    key={`${option.value}-${option.label}`}
                    type="button"
                    className={selected ? "selected" : ""}
                    disabled={option.disabled}
                    role="option"
                    aria-selected={selected}
                    onClick={() => handleSelect(option)}
                  >
                    <span>{option.label}</span>
                    {selected && <FiCheck aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
