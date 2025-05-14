const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: false, // Each transaction reference must be unique
    },
    Name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    source: { 
      type: String, 
      enum: ["paystack", "excel"] 
    },
    amountDue: {
      type: Number
    },
    amountPaid: {
      type: Number
    },
    amountOutstanding: {
      type: Number
    },
    amountPaidInAdvance: {
      type: Number
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
