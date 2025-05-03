import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  elevationYear: Number,
  callUpNumber: Number,
  fullName: String,
  email: { type: String, default: "" },
  isActive: { type: Boolean, default: false },
  activationToken: String,
  activationTokenExpiresAt: Date,
  invitationSent: { type: Boolean, default: false },
  lastError: { type: String, default: "" },

  // ✅ New field
  password: { type: String, required: false },
});


const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
