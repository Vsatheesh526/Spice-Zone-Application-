import React, { useEffect, useState } from "react";
import api from "../api";

export default function ViewOffers() {
  const [offers, setOffers] = useState([]);
  const [editingOffer, setEditingOffer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    label: "",
    mainText: "",
    subText: "",
    buttonText: "",
    image: null
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOffers = () => {
    api.get("/offers").then(res => setOffers(res.data));
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await api.delete(`/offers/${id}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
        });
        fetchOffers();
      } catch (err) {
        setError("Failed to delete offer. Please try again.");
      }
    }
  };

  const handleEditClick = (offer) => {
    setEditingOffer(offer._id);
    setEditFormData({
      label: offer.label,
      mainText: offer.mainText,
      subText: offer.subText,
      buttonText: offer.buttonText,
      image: null
    });
    setPreviewImage(offer.image);
    setError("");
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditSubmit = async (id) => {
    setLoading(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("label", editFormData.label);
      formData.append("mainText", editFormData.mainText);
      formData.append("subText", editFormData.subText);
      formData.append("buttonText", editFormData.buttonText);
      
      if (editFormData.image) {
        formData.append("image", editFormData.image);
      }

      await api.put(`/offers/${id}`, formData, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("adminToken"),
          "Content-Type": "multipart/form-data"
        }
      });

      setEditingOffer(null);
      fetchOffers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update offer");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingOffer(null);
    setError("");
  };

  if (!offers || offers.length === 0) {
    return <p style={{ textAlign: "center" }}>No offers available.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <button style={{ height: "50px", marginBottom: "20px" }}>
        <a href="/">Back</a>
      </button>
      
      {error && (
        <div style={{ color: "red", marginBottom: "20px", textAlign: "center" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center" }}>
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="main-homepage-offer-banner"
            style={{
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
              width: 400,
              marginBottom: 24,
              background: "#fff",
              position: "relative"
            }}
          >
            {editingOffer === offer._id ? (
              <div style={{ padding: "16px" }}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "4px" }}>Label:</label>
                  <input
                    type="text"
                    name="label"
                    value={editFormData.label}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "4px" }}>Main Text:</label>
                  <input
                    type="text"
                    name="mainText"
                    value={editFormData.mainText}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "4px" }}>Sub Text:</label>
                  <input
                    type="text"
                    name="subText"
                    value={editFormData.subText}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "4px" }}>Button Text:</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={editFormData.buttonText}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "8px" }}
                  />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", marginBottom: "4px" }}>Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: "100%", padding: "8px" }}
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ width: "100%", height: "180px", objectFit: "cover", marginTop: "8px" }}
                    />
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEditSubmit(offer._id)}
                    disabled={loading}
                    style={{
                      background: "#27ae60",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      background: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="offer-banner-img" style={{ width: "100%", height: 180, overflow: "hidden" }}>
                  <img
                    src={offer.image || "https://via.placeholder.com/400x180?text=No+Image"}
                    alt={offer.label || "Offer"}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div className="offer-banner-content" style={{ padding: 16 }}>
                  <div className="offer-banner-title">
                    <span className="offer-food-label" style={{ fontWeight: "bold", color: "#d35400" }}>
                      {offer.label || "No Label"}
                    </span>
                    <div className="offer-banner-main" style={{ fontSize: 22, fontWeight: "bold" }}>
                      {offer.mainText || "No Main Text"}
                    </div>
                    <div className="offer-banner-sub" style={{ color: "#888" }}>
                      {offer.subText || "No Sub Text"}
                    </div>
                  </div>
                  <button className="offer-banner-btn" style={{ marginTop: 12, background: "#d35400", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 6 }}>
                    {offer.buttonText || "No Button Text"}
                  </button>
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                      onClick={() => handleEditClick(offer)}
                      style={{
                        background: "#3498db",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      style={{
                        background: "#e74c3c",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

