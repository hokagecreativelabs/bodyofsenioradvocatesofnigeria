import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // User's basic details
    name: { type: String, required: true },
    fullName: { type: String, required: true },

    // Year and Call-up number for tracking
    elevationYear: { type: Number, required: false },
    callUpNumber: { type: Number, required: false },

    // Email with validation and uniqueness
    email: { 
      type: String, 
      unique: true, 
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 
        "Please provide a valid email address"
      ]
    },

    // Financial field: Outstanding debit balance
    debitBalance: { 
      type: Number, 
      default: 0, 
      validate: {
        validator: (value) => value >= 0,
        message: "Debit balance cannot be negative",
      },
    },

    // Account status
    isActive: { type: Boolean, default: false },

    // Activation details
    activationToken: { type: String, required: false },
    activationTokenExpiresAt: { type: Date, required: false },

    // Invitation status
    invitationSent: { type: Boolean, default: false },

    // To log errors related to the user
    lastError: { type: String, default: "" },

    // Authentication: User's password (hashed)
    password: { type: String, required: false },

    // Role-based access control
    role: { 
      type: String, 
      enum: ["admin", "user"], 
      default: "user" 
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` timestamps automatically
  }
);


// Export the User model
const User = mongoose.models.User || mongoose.model("User", userSchema);
// module.exports = User;
export default User;
