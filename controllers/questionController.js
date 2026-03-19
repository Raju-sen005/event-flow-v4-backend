// controllers/questionController.js

import Question from "../models/question.js";

export const askQuestion = async (req, res) => {
  try {
    const { requirementId, subject, question } = req.body;

    const vendorId = req.user.id;

    if (!subject || !question) {
      return res.status(400).json({
        success: false,
        message: "Subject and question required"
      });
    }

    const data = await Question.create({
      event_id: requirementId,
      vendor_id: vendorId,
      subject,
      question
    });

    res.json({
      success: true,
      message: "Question sent successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};