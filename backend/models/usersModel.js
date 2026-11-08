const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  password: [{ type: String, required: true }],
  emailVerificado: { type: Boolean, required: true, default: false },
  country: [{ type: String, required: true }],
  uniqueString: { type: String, required: true },
  picture: { type: String, default: "" },
  photo: { type: String, default: "" },
  from: { type: Array, default: [] },
});

const User = mongoose.model("users", userSchema);
module.exports = User;
