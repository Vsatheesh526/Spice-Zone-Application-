const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImageUrl: String // Add this field for profile image
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);


