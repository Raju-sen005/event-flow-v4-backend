import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TicketMessage = sequelize.define(
  "TicketMessage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    ticketId: {
      type: DataTypes.UUID,
    },

    senderId: {
      type: DataTypes.INTEGER,
    },
    senderName: {
      type: DataTypes.STRING,
    },

    senderRole: {
      type: DataTypes.ENUM("vendor", "admin"),
    },

    message: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "ticket_messages",
  },
);

export default TicketMessage;
