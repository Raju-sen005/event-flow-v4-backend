import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const VendorSetting = sequelize.define("VendorSetting", {
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  emailRequirement: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  emailBidUpdates: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  emailMessages: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  emailReminders: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  emailPayments: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  pushUrgentUpdates: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  pushAgreement: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  pushMessages: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

  language: {
    type: DataTypes.STRING,
    defaultValue: "English",
  },

  timezone: {
    type: DataTypes.STRING,
    defaultValue: "IST",
  },

});

export default VendorSetting;