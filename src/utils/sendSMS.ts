import twilo from "twilio";
import dotenv from "dotenv";
dotenv.config();


const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER as string;

const client = twilo(accountSid, authToken);


// Function to send SMS
export const sendSms = async (to: string, body: string) => {
  try {
    const message = await client.messages.create({
      body,
      from: "+16193321715",
      to: twilioPhone,
    });
    console.log("✅ SMS sent successfully to", to);
    return message;
  } catch (error) {
    console.error("❌ SMS sending error:", error);
    throw new Error("Failed to send SMS");
  }
};


