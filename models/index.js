import User from "./User.js";
import CustomerProfile from "./customerProfile.js";
import VendorProfile from "./VendorProfile.js";
User.hasOne(CustomerProfile, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

CustomerProfile.belongsTo(User, {
  foreignKey: "userId",
});

User.hasOne(VendorProfile, { foreignKey: "userId" });
VendorProfile.belongsTo(User, { foreignKey: "userId" });