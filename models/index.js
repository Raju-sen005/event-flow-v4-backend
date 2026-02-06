import Category from "./category.model.js";
import SubCategory from "./subcategory.model.js";

// 🔗 Associations
Category.hasMany(SubCategory, {
  foreignKey: "category_id",
  as: "subcategories",
});

SubCategory.belongsTo(Category, {
  foreignKey: "category_id",
});

export { Category, SubCategory };
