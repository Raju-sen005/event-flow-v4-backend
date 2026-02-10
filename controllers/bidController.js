import Bid from "../models/bid.js";

// ➕ PLACE BID
export const placeBid = async (req, res) => {
  try {
    const {
      event_id, // 🔥 FIX
      price,
      packageName,
      description,
      timeline,
      addons,
      notes,
      portfolioSamples,
    } = req.body;

    const vendorId = req.user.id;

    if (!event_id || !price || !packageName || !description || !timeline) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const bid = await Bid.create({
      event_id,
      vendor_id: vendorId,
      price,
      package_name: packageName,
      description,
      timeline,
      addons,
      notes,
      portfolio_samples: portfolioSamples || [],
    });

    res.status(201).json({
      success: true,
      message: "Bid placed successfully",
      data: bid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to place bid",
      error: error.message,
    });
  }
};


// 📋 GET BIDS FOR REQUIREMENT (Customer)
export const getBidsByEvent = async (req, res) => {
  const { eventId } = req.params;

  const bids = await Bid.findAll({
    where: { event_id: eventId },
    order: [["createdAt", "DESC"]],
  });

  res.json({ success: true, data: bids });
};


// 📋 GET MY BIDS (Vendor)
export const getMyBids = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const bids = await Bid.findAll({
      where: { vendor_id: vendorId },
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: bids });
  } catch {
    res.status(500).json({ success: false });
  }
};

// ✅ ACCEPT / ❌ REJECT BID
export const updateBidStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bid = await Bid.findByPk(id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    await bid.update({ status });

    res.json({
      success: true,
      message: "Bid status updated",
    });
  } catch {
    res.status(500).json({ success: false });
  }
};
