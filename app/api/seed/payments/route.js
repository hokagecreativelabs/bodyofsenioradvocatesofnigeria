import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import Payment from "@/models/payment.model";

export async function POST(request) {
  try {
    await dbConnect();

    const { payments } = await request.json();

    if (!payments || !Array.isArray(payments)) {
      return NextResponse.json({ error: "Invalid payment data format" }, { status: 400 });
    }

    let stats = {
      paymentsAddedOrUpdated: 0,
      usersNotFound: 0,
      errors: 0,
    };

    for (const record of payments) {
      try {
        const user = await User.findOne({
          $or: [
            { email: record.email?.toLowerCase() },
            { callUpNumber: record.callUpNumber },
            { fullName: record.fullName },
            { name: record.fullName }
          ].filter(Boolean)
        });

        if (!user) {
          console.warn(`User not found for: ${record.fullName}`);
          stats.usersNotFound++;
          continue;
        }

        for (const yearData of record.yearlyPayments || []) {
          const { year, amountDue, amountPaid, paymentDate, receiptNumber } = yearData;

          const paymentStatus = amountPaid >= amountDue ? 'paid' : 'unpaid';

          await Payment.findOneAndUpdate(
            { userId: user._id, year },
            {
              userId: user._id,
              year,
              amountDue,
              amountPaid,
              paymentStatus,
              paymentMethod: 'manual',
              datePaid: amountPaid > 0 ? new Date(paymentDate || `${year}-12-31`) : null,
              receiptNumber: amountPaid > 0
                ? receiptNumber || `BOSAN-${year}-${user.callUpNumber || user.email}`
                : null,
              updatedAt: new Date()
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          stats.paymentsAddedOrUpdated++;
        }
      } catch (err) {
        console.error(`Error processing ${record.fullName}:`, err);
        stats.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payments processed successfully",
      ...stats,
    });
  } catch (err) {
    console.error("Payment seeding error:", err);
    return NextResponse.json({ error: "Failed to seed payments" }, { status: 500 });
  }
}
