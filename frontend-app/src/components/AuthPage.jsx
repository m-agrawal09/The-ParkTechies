import React, { useState } from "react";
import axios from "axios";
import HostDashboard from "./HostDashboard";
import UserDashboard from "./UserDashboard";

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
    <div style={{ maxWidth: 400, margin: "auto", marginTop: 50 }}>
      <h1>{isRegister ? "Register" : "Login"}</h1>
      <form onSubmit={isRegister ? handleRegister : handleLogin}>
        {isRegister && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, margin: "8px 0" }}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, margin: "8px 0" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, margin: "8px 0" }}
        />
        {isRegister && (
          <select name="role" value={formData.role} onChange={handleChange} style={{ width: "100%", padding: 8, margin: "8px 0" }}>
            <option value="user">User</option>
            <option value="host">Host (Parking Provider)</option>
          </select>
        )}
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#007bff", border: "none", color: "white", borderRadius: 6, cursor: "pointer" }}>
          {isRegister ? "Register" : "Login"}
        </button>
      </form>
      <button onClick={toggleView} style={{ marginTop: 20, background: "none", border: "none", color: "#007bff", cursor: "pointer" }}>
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </button>
      {message && <p style={{ marginTop: 15, color: message.toLowerCase().includes("failed") ? "red" : "green" }}>{message}</p>}
    </div>
  );
}
