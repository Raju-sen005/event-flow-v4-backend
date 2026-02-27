import Package from "../../models/Package.js";

/**
 * CREATE PACKAGE
 * POST /api/vendor/packages
 */
export const createPackage = async (req, res) => {
  try {
    const vendor_id = 5; // 🔐 JWT se aayega later

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
    res.status(500).json({ success: false });
  }
};

/**
 * GET ALL PACKAGES (Vendor)
 * GET /api/vendor/packages
 */
export const getPackages = async (req, res) => {
  try {
    const vendor_id = 5;

    const packages = await Package.findAll({
      where: { vendor_id },
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      data: packages
    });

  } catch (err) {
    console.error("Get Packages Error:", err);
    res.status(500).json({ success: false });
  }
};

/**
 * UPDATE PACKAGE
 * PUT /api/vendor/packages/:id
 */
export const updatePackage = async (req, res) => {
  try {
    const vendor_id = 5;
    const { id } = req.params;

    const [updated] = await Package.update(req.body, {
      where: { id, vendor_id }
    });

    if (!updated) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Update Package Error:", err);
    res.status(500).json({ success: false });
  }
};

/**
 * DELETE PACKAGE
 * DELETE /api/vendor/packages/:id
 */
export const deletePackage = async (req, res) => {
  try {
    const vendor_id = 5;
    const { id } = req.params;

    await Package.destroy({
      where: { id, vendor_id }
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Delete Package Error:", err);
    res.status(500).json({ success: false });
  }
};

/**
 * TOGGLE STATUS
 * PATCH /api/vendor/packages/:id/status
 */
export const togglePackageStatus = async (req, res) => {
  try {
    const vendor_id = 5;
    const { id } = req.params;

    const pkg = await Package.findOne({ where: { id, vendor_id } });

    if (!pkg) {
      return res.status(404).json({ success: false });
    }

    pkg.status = pkg.status === "active" ? "inactive" : "active";
    await pkg.save();

    res.json({
      success: true,
      status: pkg.status
    });

  } catch (err) {
    console.error("Toggle Status Error:", err);
    res.status(500).json({ success: false });
  }
};
