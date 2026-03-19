import { VendorAvailability, VendorSettings, Event } from "../models/index.js";

/*
----------------------------------------
GET CALENDAR DATA
----------------------------------------
*/
export const getVendorAvailability = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    const blockedDates = await VendorAvailability.findAll({
      where: { vendorId },
    });

    // ⭐ अभी testing के लिए सभी events fetch कर रहे हैं
    const events = await Event.findAll();

    // ⭐ frontend format
    const bookedEvents = events.map((e) => ({
      date: e.date,
      eventName: e.name,
    }));

    const settings = await VendorSettings.findOne({
      where: { vendorId },
    });

    res.json({
      blockedDates,
      bookedEvents,
      settings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

/*
----------------------------------------
BLOCK DATE
----------------------------------------
*/
export const blockDate = async (req, res) => {
  try {
    const { vendorId, date } = req.body;

    const block = await VendorAvailability.create({
      vendorId,
      blockedDate: date,
    });

    res.json(block);
  } catch (err) {
    res.status(500).json(err);
  }
};

/*
----------------------------------------
UNBLOCK DATE
----------------------------------------
*/
export const unblockDate = async (req, res) => {
  try {
    const { vendorId, date } = req.body;

    await VendorAvailability.destroy({
      where: {
        vendorId,
        blockedDate: date,
      },
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

/*
----------------------------------------
SAVE SETTINGS
----------------------------------------
*/
export const saveVendorSettings = async (req, res) => {
  try {
    const { vendorId, serviceRadius, workingHours } = req.body;

    let settings = await VendorSettings.findOne({
      where: { vendorId },
    });

    if (settings) {
      await settings.update({
        serviceRadius,
        workingHours,
      });
    } else {
      settings = await VendorSettings.create({
        vendorId,
        serviceRadius,
        workingHours,
      });
    }

    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
