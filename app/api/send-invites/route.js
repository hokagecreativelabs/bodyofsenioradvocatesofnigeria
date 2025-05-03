import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import { sendMail } from "@/lib/mailer";

export async function POST() {
  await dbConnect();

  const users = await User.find({
    isActive: false,
    email: { $ne: "" },
    invitationSent: { $ne: true }, // Skip already-invited
  });

  let sent = 0;
  const results = [];

  for (const user of users) {
    // Ensure token and expiry exist
    if (!user.activationToken || !user.activationTokenExpiresAt) continue;

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/activate?token=${user.activationToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>BOSAN Account Activation</h2>
        <p>Dear ${user.fullName || user.name},</p>
        <p>You've been invited to activate your BOSAN portal account.</p>
        <p style="margin: 20px 0;">
          <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">
            Click here to activate your account
          </a>
        </p>
        <p>This link expires in 3 days.</p>
        <p>Regards,<br>BOSAN Secretariat</p>
      </div>
    `;

    try {
      await sendMail(user.email, "Activate Your BOSAN Account", html);

      user.invitationSent = true;
      user.lastError = "";
      await user.save();

      results.push({ email: user.email, status: 'success' });
      sent++;
    } catch (err) {
      console.error("Failed to send to", user.email, err);

      user.invitationSent = false;
      user.lastError = err.message || "Unknown error";
      await user.save();
      
      results.push({ email: user.email, status: 'failed', error: err.message });
    }
  }

  return NextResponse.json({ success: true, sent, results });
}