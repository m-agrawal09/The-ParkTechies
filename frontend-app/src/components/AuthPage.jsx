import React, { useState } from "react";
import axios from "axios";
import HostDashboard from "./HostDashboard";
import UserDashboard from "./UserDashboard";
import "../styles/global.css";   // ✅ Global variables
import "../styles/AuthPage.css"; // ✅ Page-specific styles

const backendURL = "http://localhost:5000/api/auth";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const [dashboardRole, setDashboardRole] = useState("");
  const [userName, setUserName] = useState("");

  const toggleView = () => {
    setMessage("");
    setFormData({ name: "", email: "", password: "", role: "user" });
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
      setMessage(err.response?.data.error || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${backendURL}/login`, { email: formData.email, password: formData.password });
      setMessage(res.data.message + ", Welcome " + res.data.name + "!");
      setDashboardRole(res.data.role);
      setUserName(res.data.name);
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      setMessage(err.response?.data.error || "Login failed");
    }
  };

  if (dashboardRole === "host") {
    return <HostDashboard userName={userName} />;
  }
  if (dashboardRole === "user") {
    return <UserDashboard userName={userName} />;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{isRegister ? "Register" : "Login"}</h1>
        <form onSubmit={isRegister ? handleRegister : handleLogin} className="auth-form">
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="auth-input"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="auth-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="auth-input"
          />
          {isRegister && (
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="auth-select"
            >
              <option value="user">User</option>
              <option value="host">Host (Parking Provider)</option>
            </select>
          )}
          <button type="submit" className="auth-btn">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p className="toggle-text">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={toggleView} className="toggle-btn">
            {isRegister ? "Login" : "Register"}
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
  );
}
