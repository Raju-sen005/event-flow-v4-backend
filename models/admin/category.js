import Sequelize from "sequelize";
import sequelize from "../../config/db.js";
import SubCategory from "../../models/admin/subcategory.js";
const { DataTypes } = Sequelize;
const Category = sequelize.define(
    "categories",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active",
        },
    },
    {
        tableName: "categories",
        timestamps: false,
    },
);

export default Category;