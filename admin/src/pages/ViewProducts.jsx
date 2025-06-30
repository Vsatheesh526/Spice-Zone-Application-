import React, { useEffect, useState } from "react";
import api from "../api";
import "./ViewProducts.css";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    image: null, // Changed to null for file upload
    rating: "",
    description: ""
  });
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        setError("Failed to delete product");
        console.error(err);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditFormData({
      name: product.name,
      price: product.price,
      image: null, // Reset to null when starting edit
      rating: product.rating,
      description: product.description
    });
    setPreviewImage(product.image); // Set preview to current image
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFormData({
        ...editFormData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("price", editFormData.price);
      formData.append("rating", editFormData.rating);
      formData.append("description", editFormData.description);
      
      // Only append image if a new one was selected
      if (editFormData.image) {
        formData.append("image", editFormData.image);
      }

      // Use appropriate headers for file upload
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };

      await api.put(`/products/${id}`, formData, config);
      
      setEditingProduct(null);
      fetchProducts(); // Refresh the products list
    } catch (error) {
      setError(`Error updating product: ${error.message}`);
      console.error("Error updating product:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setError(null);
  };

  return (
    <div className="products-page">
      <div className="products-bg-animation"></div>
      <div className="products-container">
        <h2>All Products</h2>
        {error && <div className="error-message">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Rating</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td>
                  {editingProduct === p._id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td>
                  {editingProduct === p._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditFormChange}
                    />
                  ) : (
                    p.price
                  )}
                </td>
                <td>
                  {editingProduct === p._id ? (
                    <div className="image-upload-container">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {previewImage && (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          width={60} 
                          height={60} 
                          style={{marginTop: '10px'}}
                        />
                      )}
                    </div>
                  ) : (
                    <img src={p.image} alt={p.name} width={60} height={60} />
                  )}
                </td>
                <td>
                  {editingProduct === p._id ? (
                    <input
                      type="number"
                      name="rating"
                      value={editFormData.rating}
                      onChange={handleEditFormChange}
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  ) : (
                    p.rating
                  )}
                </td>
                <td>
                  {editingProduct === p._id ? (
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditFormChange}
                    />
                  ) : (
                    p.description
                  )}
                </td>
                <td>
                  {editingProduct === p._id ? (
                    <>
                      <button 
                        className="save-btn" 
                        onClick={() => handleEditSubmit(p._id)}
                      >
                        Save
                      </button>
                      <h1></h1>
                      <button 
                        className="cancel-btn" 
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="edit-btn" 
                        onClick={() => handleEditClick(p)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h1></h1>
        <h1></h1>
        <button className="back-btn" style={{ color: 'black', backgroundColor: 'white', border: '1px solid black', padding: '10px 20px', borderRadius: '5px' }}>
          <a href="/">Back</a>
        </button>
      </div>
    </div>
  );
}