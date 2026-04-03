// controllers/vendor/profile.controller.js
import VendorProfile from "../../models/VendorProfile.js";
import User from "../../models/User.js";

// 🟢 CREATE PROFILE

export const createVendorProfile = async (req, res) => {
  try {
    const exists = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (exists) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    const user = await User.findByPk(req.user.id);

    const image = req.file ? `/${req.file.path}` : null;

    const {
      businessName,
      ownerName,
      experience,
      location,
      serviceLocations,
      phone,
      email,
      description,
      serviceCategory,
    } = req.body;

    const profile = await VendorProfile.create({
      userId: req.user.id,
      businessName,
      ownerName,
      experience,
      location,
      serviceLocations,
      phone,
      email,
      description,
      profileImage: image,

      // 🔥 FIX: category always from user
      category: user.category,
      serviceCategory,
    });

    res.status(201).json({
      message: "Vendor profile created",
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: "Profile creation failed" });
  }
};

// 🔵 GET MY PROFILE
export const getMyVendorProfile = async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error("GET VENDOR PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// 🟡 UPDATE PROFILE
export const updateVendorProfile = async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const user = await User.findByPk(req.user.id);

    const image = req.file ? `/${req.file.path}` : null;

    const {
      businessName,
      ownerName,
      experience,
      location,
      serviceLocations,
      phone,
      email,
      description,
    } = req.body;

    await profile.update({
      businessName,
      ownerName,
      experience,
      location,
      serviceLocations,
      phone,
      email,
      description,
      profileImage: image || profile.profileImage,

      // 🔥 ALWAYS FORCE
      category: user.category,
      serviceCategory: req.body.serviceCategory,
    });

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

// 🔴 DELETE PROFILE
export const deleteVendorProfile = async (req, res) => {
  try {
    const profile = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.destroy();
    res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error("DELETE VENDOR PROFILE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
