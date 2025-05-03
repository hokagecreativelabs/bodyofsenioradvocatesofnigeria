import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import { sendMail } from "@/lib/mailer";

export async function POST() {
  try {
    await dbConnect();
    
    // Add logging to see what's happening in production
    console.log("BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
    
    const users = await User.find({
      isActive: false,
      email: { $ne: "" },
      invitationSent: { $ne: true }, // Skip already-invited
    });
    
    console.log(`Found ${users.length} users to invite`);
    
    let sent = 0;
    let errors = [];

    for (const user of users) {
      // Ensure token and expiry exist
      if (!user.activationToken || !user.activationTokenExpiresAt) {
        console.log(`Skipping user ${user.email} - missing token or expiry`);
        continue;
      }

      // Fix the template literal syntax with backticks
      const link = `${process.env.NEXT_PUBLIC_BASE_URL}/activate?token=${user.activationToken}`;
      
      const html = `
        <h2>Dear ${user.fullName || user.name},</h2>
        <p>You've been invited to activate your BOSAN portal account.</p>
        <p><a href="${link}">Click here to activate your account</a></p>
        <p>This link expires in 3 days.</p>
        <p>Regards,<br>BOSAN Secretariat</p>
      `;

      try {
        console.log(`Attempting to send email to ${user.email}`);
        const result = await sendMail(user.email, "Activate Your BOSAN Account", html);
        console.log(`Email result:`, result);

        user.invitationSent = true;
        user.lastError = "";
        await user.save();

        sent++;
        console.log(`Successfully sent to ${user.email}`);
      } catch (err) {
        const errorMsg = err.message || "Unknown error";
        console.error(`Failed to send to ${user.email}:`, errorMsg);
        if (err.response) {
          console.error("API Response:", err.response.data);
        }

        user.invitationSent = false;
        user.lastError = errorMsg;
        await user.save();
        
        errors.push({
          email: user.email,
          error: errorMsg
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent,
      total: users.length,
      errors: errors.length > 0 ? errors : undefined 
    });
  } catch (mainError) {
    console.error("Main function error:", mainError);
    return NextResponse.json({ 
      success: false, 
      error: mainError.message,
      sent: 0
    }, { status: 500 });
  }
}