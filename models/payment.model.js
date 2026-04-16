import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  slabNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  name: {
    type: DataTypes.STRING
  },

  percentage: {
    type: DataTypes.INTEGER
  },

  amount: {
    type: DataTypes.FLOAT
  },

  status: {
    type: DataTypes.ENUM(
      "pending",
      "paid",
      "completed",
      "cash_awaiting_vendor",
      "cash_awaiting_admin"
    ),
    defaultValue: "pending"
  },

  paymentMethod: {
    type: DataTypes.ENUM("online", "cash")
  },

  transactionId: {
    type: DataTypes.STRING
  },

  dueDate: {
    type: DataTypes.DATE
  }

});

export default Payment;