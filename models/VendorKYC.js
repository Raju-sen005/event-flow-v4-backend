import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const VendorKYC = sequelize.define("VendorKYC", {
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },

  status: {
    type: DataTypes.ENUM(
      "not_submitted",
      "under_review",
      "verified",
      "rejected",
    ),
    defaultValue: "not_submitted",
  },

  rejectionReason: DataTypes.STRING,
  rejectionComment: DataTypes.TEXT,

  // Identity
  identityProofType: DataTypes.ENUM("aadhaar", "pan"),
  identityFront: DataTypes.STRING,
  identityBack: DataTypes.STRING,

  // Business
  businessProofType: DataTypes.ENUM("gst", "shop_act", "trade_license"),
  businessProof: DataTypes.STRING,

  // Bank
  accountHolderName: DataTypes.STRING,
  bankName: DataTypes.STRING,
  accountNumber: DataTypes.STRING,
  ifscCode: DataTypes.STRING,
  bankProof: DataTypes.STRING,

  // Address
  addressProofType: DataTypes.ENUM("utility_bill", "rental_agreement", "other"),
  addressProof: DataTypes.STRING,

  submittedAt: DataTypes.DATE,
  verifiedAt: DataTypes.DATE,
});

export default VendorKYC;
