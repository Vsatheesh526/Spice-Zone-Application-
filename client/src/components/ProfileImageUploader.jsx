import React, { useState } from "react";

const ProfileImageUploader = ({ onImageUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageUpload(file);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && (
        <div style={{ marginTop: 8 }}>
          <img src={preview} alt="Preview" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
};

export default ProfileImageUploader;
