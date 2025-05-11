const mongoose = require('mongoose');

const uri = 'mongodb+srv://pucit:orochimaru1@mfonbooks.krds7.mongodb.net/bosan';

const userSchema = new mongoose.Schema({
  id: Number,
  name: String,
  fullName: String,
  elevationYear: Number,
  callUpNumber: Number,
  email: String,
  isActive: Boolean,
  invitationSent: Boolean,
  lastError: String,
  password: String
});

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userCallUpNumber: Number,
  fullName: String,
  year: Number,
  amountDue: Number,
  amountPaid: Number,
  amountOutstanding: Number,
  amountPaidInAdvance: Number,
  paymentStatus: String,
  paymentMethod: String,
  datePaid: Date,
  receiptNumber: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

async function generatePaymentData() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const users = await User.find({});
    const amountsByYear = {
      2013: 50000, 2014: 50000, 2015: 50000,
      2016: 100000, 2017: 100000, 2018: 100000,
      2019: 100000, 2020: 100000, 2021: 100000,
      2022: 100000, 2023: 100000, 2024: 100000,
      2025: 100000
    };

    let totalPayments = 0;

    for (const user of users) {
      const startYear = Math.max(2013, user.elevationYear || 2013);
      for (let year = startYear; year <= 2025; year++) {
        const amountDue = amountsByYear[year] || 100000;
        const paymentData = {
          userId: user._id,
          userCallUpNumber: user.callUpNumber || user.id,
          fullName: user.fullName || user.name,
          year,
          amountDue,
          amountPaid: amountDue,
          amountOutstanding: 0,
          amountPaidInAdvance: 0,
          paymentStatus: 'paid',
          paymentMethod: 'manual',
          datePaid: new Date(`${year}-12-31`),
          receiptNumber: `BOSAN-${year}-${user.callUpNumber || user.id}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await Payment.findOneAndUpdate(
          { userId: user._id, year },
          paymentData,
          { upsert: true, new: true }
        );

        totalPayments++;
      }

      console.log(`Payments generated for: ${user.fullName || user.name}`);
    }

    console.log(`Done. Total payment records generated/updated: ${totalPayments}`);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
}

generatePaymentData();
