import React, { useEffect, useState } from "react";
import api from "../api";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    api.get("/users", {
      headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
    }).then(res => setUsers(res.data));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setEditFormData({
      name: user.name,
      email: user.email
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editingUser}`, editFormData, {
        headers: { Authorization: "Bearer " + localStorage.getItem("adminToken") }
      });
      fetchUsers(); // Refresh the user list
      setEditingUser(null); // Exit edit mode
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingUser(null);
  };

  const containerStyle = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f4f4",
    minHeight: "auto"
  };

  const headingStyle = {
    color: "#333",
    marginBottom: "20px"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff"
  };

  const thStyle = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px"
  };

  const tdStyle = {
    padding: "10px",
    border: "1px solid #ccc"
  };

  const buttonStyle = {
    border: "none",
    borderRadius: "4px",
    padding: "6px 12px",
    cursor: "pointer",
    marginRight: "5px"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>All Users</h2>
      
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={i}>
              {editingUser === u._id ? (
                <>
                  <td style={tdStyle}>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td style={tdStyle}>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                    />
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={{ ...buttonStyle, background: "#2ecc71", color: "#fff" }}
                      onClick={handleEditFormSubmit}
                    >
                      Save
                    </button>
                    <button
                      style={{ ...buttonStyle, background: "#e67e22", color: "#fff" }}
                      onClick={handleCancelClick}
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.email}</td>
                  <td style={tdStyle}>
                    <button
                      style={{ ...buttonStyle, background: "#3498db", color: "#fff" }}
                      onClick={() => handleEditClick(u)}
                    >
                      Edit
                    </button>
                    <button
                      style={{ ...buttonStyle, background: "#e74c3c", color: "#fff" }}
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <br /><br />
      <button> <a href="/">Back</a></button>
    </div>
  );
}