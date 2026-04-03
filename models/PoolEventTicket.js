import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PoolEventTicket = sequelize.define("PoolEventTicket", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  event_id: DataTypes.INTEGER,
  type: DataTypes.STRING,
  price: DataTypes.INTEGER,
  capacity: DataTypes.INTEGER,

}, {
  timestamps: true,
});

export default PoolEventTicket;