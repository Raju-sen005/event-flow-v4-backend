import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js"; // add this
import VendorProfile from "../models/VendorProfile.js";
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// 🔐 REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, businessName } =
      req.body;

    // ✅ Required fields check
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !businessName
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ Confirm password check
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password and confirm password do not match",
      });
    }

    // ✅ Strong password (extra security)
    const strongPassword =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password);

    if (!strongPassword) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters with uppercase, lowercase and number",
      });
    }

    // ✅ Email already exists?
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      businessName,
    });

    // 🔥 ADD THIS BLOCK
    if (role === "vendor") {
      await Vendor.create({
        userId: user.id,
        name: businessName, // or name
        category: "general", // default category (change as needed)
      });
    }

    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

// 🔑 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    let profileImage = null;

    if (user.role === "vendor") {
      const profile = await VendorProfile.findOne({
        where: { userId: user.id },
      });

      profileImage = profile?.profileImage || null;
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        profileImage, // 🔥 ADD THIS
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};




// ==========================
// ✅ REGISTER V2 (CLEAN)
// ==========================
export const registerV2 = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, businessName } = req.body;

    // Basic validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Role-based validation
    if (role === "vendor" && !businessName) {
      return res.status(400).json({
        message: "Business name is required for vendor",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check existing
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      businessName: role === "vendor" ? businessName : null,
    });

    // Vendor setup
    if (role === "vendor") {
      await Vendor.create({
        userId: user.id,
        name: businessName,
        category: "general",
      });

      await VendorProfile.create({
        userId: user.id,
      });
    }

    const token = generateToken(user);

    return res.status(201).json({
      message: "Registered successfully (v2)",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};



// ==========================
// ✅ LOGIN V2 (CLEAN)
// ==========================
export const loginV2 = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email & password required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    let profileImage = null;

    if (user.role === "vendor") {
      const profile = await VendorProfile.findOne({
        where: { userId: user.id },
      });
      profileImage = profile?.profileImage || null;
    }

    return res.json({
      message: "Login successful (v2)",
      token,
      user: {
        ...user.toJSON(),
        profileImage,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};
