import Bid from "../models/bid.js";
import Event from "../models/event.js";
import CustomerProfile from "../models/customerProfile.js";
import User from "../models/User.js";
// import VendorProfile from "../models/vendorProfile.js";
import VendorPackage from "../models/Package.js";
import VendorProfile from "../models/VendorProfile.js";
import Portfolio from "../models/Portfolio.js";
import { sendEmail } from "../utils/sendEmail.js"
/* =============================
   PLACE BID
============================= */


export const placeBid = async (req, res) => {
  try {
    const {
      event_id,
      price,
      package_name,
      description,
      timeline,
      addons,
      notes,
    } = req.body;

    const vendorId = req.user.id;

    if (!event_id || !price || !package_name || !description || !timeline) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // ❌ existing bid check
    const existingBid = await Bid.findOne({
      where: { event_id, vendor_id: vendorId },
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: "You have already placed a bid for this event",
      });
    }

    /* =============================
       ✅ EVENT FETCH (IMPORTANT)
    ============================= */
    const event = await Event.findByPk(event_id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    /* =============================
       FILES
    ============================= */
    const files = req.files;
    const portfolioSamples = files ? files.map((file) => file.filename) : [];

    const bid = await Bid.create({
      event_id,
      vendor_id: vendorId,
      price,
      package_name,
      description,
      timeline,
      addons,
      notes,
      portfolio_samples: portfolioSamples,
    });

    /* =============================
       ✅ EMAIL SEND WITH EVENT NAME
    ============================= */

    const vendor = await User.findByPk(vendorId);

    await sendEmail(
      vendor.email,
      "Bid Placed Successfully 🎉",
      `Congratulations! 🎉

You have successfully placed a bid for the event: ${event.name}

Package: ${package_name}
Price: ₹${price}

Best of luck! 🚀`
    );

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

/* =============================
   GET BIDS FOR EVENT
============================= */

export const getBidsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const bids = await Bid.findAll({
      where: { event_id: eventId },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

/* =============================
   GET MY BIDS
============================= */

export const getMyBids = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const bids = await Bid.findAll({
      where: { vendor_id: vendorId },
      include: [
        {
          model: Event,
          attributes: ["name", "date", "location"],
          include: [
            {
              model: CustomerProfile,
              attributes: ["firstName"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: bids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

/* =============================
   GET BID BY ID
============================= */

// export const getBidById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const vendorId = req.user.id;

//     const bid = await Bid.findOne({
//       where: {
//         id,
//         vendor_id: vendorId,
//       },
//       include: [
//         {
//           model: Event,
//           attributes: [
//             "id",
//             "name",
//             "date",
//             "location",
//             "budget",
//             "guest",
//             "notes",
//           ],
//           include: [
//             {
//               model: CustomerProfile,
//               attributes: ["firstName", "lastName", "phone"],
//               include: [
//                 {
//                   model: User,
//                   attributes: ["email"],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     if (!bid) {
//       return res.status(404).json({
//         success: false,
//         message: "Bid not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: bid,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//     });
//   }
// };

export const getBidById = async (req, res) => {
  try {
    const { id } = req.params;

    const bid = await Bid.findOne({
      where: { id },
      include: [
        {
          model: Event,
          include: [
            {
              model: CustomerProfile,
              attributes: ["firstName", "phone"],
              include: [
                {
                  model: User,
                  attributes: ["email"],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: "vendor",
          attributes: ["id", "name", "email"],
          include: [
            {
              model: VendorProfile,
              attributes: [
                "profileImage",
                "category",
                "experience",
                "location",
              ],
              include: [
                {
                  model: Portfolio,
                  as: "portfolios",
                  attributes: ["id", "title"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    const inclusions = bid.addons
      ? bid.addons.split(",").map((i) => i.trim())
      : [];

    res.json({
      success: true,
      data: {
        ...bid.toJSON(),
        inclusions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
    });
  }
};

/* =============================
   UPDATE BID STATUS
============================= */

export const updateBidStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bid = await Bid.findByPk(id);

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    await bid.update({ status });

    res.json({
      success: true,
      message: "Bid status updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

/* =============================
   UPDATE BID
============================= */

export const updateBid = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;

    const bid = await Bid.findOne({
      where: {
        id,
        vendor_id: vendorId,
      },
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    if (bid.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bids can be edited",
      });
    }

    const files = req.files;

    let portfolioSamples = bid.portfolio_samples;

    if (files && files.length > 0) {
      portfolioSamples = files.map((file) => file.filename);
    }

    await bid.update({
      price: Number(req.body.price),
      package_name: req.body.package_name,
      description: req.body.description,
      timeline: req.body.timeline,
      addons: req.body.addons,
      notes: req.body.notes,
      portfolio_samples: portfolioSamples,
    });

    res.json({
      success: true,
      message: "Bid updated successfully",
      data: bid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

/* =============================
   DELETE BID
============================= */

export const deleteBid = async (req, res) => {
  try {
    const { id } = req.params;
    const vendorId = req.user.id;

    const bid = await Bid.findOne({
      where: {
        id,
        vendor_id: vendorId,
      },
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    if (bid.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot withdraw this bid",
      });
    }

    await bid.destroy();

    res.json({
      success: true,
      message: "Bid withdrawn successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

/* =============================
   TOTAL BIDS
============================= */

export const getTotalBidsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const totalBids = await Bid.count({
      where: {
        event_id: eventId,
      },
    });

    res.json({
      success: true,
      totalBids,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get total bids",
      error: error.message,
    });
  }
};
