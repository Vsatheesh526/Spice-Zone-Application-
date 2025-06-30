import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("adminToken", data.token);
        onLogin && onLogin();
        navigate("/");
      } else {
        setMsg(data.error || "Login failed");
      }
    } catch (err) {
      setMsg("Login failed");
    }
  };

  // 🎨 Inline styles
  const containerStyle = {
    maxWidth: 400,
    margin: "60px auto",
    padding: 48,
    border: "1px solid #ccc",
    borderRadius: 8,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff"
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: 24
  };

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontWeight: "bold"
  };

  const inputStyle = {
    width: "100%",
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 4,
    boxSizing: "border-box"
  };

  const fieldStyle = {
    marginBottom: 16
  };

  const buttonStyle = {
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    padding: "10px 18px",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%"
  };

  const linkStyle = {
    textAlign: "center",
    marginTop: 20,
    fontSize: "14px"
  };

  const msgStyle = {
    color: "red",
    marginTop: 16,
    textAlign: "center"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Email:</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Password:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Login</button>
        <div style={linkStyle}>
          Don’t have an account? <a href="/signup">Sign Up</a>
        </div>
      </form>
      {msg && <div style={msgStyle}>{msg}</div>}
    </div>
  );
}
