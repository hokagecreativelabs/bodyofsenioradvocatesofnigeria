import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: String,
  fullName: String,
  elevationYear: Number,
  callUpNumber: Number,
  email: { 
    type: String, 
    default: "",
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Invalid email address",
  ],
  index: true, 
  },
  subscription: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Subscription" 
},
  isActive: { type: Boolean, default: false },
  activationToken: String,
  activationTokenExpiresAt: Date,
  invitationSent: { type: Boolean, default: false },
  lastError: { type: String, default: "" },
  password: { type: String, required: false }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
