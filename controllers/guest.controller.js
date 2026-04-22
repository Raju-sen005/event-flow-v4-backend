import Guest from "../models/guest.js";
import Event from "../models/event.js";
import { Op } from "sequelize";
import nodemailer from "nodemailer";

// ➕ ADD GUEST
export const addGuest = async (req, res) => {
  try {
    const { event_id, name, email, phone, category, status } = req.body;

    if (!event_id || !name) {
      return res.status(400).json({
        success: false,
        message: "Event ID and Name are required",
      });
    }

    // 🔍 duplicate check
    const existing = await Guest.findOne({
      where: {
        event_id,
        [Op.or]: [{ email }, { phone }],
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Guest already exists",
      });
    }

    const guest = await Guest.create({
      event_id,
      name,
      email,
      phone,
      category: category || "general",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Guest added successfully",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add guest",
      error: error.message,
    });
  }
};

// 🚀 BULK UPLOAD (OPTIMIZED)
export const uploadGuestsCSV = async (req, res) => {
  try {
    const { event_id, guests } = req.body;

    if (!event_id || !Array.isArray(guests)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format",
      });
    }

    // 🔥 CLEAN DATA
    const cleanGuests = guests
      .map((g) => ({
        event_id,
        name: g.name?.trim(),
        email: g.email?.trim() || null,
        phone: g.phone?.trim() || null,
        category: g.category?.trim() || "general",
        status: "pending",
      }))
      .filter((g) => g.name); // empty skip

    // 🔍 DUPLICATE CHECK
    const emails = cleanGuests.map((g) => g.email).filter(Boolean);
    const phones = cleanGuests.map((g) => g.phone).filter(Boolean);

    const existingGuests = await Guest.findAll({
      where: {
        event_id,
        [Op.or]: [
          emails.length ? { email: { [Op.in]: emails } } : null,
          phones.length ? { phone: { [Op.in]: phones } } : null,
        ].filter(Boolean),
      },
    });

    const existingSet = new Set([
      ...existingGuests.map((g) => g.email),
      ...existingGuests.map((g) => g.phone),
    ]);

    // ✅ REMOVE DUPLICATES
    const duplicateGuests = [];
    const newGuests = [];

    cleanGuests.forEach((g) => {
      const isDuplicate =
        (g.email && existingSet.has(g.email)) ||
        (g.phone && existingSet.has(g.phone));

      if (isDuplicate) {
        duplicateGuests.push({
          name: g.name,
          email: g.email,
        });
      } else {
        newGuests.push(g);
      }
    });

    // 🚀 SAVE
    const createdGuests = await Guest.bulkCreate(newGuests);

    res.json({
      success: true,
      added: newGuests.length,
      skipped: duplicateGuests.length,
      duplicates: duplicateGuests, // 🔥 NEW
    });
  } catch (err) {
    console.error("CSV ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const sendInvitation = async (req, res) => {
  try {
    const { guestId, type, message } = req.body;

    if (!guestId || !type || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const guest = await Guest.findByPk(guestId);

    if (!guest) {
      return res.status(404).json({
        message: "Guest not found",
      });
    }

    // ================= EMAIL =================
    if (type === "email") {
      if (guest.invited) {
        return res.status(400).json({
          success: false,
          message: "Already invited",
          guest: {
            name: guest.name,
            email: guest.email,
          },
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // ✅ NO QUOTES
          pass: process.env.EMAIL_PASS, // ✅ NO QUOTES
        },
      });
      console.log("EMAIL:", process.env.EMAIL_USER);
      console.log("PASS:", process.env.EMAIL_PASS);

      await transporter.sendMail({
        from: process.env.EMAIL_USER, // ✅ NO QUOTES
        to: guest.email,
        subject: "Invitation",
        text: message,
      });

      await guest.update({ invited: true });

      return res.json({
        success: true,
        type: "email",
      });
    }

    // ================= WHATSAPP =================
    if (type === "whatsapp") {
      let phone = guest.phone;

      // fix format
      if (!phone.startsWith("91")) {
        phone = `91${phone}`;
      }

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

      console.log("Sending to:", guest.email);
      console.log("Type:", type);
      return res.json({
        success: true,
        url,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// 📋 GET GUESTS BY EVENT
// 📋 GET GUESTS BY EVENT
export const getGuestsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const guests = await Guest.findAll({
      where: { event_id: eventId },
      include: [
        {
          model: Event,
          attributes: ["id", "name", "date"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: guests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch guests",
    });
  }
};

// ✏️ UPDATE GUEST
export const updateGuest = async (req, res) => {
  try {
    const { id } = req.params;

    const guest = await Guest.findByPk(id);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    await guest.update(req.body);

    res.json({
      success: true,
      message: "Guest updated successfully",
      data: guest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update guest",
    });
  }
};

// ❌ DELETE GUEST
export const deleteGuest = async (req, res) => {
  try {
    const { id } = req.params;

    const guest = await Guest.findByPk(id);
    if (!guest) {
      return res.status(404).json({ message: "Guest not found" });
    }

    await guest.destroy();

    res.json({
      success: true,
      message: "Guest deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete guest",
    });
  }
};
