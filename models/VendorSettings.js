import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const VendorSettings = sequelize.define("VendorSettings", {
 id: {
  type: DataTypes.INTEGER,
  primaryKey: true,
  autoIncrement: true
 },
 vendorId: {
  type: DataTypes.INTEGER,
  allowNull: false
 },
 serviceRadius: DataTypes.STRING,
 workingHours: DataTypes.STRING
});

export default VendorSettings;