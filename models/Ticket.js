import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Ticket = sequelize.define("Ticket", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  ticketNumber: {
    type: DataTypes.STRING,
    allowNull:false
  },

  vendorId: {
    type: DataTypes.INTEGER,
    allowNull:false
  },

  category: {
    type: DataTypes.STRING
  },

  subject: {
    type: DataTypes.STRING
  },

  description: {
    type: DataTypes.TEXT
  },

  priority: {
    type: DataTypes.ENUM("low","medium","high","urgent"),
    defaultValue:"medium"
  },

  status: {
    type: DataTypes.ENUM(
      "open",
      "in_progress",
      "waiting_for_vendor",
      "resolved",
      "closed"
    ),
    defaultValue:"open"
  },

  relatedType: DataTypes.STRING,

  relatedId: DataTypes.STRING,

  relatedReference: DataTypes.STRING,

  assignedToId: DataTypes.INTEGER

},{
  tableName:"tickets"
});

export default Ticket;