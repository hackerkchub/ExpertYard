// Tabs.jsx
import React, { useState } from "react";

const Tabs = ({ tabs }) => {
  const [active, setActive] = useState(0);

  return (
    <>
      <div style={{ display: "flex", gap: 10 }}>
        {tabs.map((tab, i) => (
          <button key={i} onClick={() => setActive(i)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active].content}</div>
    </>
  );
};

export default Tabs;
