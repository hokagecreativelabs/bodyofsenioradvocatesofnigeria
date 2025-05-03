import { Resend } from 'resend';
import { render } from '@react-email/render';
import InvitationEmail from '../components/templates/emails/invitation';

export const sendMail = async (to, subject, params) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    console.log(`Sending email to ${to} via Resend`);
    
    // Ensure proper FROM_EMAIL format
    const fromEmail = process.env.FROM_EMAIL && process.env.FROM_EMAIL.includes('<') 
      ? process.env.FROM_EMAIL 
      : 'BOSAN Secretariat <onboarding@resend.dev>';
    
    console.log(`Using from email: ${fromEmail}`);
    
    // Render React email template to HTML
    const html = render(
      <InvitationEmail 
        userName={params.userName}
        activationLink={params.activationLink}
      />
    );
    
    const response = await resend.emails.send({
      from: fromEmail,
      to: to,
      subject: subject,
      html: html,
      // Add text version for better deliverability
      text: `Dear ${params.userName}, You've been invited to activate your BOSAN portal account. Please click this link to activate: ${params.activationLink}. This link expires in 3 days. Regards, BOSAN Secretariat`,
    });
    
    console.log(`Email sent response:`, response);
    
    // Check for errors in the response
    if (response.error) {
      console.error(`Resend API returned an error:`, response.error);
      throw new Error(response.error.message || 'Unknown Resend error');
    }
    
    return response;
  } catch (error) {
    console.error(`Failed to send email to ${to} via Resend:`, error);
    if (error.response?.data) {
      console.error('API response data:', error.response.data);
    }
    throw error;
  }
};