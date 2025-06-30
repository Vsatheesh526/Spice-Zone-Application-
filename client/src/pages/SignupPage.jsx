import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthPages.css";
import ProfileImageUploader from "../components/ProfileImageUploader";

const SignupPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (profileImage) formData.append("profileImage", profileImage);

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful!");
        // Save userName, userEmail, and profileImageUrl in localStorage
        localStorage.setItem("userName", form.name);
        localStorage.setItem("userEmail", form.email);
        if (data.profileImageUrl) {
          localStorage.setItem("profileImageUrl", data.profileImageUrl);
        }
        // Store JWT token for persistent login
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setForm({ name: "", email: "", password: "" });
        setProfileImage(null);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (err) {
      setMessage("Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form
        className="auth-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <ProfileImageUploader onImageUpload={setProfileImage} />
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <p className="auth-link">
        Already have an account? <Link to="/login">Go to Login</Link>
      </p>
    </div>
  );
};

export default SignupPage;