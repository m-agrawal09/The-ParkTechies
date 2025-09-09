import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import Contact from "./components/Contact";

function App() {
  return (
    <Router>
      {/* <Header logoSrc="/Logo.png" /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/contact" element={<Contact />} />
        {/* Add other routes like /dashboard later */}
      </Routes>
    </Router>
  );
}

export default App;
