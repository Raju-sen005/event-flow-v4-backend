import { Category, SubCategory } from "../../models/index.js";

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    await Category.create({
      name: name,
      description: description,
    });

    res.json({
      message: "Category created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

const categoryList = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: SubCategory,
          as: "subcategories",
          where: { status: true },
          required: false, // 🔥 category aaye bhale hi subcategory na ho
        },
      ],
    });
    res.status(200).json({
      status: true,
      data: categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

/**
 * CREATE SUB CATEGORY
 */
const createSubCategory = async (req, res) => {
  try {
    const { category_id, name, description } = req.body;

    await SubCategory.create({
      category_id,
      name,
      description,
    });

    res.json({
      message: "Sub-category created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

/**
 * SUB CATEGORY LIST (ALL)
 */
const subCategoryList = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll();

    res.status(200).json({
      status: true,
      data: subCategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

/**
 * SUB CATEGORY LIST BY CATEGORY
 */
const subCategoryByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    const subCategories = await SubCategory.findAll({
      where: {
        category_id: category_id,
        status: true,
      },
    });

    res.status(200).json({
      status: true,
      data: subCategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

export {
  createCategory,
  categoryList,
  createSubCategory,
  subCategoryList,
  subCategoryByCategory,
};
