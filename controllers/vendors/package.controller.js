import Package from "../../models/Package.js";
import { VendorProfile } from "../../models/index.js";

/**
 * CREATE PACKAGE
 * POST /api/vendor/packages
 */
export const createPackage = async (req, res) => {
  try {

    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    const vendor_id = vendorProfile.id;

    const {
      name,
      category,
      description,
      price,
      inclusions,
      exclusions,
      eventTypes,
      status
    } = req.body;

    const pkg = await Package.create({
      vendor_id,
      name,
      category,
      description,
      price,
      inclusions,
      exclusions,
      event_types: eventTypes,
      status
    });

    res.status(201).json({
      success: true,
      data: pkg
    });

  } catch (err) {

    console.error("Create Package Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to create package"
    });

  }
};


/**
 * GET ALL PACKAGES (Vendor)
 * GET /api/vendor/packages
 */
export const getPackages = async (req, res) => {
  try {

    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    const packages = await Package.findAll({
      where: { vendor_id: vendorProfile.id },
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      data: packages
    });

  } catch (err) {

    console.error("Get Packages Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch packages"
    });

  }
};


/**
 * UPDATE PACKAGE
 * PUT /api/vendor/packages/:id
 */
export const updatePackage = async (req, res) => {
  try {

    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    const vendor_id = vendorProfile.id;
    const { id } = req.params;

    const [updated] = await Package.update(req.body, {
      where: { id, vendor_id }
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    res.json({
      success: true,
      message: "Package updated successfully"
    });

  } catch (err) {

    console.error("Update Package Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to update package"
    });

  }
};


/**
 * DELETE PACKAGE
 * DELETE /api/vendor/packages/:id
 */
export const deletePackage = async (req, res) => {
  try {

    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    const vendor_id = vendorProfile.id;
    const { id } = req.params;

    const deleted = await Package.destroy({
      where: { id, vendor_id }
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    res.json({
      success: true,
      message: "Package deleted successfully"
    });

  } catch (err) {

    console.error("Delete Package Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to delete package"
    });

  }
};


/**
 * TOGGLE PACKAGE STATUS
 * PATCH /api/vendor/packages/:id/status
 */
export const togglePackageStatus = async (req, res) => {
  try {

    const vendorProfile = await VendorProfile.findOne({
      where: { userId: req.user.id }
    });

    if (!vendorProfile) {
      return res.status(400).json({
        success: false,
        message: "Vendor profile not found"
      });
    }

    const vendor_id = vendorProfile.id;
    const { id } = req.params;

    const pkg = await Package.findOne({
      where: { id, vendor_id }
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found"
      });
    }

    pkg.status = pkg.status === "active" ? "inactive" : "active";

    await pkg.save();

    res.json({
      success: true,
      status: pkg.status
    });

  } catch (err) {

    console.error("Toggle Status Error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to update status"
    });

  }
};