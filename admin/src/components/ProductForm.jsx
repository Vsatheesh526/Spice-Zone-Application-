import React, { useState } from "react";
import api from "../api";              // axios instance pointed at your server
import "./ProductForm.css";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    rating: 0,
    description: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // build multipart form data
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("rating", form.rating);
    fd.append("description", form.description);
    if (imageFile) fd.append("image", imageFile);

    try {
      const { data } = await api.post("/products", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + localStorage.getItem("adminToken")
        }
      });
      setMsg("✅ Product saved!");
      // clear form
      setForm({ name: "", price: "", rating: 0, description: "" });
      setImageFile(null);
    } catch (err) {
      console.error(err);
      setMsg("❌ Error saving product");
    }
  };

  return (
    <div className="product-page">
      <div className="product-bg-animation" />
      <form
        className="product-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2>Add Product</h2>
        {msg && (
          <div
            style={{
              color: msg.startsWith("✅") ? "green" : "red",
              marginBottom: 10
            }}
          >
            {msg}
          </div>
        )}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <input
          name="rating"
          type="number"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">Add Product</button>
        <br />
        <br />
        <button className="back-btn" style={{ color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '10px 20px', borderRadius: '5px' }}>
          <a href="/">Back</a>
        </button>
      </form>
    </div>
  );
}
