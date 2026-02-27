import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Portfolio from "./Portfolio.js";

const PortfolioMedia = sequelize.define("PortfolioMedia", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  portfolioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  type: {
    type: DataTypes.ENUM("image", "video"),
    allowNull: false,
  },

  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "portfolio_media",
  timestamps: true,
});

Portfolio.hasMany(PortfolioMedia, {
  foreignKey: "portfolioId",
  onDelete: "CASCADE",
});

PortfolioMedia.belongsTo(Portfolio, {
  foreignKey: "portfolioId",
});

export default PortfolioMedia;
