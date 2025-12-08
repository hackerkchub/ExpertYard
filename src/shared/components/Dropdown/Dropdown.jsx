// shared/components/Dropdown/Dropdown.jsx
import React, { useState, useRef } from "react";
import { Wrapper, Trigger, Menu, MenuItem } from "./Dropdown.styles";
import useOutsideClick from "../../hooks/useOutsideClick";

const Dropdown = ({
  items = [],
  onSelect,
  placeholder = "Select...",
  width = "100%"
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef();

  useOutsideClick(ref, () => setOpen(false));

  function handleSelect(item) {
    setSelected(item);
    setOpen(false);
    onSelect && onSelect(item);
  }

  return (
    <Wrapper width={width} ref={ref}>
      <Trigger onClick={() => setOpen(prev => !prev)}>
        {selected?.label || placeholder}
        <span>{open ? "▲" : "▼"}</span>
      </Trigger>

      {open && (
        <Menu>
          {items.map(item => (
            <MenuItem
              key={item.value}
              onClick={() => handleSelect(item)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
};

export default Dropdown;
