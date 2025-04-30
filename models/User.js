// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: [true, "Full name is required"] 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    password: { 
      type: String, 
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"]
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    lastLogin: {
      type: Date
    }
  },
  { 
    timestamps: true,
    collection: "learned-silk" // Specific collection name as requested
  }
);

// Prevent duplicate model initialization
export default mongoose.models.User || mongoose.model("User", UserSchema);