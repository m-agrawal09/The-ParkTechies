import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import Contact from "./components/Contact";
import { FontSizeProvider } from "./components/FontSizeContext";
import { LanguageProvider } from "./components/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <FontSizeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/contact" element={<Contact />} />
          {/* Add other routes like /dashboard later */}
        </Routes>
      </Router>
      </FontSizeProvider>
    </LanguageProvider>
  );
}

export default App;
