import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  year: { type: Number, required: true },
  amountDue: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  datePaid: { type: Date },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'paid_in_advance'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['manual', 'paystack', 'other'],
    default: 'manual'
  },
  reference: { type: String },
  receiptNumber: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure uniqueness for yearly payment per user
paymentSchema.index({ userId: 1, year: 1 }, { unique: true });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
