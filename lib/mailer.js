import nodemailer from 'nodemailer';

// Create a more robust transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Additional configuration for better deliverability
  secure: true,
  tls: {
    rejectUnauthorized: false
  }
});

export const sendMail = async (to, subject, html, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const mailOptions = {
        // Use a more professional from address
        from: `"BOSAN Secretariat" <${process.env.SMTP_USER}>`,
        to: to,
        subject: subject,
        html: html,
        // Add text version for better deliverability
        text: convertHtmlToText(html),
        // Add headers to improve deliverability
        headers: {
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'Normal',
          'List-Unsubscribe': `<mailto:unsubscribe@${getDomainFromEmail(process.env.SMTP_USER)}>`,
          'X-Mailer': 'BOSAN Portal',
        },
        // Add tracking and authentication headers
        messageId: `<${Date.now()}.${Math.random().toString(36).substr(2, 9)}@${getDomainFromEmail(process.env.SMTP_USER)}>`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}:`, info.messageId);
      return info;
    } catch (error) {
      console.error(`Failed to send email to ${to} (attempt ${attempt}):`, error.message);
      
      if (attempt === retries) {
        throw error; // Final attempt failed
      }
      
      // Wait before retrying with exponential backoff
      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s...
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Helper function to convert HTML to plain text
function convertHtmlToText(html) {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/gi, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to extract domain from email
function getDomainFromEmail(email) {
  return email.split('@')[1] || 'bosan.org';
}

// Test connection function
export const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return false;
  }
};

// Enhanced email template with better spam-score optimization
export const createActivationEmailTemplate = (user, activationLink) => {
  const currentYear = new Date().getFullYear();
  
  return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>BOSAN Account Activation</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 20px 0; text-align: center;">
                <table role="presentation" style="width: 600px; max-width: 100%; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #2c5aa0 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                        BOSAN Portal
                      </h1>
                      <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">
                        Body of Senior Advocates of Nigeria
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                        Welcome to BOSAN Portal
                      </h2>
                      
                      <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Dear <strong>${user.fullName || user.name}</strong>,
                      </p>
                      
                      <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                        You have been invited to join the Body of Senior Advocates of Nigeria (BOSAN) portal. 
                        To get started, please activate your account by clicking the button below.
                      </p>
                      
                      <!-- CTA Button with proper href and target -->
                      <div style="text-align: center; margin: 35px 0;">
                        <table role="presentation" style="margin: 0 auto;">
                          <tr>
                            <td style="border-radius: 6px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
                              <a href="${activationLink}" 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 style="display: inline-block; padding: 16px 32px; font-family: 'Segoe UI', sans-serif; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px; transition: all 0.3s ease;"
                                 onmouseover="this.style.transform='translateY(-2px)'"
                                 onmouseout="this.style.transform='translateY(0)'">
                                ✓ Activate Your Account
                              </a>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Alternative Link -->
                      <div style="background-color: #f8f9fa; border-left: 4px solid #4CAF50; padding: 15px 20px; margin: 25px 0; border-radius: 4px;">
                        <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                          If the button above doesn't work, copy and paste this link into your browser:
                        </p>
                        <p style="color: #495057; font-size: 14px; margin: 0; word-break: break-all; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 8px; border-radius: 4px; border: 1px solid #dee2e6;">
                          ${activationLink}
                        </p>
                      </div>
                      
                      <!-- Security Notice -->
                      <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 25px 0;">
                        <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                          <strong>⚠️ Security Notice:</strong> This activation link will expire in 7 days for your security. 
                          If you didn't request this account, please ignore this email.
                        </p>
                      </div>
                      
                      <p style="color: #6c757d; font-size: 14px; line-height: 1.6; margin: 25px 0 0 0;">
                        If you have any questions or need assistance, please contact the BOSAN Secretariat.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #dee2e6;">
                      <p style="color: #6c757d; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">
                        Body of Senior Advocates of Nigeria (BOSAN)
                      </p>
                      <p style="color: #adb5bd; font-size: 12px; margin: 0; line-height: 1.4;">
                        This is an automated message. Please do not reply to this email.<br>
                        © ${new Date().getFullYear()} BOSAN. All rights reserved.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
  `;
};