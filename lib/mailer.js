import nodemailer from 'nodemailer';

// Create a transporter using Gmail's SMTP server
// This is a simple and reliable configuration for Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',  // Gmail's SMTP server
  port: 587,               // Gmail's SMTP port
  secure: false,           // Use TLS
  auth: {
    user: process.env.SMTP_USER,     // Your Gmail address
    pass: process.env.SMTP_PASS,     // Your Gmail password or App Password
  }
});

export const sendMail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"BOSAN Secretariat" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email via Nodemailer:', error);
    throw error; // Rethrow the error so it can be caught in the main flow
  }
};