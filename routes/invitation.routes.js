import express from "express";
import Invitation from "../models/invitation.model.js";

const router = express.Router();


// ✅ GET all invitations
router.get("/", async (req, res) => {
  try {
    const data = await Invitation.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Invitation.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ SEND invitation
router.post("/send/:id", async (req, res) => {
  try {
    const invitation = await Invitation.findByPk(req.params.id);

    if (!invitation) {
      return res.status(404).json({ message: "Not found" });
    }

    await invitation.update({
      status: "sent",
      sentTo: invitation.sentTo + 1,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;