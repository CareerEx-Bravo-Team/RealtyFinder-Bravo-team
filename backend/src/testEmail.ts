import { sendEmail } from "./utils/sendEmail";

(async () => {
  await sendEmail(
    "yourtestemail@example.com",
    "Test Email from RealityFinder",
    "<p>This is a test email.</p>"
  );
})();
