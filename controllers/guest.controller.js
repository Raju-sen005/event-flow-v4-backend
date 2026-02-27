import Guest from "../models/guest.js";

// ➕ ADD GUEST
export const addGuest = async (req, res) => {
  try {
    const { event_id, name, email, phone, category } = req.body;

    if (!event_id || !name || !email || !phone || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const guest = await Guest.create({
      event_id,
      name,
      email,
      phone,
      category,
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

// 📋 GET GUESTS BY EVENT
export const getGuestsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const guests = await Guest.findAll({
      where: { event_id: eventId },
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
