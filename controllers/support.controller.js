import { Vendor, Ticket, TicketMessage } from "../models/index.js";

/*
|--------------------------------------------------------------------------
| CREATE TICKET
|--------------------------------------------------------------------------
*/
export const createTicket = async (req, res) => {
  try {
    const {
      vendorId,
      category,
      subject,
      description,
      priority,
      relatedType,
      relatedId,
      relatedReference
    } = req.body;

    if (!vendorId || !subject || !description) {
      return res.status(400).json({
        message: "Required fields missing"
      });
    }

    const vendor = await Vendor.findOne({
      where: { userId: vendorId }
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor profile not found"
      });
    }

    const ticket = await Ticket.create({
      vendorId: vendor.id,
      category,
      subject,
      description,
      priority,
      relatedType,
      relatedId,
      relatedReference,
      ticketNumber: "TKT-" + Date.now()
    });

    await TicketMessage.create({
      ticketId: ticket.id,
      senderId: vendor.userId,
      senderName: vendor.name,
      senderRole: "vendor",
      message: description
    });

    return res.json({
      success: true,
      data: ticket
    });

  } catch (err) {
    console.error("Create Ticket Error:", err);

    res.status(500).json({
      message: "Failed to create ticket",
      error: err.message
    });
  }
};



/*
|--------------------------------------------------------------------------
| GET ALL VENDOR TICKETS
|--------------------------------------------------------------------------
*/
export const getVendorTickets = async (req, res) => {
  try {

    const userId = req.params.vendorId;

    const vendor = await Vendor.findOne({
      where: { userId }
    });

    if (!vendor) {
      return res.json([]);
    }

    const tickets = await Ticket.findAll({
      where: {
        vendorId: vendor.id
      },

      include: [
        {
          model: TicketMessage,
          as: "messages",
          order: [["createdAt", "ASC"]]
        }
      ],

      order: [["createdAt", "DESC"]]
    });

    return res.json(tickets);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};



/*
|--------------------------------------------------------------------------
| GET SINGLE TICKET DETAIL
|--------------------------------------------------------------------------
*/
export const getTicketDetail = async (req, res) => {
  try {

    const ticket = await Ticket.findByPk(req.params.ticketId, {
      include: [
        {
          model: TicketMessage,
          as: "messages"
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }

    return res.json(ticket);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};



/*
|--------------------------------------------------------------------------
| REPLY TO TICKET
|--------------------------------------------------------------------------
*/
export const replyTicket = async (req, res) => {
  try {

    const { senderId, senderRole, message } = req.body;

    if (!senderId || !message) {
      return res.status(400).json({
        message: "senderId and message required"
      });
    }

    let senderName = "User";

    if (senderRole === "vendor") {

      const vendor = await Vendor.findOne({
        where: { userId: senderId }
      });

      senderName = vendor?.name || "Vendor";
    }

    const reply = await TicketMessage.create({
      ticketId: req.params.ticketId,
      senderId,
      senderName,
      senderRole,
      message
    });

    await Ticket.update(
      { updatedAt: new Date() },
      { where: { id: req.params.ticketId } }
    );

    return res.json({
      success: true,
      data: reply
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};