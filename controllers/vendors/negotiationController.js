import { Negotiation, NegotiationOffer } from "../models/index.js";

export const createOffer = async (req, res) => {
  try {

    const { bidId, price, timeline, notes } = req.body;

    let negotiation = await Negotiation.findOne({
      where: { bid_id: bidId }
    });

    if (!negotiation) {
      negotiation = await Negotiation.create({
        bid_id: bidId
      });
    }

    const offer = await NegotiationOffer.create({
      negotiation_id: negotiation.id,
      proposed_by: req.user.role,
      price,
      timeline,
      notes
    });

    res.json({
      success: true,
      data: offer
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
};


export const getNegotiation = async (req, res) => {

  const { bidId } = req.params;

  const negotiation = await Negotiation.findOne({
    where: { bid_id: bidId },
    include: [
      {
        model: NegotiationOffer,
        as: "offers",
        order: [["createdAt","ASC"]]
      }
    ]
  });

  res.json({
    success: true,
    data: negotiation
  });

};