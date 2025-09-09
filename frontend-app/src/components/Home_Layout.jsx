import React from "react";
import Header from "./Home_Header";
import "../styles/Layout.css";

const Layout = ({ children, logoSrc }) => {
  return (
    <div className="layout-container">
      <Header logoSrc={logoSrc} />
      <main className="layout-main">{children}</main>
    </div>
  );
};

export default Layout;
