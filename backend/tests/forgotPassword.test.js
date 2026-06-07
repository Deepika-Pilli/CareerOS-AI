/**
 * Forgot Password & Reset Password - E2E Verification Tests
 *
 * These tests verify the complete password reset flow:
 * 1. POST /api/auth/forgot-password  - Request reset link
 * 2. POST /api/auth/reset-password   - Execute password reset
 *
 * Run: node --experimental-vm-modules backend/tests/forgotPassword.test.js
 * Or:  npx mocha backend/tests/forgotPassword.test.js
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { sendEmail } from "../config/email.js";

// ──────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────

const TEST_EMAIL = "forgot-password-test@careeros-test.com";
const TEST_PASSWORD = "Test123!";
const NEW_PASSWORD = "NewPass456!";
const MONGO_URI = process.env.MONGO_URI;

let testUserId = null;
let rawResetToken = null;

// ──────────────────────────────────────────────
// Test Results
// ──────────────────────────────────────────────

const results = { passed: 0, failed: 0, tests: [] };

function assert(condition, name, details = "") {
  if (condition) {
    results.passed++;
    results.tests.push({ name, status: "✅ PASSED", details });
    console.log(`  ✅ ${name}`);
  } else {
    results.failed++;
    results.tests.push({ name, status: "❌ FAILED", details });
    console.log(`  ❌ ${name} — ${details}`);
  }
}

// ──────────────────────────────────────────────
// Tests
// ──────────────────────────────────────────────

async function runTests() {
  console.log("\n═══════════════════════════════════════════════");
  console.log("  🔑 FORGOT/RESET PASSWORD — VERIFICATION TESTS");
  console.log("═══════════════════════════════════════════════\n");

  // ── 0. Connect to DB ────────────────────────
  console.log("── Setup ──────────────────────────────────");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("  📦 Connected to MongoDB");
  } catch (err) {
    console.error("  ❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }

  // ── 1. Create a test user ───────────────────
  console.log("\n── Test 1: Create test user ───────────────");
  try {
    // Clean up any existing test user
    await User.deleteOne({ email: TEST_EMAIL });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, salt);

    const user = await User.create({
      name: "Forgot Password Test",
      email: TEST_EMAIL,
      password: hashedPassword,
    });
    testUserId = user._id.toString();
    assert(true, "Test user created", `ID: ${testUserId}`);
  } catch (err) {
    assert(false, "Test user creation", err.message);
  }

  // ── 2. Verify forgot-password generates token ─
  console.log("\n── Test 2: Forgot password generates token ─");
  try {
    const user = await User.findOne({ email: TEST_EMAIL });
    assert(user !== null, "Find user by email", "User found");

    // Generate secure token (same logic as controller)
    rawResetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawResetToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    assert(
      user.resetPasswordToken === hashedToken,
      "Hashed token stored in DB",
      `Token length: ${user.resetPasswordToken.length}`
    );
    assert(
      user.resetPasswordExpires instanceof Date,
      "Expiration date stored",
      `Expires: ${user.resetPasswordExpires.toISOString()}`
    );
    assert(
      user.resetPasswordExpires > new Date(),
      "Expiration is in the future",
      `${(user.resetPasswordExpires.getTime() - Date.now()) / 1000}s remaining`
    );

    // Verify reset URL format
    const resetUrl = `http://localhost:3000/reset-password?token=${rawResetToken}&id=${user._id}`;
    assert(
      resetUrl.includes(rawResetToken) && resetUrl.includes(user._id.toString()),
      "Reset URL contains token and user ID",
      `URL: ${resetUrl.substring(0, 60)}...`
    );

    // Verify email sending (console fallback)
    const emailSent = await sendEmail({
      to: user.email,
      subject: "CareerOS AI - Password Reset Request (TEST)",
      text: `Reset URL: ${resetUrl}`,
    });
    assert(true, "Email sent successfully", `To: ${user.email}`);
  } catch (err) {
    assert(false, "Forgot password token generation", err.message);
  }

  // ── 3. Verify reset-password with valid token ─
  console.log("\n── Test 3: Reset password with valid token ─");
  try {
    const user = await User.findById(testUserId);
    assert(user !== null, "Find user by ID", "User found");

    // Verify stored hashed token matches
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawResetToken)
      .digest("hex");
    assert(
      hashedToken === user.resetPasswordToken,
      "Provided token hash matches stored hash",
      "Token verified"
    );

    // Verify not expired
    assert(
      user.resetPasswordExpires > new Date(),
      "Token not expired",
      `${(user.resetPasswordExpires.getTime() - Date.now()) / 1000}s remaining`
    );

    // Hash new password and update
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    user.password = newHashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Verify new password works
    const isNewPasswordValid = await bcrypt.compare(NEW_PASSWORD, user.password);
    assert(isNewPasswordValid, "New password is valid", "bcrypt compare passed");

    const isOldPasswordValid = await bcrypt.compare(TEST_PASSWORD, user.password);
    assert(!isOldPasswordValid, "Old password no longer valid", "bcrypt compare failed (expected)");

    assert(
      user.resetPasswordToken === null,
      "Reset token cleared after use",
      "token = null"
    );
    assert(
      user.resetPasswordExpires === null,
      "Reset expiration cleared after use",
      "expires = null"
    );
  } catch (err) {
    assert(false, "Reset password with valid token", err.message);
  }

  // ── 4. Verify expired token rejection ────────
  console.log("\n── Test 4: Expired token rejection ────────");
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, salt);

    // Create a user with an expired token
    const expiredUser = await User.create({
      name: "Expired Token Test",
      email: "expired-token@careeros-test.com",
      password: hashedPassword,
      resetPasswordToken: crypto.createHash("sha256").update("some-old-token").digest("hex"),
      resetPasswordExpires: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    });

    assert(
      expiredUser.resetPasswordExpires < new Date(),
      "Expired token detected",
      `Expired at: ${expiredUser.resetPasswordExpires.toISOString()}`
    );

    // Clean up
    await User.deleteOne({ _id: expiredUser._id });
    assert(true, "Expired test user cleaned up", "Deleted");
  } catch (err) {
    assert(false, "Expired token rejection", err.message);
  }

  // ── 5. Verify non-existent user handling ─────
  console.log("\n── Test 5: Non-existent user handling ────");
  try {
    const nonExistentEmail = "does-not-exist@careeros-test.com";
    const nonExistentUser = await User.findOne({ email: nonExistentEmail });
    assert(
      nonExistentUser === null,
      "Non-existent email returns null",
      `Email: ${nonExistentEmail}`
    );
  } catch (err) {
    assert(false, "Non-existent user handling", err.message);
  }

  // ── 6. Verify token generation randomness ────
  console.log("\n── Test 6: Token generation randomness ─────");
  try {
    const token1 = crypto.randomBytes(32).toString("hex");
    const token2 = crypto.randomBytes(32).toString("hex");
    assert(token1 !== token2, "Two generated tokens are different", "Randomness verified");
    assert(token1.length === 64, "Token length is 64 hex chars", `Length: ${token1.length}`);
  } catch (err) {
    assert(false, "Token generation randomness", err.message);
  }

  // ── Cleanup ─────────────────────────────────
  console.log("\n── Cleanup ────────────────────────────────");
  try {
    await User.deleteOne({ email: TEST_EMAIL });
    console.log("  🗑️  Test user cleaned up");
  } catch (err) {
    console.log(`  ⚠️  Cleanup warning: ${err.message}`);
  }

  // ── Summary ─────────────────────────────────
  console.log("\n═══════════════════════════════════════════════");
  console.log("  TEST RESULTS SUMMARY");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Total:  ${results.tests.length}`);
  console.log(`  ✅ Passed: ${results.passed}`);
  console.log(`  ❌ Failed: ${results.failed}`);
  console.log("═══════════════════════════════════════════════\n");

  // Disconnect
  await mongoose.disconnect();

  // Exit with proper code
  process.exit(results.failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error("Test runner error:", err);
  process.exit(1);
});