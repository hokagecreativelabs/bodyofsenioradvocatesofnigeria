import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["active", "scheduled", "expired"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
