import React from "react";
import Header from "./Header";
import "../styles/Layout.css";
import { useFontSize } from "./FontSizeContext";

const Layout = ({ children, logoSrc }) => {
  const { fontSize } = useFontSize();
  return (
    <div className="layout-container" style={{ fontSize: `${fontSize}px` }}>
      <Header logoSrc={logoSrc} />
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;
