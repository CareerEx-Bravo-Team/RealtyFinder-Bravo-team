
import nodemailer from "nodemailer";



export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // you can also use "hotmail", "yahoo", or custom SMTP
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
      tls: {
        rejectUnauthorized: false // ✅ avoids self-signed certificate errors
    }
    });

    await transporter.sendMail({
      from: `"RealityFinder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully to", to);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
};
