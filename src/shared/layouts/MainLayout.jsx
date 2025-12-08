import React from "react";

const MainLayout = ({ children }) => {
  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {children}
    </div>
  );
};

export default MainLayout;
