import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Package = sequelize.define("Package", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  category: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  price: {
    type: DataTypes.STRING,
    allowNull: false
  },

  inclusions: {
    type: DataTypes.JSON,
    allowNull: true
  },

  exclusions: {
    type: DataTypes.JSON,
    allowNull: true
  },

  event_types: {
    type: DataTypes.JSON,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM("active", "inactive"),
    defaultValue: "active"
  }
}, {
  tableName: "packages"
});

export default Package;
