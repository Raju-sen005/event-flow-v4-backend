import VendorKYC from "../../models/VendorKYC.js";

export const verifyKYC = async (req, res) => {
  const { vendorId } = req.params;

  await VendorKYC.update(
    {
      status: "verified",
      verifiedAt: new Date()
    },
    { where: { vendorId } }
  );

  res.json({ success: true, message: "KYC Verified" });
};

export const rejectKYC = async (req, res) => {
  const { vendorId } = req.params;
  const { reason, comment } = req.body;

  await VendorKYC.update(
    {
      status: "rejected",
      rejectionReason: reason,
      rejectionComment: comment
    },
    { where: { vendorId } }
  );

  res.json({ success: true, message: "KYC Rejected" });
};