import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    businessName: {
      type: DataTypes.STRING,
      allowNull: true, // customer ke liye null
    },

    // phone: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     isNumeric: true,
    //     len: [10, 15],
    //   },
    // },

    // category: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    role: {
      type: DataTypes.ENUM(
        "customer",
        "vendor",
        "event-planner",
        "freelance-planner",
      ),
      allowNull: false,
      defaultValue: "customer",
    },
    kyc: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "rejected"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);

export default User;
