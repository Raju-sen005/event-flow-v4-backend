import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Negotiation = sequelize.define(
  "Negotiation",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    bid_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM(
        "awaiting_vendor",
        "awaiting_customer",
        "accepted",
        "rejected",
        "locked"
      ),
      defaultValue: "awaiting_vendor"
    },

    finalized_price: {
      type: DataTypes.INTEGER
    },

    finalized_timeline: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: "negotiations",
    timestamps: true
  }
);

export default Negotiation;