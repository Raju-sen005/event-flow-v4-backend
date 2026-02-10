import CustomerProfile from "../../models/customerProfile.js";
import User from "../../models/User.js";

// 🟢 CREATE PROFILE
export const createProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;

    const exists = await CustomerProfile.findOne({
      where: { userId: req.user.id },
    });

    if (exists) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    const profile = await CustomerProfile.create({
      userId: req.user.id,
      firstName,
      lastName,
      phone,
      bio,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (err) {
    console.error("CREATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile creation failed" });
  }
};

// 🔵 GET MY PROFILE (WITH EMAIL)
export const getMyProfile = async (req, res) => {
  try {
    const profile = await CustomerProfile.findOne({
      where: { userId: req.user.id },
      include: {
        model: User,
        attributes: ["email"],
      },
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    res.json({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      bio: profile.bio,
      email: profile.User.email, // ✅ safe
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// 🟡 UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;

    const profile = await CustomerProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    await profile.update({
      firstName,
      lastName,
      phone,
      bio,
    });

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

// 🔴 DELETE PROFILE
export const deleteProfile = async (req, res) => {
  try {
    const profile = await CustomerProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    await profile.destroy();

    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error("DELETE PROFILE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
