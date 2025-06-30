import React, { useEffect, useState } from "react";
import api from "../api"; // your axios instance

const UserInfo = () => {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const userName = localStorage.getItem("userName") || "";
    const userEmail = localStorage.getItem("userEmail") || "";
    setUser({ name: userName, email: userEmail });
  }, []);

  return (
    <div style={{
      maxWidth: "400px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      textAlign: "left",
      fontFamily: "sans-serif"
    }}>
      <div style={{ marginBottom: "10px", fontSize: "18px" }}>
        <b>Name:</b> <span>{user.name}</span>
      </div>
      <div style={{ fontSize: "18px",width: "100%" }}>
        <b>Email:</b> <span>{user.email}</span>
      </div>
    </div>
  );
};

export default UserInfo;