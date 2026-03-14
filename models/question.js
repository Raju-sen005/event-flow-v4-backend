import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  reply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Question;