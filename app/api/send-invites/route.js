import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import { sendMail } from "@/lib/mailer";

export async function POST() {
  try {
    console.log("Starting send-invites process");
    await dbConnect();
    console.log("Database connected");

    // Log environment variables (be careful not to log sensitive info)
    console.log("BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
    console.log("BREVO_API_KEY exists:", !!process.env.BREVO_API_KEY);

    const users = await User.find({
      isActive: false,
      email: { $ne: "" },
      invitationSent: { $ne: true }, // Skip already-invited
    });

    console.log(`Found ${users.length} eligible users to invite`);
    
    // If no users found, add more detailed check
    if (users.length === 0) {
      // Check how many inactive users exist at all
      const inactiveUsers = await User.countDocuments({ isActive: false });
      const usersWithEmail = await User.countDocuments({ 
        isActive: false, 
        email: { $ne: "" } 
      });
      const usersWithToken = await User.countDocuments({ 
        isActive: false, 
        email: { $ne: "" },
        activationToken: { $exists: true, $ne: null }
      });
      const alreadyInvited = await User.countDocuments({ 
        invitationSent: true 
      });
      
      console.log(`Debug counts: ${inactiveUsers} inactive, ${usersWithEmail} with email, ${usersWithToken} with token, ${alreadyInvited} already invited`);
      
      return NextResponse.json({ 
        success: true, 
        sent: 0,
        debug: {
          inactiveUsers,
          usersWithEmail,
          usersWithToken,
          alreadyInvited
        }
      });
    }

    let sent = 0;
    let errors = [];

    for (const user of users) {
      // Ensure token and expiry exist
      if (!user.activationToken || !user.activationTokenExpiresAt) {
        console.log(`User ${user.email} missing activation token or expiry`);
        continue;
      }

      const link = `${process.env.NEXT_PUBLIC_BASE_URL}/activate?token=${user.activationToken}`;
      console.log(`Generated activation link for ${user.email}: ${link}`);

      const html = `
        <h2>Dear ${user.fullName || user.name},</h2>
        <p>You've been invited to activate your BOSAN portal account.</p>
        <p><a href="${link}">Click here to activate your account</a></p>
        <p>This link expires in 3 days.</p>
        <p>Regards,<br>BOSAN Secretariat</p>
      `;

      try {
        console.log(`Attempting to send email to ${user.email}`);
        const mailResult = await sendMail(user.email, "Activate Your BOSAN Account", html);
        console.log(`Email sent to ${user.email}, result:`, mailResult);

        user.invitationSent = true;
        user.lastError = "";
        await user.save();
        console.log(`Updated user ${user.email} as invited`);

        sent++;
      } catch (err) {
        console.error(`Failed to send to ${user.email}:`, err);
        errors.push({
          email: user.email,
          error: err.message || "Unknown error",
          details: err.response?.data || {}
        });

        user.invitationSent = false;
        user.lastError = err.message || "Unknown error";
        await user.save();
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent,
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