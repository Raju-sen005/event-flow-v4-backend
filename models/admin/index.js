import Category from "../../models/admin/category.js";
import SubCategory from "../../models/admin/subcategory.js";

// 🔗 Associations
Category.hasMany(SubCategory, {
  foreignKey: "category_id",
  as: "subcategories",
});

SubCategory.belongsTo(Category, {
  foreignKey: "category_id",
});

export { Category, SubCategory };