import { VendorSettings, User } from "../models/index.js";
import bcrypt from "bcrypt";

/*
--------------------------------
GET SETTINGS
--------------------------------
*/

export const getVendorSettings = async (req, res) => {
  try {

    const vendorId = req.params.vendorId;

    const [settings] = await VendorSettings.findOrCreate({
      where: { vendorId },
      defaults: { vendorId }
    });

    res.json(settings);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message:"Failed to load settings" });

  }
};

/*
--------------------------------
SAVE NOTIFICATION SETTINGS
--------------------------------
*/

export const saveNotificationSettings = async (req, res) => {
  try {

    const { vendorId, data } = req.body;

    const [settings] = await VendorSettings.findOrCreate({
      where: { vendorId },
      defaults: { vendorId }
    });

    await settings.update(data);

    res.json(settings);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message:"Failed to save settings" });

  }
};

/*
--------------------------------
UPDATE PASSWORD
--------------------------------
*/

export const updatePassword = async (req, res) => {

  try {

    const { userId, currentPassword, newPassword } = req.body;

    const user = await User.findByPk(userId);

    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }

    const match = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Current password incorrect"
      });
    }

    if(newPassword.length < 6){
      return res.status(400).json({
        message:"Password must be at least 6 characters"
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashed
    });

    res.json({
      message: "Password updated successfully"
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ message:"Password update failed" });

  }
};

/*
--------------------------------
SAVE PREFERENCES
--------------------------------
*/

export const savePreferences = async (req, res) => {

  try {

    const { vendorId, language, timezone } = req.body;

    const [settings] = await VendorSettings.findOrCreate({
      where:{vendorId},
      defaults:{vendorId}
    });

    await settings.update({
      language,
      timezone
    });

    res.json(settings);

  } catch (err) {

    console.error(err);
    res.status(500).json({ message:"Failed to save preferences" });

  }

};