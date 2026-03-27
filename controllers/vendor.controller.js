import { Op } from "sequelize";
import {
  VendorProfile,
  Package,
  Portfolio,
  PortfolioMedia,
} from "../models/index.js";
// import PortfolioMedia from "../models/PortfolioMedia.js";

const getAllVendors = async (req, res) => {
  try {
    const { search, category } = req.query;

    const whereClause = {};

    // 🔍 Search by business name / location
    if (search) {
      whereClause[Op.or] = [
        { businessName: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
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
        "createdAt",
      ],

      include: [
        {
          model: Package,
          as: "packages",
          where: { status: "active" },
          required: false, // vendor without packages also allowed
          attributes: ["id", "name", "price", "category"],
        },
        {
          model: Portfolio,
          as: "portfolios",
          where: { status: "active" },
          required: false,
          attributes: ["id", "title", "category", "subCategory"],
          include: [
            {
              model: PortfolioMedia,
              as: "media",
              attributes: ["url"],
              required: false,
            },
          ],
        },
      ],

      order: [["createdAt", "DESC"]],
    });
const formattedVendors = vendors.map((v) => {
  const data = v.toJSON();

  return {
    ...data,
    image: data.portfolios?.[0]?.media?.[0]?.url || null,
  };
});
    return res.status(200).json({
  success: true,
  count: formattedVendors.length,
  data: formattedVendors,
});
  } catch (error) {
    console.error("GET VENDORS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendors",
      error: error.message,
    });
  }
};


export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await VendorProfile.findByPk(id, {
  include: [
    {
      model: Package,
      as: "packages",
      where: { status: "active" },
      required: false,
      attributes: ["id", "name", "price", "category"],
    },
    {
      model: Portfolio,
      as: "portfolios",
      where: { status: "active" },
      required: false,
      attributes: ["id", "title", "category", "subCategory"],
      include: [
        {
          model: PortfolioMedia,
          as: "media",
          attributes: ["url"],
          required: false,
        },
      ],
    },
  ],
});

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    res.json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error("Get vendor error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default {
  getAllVendors,
  getVendorById
};
