


import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();



const brevo = new Brevo.TransactionalEmailsApi();
brevo.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const senderEmail = process.env.BREVO_SENDER_EMAIL as string;
    const senderName = process.env.BREVO_SENDER_NAME as string || "RealityFinder";  

    const sendSmtpEmail = {
      sender: { email: senderEmail, name: senderName },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    };

    await brevo.sendTransacEmail(sendSmtpEmail);

    console.log("✅ Email sent successfully to", to);

  }catch (error: any) {
    console.error("❌ Email sending error:", error.response ? error.response.text : error.message);
  }

};











// import nodemailer from "nodemailer";



// export const sendEmail = async (to: string, subject: string, html: string) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail", 
//       auth: {
//         user: process.env.EMAIL_USER, 
//         pass: process.env.EMAIL_PASS, 
//       },
//       tls: {
//         rejectUnauthorized: false 
//     }
//     });

//     await transporter.sendMail({
//       from: `"RealityFinder" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ Email sent successfully to", to);
//   } catch (error) {
//     console.error("❌ Email sending error:", error);
//   }
// };
