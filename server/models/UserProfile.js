const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  address: String,
});
module.exports = mongoose.model("User", UserSchema);




