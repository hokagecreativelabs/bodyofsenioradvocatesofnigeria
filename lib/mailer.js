import axios from "axios";

export const sendMail = async (to, subject, html) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.SMTP_USER, name: "BOSAN Secretariat" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to send email via Brevo API:", error);
    throw error;  // Rethrow the error so it can be caught in the main flow
  }
};
