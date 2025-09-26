
import passport  from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();


console.log("Google Callback URL in passport:", process.env.GOOGLE_CALLBACK_URL);
// Configure the Google strategy for use by Passport.
passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
            console.log("✅ Google Profile:", profile); // 👈 See what Google sends
            console.log("✅ Google Email:", profile.emails?.[0]?.value);
            
            // Check if user already exists
            const email = profile.emails[0].value;
            if (!email) {
                console.log("❌ No email found in Google profile");

                return done(new Error("No email found in Google profile"));
            }

            let user = await User.findOne({ email });

            // If user doesn't exist, create a new one
            if (!user) {
                // Generate a random password for the user
                const randomPassword = crypto.randomBytes(20).toString("hex");
                const hashedPassword = await bcrypt.hash(randomPassword, 10);

                
                user = await new User({
                    firstName: profile.name.givenName || "GoogleUser",
                    middleName: "",
                    lastName: profile.name.familyName || "GoogleUser",
                    email,
                    password: hashedPassword,
                    isVerified: true, // Google accounts are considered verified
                    verifiedBy: "google",
                    role: "individual",
                });

                await user.save();
                console.log("✅ New Google user created:", user);
            }else {
                    // If user exists but is not verified, mark as verified
                    if (!user.isVerified) {
                        user.isVerified = true,
                        user.verifiedBy = "google",
                        await user.save();
                    }
                    console.log("✅ Existing Google user verified:", user);

                }
            return done(null, user);
        } catch (error) {
            console.error("❌ Error in GoogleStrategy:", error);
            return done(error, null);

        }
    }
)
);

export default passport;