import User from "../models/User.js";
import VendorProfile from "../models/VendorProfile.js";
import PoolEvent from "../models/PoolEvents.js";
import PoolEventTicket from "../models/PoolEventTicket.js";
import PoolBookedTicket from "../models/PoolBookedTicket.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import Vendor from "../models/Vendor.js";
import Admin from "../models/admin/admin.js";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const test = (req, res) => {
  try {
    res.json({
      success: true,
      message: "Api working",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
    });
  }
};

export const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    let profileImage = null;
    let profile = null;
    
    if (user.role === "vendor") {
       profile = await VendorProfile.findOne({
        where: { userId: user.id },
      });

      profileImage = profile?.profileImage || null;
    }

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        profileImage, // 🔥 ADD THIS
        phone: profile?.phone ?? null
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = generateToken(admin);
    res.json({
        message: "Login successful",
        token,
        user: {
          id: admin.id,
          name: admin.name,
          role: 'admin',
          email: admin.email
        },
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      meetupPoint,
      date,
      time,
      duration,
      totalCapacity,
      tickets,
      status,
    } = req.body;

    const user_id = req.user?.id || 1;
    // res.json({user:user_id});

    // 1️⃣ create event
    const event = await PoolEvent.create({
      user_id,
      title,
      category,
      description,
      location,
      meetup_point: meetupPoint,
      event_date: date,
      event_time: time,
      duration,
      total_capacity: totalCapacity,
      status: status || "draft",
    });

    // 2️⃣ create tickets
    const ticketData = tickets.map((t) => ({
      event_id: event.id,
      type: t.type,
      price: t.price,
      capacity: t.capacity,
    }));

    await PoolEventTicket.bulkCreate(ticketData);

    res.json({
      success: true,
      message: "Event created 🔥",
      event,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const user_id = req.user.id;
    let events;
    if (!user_id) {
         // public events
         events = await PoolEvent.findAll({
         where: { status: "published" },
         order: [["createdAt", "DESC"]],
         });
    } else {
    // vendor events
    events = await PoolEvent.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
    });
    }

    res.json({
      success: true,
      events,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await PoolEvent.update({ status }, { where: { id } });

    res.json({
      success: true,
      message: "Status updated",
    });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};

export const getEventsByType = async (req, res) => {
  try {
    const { type } = req.params;

    let filter = {
      status: "published",
    };

    // 🔥 dynamic logic
    if (type === "featured") {
      filter.featured = true;
    }

    if (type === "trending") {
      filter.trending = true;
    }

    if (type === "popular") {
      filter.popular = true;
    }

    const events = await PoolEvent.findAll({
      where: filter,
      order: [["createdAt", "DESC"]],
      limit: 8,
    });

    res.json({
      success: true,
      events,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: err.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await PoolEvent.findAll({
      where: { status: "published" },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      events,
    });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await PoolEvent.findOne({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error 💀",
      error: err.message,
    });
  }
};

const razorpay = new Razorpay({
  key_id: "rzp_test_SW5IIFpPOuMm4k",
  key_secret: "5pSa6UAG1XhfTDGENqsr3EQj",
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Order creation failed", err });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      totalAmount,
      tickets,
      date,
      userDetails,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", "5pSa6UAG1XhfTDGENqsr3EQj")
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature ❌" });
    }

    const bookingId = "LB" + Date.now().toString().slice(-6);
    // 🔥 save booking here
    await PoolBookedTicket.create({
      event_id: eventId,
      booking_id: bookingId,

      name: userDetails?.name,
      email: userDetails?.email,
      phone: userDetails?.phone,

      event_date: date,

      adult_count: tickets?.adult || 0,
      child_count: tickets?.child || 0,
      senior_count: tickets?.senior || 0,

      total_tickets:
        (tickets?.adult || 0) + (tickets?.child || 0) + (tickets?.senior || 0),

      total_amount: totalAmount,

      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,

      payment_method: "razorpay",
      payment_status: "paid",
    });

    res.json({ success: true, booking_id: bookingId });
  } catch (err) {
    //     console.log(err);
    res.status(500).json({ message: "Verification failed", err });
  }
};

export const getBookings = async (req, res) => {
  try {
    const user_id = req.user?.id;
    let bookings;

    bookings = await PoolBookedTicket.findAll({
      include: [
        {
          model: PoolEvent,
          as: "event",
          where: { user_id },
          attributes: [
            "id",
            "title",
            "location",
            "event_date",
            "event_time",
            "duration",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
};

export const eventInventory = async (req,res) => {
  try {
    const user_id = req.user?.id;

    const events = await PoolEvent.findAll({
      include: [
        {
          model: PoolEventTicket,
        },
        {
          model: PoolBookedTicket,
          as: "tickets",
        },
      ],
      where: { status: "published",user_id : user_id },
      order: [["createdAt", "DESC"]],
    });

    const formatted = events.map((event) => {
      // 🔥 1. capacity extract
      let adultTotal = 0;
      let childTotal = 0;
      let seniorTotal = 0;

      event.PoolEventTickets.forEach((t) => {
        if (t.type === "Adult") adultTotal = t.capacity;
        if (t.type === "Child") childTotal = t.capacity;
        if (t.type === "Senior") seniorTotal = t.capacity;
      });

      // 🔥 2. booked count
      let adultBooked = 0;
      let childBooked = 0;
      let seniorBooked = 0;

      event.tickets.forEach((b) => {
        adultBooked += b.adult_count || 0;
        childBooked += b.child_count || 0;
        seniorBooked += b.senior_count || 0;
      });

      // 🔥 3. available
      const adultAvailable = adultTotal - adultBooked;
      const childAvailable = childTotal - childBooked;
      const seniorAvailable = seniorTotal - seniorBooked;

      return {
        event: event.title,

        adult: {
          available: adultAvailable > 0 ? adultAvailable : 0,
          total: adultTotal,
        },

        child: {
          available: childAvailable > 0 ? childAvailable : 0,
          total: childTotal,
        },

        senior: {
          available: seniorAvailable > 0 ? seniorAvailable : 0,
          total: seniorTotal,
        },

        status:
          adultAvailable > 0 ||
          childAvailable > 0 ||
          seniorAvailable > 0
            ? "available"
            : "out_of_stock",
      };
    });

    res.json({
      success: true,
      events: formatted,
    });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};


export const analytics = async (req, res) => {
  try {
    const user_id = req.user?.id;
    // 🔥 events with bookings + capacity
    const events = await PoolEvent.findAll({
      include: [
        { model: PoolEventTicket },
        {
          model: PoolBookedTicket,
          as: "tickets",
        },
      ],
      where: { status: "published", user_id : user_id },
    });

    // =========================
    // 🔥 EVENT WISE DATA
    // =========================
    const eventData = events.map((event) => {
      let totalCapacity = 0;

      event.PoolEventTickets.forEach((t) => {
        totalCapacity += t.capacity || 0;
      });

      let totalBooked = 0;

      event.tickets.forEach((b) => {
        totalBooked +=
          (b.adult_count || 0) +
          (b.child_count || 0) +
          (b.senior_count || 0);
      });

      const pct =
        totalCapacity > 0
          ? Math.round((totalBooked / totalCapacity) * 100)
          : 0;

      return {
        name: event.title,
        bookings: totalBooked,
        pct,
      };
    });

    // =========================
    // 🔥 MONTH WISE DATA
    // =========================
    const bookings = await PoolBookedTicket.findAll({
      attributes: ["total_amount", "createdAt"],
       include: [
        {
          model: PoolEvent,
          as: "event",
          where: { user_id },
        },
      ],
    });

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const now = new Date();

    const months = [
      new Date(now.getFullYear(), now.getMonth() - 2, 1),
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
      new Date(now.getFullYear(), now.getMonth(), 1),
    ];

    let monthly = months.map((m) => ({
      month: monthNames[m.getMonth()],
      revenue: 0,
    }));

    bookings.forEach((b) => {
      const d = new Date(b.createdAt);

      monthly.forEach((m, i) => {
        if (
          d.getMonth() === months[i].getMonth() &&
          d.getFullYear() === months[i].getFullYear()
        ) {
          m.revenue += b.total_amount || 0;
        }
      });
    });

    const maxRevenue = Math.max(...monthly.map((m) => m.revenue), 1);

    const monthlyData = monthly.map((m) => ({
      month: m.month,
      revenue: `₹${m.revenue.toLocaleString()}`,
      pct: Math.round((m.revenue / maxRevenue) * 100),
    }));

    // =========================
    // 🔥 FINAL RESPONSE
    // =========================
    res.json({
      success: true,
      events: eventData,
      monthly: monthlyData,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error",
      error: err.message,
    });
  }
};


export const register = async (req, res) => {
  try {
    const { name, email, phone, password, cnfpassword } = req.body;
    const role = "vendor";

    // Basic validation
    if (!name || !email || !password || !cnfpassword  || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Role-based validation
    if (role === "vendor" && !name) {
      return res.status(400).json({
        message: "Business name is required for vendor",
      });
    }

    if (password !== cnfpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check existing
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      businessName: name,
    });

    // Vendor setup
    if (role === "vendor") {
      await Vendor.create({
        userId: user.id,
        name: name,
        category: "general",
      });

      await VendorProfile.create({
        userId: user.id,
        businessName: user.name,
        ownerName: user.name,
        email: user.email,
        phone: phone,
      });
    }

    const token = generateToken(user);

    return res.status(201).json({
      message: "Registered successfully (v2)",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

export const updateSettings = async (req,res) => {
  try {
    const user_id = req.user?.id;

    res.status(200).json({
      message: "Profile updated successfull",
      user : user_id
    });
  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
}

export const getVendors = async (req, res) => {
  try {
    
    const vendors = await User.findAll({
      where: { role: 'vendor' },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      vendors,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
};