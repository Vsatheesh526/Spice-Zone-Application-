import React, { useState } from "react";
import api from "../api";
import './AddOffer.css';

export default function AddOffer() {
  const [form, setForm] = useState({
    label: "",
    mainText: "",
    subText: "",
    buttonText: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setMsg("Authorization token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const fd = new FormData();
      fd.append("label", form.label);
      fd.append("mainText", form.mainText);
      fd.append("subText", form.subText);
      fd.append("buttonText", form.buttonText);
      if (imageFile) fd.append("image", imageFile);

      await api.post("/offers", fd, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data"
        }
      });

      setMsg("✅ Offer added successfully!");
      setForm({ label: "", mainText: "", subText: "", buttonText: "" });
      setImageFile(null);
    } catch (err) {
      console.error("Error adding offer:", err);
      setMsg("❌ Failed to add offer. Please check your input or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="offer-page">
      <div className="animated-bg"></div>
      <form onSubmit={handleSubmit} className="offer-form" encType="multipart/form-data">
        <h2>Add Offer Banner</h2>

        {msg && <div className={`message ${msg.startsWith("✅") ? "success" : "error"}`}>{msg}</div>}

        <input type="file" name="image" accept="image/*" onChange={handleImageChange} required />
        <input name="label" placeholder="Label (e.g. Food)" value={form.label} onChange={handleChange} required />
        <input name="mainText" placeholder="Main Text (e.g. Flat 50% OFF)" value={form.mainText} onChange={handleChange} required />
        <input name="subText" placeholder="Sub Text (e.g. On Food Orders)" value={form.subText} onChange={handleChange} required />
        <input name="buttonText" placeholder="Button Text (e.g. ORDER NOW)" value={form.buttonText} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Offer"}
        </button>
        <br /><br />
                <button className="back-btn" style={{ color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '10px 20px', borderRadius: '5px' }}>
          <a href="/">Back</a>
        </button>
      </form>
    </div>
  );
}
