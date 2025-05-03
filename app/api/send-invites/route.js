import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import { sendMail } from "../../../lib/mailer"; // Updated to use Resend

export async function POST() {
  try {
    console.log("Starting send-invites process");
    await dbConnect();
    console.log("Database connected");

    const users = await User.find({
      isActive: false,
      email: { $ne: "" },
      invitationSent: { $ne: true }, // Skip already-invited
    });

    console.log(`Found ${users.length} eligible users to invite`);
    
    if (users.length === 0) {
      const inactiveUsers = await User.countDocuments({ isActive: false });
      const usersWithEmail = await User.countDocuments({ 
        isActive: false, 
        email: { $ne: "" } 
      });
      
      console.log(`Debug counts: ${inactiveUsers} inactive, ${usersWithEmail} with email`);
      
      return NextResponse.json({ 
        success: true, 
        sent: 0,
        message: "No eligible users found to send invitations"
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

      const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/activate?token=${user.activationToken}`;
      console.log(`Generated activation link for ${user.email}: ${activationLink}`);

      try {
        console.log(`Attempting to send email to ${user.email}`);
        
        // Send email using React Email template
        const mailResult = await sendMail(
          user.email, 
          "Activate Your BOSAN Account", 
          {
            userName: user.fullName || user.name,
            activationLink: activationLink
          }
        );
        
        console.log(`Email sent to ${user.email}`);

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