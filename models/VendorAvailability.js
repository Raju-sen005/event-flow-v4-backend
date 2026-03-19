import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const VendorAvailability = sequelize.define("VendorAvailability", {
 id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
 },
 vendorId: {
  type: DataTypes.INTEGER,
  allowNull: false
 },
 blockedDate: {
  type: DataTypes.DATEONLY,
  allowNull: false
 }
});

export default VendorAvailability;