import Invitation from "../models/invitation.model.js";


// ✅ GET all invitations
export const getInvitations = async (req, res) => {
  try {
    const data = await Invitation.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ DELETE invitation
export const deleteInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Invitation.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ SEND invitation
export const sendInvitation = async (req, res) => {
  try {
    const { id } = req.params;

    const invitation = await Invitation.findByPk(id);

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    await invitation.update({
      status: "sent",
      sentTo: invitation.sentTo + 1,
    });

    res.json({ success: true, data: invitation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};