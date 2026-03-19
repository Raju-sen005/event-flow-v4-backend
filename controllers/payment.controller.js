import Payment from "../models/payment.model.js";
// import PaymentSlab from "../models/paymentSlab.model.js";
import Event from "../models/event.js";

/* =============================
   GET VENDOR PAYMENTS
============================= */

export const getVendorPayments = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const vendorId = req.user.id;

    const payments = await Payment.findAll({
      where: { vendorId },
      include: [
        {
          model: Event,
          attributes: ["id", "name", "date"]
        }
      ],
      order: [["slabNumber", "ASC"]]
    });

    const grouped = {};

    payments.forEach(payment => {

      const eventId = payment.eventId;

      if (!grouped[eventId]) {
        grouped[eventId] = {
          id: eventId,
          eventId: eventId,
          eventName: payment.Event?.name || "Event",
          customerName: "Customer",
          totalAmount: 0,
          slabs: []
        };
      }

      grouped[eventId].slabs.push(payment);
      grouped[eventId].totalAmount += payment.amount;

    });

    res.json({
      success: true,
      data: Object.values(grouped)
    });

  } catch (error) {

    console.error("Vendor Payments Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching payments"
    });

  }
};





/* =============================
   CONFIRM CASH PAYMENT
============================= */

export const confirmCashPayment = async (req, res) => {

  try {

    const { id } = req.params;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.status = "cash_awaiting_admin";

    await payment.save();

    res.json({
      success: true,
      message: "Cash confirmed successfully"
    });

  } catch (error) {

    console.error("Confirm Cash Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};





/* =============================
   WITHDRAW REQUEST
============================= */

export const requestWithdraw = async (req, res) => {

  try {

    const vendorId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid withdraw amount"
      });
    }

    // optional: check available balance
    const payments = await Payment.findAll({
      where: {
        vendorId,
        status: "completed"
      }
    });

    const totalBalance = payments.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    if (amount > totalBalance) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance"
      });
    }

    console.log(`Vendor ${vendorId} requested withdraw: ₹${amount}`);

    res.json({
      success: true,
      message: "Withdraw request submitted"
    });

  } catch (error) {

    console.error("Withdraw Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};