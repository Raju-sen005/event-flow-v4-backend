import { Event, EventService, CustomerProfile } from "../models/index.js";

export const createEvent = async (req, res) => {
  try {
    const {
      name,
      date,
      startTime,
      endTime,
      location,
      budget,
      notes,
      category_id,
      management_mode,
      services
    } = req.body;

    // ✅ userId from auth middleware
    const userId = 9;

    // ✅ find customer profile
    const customer = await CustomerProfile.findOne({
      where: { userId }
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Customer profile not found"
      });
    }

    const event = await Event.create({
      name,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      budget,
      notes,
      category_id,
      management_mode,
      customer_id: customer.id   // 🔥 FIX
    });

    if (Array.isArray(services)) {
      await EventService.bulkCreate(
        services.map(service => ({
          event_id: event.id,
          service_name: service
        }))
      );
    }

    return res.status(201).json({
      success: true,
      event_id: event.id
    });

  } catch (error) {
    console.error("Create Event Error:", error);
    return res.status(500).json({ success: false });
  }
};


export const getMyEvents = async (req, res) => {
  try {
    // 🔐 auth middleware se aayega
    const userId = 9; // abhi hardcoded (later JWT)

    // find customer
    const customer = await CustomerProfile.findOne({
      where: { userId }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found"
      });
    }

    const events = await Event.findAll({
      where: { customer_id: customer.id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: EventService,
          as: "services",
          attributes: ["id", "service_name"]
        }
      ]
    });

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });

  } catch (error) {
    console.error("Get Events Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = 9; // auth se aayega

    const customer = await CustomerProfile.findOne({
      where: { userId }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found"
      });
    }

    const event = await Event.findOne({
      where: {
        id,
        customer_id: customer.id
      },
      include: [
        {
          model: EventService,
          as: "services",
          attributes: ["id", "service_name"]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: event
    });

  } catch (error) {
    console.error("Get Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};