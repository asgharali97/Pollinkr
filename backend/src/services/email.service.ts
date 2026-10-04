import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export async function sendVerificationEmail(options: {
  to: string;
  name: string;
  token: string;
}): Promise<void> {
  const { to, name, token } = options;
  const verifyUrl = `${env.CLIENT_ORIGIN}/verify-email?token=${encodeURIComponent(token)}`;

  // Defensive fallback for development if API key is not configured
  if (!resend || !env.RESEND_API_KEY) {
    console.warn(
      `[EmailService] Resend API key is missing. Verification link for ${to}:\n${verifyUrl}`
    );
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 24px; color: #111827;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <tr>
            <td>
              <div style="font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #000000; letter-spacing: -0.025em;">
                Pollinkr
              </div>
              <h1 style="font-size: 20px; font-weight: 600; margin: 0 0 12px 0; color: #111827;">
                Verify your email address
              </h1>
              <p style="font-size: 14px; line-height: 22px; color: #4b5563; margin: 0 0 24px 0;">
                Hi ${name},<br>
                Thanks for creating an account with Pollinkr. Please confirm your email address by clicking the button below.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${verifyUrl}" style="background-color: #000000; color: #ffffff; padding: 12px 28px; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 10px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="font-size: 12px; line-height: 18px; color: #6b7280; margin: 0 0 16px 0;">
                Or copy and paste this link into your browser:<br>
                <a href="${verifyUrl}" style="color: #2563eb; word-break: break-all;">${verifyUrl}</a>
              </p>
              <p style="font-size: 12px; line-height: 18px; color: #9ca3af; margin: 24px 0 0 0; border-top: 1px solid #f3f4f6; padding-top: 16px;">
                This link will expire in 24 hours. If you did not create a Pollinkr account, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  try {
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: "Verify your email for Pollinkr",
      html,
    });

    if (error) {
      console.error("[EmailService] Failed to send verification email via Resend:", error);
      // In development, also log the link so developer is not blocked
      if (env.NODE_ENV !== "production") {
        console.warn(`[EmailService] Dev Fallback - Verification link: ${verifyUrl}`);
      }
    }
  } catch (err) {
    console.error("[EmailService] Error dispatching email:", err);
    if (env.NODE_ENV !== "production") {
      console.warn(`[EmailService] Dev Fallback - Verification link: ${verifyUrl}`);
    }
  }
}
