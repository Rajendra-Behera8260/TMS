const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  createMailTransporter,
  formatMailError,
  isMailConfigured,
} = require("../utils/mailer");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const isValidEmail = (email = "") => EMAIL_REGEX.test(normalizeEmail(email));

const getFrontendUrl = () => {
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
  return frontendUrl.replace(/\/+$/, "");
};

const createToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  status: user.status,
});

const sendWelcomeEmail = async (user) => {
  const transporter = createMailTransporter();

  if (!transporter) {
    return false;
  }

  await transporter.sendMail({
    from: process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER,
    to: user.email,
    subject: "Welcome to TMS - Registration Successful",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to TMS</title>
</head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table width="600" style="background:#ffffff; margin:40px 0; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);">
        <tr><td style="background:linear-gradient(90deg,#2563eb,#7c3aed); padding:30px; text-align:center; color:white;">
          <h1 style="margin:0; font-size:26px;">Welcome to TMS</h1>
          <p style="margin:10px 0 0;">Transport Management System</p>
        </td></tr>
        <tr><td style="padding:30px; color:#374151;">
          <h2 style="margin-top:0;">Hello ${user.name},</h2>
          <p>Your account has been created successfully.</p>
          <p>You can now log in and start using your dashboard.</p>
          <ul style="padding-left:20px;">
            <li>Manage Vehicles</li>
            <li>Manage Drivers</li>
            <li>Handle Bookings</li>
            <li>View Reports</li>
          </ul>
          <div style="text-align:center; margin:25px 0;">
            <a href="${getFrontendUrl()}/login" style="display:inline-block; padding:14px 30px; background:linear-gradient(90deg,#2563eb,#7c3aed); color:#fff; text-decoration:none; border-radius:8px; font-weight:bold;">
              Login to Dashboard
            </a>
          </div>
        </td></tr>
        <tr><td style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280;">
          &copy; 2026 TMS. All rights reserved.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });

  return true;
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      avatar: "/default-avatar.png",
      status: "approved",
    });

    let emailStatus = "not_configured";

    try {
      if (isMailConfigured()) {
        await sendWelcomeEmail(user);
        emailStatus = "sent";
      }
    } catch (error) {
      emailStatus = "failed";
      console.error("Welcome email failed:", formatMailError(error));
    }

    return res.status(201).json({
      message:
        emailStatus === "sent"
          ? "User registered successfully. Welcome email sent."
          : emailStatus === "not_configured"
            ? "User registered successfully. Email is not configured yet."
            : "User registered successfully. Welcome email could not be sent.",
      emailStatus,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Register error:", error.message);
    return res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Login failed" });
  }
};

exports.approveAdmin = async (req, res) => {
  res.status(501).json({ message: "Not needed - no role auth" });
};

exports.rejectAdmin = async (req, res) => {
  res.status(501).json({ message: "Not needed - no role auth" });
};
