// lib/sendMail.ts
import { Resend } from 'resend';
import { render } from '@react-email/render';
import InvitationEmail from '../components/templates/emails/invitation';

export const sendMail = async (
  to,
  subject,
  params
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    console.log(`📧 Sending invitation email to: ${to}`);

    // Use provided FROM_EMAIL or fallback
    const fromEmail = process.env.FROM_EMAIL?.includes('<')
      ? process.env.FROM_EMAIL
      : 'BOSAN Secretariat <onboarding@resend.dev>';

    // Render React Email template to HTML
    const html = render(
      <InvitationEmail
        userName={params.userName}
        activationLink={params.activationLink}
      />
    );

    // Send the email via Resend
    const response = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text: `Dear ${params.userName},\n\nYou've been invited to activate your BOSAN portal account.\nPlease click the following link to activate:\n${params.activationLink}\n\nThis link expires in 3 days.\n\nRegards,\nBOSAN Secretariat`,
    });

    if (response.error) {
      console.error('Resend API Error:', response.error);
      throw new Error(response.error.message || 'Unknown Resend API error');
    }

    console.log('Email sent successfully:', response.id || response);
    return response;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    if (error.response?.data) {
      console.error('API response data:', error.response.data);
    }
    throw error;
  }
};
