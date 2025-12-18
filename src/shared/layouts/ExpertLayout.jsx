// shared/layouts/ExpertLayout.jsx
import React from "react";


const ExpertLayout = ({ sidebar, children }) => {
  return (
    <div style={styles.wrapper}>
      <aside style={styles.sidebar}>{sidebar}</aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "260px",
    padding: "20px",
    borderRight: "1px solid #e5e7eb",
    background: "#fff",

    /* Mobile responsive */
    "@media(max-width:768px)": {
      display: "none",
    }
  },
  main: {
    flex: 1,
    padding: "20px",
  },
};

export default ExpertLayout;
