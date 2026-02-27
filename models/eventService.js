import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const EventService = sequelize.define(
  "EventService",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    service_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "event_services",
    timestamps: true
  }
);

export default EventService;
