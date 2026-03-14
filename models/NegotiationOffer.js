import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const NegotiationOffer = sequelize.define(
  "NegotiationOffer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    negotiation_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    proposed_by: {
      type: DataTypes.ENUM("customer", "vendor"),
      allowNull: false
    },

    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    timeline: {
      type: DataTypes.STRING,
      allowNull: false
    },

    notes: {
      type: DataTypes.TEXT
    },

    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "countered"),
      defaultValue: "pending"
    }
  },
  {
    tableName: "negotiation_offers",
    timestamps: true
  }
);

export default NegotiationOffer;