import React, { useState } from "react";
import axios from "axios";
import HostDashboard from "./HostDashboard";
import UserDashboard from "./UserDashboard";
import Layout from "./Layout";
import "../styles/global.css";   // Global variables
import "../styles/AuthPage.css"; // Page-specific styles
import { useLanguage } from "./LanguageContext"; // Import language context

const backendURL = "http://localhost:5000/api/auth";

export default function AuthPage() {
  const { language } = useLanguage(); // Get current language from context

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    aadhar: "",
  });
  const [message, setMessage] = useState("");
  const [dashboardRole, setDashboardRole] = useState("");
  const [userName, setUserName] = useState("");

  const toggleView = () => {
    setMessage("");
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
      aadhar: "",
    });
    setIsRegister(!isRegister);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${backendURL}/register`, formData);
      setMessage(res.data.message);
      setDashboardRole(formData.role);
      setUserName(formData.name);
    } catch (err) {
      setMessage(err.response?.data.error || (language === "en" ? "Registration failed" : "पंजीकरण विफल हुआ"));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${backendURL}/login`, {
        email: formData.email,
        password: formData.password,
      });
      setMessage(
        res.data.message +
          ", " +
          (language === "en" ? "Welcome" : "स्वागत है") +
          " " +
          res.data.name +
          "!"
      );
      setDashboardRole(res.data.role);
      setUserName(res.data.name);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setMessage(err.response?.data.error || (language === "en" ? "Login failed" : "लॉगिन विफल हुआ"));
    }
  };

  if (dashboardRole === "host") {
    return (
      <Layout logoSrc="/Logo.png">
        <HostDashboard userName={userName} />
      </Layout>
    );
  }
  if (dashboardRole === "user") {
    return (
      <Layout logoSrc="/Logo.png">
        <UserDashboard userName={userName} />
      </Layout>
    );
  }

  // Translation texts for English and Hindi
  const texts = {
    en: {
      register: "Register",
      login: "Login",
      name: "Name",
      phone: "Phone",
      aadhar: "Aadhar",
      roleUser: "User",
      roleHost: "Host (Parking Provider)",
      email: "Email",
      password: "Password",
      alreadyAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      toggleToLogin: "Login",
      toggleToRegister: "Register",
    },
    hi: {
      register: "पंजीकरण करें",
      login: "लॉगिन करें",
      name: "नाम",
      phone: "फ़ोन",
      aadhar: "आधार",
      roleUser: "उपयोगकर्ता",
      roleHost: "मेज़बान (पार्किंग प्रदाता)",
      email: "ईमेल",
      password: "पासवर्ड",
      alreadyAccount: "क्या आपका पहले से खाता है?",
      dontHaveAccount: "क्या आपका खाता नहीं है?",
      toggleToLogin: "लॉगिन",
      toggleToRegister: "पंजीकरण करें",
    },
  };

  const t = texts[language]; // Selected texts based on language

  return (
    <Layout logoSrc="/Logo.png">
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{isRegister ? t.register : t.login}</h1>
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="auth-form">
          {isRegister && (
            <>
              <input
                type="text"
                name="name"
                placeholder={t.name}
                value={formData.name}
                onChange={handleChange}
                required
                className="auth-input"
              />

              <input
                type="text"
                name="phone"
                placeholder={t.phone}
                value={formData.phone}
                onChange={handleChange}
                required
                className="auth-input"
              />

              <input
                type="text"
                name="aadhar"
                placeholder={t.aadhar}
                value={formData.aadhar}
                onChange={handleChange}
                required
                className="auth-input"
              />

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="auth-select"
              >
                <option value="user">{t.roleUser}</option>
                <option value="host">{t.roleHost}</option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder={t.email}
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder={t.password}
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
          />

          <button type="submit" className="auth-btn">
            {isRegister ? t.register : t.login}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? t.alreadyAccount : t.dontHaveAccount}{" "}
          <button onClick={toggleView} className="toggle-btn">
            {isRegister ? t.toggleToLogin : t.toggleToRegister}
          </button>
        </p>

        {message && (
          <p
            className={`auth-message ${
              message.toLowerCase().includes("failed") ? "error" : "success"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
    </Layout>
  );
}
