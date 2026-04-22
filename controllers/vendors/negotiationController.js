import { Negotiation, NegotiationOffer } from "../../models/index.js";
import { Op } from "sequelize";
import { Bid } from "../../models/index.js";

export const createOffer = async (req, res) => {
  try {
    const { bidId, price, timeline, notes } = req.body;

    let negotiation = await Negotiation.findOne({
      where: { bid_id: bidId },
    });

    if (!negotiation) {
      negotiation = await Negotiation.create({
        bid_id: bidId,
        status: "awaiting_vendor",
      });
    }

    const offer = await NegotiationOffer.create({
      negotiation_id: negotiation.id,
      proposed_by: req.user.role, // "vendor" or "customer"
      price,
      timeline,
      notes,
      status: "pending",
    });

    res.json({
      success: true,
      data: offer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const getNegotiation = async (req, res) => {
  try {
    const { bidId } = req.params;

    const negotiation = await Negotiation.findOne({
      where: { bid_id: bidId },
      include: [
        {
          model: NegotiationOffer,
          as: "offers",
          separate: true,
          order: [["createdAt", "ASC"]],
        },
      ],
    });

    if (!negotiation) {
      return res.json({
        success: true,
        data: {
          id: null,
          bid_id: bidId,
          offers: [],
        },
      });
    }

    res.json({
      success: true,
      data: negotiation,
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

export const acceptOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await NegotiationOffer.findByPk(offerId);

    if (!offer) {
      return res.status(404).json({ success: false });
    }

    // ✅ accept selected offer
    offer.status = "accepted";
    await offer.save();

    // ❌ reject others
    await NegotiationOffer.update(
      { status: "rejected" },
      {
        where: {
          negotiation_id: offer.negotiation_id,
          id: { [Op.ne]: offerId },
        },
      }
    );

    // 🔥 UPDATE negotiation
    await Negotiation.update(
      {
        status: "accepted", // ✅ सही enum
        finalized_price: offer.price,
        finalized_timeline: offer.timeline,
      },
      {
        where: { id: offer.negotiation_id },
      }
    );

    res.json({
      success: true,
      message: "Offer accepted",
    });
  } catch (err) {
    console.error("ACCEPT ERROR:", err);
    res.status(500).json({ success: false });
  }
};


export const finalizeVendor = async (req, res) => {
  try {
    const { bidId } = req.body;

    // 🔍 negotiation find karo
    const negotiation = await Negotiation.findOne({
      where: { bid_id: bidId },
    });

    // ❌ agar negotiation hi nahi hai
    if (!negotiation) {
      return res.status(400).json({
        success: false,
        message: "Please complete negotiation before finalizing vendor",
      });
    }

    // ❌ agar accepted nahi hua
    if (negotiation.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message: "Please accept an offer before finalizing vendor",
      });
    }

    // ❌ safety: finalized price check
    if (!negotiation.finalized_price) {
      return res.status(400).json({
        success: false,
        message: "Final price not set",
      });
    }

    // ✅ sab sahi → finalize
    await Bid.update(
      {
        status: "accepted",
        finalizedAt: new Date(),
      },
      {
        where: { id: bidId },
      }
    );

    res.json({
      success: true,
      message: "Vendor finalized successfully",
    });
  } catch (err) {
    console.error("FINALIZE ERROR:", err);
    res.status(500).json({ success: false });
  }
};


export const counterOffer = async (req, res) => {
  try {
    const { bidId, price, timeline, notes } = req.body;

    let negotiation = await Negotiation.findOne({
      where: { bid_id: bidId },
    });

    if (!negotiation) {
      negotiation = await Negotiation.create({
        bid_id: bidId,
        status: "awaiting_vendor",
      });
    }

    const offer = await NegotiationOffer.create({
      negotiation_id: negotiation.id,
      proposed_by: "customer",
      price,
      timeline: timeline || "custom", 
      notes,
      status: "pending",
    });

    res.json({
      success: true,
      data: offer,
    });
  } catch (err) {
    console.error("COUNTER ERROR:", err); // 🔥 add this
    res.status(500).json({ success: false });
  }
};
