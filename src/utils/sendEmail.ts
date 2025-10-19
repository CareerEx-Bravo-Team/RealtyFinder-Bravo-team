import dotenv from "dotenv";
dotenv.config();

// Import Brevo properly for both ESM and CJS builds
const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "RealityFinder";

    const sendSmtpEmail = {
      sender: { email: senderEmail, name: senderName },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully to", to);
  } catch (error: any) {
    console.error(
      "❌ Email sending error:",
      error.response?.text || error.message
    );
  }
};
