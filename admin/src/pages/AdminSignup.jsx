import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignup() {
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('name', form.name);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      const res = await fetch('http://localhost:5000/api/admin/signup', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1000);
      } else setError(data.error || 'Signup failed');
    } catch (err) {
      setError('Signup failed');
    }
  };

  // 🎨 Inline Styles
  const containerStyle = {
    width: '400px', // reduced width
    margin: '10px auto',
    height: 'auto',
    padding: 32, // reduced padding
    border: '1px solid #ccc',
    borderRadius: 8,
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  };

  const AdminSignupPage = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // fill viewport but block is smaller
   
  };



  const labelStyle = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 'bold',
  };

  const inputStyle = {
    width: '100%',
    padding: 8,
    border: '1px solid #ccc',
    borderRadius: 4,
    boxSizing: 'border-box',
  };

  const fieldStyle = {
    marginBottom: 16,
  };

  const buttonStyle = {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    padding: '10px 18px',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    marginTop: 10,
  };

  const messageStyle = {
    marginTop: 16,
    color: 'green',
    fontWeight: 500,
  };

  const errorStyle = {
    marginTop: 16,
    color: 'red',
    fontWeight: 500,
  };

  return (
    <div style={AdminSignupPage}>
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Admin Signup</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div style={fieldStyle}>
          <label style={labelStyle}>Email:</label>
          <input name="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Password:</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} style={inputStyle} />
        </div>
        <button type="submit" style={buttonStyle}>Sign Up</button>
        <br/>
        <br/>
        already have an account? <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login</a>
      </form>
      {message && <div style={messageStyle}>{message}</div>}
      {error && <div style={errorStyle}>{error}</div>}
    </div>
    
    </div>
  );
}
