import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import { sendMail } from "@/lib/mailer";

export async function POST() {
  await dbConnect();
  
  const users = await User.find({
    isActive: false,
    email: { $ne: "" },
    invitationSent: { $ne: true },
  });

  let sent = 0;

  for (const user of users) {
    if (!user.activationToken || !user.activationTokenExpiresAt) continue;

    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/activate?token=${user.activationToken}`;

    const html = `
      <h2>Dear ${user.fullName || user.name},</h2>
      <p>You’ve been invited to activate your BOSAN portal account.</p>
      <p><a href="${link}">Click here to activate your account</a></p>
      <p>This link expires in 3 days.</p>
      <p>Regards,<br>BOSAN Secretariat</p>
    `;

    try {
      await sendMail(user.email, "Activate Your BOSAN Account", html);

      user.invitationSent = true;
      user.lastError = "";
      await user.save();

      sent++;
    } catch (err) {
      console.error("Failed to send to", user.email, err);

      user.invitationSent = false;
      user.lastError = err.message || "Unknown error";
      await user.save();
    }
  }

  return NextResponse.json({ success: true, sent });
}
