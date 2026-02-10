// models/Guest.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Guest = sequelize.define(
  "Guest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING, // family, friend, vip, etc
      allowNull: false,
    },
  },
  {
    tableName: "guests",
    timestamps: true,
  }
);

export default Guest;
