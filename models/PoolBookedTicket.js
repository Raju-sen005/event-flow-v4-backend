import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PoolBookedTicket = sequelize.define("PoolBookedTicket", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,

  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  booking_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  event_date: DataTypes.DATEONLY,

  adult_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  child_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  senior_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  total_tickets: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  total_amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  payment_id: DataTypes.STRING,
  order_id: DataTypes.STRING,

  payment_method: DataTypes.STRING,

  payment_status: {
    type: DataTypes.ENUM("pending", "paid", "failed"),
    defaultValue: "pending",
  },

  status: {
    type: DataTypes.ENUM("active", "cancelled"),
    defaultValue: "active",
  },
});

export default PoolBookedTicket;
