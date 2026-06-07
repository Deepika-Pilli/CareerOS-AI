import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../config/email.js";

/**
 * Generate a cryptographically secure random token for password reset.
 * @returns {string} Hex token string
 */
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Get the frontend base URL from environment or default to localhost:3000.
 * @returns {string}
 */
const getFrontendUrl = () => {
  return process.env.FRONTEND_URL || "http://localhost:3000";
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * 1. Validate email exists (return success regardless to prevent email enumeration)
 * 2. Generate secure reset token
 * 3. Store hashed token with 1-hour expiration
 * 4. Send password reset email with link
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address",
      });
    }

    // Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to prevent email enumeration attacks
    if (!user) {
      console.log(`Forgot password requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate secure token
    const rawToken = generateResetToken();

    // Hash the token for storage (so DB compromise doesn't reveal tokens)
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Set expiration to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Save to user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    // Build reset URL (frontend handles the form)
    const frontendUrl = getFrontendUrl();
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}&id=${user._id}`;

    // Email content
    const subject = "CareerOS AI - Password Reset Request";
    const text = `
You are receiving this because you (or someone else) requested a password reset for your CareerOS AI account.

Please click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you did not request this, please ignore this email and your password will remain unchanged.

— CareerOS AI Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 480px; margin: 40px auto; padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9)); }
    .header { text-align: center; margin-bottom: 24px; }
    .logo { display: inline-flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 700; }
    .logo-icon { width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #3b82f6, #7c3aed); display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 18px; }
    h1 { font-size: 22px; color: #f1f5f9; margin: 0 0 8px; }
    p { line-height: 1.6; color: #94a3b8; margin: 0 0 16px; }
    .btn { display: inline-block; padding: 14px 32px; border-radius: 12px; background: linear-gradient(135deg, #3b82f6, #7c3aed); color: white !important; text-decoration: none; font-weight: 600; font-size: 15px; margin: 8px 0 16px; }
    .btn:hover { background: linear-gradient(135deg, #2563eb, #6d28d9); }
    .footer { text-align: center; font-size: 13px; color: #64748b; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
    .warning { background: rgba(234,179,8,0.1); border: 1px solid rgba(234,179,8,0.2); border-radius: 8px; padding: 12px; font-size: 13px; color: #fbbf24; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-icon">⚡</span>
        <span>CareerOS AI</span>
      </div>
    </div>
    <h1>Reset your password</h1>
    <p>We received a request to reset the password for your CareerOS AI account. Click the button below to set a new password.</p>
    <div style="text-align:center;">
      <a href="${resetUrl}" class="btn">Reset Password</a>
    </div>
    <p style="font-size:14px;">Or copy and paste this link into your browser:</p>
    <p style="font-size:13px; word-break:break-all; background:rgba(0,0,0,0.2); padding:8px; border-radius:6px; color:#94a3b8;">${resetUrl}</p>
    <div class="warning">⏰ This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</div>
    <div class="footer">
      <p>— CareerOS AI Team · Your AI-powered career companion</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send the email
    await sendEmail({ to: user.email, subject, text, html });

    console.log(`🔑 Password reset email sent to ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error processing password reset request",
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Body: { token, id, password }
 * 1. Validate required fields
 * 2. Find user by id and verify hashed token matches
 * 3. Check token hasn't expired
 * 4. Hash new password and save
 * 5. Clear reset token fields
 * 6. Return success
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, id, password } = req.body;

    if (!token || !id || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: token, user ID, and new password",
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    // Check if user has a reset token stored
    if (!user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    // Hash the provided token and compare with stored hash
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    if (hashedToken !== user.resetPasswordToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    // Check expiration
    if (user.resetPasswordExpires < new Date()) {
      // Clear expired token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      return res.status(400).json({
        success: false,
        message: "Reset link has expired. Please request a new one.",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset fields
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    console.log(`🔐 Password reset successfully for user: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error resetting password",
    });
  }
};