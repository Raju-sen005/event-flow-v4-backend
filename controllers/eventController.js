import sequelize from "../config/db.js";
import { Event, EventService, CustomerProfile } from "../models/index.js";
import { VendorProfile } from "../models/index.js";
import { Sequelize } from "sequelize";
import Bid from "../models/bid.js";
import Guest from "../models/guest.js";
import Payment from "../models/payment.model.js";
import User from "../models/User.js";

/* =======================
   CREATE EVENT
======================= */
export const createEvent = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      name,
      date,
      startTime,
      endTime,
      location,
      budget,
      guest,
      notes,
      category_id,
      management_mode,
      services,
    } = req.body;

    const userId = req.user.id; // 🔐 JWT

    if (
      !name ||
      !date ||
      !startTime ||
      !endTime ||
      !location ||
      !category_id ||
      !management_mode
    ) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const customer = await CustomerProfile.findOne({
      where: { userId },
    });

    if (!customer) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    const event = await Event.create(
      {
        name,
        date,
        start_time: startTime,
        end_time: endTime,
        location,
        budget,
        guest,
        notes,
        category_id,
        management_mode,
        customer_id: customer.id,
      },
      { transaction },
    );

    if (services !== undefined) {
      if (!Array.isArray(services)) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: "Services must be an array",
        });
      }

      await EventService.bulkCreate(
        services.map((service) => ({
          event_id: event.id,
          service_name: service,
        })),
        { transaction },
      );
    }

    await transaction.commit();

    return res.status(201).json({
      data: event,
      success: true,
      event_id: event.id,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Create Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =======================
   GET MY EVENTS
======================= */
export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const customer = await CustomerProfile.findOne({
      where: { userId },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    const events = await Event.findAll({
      where: { customer_id: customer.id },

      include: [
        {
          model: EventService,
          as: "services",
          attributes: ["id", "service_name"],
        },
        {
          model: Bid,
          as: "bids",
          attributes: [],
        },
      ],

      attributes: {
        include: [
          [Sequelize.fn("COUNT", Sequelize.col("bids.id")), "bidCount"],
        ],
      },

      group: ["Event.id", "services.id"],
      order: [["createdAt", "DESC"]],
    });

    // 🔥 FORMAT DATA
    const formattedEvents = events.map((e) => {
      const data = e.toJSON();

      const bidCount = parseInt(data.bidCount || 0);

      // 🔥 dynamic status
      let status = "planning";
      if (bidCount > 0) status = "in-progress";
      if (data.vendorId) status = "vendors-finalized";

      // 🔥 dynamic progress
      let progress = 20;
      if (data.services?.length > 0) progress += 20;
      if (bidCount > 0) progress += 20;
      if (bidCount >= 3) progress += 20;
      if (data.vendorId) progress += 20;

      return {
        ...data,
        bidCount,
        status,
        progress,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedEvents.length,
      data: formattedEvents,
    });
  } catch (error) {
    console.error("Get Events Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =======================
   GET EVENT BY ID
======================= */

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: EventService,
          as: "services",
        },
        {
          model: Bid,
          as: "bids",
          include: [
            {
              model: User,
              as: "vendor",
              attributes: ["id", "name", "email"],
            },
          ],
        },
        {
          model: Guest,
          as: "guests",
        },
        {
          model: Payment,
          as: "payments",
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ success: false });
    }

    const data = event.toJSON();

    const acceptedBids = data.bids.filter((b) => b.status === "accepted");

    const bidCount = data.bids.length;

    const spent = acceptedBids.reduce((sum, b) => sum + (b.price || 0), 0);

    // 🔥 STATUS
    let status = "planning";
    if (bidCount > 0) status = "in-progress";
    if (acceptedBids.length > 0) status = "vendors-finalized";

    // 🔥 PROGRESS
    let progress = 20;
    if (data.services?.length > 0) progress += 20;
    if (bidCount > 0) progress += 20;
    if (bidCount >= 3) progress += 20;
    if (data.vendorId) progress += 20;

    return res.json({
      success: true,
      data: {
        ...data,
        bidCount,
        spent,
        status,
        progress,

        vendors: acceptedBids.map((b) => ({
          id: b.id,
          name: b.vendor?.name || "Vendor",
          service: b.package_name,
          status: "finalized",
          price: b.price,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

// Vendor के लिए - GET EVENTS IN THEIR CATEGORY

export const getVendorEvents = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: EventService,
          as: "services",
          attributes: ["id", "service_name"],
        },
      ],
    });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Vendor Events Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =======================
   GET EVENT DETAIL FOR VENDOR
======================= */

export const getVendorEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id, {
      include: [
        {
          model: EventService,
          as: "services",
          attributes: ["id", "service_name"],
        },
        {
          model: CustomerProfile,
          attributes: ["id", "firstName", "lastName", "phone"],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Vendor Event Detail Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
