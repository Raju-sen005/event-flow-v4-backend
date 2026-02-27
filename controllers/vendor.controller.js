import { Op } from "sequelize";
import { VendorProfile, Package, Portfolio } from "../models/index.js";

const getAllVendors = async (req, res) => {
  try {
    const { search, category } = req.query;

    const whereClause = {};

    // 🔍 Search by business name / location
    if (search) {
      whereClause[Op.or] = [
        { businessName: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    // 📂 Category filter
    if (category && category !== "all") {
      whereClause.category = category;
    }

    const vendors = await VendorProfile.findAll({
      where: whereClause,

      attributes: [
        "id",
        "userId",
        "businessName",
        "ownerName",
        "category",
        "experience",
        "location",
        "serviceLocations",
        "phone",
        "email",
        "description",
        "createdAt"
      ],

      include: [
        {
          model: Package,
          as: "packages",
          where: { status: "active" },
          required: false, // vendor without packages also allowed
          attributes: ["id", "name", "price", "category"]
        },
        {
          model: Portfolio,
          as: "portfolios",
          where: { status: "active" },
          required: false,
          attributes: ["id", "title", "category", "subCategory"]
        }
      ],

      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors
    });

  } catch (error) {
    console.error("GET VENDORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
      error: error.message
    });
  }
};

export default {
  getAllVendors
};
