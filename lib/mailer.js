import axios from "axios";

export const sendMail = async (to, subject, html) => {
  try {
    console.log(`Preparing to send email to ${to} via Brevo API`);
    
    const payload = {
      sender: { email: process.env.SMTP_USER, name: "BOSAN Secretariat" },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };
    
    console.log("Email payload prepared (excluding html content):", {
      sender: payload.sender,
      to: payload.to,
      subject: payload.subject
    });
    
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );
    
    console.log("Brevo API response:", response.status, response.statusText);
    return response.data;
  } catch (error) {
    console.error("Failed to send email via Brevo API:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;  // Rethrow the error so it can be caught in the main flow
  }
};