import { Resend } from 'resend';
import { render } from '@react-email/render';
import InvitationEmail from '../components/templates/emails/invitation';

export const sendMail = async (to, subject, params) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    console.log(`Sending email to ${to} via Resend`);
    
    // Render React email template to HTML
    const html = render(
      <InvitationEmail 
        userName={params.userName}
        activationLink={params.activationLink}
      />
    );
    
    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'BOSAN Secretariat <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });
    
    console.log(`Email sent successfully to ${to}`, response);
    return response;
  } catch (error) {
    console.error(`Failed to send email to ${to} via Resend:`, error);
    throw error;
  }
};