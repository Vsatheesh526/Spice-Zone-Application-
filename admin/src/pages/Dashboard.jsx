import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  React.useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const handleProfile = async () => {
    setLoading(true);
    setError('');
    setShowProfileModal(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch("/api/adminprofile/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setProfile(data);
      setForm({ name: data.name || '' });
    } catch (err) {
      setError('Could not load profile.');
    }
    setLoading(false);
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => { setEditMode(false); setForm({ name: profile.name }); };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('name', form.name);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      const res = await fetch("/api/adminprofile/profile", {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const updated = await res.json();
      setProfile(updated);
      setEditMode(false);
    } catch (err) {
      setError('Could not update profile.');
    }
    setLoading(false);
  };

  if (pageLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader" style={{ border: '6px solid #f3f3f3', borderTop: '6px solid #007bff', borderRadius: '50%', width: 60, height: 60, animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <nav
        className="dashboard-navbar"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 32px",
          background: "#007bff",
          width: "120%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
        }}
      >
        <h2 className="dashboard-title" style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
          Admin Dashboard
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            style={{
              marginRight: "12px",
              background: "#fff",
              color: "#007bff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "background 0.2s, color 0.2s, box-shadow 0.2s"
            }}
            onClick={handleProfile}
            onMouseOver={e => {
              e.target.style.background = "#e3f0ff";
              e.target.style.color = "#0056b3";
              e.target.style.boxShadow = "0 2px 8px rgba(0,123,255,0.10)";
            }}
            onMouseOut={e => {
              e.target.style.background = "#fff";
              e.target.style.color = "#007bff";
              e.target.style.boxShadow = "none";
            }}
          >
            Profile
          </button>
          <button
            style={{
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "background 0.2s, box-shadow 0.2s"
            }}
            onClick={handleLogout}
            onMouseOver={e => {
              e.target.style.background = "#c0392b";
              e.target.style.boxShadow = "0 2px 8px rgba(231,76,60,0.10)";
            }}
            onMouseOut={e => {
              e.target.style.background = "#e74c3c";
              e.target.style.boxShadow = "none";
            }}
          >
            Logout
          </button>
          <button
            style={{
              background: "#fff",
              color: "#007bff",
              border: "0.1px solid #007bff",
              borderRadius: "4px",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "background 0.2s, color 0.2s, box-shadow 0.2s"
            }}
            onClick={() => {
              const footer = document.querySelector('.admin-dashboard-footer');
              if (footer) {
                footer.scrollIntoView({ behavior: 'smooth' });
                footer.classList.add('footer-highlight');
                setTimeout(() => footer.classList.remove('footer-highlight'), 1200);
              }
            }}
          >
            Support
          </button>
        </div>
      </nav>
      <br />
      <br/>
      <div className="dashboard-grid">
        <Link to="/add-product" className="dashboard-card">➕ Add Product</Link>
        <Link to="/view-products" className="dashboard-card">📦 View Products</Link>
        <Link to="/add-offer" className="dashboard-card">🎁 Add Offer</Link>
        <Link to="/view-offers" className="dashboard-card">🔍 View Offers</Link>
        <Link to="/view-users" className="dashboard-card">👤 View Users</Link>
        <Link to="/view-orders" className="dashboard-card">📄 View Orders</Link>
        <Link to="/add-city" className="dashboard-card">🏙️ Add City</Link>
        <Link to="/view-cities" className="dashboard-card">🌆 View Cities</Link>
      </div>
      {showProfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 400,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative', textAlign: 'center'
          }}>
            <button onClick={() => setShowProfileModal(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>×</button>
            <h2 style={{ marginBottom: 18 }}>Admin Profile</h2>
            {loading ? <div>Loading...</div> : error ? <div style={{color:'red'}}>{error}</div> : profile && (
              <>
                {profile.profileImage && (
                  <div style={{ marginBottom: 18 }}>
                                        <img
                      src={
                        profile.profileImage && profile.profileImage.startsWith('http')
                          ? profile.profileImage
                          : `http://localhost:5000${profile.profileImage}`
                      }
                      alt="Profile"
                      style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff' }}
                    />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: 24 }}>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Email:</strong> <span>{profile.email}</span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>Signup Date:</strong> <span>{profile.createdAt ? new Date(profile.createdAt).toLocaleString() : ''}</span>
                  </div>
                  <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                    <strong>Name:</strong>
                    {editMode ? (
                      <input name="name" value={form.name} onChange={handleChange} style={{ marginLeft: 8, padding: 4, borderRadius: 4, border: '1px solid #ccc' }} />
                    ) : (
                      <span style={{ marginLeft: 8 }}>{profile.name}</span>
                    )}
                  </div>
                  {editMode && (
                    <div style={{ marginBottom: 12 }}>
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                  )}
                </div>
                {editMode ? (
                  <div style={{ display: 'flex', gap: 8, marginLeft: 24, marginTop: 8 }}>
                    <button onClick={handleSave} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                    <button onClick={handleCancel} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={handleEdit} style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginLeft: 24, marginTop: 8 }}>Edit</button>
                )}
              </>
            )}
          </div>
        </div>
      )}
      <div className="admin-dashboard-footer" style={{ textAlign: 'center', padding: 24, background: '#f5f5f5', marginTop: 40,width: '120%' }}>
        <p>Admin Support: support@spicezone.com | +91-12345-67890</p>
        <p>&copy; 2023 SpiceZone Admin Panel</p>


        <form
style={{ maxWidth: 400, margin: '24px auto 0', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', padding: 24, textAlign: 'left' }}
action="https://formspree.io/f/xvgrblno"
method="POST"
encType="multipart/form-data"
>
<h3 style={{ marginBottom: 16, color: '#007bff' }}>Contact Support</h3>
<div style={{ marginBottom: 14 }}>
  <label style={{ fontWeight: 600 }}>Email:</label>
  <input name="email" type="email" required style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc' }} />
</div>
<div style={{ marginBottom: 14 }}>
  <label style={{ fontWeight: 600 }}>Your Problem:</label>
  <textarea name="message" required rows={3} style={{ width: '100%', padding: 6, borderRadius: 4, border: '1px solid #ccc', resize: 'vertical' }} />
</div>
<button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Submit</button>
</form>


        
      </div>
      
    </div>
  );
}