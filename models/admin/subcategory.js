import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Category from "../../models/admin/category.js";

const SubCategory = sequelize.define(
  "SubCategory",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    meta_title: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    meta_desc: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    meta_keywords: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    meta_author: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        allowNull: false,
        defaultValue: "active",
    },
  },
  {
    tableName: "subcategories",
    timestamps: false,
  },
);

export default SubCategory;