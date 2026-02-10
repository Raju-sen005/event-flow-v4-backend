import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Event = sequelize.define(
    "Event",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },

        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        },

        location: {
            type: DataTypes.STRING,
            allowNull: false
        },

        budget: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        management_mode: {
            type: DataTypes.ENUM("self-managed", "planner-managed"),
            allowNull: false
        },

        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "events",
        timestamps: true
    }
);

export default Event;
