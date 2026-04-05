import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PoolEvent = sequelize.define("PoolEvent", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  title: DataTypes.STRING,
  category: DataTypes.STRING,
  description: DataTypes.TEXT,
  location: DataTypes.STRING,
  meetup_point: DataTypes.STRING,
  event_date: DataTypes.DATEONLY,
  event_time: DataTypes.TIME,
  duration: DataTypes.STRING,
  total_capacity: DataTypes.INTEGER,

  status: {
    type: DataTypes.ENUM("draft", "published"),
    defaultValue: "draft",
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  trending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  popular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  image: DataTypes.STRING,
  price: DataTypes.INTEGER,
  originalPrice: DataTypes.INTEGER,
  rating: DataTypes.FLOAT,
  offer: DataTypes.STRING,
  verified: DataTypes.BOOLEAN

}, {
    tableName: "poolevents",
    timestamps: true,
  },);

export default PoolEvent;