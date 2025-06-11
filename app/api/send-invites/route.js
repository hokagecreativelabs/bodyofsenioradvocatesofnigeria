import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/models/user.model";
import { sendMail, createActivationEmailTemplate } from "@/lib/mailer";

// Generate activation token and expiry for users who don't have one
function generateActivationToken() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  return { token, expiry };
}

// Add delay between emails to avoid being flagged as spam
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request) {
  try {
    await dbConnect();
    
    // Check for required environment variables
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('Missing required email credentials: SMTP_HOST, SMTP_USER, or SMTP_PASS');
      return NextResponse.json({
        success: false,
        error: 'Missing email configuration'
      }, { status: 500 });
    }

    // Parse request body to get optional parameters
    let userIds = null;
    let forceResend = false;
    let batchSize = 10; // Send emails in batches to avoid spam detection
    
    try {
      const body = await request.json();
      userIds = body.userIds;
      forceResend = body.forceResend || false;
      batchSize = body.batchSize || 10;
    } catch (error) {
      console.log('No request body provided, using default behavior');
    }

    // Build query based on parameters
    let query = {
      isActive: false,
      email: { $ne: "" }
    };

    if (userIds && Array.isArray(userIds) && userIds.length > 0) {
      query._id = { $in: userIds };
    }

    if (!forceResend) {
      query.invitationSent = { $ne: true };
    }

    const users = await User.find(query);

    console.log(`Found ${users.length} users to send invites to`);

    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        results: [],
        message: 'No users found matching criteria'
      });
    }

    let sent = 0;
    const results = [];

    // Process users in batches
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      for (const user of batch) {
        // Generate token if missing
        if (!user.activationToken || !user.activationTokenExpiresAt) {
          console.log(`Generating activation token for user: ${user.email}`);
          const { token, expiry } = generateActivationToken();
          user.activationToken = token;
          user.activationTokenExpiresAt = expiry;
          
          try {
            await user.save();
          } catch (saveError) {
            console.error(`Failed to save activation token for ${user.email}:`, saveError);
            results.push({
              email: user.email,
              status: 'failed',
              reason: 'Failed to generate activation token',
              error: saveError.message
            });
            continue;
          }
        }

        // Check if token is expired
        if (user.activationTokenExpiresAt < new Date()) {
          console.log(`Token expired for user: ${user.email}, generating new one`);
          const { token, expiry } = generateActivationToken();
          user.activationToken = token;
          user.activationTokenExpiresAt = expiry;
          
          try {
            await user.save();
          } catch (saveError) {
            console.error(`Failed to update expired token for ${user.email}:`, saveError);
            results.push({
              email: user.email,
              status: 'failed',
              reason: 'Failed to update expired token',
              error: saveError.message
            });
            continue;
          }
        }

        const activationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/activate?token=${user.activationToken}`;

        // Use the improved email template
        const html = createActivationEmailTemplate(user, activationLink);

        try {
          await sendMail(
            user.email, 
            "BOSAN Account Activation Required", // More professional subject
            html
          );

          // Update user status
          user.invitationSent = true;
          user.lastError = "";
          
          try {
            await user.save();
            results.push({ 
              email: user.email, 
              status: 'success',
              tokenGenerated: !user.activationToken
            });
            sent++;
          } catch (saveError) {
            console.error(`Email sent but failed to update user ${user.email}:`, saveError);
            results.push({
              email: user.email,
              status: 'warning',
              message: 'Email sent but failed to update database',
              error: saveError.message
            });
            sent++;
          }

        } catch (emailError) {
          console.error("Failed to send email to", user.email, emailError);

          user.invitationSent = false;
          user.lastError = emailError.message || "Unknown email error";
          
          try {
            await user.save();
          } catch (saveError) {
            console.error(`Failed to save error status for ${user.email}:`, saveError);
          }

          results.push({ 
            email: user.email, 
            status: 'failed', 
            error: emailError.message || "Unknown email error"
          });
        }

        // Add delay between emails to avoid spam detection (2-3 seconds)
        await delay(2000 + Math.random() * 1000);
      }

      // Longer delay between batches (5-10 seconds)
      if (i + batchSize < users.length) {
        console.log(`Completed batch ${Math.floor(i/batchSize) + 1}, waiting before next batch...`);
        await delay(5000 + Math.random() * 5000);
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent, 
      total: users.length,
      results,
      summary: {
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
        warnings: results.filter(r => r.status === 'warning').length
      }
    });

  } catch (error) {
    console.error("Error in send-invites API:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Server error"
    }, { status: 500 });
  }
}

// GET method for testing and getting info
export async function GET() {
  try {
    await dbConnect();
    
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ['$isActive', 1, 0] } },
          inactive: { $sum: { $cond: ['$isActive', 0, 1] } },
          invitesSent: { $sum: { $cond: ['$invitationSent', 1, 0] } },
          pendingInvites: { 
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$isActive', false] }, { $ne: ['$invitationSent', true] }] }, 
                1, 
                0
              ] 
            } 
          }
        }
      }
    ]);

    return NextResponse.json({
      message: 'Send invites API is working',
      methods: ['POST', 'GET'],
      parameters: {
        userIds: 'Array of user IDs to send invites to (optional)',
        forceResend: 'Boolean to resend to users who already received invites (optional)',
        batchSize: 'Number of emails to send in each batch (default: 10)'
      },
      examples: {
        sendToAll: 'POST with no body - sends to all uninvited inactive users',
        sendToSpecific: 'POST with {"userIds": ["userId1", "userId2"]}',
        forceResend: 'POST with {"forceResend": true}',
        customBatch: 'POST with {"batchSize": 5}'
      },
      stats: stats[0] || { total: 0, active: 0, inactive: 0, invitesSent: 0, pendingInvites: 0 }
    });

  } catch (error) {
    return NextResponse.json({
      message: 'Send invites API is working (stats unavailable)',
      error: error.message
    });
  }
}