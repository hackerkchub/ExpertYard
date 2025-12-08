// shared/layouts/AdminLayout.jsx
import React from "react";

const AdminLayout = ({ sidebar, children }) => {
  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>Admin Panel</header>

      <div style={styles.body}>
        <aside style={styles.sidebar}>{sidebar}</aside>
        <main style={styles.main}>{children}</main>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100%",
    minHeight: "100vh",
  },
  header: {
    padding: "15px 20px",
    borderBottom: "1px solid #e5e7eb",
    background: "#fff",
    fontWeight: 600,
  },
  body: {
    display: "flex",
    minHeight: "calc(100vh - 60px)",
  },
  sidebar: {
    width: "240px",
    borderRight: "1px solid #e5e7eb",
    padding: "20px",
    background: "#fafafa",

    /* hide on mobile */
    "@media(max-width:768px)": {
      display: "none",
    }
  },
  main: {
    flex: 1,
    padding: "20px",
  },
};

export default AdminLayout;
