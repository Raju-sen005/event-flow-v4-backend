import VendorKYC from "../models/VendorKYC.js";

import Vendor from "../models/Vendor.js"; // add this

export const submitKYC = async (req, res) => {
  try {
    console.log("User from token:", req.user);

    // 🔥 Find vendor using logged in user
    const vendor = await Vendor.findOne({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(400).json({ error: "Vendor not found" });
    }

    const data = {
      ...req.body,
      vendorId: vendor.id, // ✅ correct id
      status: "under_review",
      submittedAt: new Date(),
    };

    Object.keys(req.files || {}).forEach((key) => {
      data[key] = req.files[key][0].path;
    });

    const [kyc] = await VendorKYC.upsert(data);

    res.json({
      success: true,
      message: "KYC submitted successfully",
      kyc,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyKYC = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      where: { userId: req.user.id },
    });

    if (!vendor) {
      return res.status(400).json({ error: "Vendor not found" });
    }

    const kyc = await VendorKYC.findOne({
      where: { vendorId: vendor.id },
    });

    res.json(kyc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
