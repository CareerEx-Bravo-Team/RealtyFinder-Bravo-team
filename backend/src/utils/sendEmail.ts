// utils/sendEmail.ts
import nodemailer from "nodemailer";



export const sendUserWelcomeEmail = async (email: string, firstName: string, token: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // you can also use "hotmail", "yahoo", or custom SMTP
            auth: {
                user: `${process.env.EMAIL_USER}`, 
                pass: `${process.env.EMAIL_PASS}`, 
            },
        });

        const mailDetails = {
            from: `"RealtyFinder" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: "Welcome to RealtyFinder",
            html: `<body style="margin:0;padding:0;background:#f6f9fc;">
                    <!-- Preheader (hidden preview text) -->
                    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
                      Welcome to RealtyFinder — find verified homes to rent or buy at prices that fit your budget.
                    </div>

                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f6f9fc;margin:0;padding:24px 0;">
                      <tr>
                        <td align="center" style="padding:0 16px;">
                          <!-- Container -->
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(16,24,40,0.08);">
                            <!-- Header / Logo -->
                            <tr>
                              <td align="left" style="padding:20px 24px;background:#0ea5e9;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                  <tr>
                                    <td align="left" style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.2px;">
                                      RealtyFinder
                                    </td>
                                    <td align="right" style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#e0f2fe;">
                                      Buy • Rent • Save
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Hero -->
                            <tr>
                              <td style="padding:28px 24px 0 24px;">
                                <h1 style="margin:0 0 12px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#111827;">
                                  Welcome aboard, ${firstName} 👋
                                </h1>
                                <p style="margin:0 0 16px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">
                                  Thanks for creating an account with <strong>RealtyFinder</strong> — your trusted way to discover verified properties to
                                  <strong>buy</strong> or <strong>rent</strong> at affordable prices.
                                </p>
                              </td>
                            </tr>

                            <!-- Call to Action -->
                            <tr>
                              <td align="left" style="padding:0 24px 8px 24px;">
                                <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#374151;">
                                  Get started in minutes:
                                </p>
                                <ol style="margin:0 0 20px 20px;padding:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.7;color:#4b5563;">
                                  <li>Set your preferred <em>location</em> and <em>budget</em>.</li>
                                  <li>Browse real-time listings from verified owners and agents.</li>
                                  <li>Save favorites and book viewings instantly.</li>
                                </ol>

                                <!-- Primary Button -->
                                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 12px 0;">
                                  <tr>
                                    <td align="center" bgcolor="#0ea5e9" style="border-radius:10px;">
                                      <a href="{{primaryCtaUrl}}" target="_blank"
                                        style="display:inline-block;padding:12px 20px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;font-weight:600;line-height:1;text-decoration:none;color:#ffffff;border-radius:10px;">
                                        Explore Listings
                                      </a>
                                    </td>
                                  </tr>
                                </table>

                                <!-- Secondary Button -->
                                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                  <tr>
                                    <td align="center" bgcolor="#111827" style="border-radius:10px;">
                                      <a href="http://yourfrontendurl/verify-email?token=${token}" target="_blank"
                                        style="display:inline-block;padding:11px 18px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;font-weight:600;line-height:1;text-decoration:none;color:#ffffff;border-radius:10px;">
                                        Verify Email
                                      </a>
                                    </td>
                                  </tr>
                                </table>

                                <p style="margin:14px 0 0 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">
                                  Tip: Verifying your email helps keep your account secure and unlocks messaging with property owners.
                                </p>
                              </td>
                            </tr>

                            <!-- Feature Grid (stacked for email) -->
                            <tr>
                              <td style="padding:20px 24px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                  <tr>
                                    <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                      <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Verified Listings</h3>
                                      <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                        Every listing is quality-checked to reduce scams and surprises.
                                      </p>
                                    </td>
                                    <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                      <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Smart Filters</h3>
                                      <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                        Filter by budget, location, bedrooms, amenities, and more.
                                      </p>
                                    </td>
                                    <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                      <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Direct Contact</h3>
                                      <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                        Chat or schedule viewings with owners and agents instantly.
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Helpful Links -->
                            <tr>
                              <td style="padding:0 24px 8px 24px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f8fafc;border-radius:10px;">
                                  <tr>
                                    <td style="padding:14px 16px;">
                                      <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0f172a;font-weight:600;">
                                        Quick links
                                      </p>
                                      <a href="{{completeProfileUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Complete your profile</a>
                                      <a href="{{savedSearchUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Create a saved search</a>
                                      <a href="{{helpCenterUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Help Center</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                              <td style="padding:18px 24px 24px 24px;">
                                <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#111827;font-weight:600;">
                                  Welcome to the neighborhood 🏡
                                </p>
                                <p style="margin:0 0 14px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.7;color:#4b5563;">
                                  If you didn't create this account, please <a href="{{supportUrl}}" style="color:#0ea5e9;text-decoration:none;">contact support</a>.
                                </p>
                                <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">
                                  © 2025 RealtyFinder. All rights reserved.<br/>
                                  {{companyAddress}} • <a href="{{preferencesUrl}}" style="color:#0ea5e9;text-decoration:none;">Email preferences</a> • <a href="{{unsubscribeUrl}}" style="color:#0ea5e9;text-decoration:none;">Unsubscribe</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                          <!-- /Container -->
                        </td>
                      </tr>
                    </table>

                    <!-- Text-only fallback (for clients that strip styles/HTML). Keep short. -->
                    <!--
                    Welcome to RealtyFinder, {{firstName}}!
                    Explore listings: {{primaryCtaUrl}}
                    Verify your email: {{verifyEmailUrl}}
                    Help Center: {{helpCenterUrl}}
                    -->
                  </body>`
        };

        await transporter.sendMail(mailDetails);

        console.log("✅ Email sent successfully to", email);
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
};

export const sendAgentWelcomeEmail = async (email: string, firstName: string, token: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // you can also use "hotmail", "yahoo", or custom SMTP
            auth: {
                user: `${process.env.EMAIL_USER}`, 
                pass: `${process.env.EMAIL_PASS}`, 
            },
        });

        const mailDetails = {
            from: `"RealtyFinder" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: "Welcome to RealtyFinder",
            html: `<body style="margin:0;padding:0;background:#f6f9fc;">
                    <!-- Preheader -->
                    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
                      Welcome to RealtyFinder — start listing properties and connect with serious buyers and renters today.
                    </div>

                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f6f9fc;margin:0;padding:24px 0;">
                      <tr>
                        <td align="center" style="padding:0 16px;">
                          <!-- Container -->
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(16,24,40,0.08);">
                            <!-- Header -->
                            <tr>
                              <td align="left" style="padding:20px 24px;background:#0ea5e9;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                  <tr>
                                    <td align="left" style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#ffffff;">
                                      RealtyFinder
                                    </td>
                                    <td align="right" style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#e0f2fe;">
                                      Agents • Listings • Deals
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Hero -->
                            <tr>
                              <td style="padding:28px 24px 0 24px;">
                                <h1 style="margin:0 0 12px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#111827;">
                                  Welcome, ${firstName} 🎉
                                </h1>
                                <p style="margin:0 0 16px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">
                                  Thank you for joining <strong>RealtyFinder</strong> as a verified property agent. You’re now part of a growing platform
                                  that helps buyers and renters find affordable homes — while connecting you directly to serious clients.
                                </p>
                              </td>
                            </tr>

                            <!-- Call to Action -->
                            <tr>
                              <td align="left" style="padding:0 24px 8px 24px;">
                                <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#374151;">
                                  Here’s how to get started:
                                </p>
                                <ol style="margin:0 0 20px 20px;padding:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.7;color:#4b5563;">
                                  <li>Complete your agent profile with your logo and contact details.</li>
                                  <li>Start listing properties for rent or sale.</li>
                                  <li>Connect with buyers and renters in real time.</li>
                                </ol>

                                <!-- Primary Button -->
                                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 12px 0;">
                                  <tr>
                                    <td align="center" bgcolor="#0ea5e9" style="border-radius:10px;">
                                      <a href="{{addListingUrl}}" target="_blank"
                                        style="display:inline-block;padding:12px 20px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;color:#ffffff;border-radius:10px;">
                                        Add Your First Listing
                                      </a>
                                    </td>
                                  </tr>
                                </table>

                                <!-- Secondary Button -->
                                <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                  <tr>
                                    <td align="center" bgcolor="#111827" style="border-radius:10px;">
                                      <a href="http://yourfrontendurl/verify-email?token=${token}" target="_blank"
                                        style="display:inline-block;padding:11px 18px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;font-weight:600;text-decoration:none;color:#ffffff;border-radius:10px;">
                                        Verify Your Email
                                      </a>
                                    </td>
                                  </tr>
                                </table>

                                <p style="margin:14px 0 0 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">
                                  Email verification helps secure your account and boosts trust in your listings.
                                </p>
                              </td>
                            </tr>

                            <!-- Feature Highlights -->
                            <tr>
                              <td style="padding:20px 24px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                  <tr>
                                    <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                      <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Direct Leads</h3>
                                      <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                        Connect instantly with verified buyers and renters.
                                      </p>
                                    </td>
                                    <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                      <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Easy Management</h3>
                                      <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                        Add, edit, and manage your property listings seamlessly.
                                      </p>
                                    </td>
                                    <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                      <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Boost Visibility</h3>
                                      <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                        Get discovered by more clients searching in your area.
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Helpful Links -->
                            <tr>
                              <td style="padding:0 24px 8px 24px;">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f8fafc;border-radius:10px;">
                                  <tr>
                                    <td style="padding:14px 16px;">
                                      <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0f172a;font-weight:600;">
                                        Quick links
                                      </p>
                                      <a href="{{completeProfileUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Complete your profile</a>
                                      <a href="{{addListingUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Add property listing</a>
                                      <a href="{{helpCenterUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Help Center</a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                              <td style="padding:18px 24px 24px 24px;">
                                <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#111827;font-weight:600;">
                                  Here’s to closing more deals 🏘️
                                </p>
                                <p style="margin:0 0 14px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.7;color:#4b5563;">
                                  If you didn’t create this agent account, please <a href="{{supportUrl}}" style="color:#0ea5e9;text-decoration:none;">contact support</a>.
                                </p>
                                <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">
                                  © 2025 RealtyFinder. All rights reserved.<br/>
                                  {{companyAddress}} • <a href="{{preferencesUrl}}" style="color:#0ea5e9;text-decoration:none;">Email preferences</a> • <a href="{{unsubscribeUrl}}" style="color:#0ea5e9;text-decoration:none;">Unsubscribe</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                          <!-- /Container -->
                        </td>
                      </tr>
                    </table>
                  </body>`
        };

        await transporter.sendMail(mailDetails);

        console.log("✅ Email sent successfully to", email);
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
};

export const sendPropertyOwnerWelcomeEmail = async (email: string, firstName: string, token: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // you can also use "hotmail", "yahoo", or custom SMTP
            auth: {
                user: `${process.env.EMAIL_USER}`, 
                pass: `${process.env.EMAIL_PASS}`, 
            },
        });

        const mailDetails = {
            from: `"RealtyFinder" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: "Welcome to RealtyFinder",
            html: `<body style="margin:0;padding:0;background:#f6f9fc;">
                      <!-- Preheader -->
                      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
                        Welcome to RealtyFinder — start listing your properties and connect directly with verified tenants and buyers.
                      </div>

                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f6f9fc;margin:0;padding:24px 0;">
                        <tr>
                          <td align="center" style="padding:0 16px;">
                            <!-- Container -->
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(16,24,40,0.08);">
                              <!-- Header -->
                              <tr>
                                <td align="left" style="padding:20px 24px;background:#0ea5e9;">
                                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                    <tr>
                                      <td align="left" style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#ffffff;">
                                        RealtyFinder
                                      </td>
                                      <td align="right" style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#e0f2fe;">
                                        Property Owners • Listings • Tenants
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <!-- Hero -->
                              <tr>
                                <td style="padding:28px 24px 0 24px;">
                                  <h1 style="margin:0 0 12px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#111827;">
                                    Welcome, ${firstName} 🏡
                                  </h1>
                                  <p style="margin:0 0 16px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">
                                    We’re excited to have you join <strong>RealtyFinder</strong>. As a property owner, you can now list your properties, connect with trusted tenants or buyers, and manage everything from one simple dashboard.
                                  </p>
                                </td>
                              </tr>

                              <!-- Call to Action -->
                              <tr>
                                <td align="left" style="padding:0 24px 8px 24px;">
                                  <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#374151;">
                                    Here’s how to make the most of your account:
                                  </p>
                                  <ol style="margin:0 0 20px 20px;padding:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.7;color:#4b5563;">
                                    <li>Complete your property owner profile with your contact details.</li>
                                    <li>List your properties for rent or sale with photos and details.</li>
                                    <li>Receive and respond to inquiries from verified tenants or buyers.</li>
                                  </ol>

                                  <!-- Primary Button -->
                                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 12px 0;">
                                    <tr>
                                      <td align="center" bgcolor="#0ea5e9" style="border-radius:10px;">
                                        <a href="{{addPropertyUrl}}" target="_blank"
                                          style="display:inline-block;padding:12px 20px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;color:#ffffff;border-radius:10px;">
                                          Add Your First Property
                                        </a>
                                      </td>
                                    </tr>
                                  </table>

                                  <!-- Secondary Button -->
                                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                    <tr>
                                      <td align="center" bgcolor="#111827" style="border-radius:10px;">
                                        <a href="http://yourfrontendurl/verify-email?token=${token}" target="_blank"
                                          style="display:inline-block;padding:11px 18px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;font-weight:600;text-decoration:none;color:#ffffff;border-radius:10px;">
                                          Verify Your Email
                                        </a>
                                      </td>
                                    </tr>
                                  </table>

                                  <p style="margin:14px 0 0 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">
                                    Verifying your email improves trust and ensures tenants know they’re dealing with a genuine property owner.
                                  </p>
                                </td>
                              </tr>

                              <!-- Feature Highlights -->
                              <tr>
                                <td style="padding:20px 24px;">
                                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                    <tr>
                                      <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                        <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Reliable Tenants</h3>
                                        <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                          Reach verified renters and buyers searching for properties like yours.
                                        </p>
                                      </td>
                                      <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                        <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Simple Management</h3>
                                        <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                          Update, pause, or renew your listings anytime with ease.
                                        </p>
                                      </td>
                                      <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                        <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Maximized Reach</h3>
                                        <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                          Showcase your property to thousands of users browsing daily.
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <!-- Helpful Links -->
                              <tr>
                                <td style="padding:0 24px 8px 24px;">
                                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f8fafc;border-radius:10px;">
                                    <tr>
                                      <td style="padding:14px 16px;">
                                        <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0f172a;font-weight:600;">
                                          Quick links
                                        </p>
                                        <a href="{{completeProfileUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Complete your profile</a>
                                        <a href="{{addPropertyUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Add a property</a>
                                        <a href="{{helpCenterUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Help Center</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <!-- Footer -->
                              <tr>
                                <td style="padding:18px 24px 24px 24px;">
                                  <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#111827;font-weight:600;">
                                    Let’s help you find the right tenants fast 🚀
                                  </p>
                                  <p style="margin:0 0 14px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.7;color:#4b5563;">
                                    If you didn’t create this property owner account, please <a href="{{supportUrl}}" style="color:#0ea5e9;text-decoration:none;">contact support</a>.
                                  </p>
                                  <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">
                                    © 2025 RealtyFinder. All rights reserved.<br/>
                                    {{companyAddress}} • <a href="{{preferencesUrl}}" style="color:#0ea5e9;text-decoration:none;">Email preferences</a> • <a href="{{unsubscribeUrl}}" style="color:#0ea5e9;text-decoration:none;">Unsubscribe</a>
                                  </p>
                                </td>
                              </tr>
                            </table>
                            <!-- /Container -->
                          </td>
                        </tr>
                      </table>
                    </body>`
        };

        await transporter.sendMail(mailDetails);

        console.log("✅ Email sent successfully to", email);
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
};

export const sendAdminWelcomeEmail = async (email: string, firstName: string, token: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // you can also use "hotmail", "yahoo", or custom SMTP
            auth: {
                user: `${process.env.EMAIL_USER}`, 
                pass: `${process.env.EMAIL_PASS}`, 
            },
        });

        const mailDetails = {
            from: `"RealtyFinder" <${process.env.EMAIL_USER}>`,
            to: `${email}`,
            subject: "Welcome to RealtyFinder",
            html: `<body style="margin:0;padding:0;background:#f6f9fc;">
                      <!-- Preheader -->
                      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
                        Welcome to RealtyFinder Admin — manage properties, agents, and users all in one place.
                      </div>

                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f6f9fc;margin:0;padding:24px 0;">
                        <tr>
                          <td align="center" style="padding:0 16px;">
                            <!-- Container -->
                            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;border-collapse:collapse;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(16,24,40,0.08);">
                              <!-- Header -->
                              <tr>
                                <td align="left" style="padding:20px 24px;background:#0ea5e9;">
                                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                    <tr>
                                      <td align="left" style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:24px;font-weight:700;color:#ffffff;">
                                        RealtyFinder
                                      </td>
                                      <td align="right" style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#e0f2fe;">
                                        Admin • Management • Control
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <!-- Hero -->
                              <tr>
                                <td style="padding:28px 24px 0 24px;">
                                  <h1 style="margin:0 0 12px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:22px;line-height:1.3;color:#111827;">
                                    Welcome, ${firstName} 👋
                                  </h1>
                                  <p style="margin:0 0 16px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">
                                    Congratulations on joining the <strong>RealtyFinder Admin Team</strong>. As an admin, you have powerful tools to oversee property listings, manage agents and property owners, and ensure smooth operations across the platform.
                                  </p>
                                </td>
                              </tr>

                              <!-- Call to Action -->
                              <tr>
                                <td align="left" style="padding:0 24px 8px 24px;">
                                  <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#374151;">
                                    Here’s what you can do as an admin:
                                  </p>
                                  <ol style="margin:0 0 20px 20px;padding:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;line-height:1.7;color:#4b5563;">
                                    <li>Review and approve new property listings.</li>
                                    <li>Manage property owners, agents, and user accounts.</li>
                                    <li>Oversee platform activities to maintain trust and security.</li>
                                  </ol>

                                  <!-- Primary Button -->
                                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 12px 0;">
                                    <tr>
                                      <td align="center" bgcolor="#0ea5e9" style="border-radius:10px;">
                                        <a href="{{adminDashboardUrl}}" target="_blank"
                                          style="display:inline-block;padding:12px 20px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;font-weight:600;text-decoration:none;color:#ffffff;border-radius:10px;">
                                          Go to Admin Dashboard
                                        </a>
                                      </td>
                                    </tr>
                                  </table>

                                  <!-- Secondary Button -->
                                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                    <tr>
                                      <td align="center" bgcolor="#111827" style="border-radius:10px;">
                                        <a href="http://yourfrontendurl/verify-email?token=${token}" target="_blank"
                                          style="display:inline-block;padding:11px 18px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;font-weight:600;text-decoration:none;color:#ffffff;border-radius:10px;">
                                          Verify Your Email
                                        </a>
                                      </td>
                                    </tr>
                                  </table>

                                  <p style="margin:14px 0 0 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">
                                    Verifying your email helps secure your admin account and ensures proper access controls.
                                  </p>
                                </td>
                              </tr>

                              <!-- Feature Highlights -->
                              <tr>
                                <td style="padding:20px 24px;">
                                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                    <tr>
                                      <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                        <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Platform Oversight</h3>
                                        <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                          Keep track of all property listings and ensure quality control.
                                        </p>
                                      </td>
                                      <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                        <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">User Management</h3>
                                        <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                          Approve, suspend, or support users and maintain community trust.
                                        </p>
                                      </td>
                                      <td width="33.33%" style="vertical-align:top;padding:8px;border:1px solid #f1f5f9;border-radius:8px;">
                                        <h3 style="margin:0 0 6px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:14px;color:#111827;">Analytics & Reports</h3>
                                        <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:12px;color:#6b7280;">
                                          Gain insights into activities, growth, and platform performance.
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <!-- Helpful Links -->
                              <tr>
                                <td style="padding:0 24px 8px 24px;">
                                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;background:#f8fafc;border-radius:10px;">
                                    <tr>
                                      <td style="padding:14px 16px;">
                                        <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0f172a;font-weight:600;">
                                          Quick links
                                        </p>
                                        <a href="{{adminDashboardUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Admin Dashboard</a>
                                        <a href="{{adminGuideUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Admin Guide</a>
                                        <a href="{{supportUrl}}" style="display:inline-block;margin:0 12px 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#0ea5e9;text-decoration:none;">Support</a>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>

                              <!-- Footer -->
                              <tr>
                                <td style="padding:18px 24px 24px 24px;">
                                  <p style="margin:0 0 8px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;color:#111827;font-weight:600;">
                                    Let’s build trust and growth together 🚀
                                  </p>
                                  <p style="margin:0 0 14px 0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:13px;line-height:1.7;color:#4b5563;">
                                    If you didn’t create this admin account, please <a href="{{supportUrl}}" style="color:#0ea5e9;text-decoration:none;">contact support</a> immediately.
                                  </p>
                                  <p style="margin:0;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">
                                    © 2025 RealtyFinder. All rights reserved.<br/>
                                    {{companyAddress}} • <a href="{{preferencesUrl}}" style="color:#0ea5e9;text-decoration:none;">Email preferences</a> • <a href="{{unsubscribeUrl}}" style="color:#0ea5e9;text-decoration:none;">Unsubscribe</a>
                                  </p>
                                </td>
                              </tr>
                            </table>
                            <!-- /Container -->
                          </td>
                        </tr>
                      </table>
                    </body>`
        };

        await transporter.sendMail(mailDetails);

        console.log("✅ Email sent successfully to", email);
    } catch (error) {
        console.error("❌ Email sending error:", error);
    }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // you can also use "hotmail", "yahoo", or custom SMTP
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
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