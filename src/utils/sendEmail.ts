import * as brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const apiInstance = new brevo.TransactionalEmailsApi();

// ✅ Set API key
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const senderEmail = process.env.BREVO_SENDER_EMAIL as string;
    const senderName = process.env.BREVO_SENDER_NAME || "RealityFinder";

    const sendSmtpEmail = {
      sender: { email: senderEmail, name: senderName },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent successfully to:", to, response.body);
  } catch (error: any) {
    console.error("❌ Email sending error:", error.message || error);
  }
};
