import Package from "../../models/Package.js";
// import { VendorProfile } from "../../models/index.js";
import { VendorProfile, Event } from "../../models/index.js";

/**
 * 🔥 SAFE PARSE FUNCTION
 */
const safeParse = (data) => {
  if (Array.isArray(data)) return data;

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  return [];
};

/**
 * CREATE PACKAGE
 */
export const createPackage = async (req, res) => {
  try {
    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const vendor_id = vendorProfile.id;

    const inclusions = JSON.parse(req.body.inclusions || "[]");
    const exclusions = JSON.parse(req.body.exclusions || "[]");
    const eventTypes = JSON.parse(req.body.eventTypes || "[]");

    const { name, category, description, price, status } = req.body;

    const imageFiles = req.files?.images || [];
    const videoFile = req.files?.video?.[0];

    const imageUrls = imageFiles.map((file) => `/${file.path}`);
    const videoUrl = videoFile ? `/${videoFile.path}` : null;

    const pkg = await Package.create({
      vendor_id,
      name,
      category,
      description,
      price,
      inclusions,
      exclusions,
      event_types: eventTypes,
      status,
      images: JSON.stringify(imageUrls),
      video: videoUrl,
    });

    const data = pkg.toJSON();

    res.status(201).json({
      success: true,
      data: {
        ...data,
        inclusions,
        exclusions,
        event_types: eventTypes,
        images: JSON.stringify(imageUrls),
      },
    });
  } catch (err) {
    console.error("Create Package Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create package",
    });
  }
};

/**
 * GET PACKAGES
 */
export const getPackages = async (req, res) => {
  try {
    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const packages = await Package.findAll({
      where: { vendor_id: vendorProfile.id },
      order: [["createdAt", "DESC"]],
    });

    const formattedPackages = packages.map((pkg) => {
      const data = pkg.toJSON();

      return {
        ...data,
        inclusions: safeParse(data.inclusions),
        exclusions: safeParse(data.exclusions),
        event_types: safeParse(data.event_types),
        images: safeParse(data.images),
      };
    });

    res.json({
      success: true,
      data: formattedPackages,
    });
  } catch (err) {
    console.error("Get Packages Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch packages",
    });
  }
};

export const getPackageById = async (req, res) => {
  try {
    const data = await Package.findByPk(req.params.id, {
      include: [
        {
          model: VendorProfile,
          as: "vendor",
          attributes: ["id", "ownerName", "email", "phone"],
        },
        // {
        //   model: Event,
        //   attributes: ["id", "name", "date"],
        // },
      ],
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * UPDATE PACKAGE
 */
export const updatePackage = async (req, res) => {
  try {
    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const vendor_id = vendorProfile.id;
    const { id } = req.params;

    const inclusions = JSON.parse(req.body.inclusions || "[]");
    const exclusions = JSON.parse(req.body.exclusions || "[]");
    const eventTypes = JSON.parse(req.body.eventTypes || "[]");

    const imageFiles = req.files?.images || [];
    const videoFile = req.files?.video?.[0];

    const pkg = await Package.findOne({ where: { id, vendor_id } });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // 🔥 Preserve old images if new not uploaded
    let imageUrls = pkg.images || [];
    if (imageFiles.length) {
      const newImages = imageFiles.map((file) => `/${file.path}`);
      imageUrls = [...safeParse(pkg.images), ...newImages];
    }

    // 🔥 Preserve old video
    const videoUrl = videoFile ? `/${videoFile.path}` : pkg.video;

    await pkg.update({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      status: req.body.status,
      inclusions,
      exclusions,
      event_types: eventTypes,
      images: JSON.stringify(imageUrls),
      video: videoUrl,
    });

    const data = pkg.toJSON();

    res.json({
      success: true,
      data: {
        ...data,
        inclusions,
        exclusions,
        event_types: eventTypes,
        images: JSON.stringify(imageUrls),
      },
    });
  } catch (err) {
    console.error("Update Package Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update package",
    });
  }
};

/**
 * DELETE PACKAGE
 */
export const deletePackage = async (req, res) => {
  try {
    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const vendor_id = vendorProfile.id;
    const { id } = req.params;

    const deleted = await Package.destroy({
      where: { id, vendor_id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.json({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (err) {
    console.error("Delete Package Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete package",
    });
  }
};

/**
 * TOGGLE PACKAGE STATUS
 */
export const togglePackageStatus = async (req, res) => {
  try {
    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id },
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    const vendor_id = vendorProfile.id;
    const { id } = req.params;

    const pkg = await Package.findOne({
      where: { id, vendor_id },
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    pkg.status = pkg.status === "active" ? "inactive" : "active";

    await pkg.save();

    res.json({
      success: true,
      status: pkg.status,
    });
  } catch (err) {
    console.error("Toggle Status Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};
