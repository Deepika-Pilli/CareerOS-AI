import nodemailer from "nodemailer";

/**
 * Create a reusable email transporter based on environment config.
 * Falls back to Ethereal test account or console logging in dev.
 */
let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  // If explicit email config is provided, use it
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return transporter;
  }

  // Try to create an Ethereal test account for development
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧 Ethereal test email account created:", testAccount.user);
  } catch (err) {
    console.warn("⚠️  No email transporter configured. Emails will be logged to console.");
    transporter = null;
  }

  return transporter;
};

/**
 * Send an email using the configured transporter.
 * Falls back to console logging if no transporter is available.
 *
 * @param {{ to: string, subject: string, text: string, html?: string }} options
 */
export const sendEmail = async (options) => {
  const { to, subject, text, html } = options;
  const from = process.env.EMAIL_FROM || "noreply@careeros-ai.com";

  const transport = await getTransporter();

  if (!transport) {
    // Fallback: log email to console (development mode)
    console.log("═══════════════════════════════════════════════");
    console.log("📧 EMAIL (console fallback - no transporter)");
    console.log("═══════════════════════════════════════════════");
    console.log(`From:    ${from}`);
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("───────────────────────────────────────────────");
    console.log(text);
    if (html) {
      console.log("───────────────────────────────────────────────");
      console.log(`HTML: ${html.substring(0, 200)}...`);
    }
    console.log("═══════════════════════════════════════════════\n");
    return;
  }

  const info = await transport.sendMail({
    from,
    to,
    subject,
    text,
    html: html || text,
  });

  console.log(`📧 Email sent: ${info.messageId}`);

  // If using Ethereal, log preview URL
  if (info.messageId) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📧 Preview URL: ${previewUrl}`);
    }
  }
};