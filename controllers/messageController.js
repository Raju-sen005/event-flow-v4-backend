import Message from "../models/message.js";
import Bid from "../models/bid.js";
import Event from "../models/event.js";
import CustomerProfile from "../models/customerProfile.js";
import User from "../models/User.js";

/* ===============================
   SEND MESSAGE
================================ */

export const sendMessage = async (req, res) => {
  try {

    const { bidId, message } = req.body;
    const senderId = req.user.id;

    const bid = await Bid.findByPk(bidId, {
      include: [
        {
          model: Event,
          attributes: ["customer_id"]
        }
      ]
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: "Bid not found",
      });
    }

    const receiverId = bid.Event.customer_id;

    const msg = await Message.create({
      bid_id: bidId,
      sender_id: senderId,
      receiver_id: receiverId,
      message,
    });

    res.json({
      success: true,
      data: msg,
    });

  } catch (error) {

    console.log("SEND MESSAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });

  }
};


/* ===============================
   GET MESSAGES OF BID
================================ */

export const getMessagesByBid = async (req, res) => {
  try {

    const { bidId } = req.params;

    const messages = await Message.findAll({
      where: {
        bid_id: bidId,
      },
      order: [["createdAt", "ASC"]],
    });

    res.json({
      success: true,
      data: messages,
    });

  } catch (error) {

    console.log("FETCH MESSAGE ERROR", error);

    res.status(500).json({
      success: false,
    });

  }
};


/* ===============================
   GET VENDOR CHAT LIST
================================ */

export const getVendorChats = async (req, res) => {
  try {

    const vendorId = req.user.id;

    const bids = await Bid.findAll({
      where: {
        vendor_id: vendorId,
      },
      include: [
        {
          model: Event,
          attributes: ["id", "name"],
          include: [
            {
              model: CustomerProfile,
              attributes: ["firstName"],
              include: [
                {
                  model: User,
                  attributes: ["email"],
                },
              ],
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

    console.log("FETCH CHATS ERROR", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });

  }
};