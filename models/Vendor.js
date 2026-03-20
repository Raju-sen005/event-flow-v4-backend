import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Vendor = sequelize.define("Vendor", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  location: {
    type: DataTypes.STRING
  },
  priceRange: {
    type: DataTypes.STRING
  },
  image: {
    type: DataTypes.STRING
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  responseTime: {
    type: DataTypes.STRING
  },
  completedEvents: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: "vendors",
  timestamps: true
});

export default Vendor;
