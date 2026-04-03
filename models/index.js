import User from "./User.js";
import CustomerProfile from "./customerProfile.js";
import VendorProfile from "./VendorProfile.js";
import Event from "./event.js";
import EventService from "./eventService.js";
import Guest from "./guest.js";
import Bid from "./bid.js";
import Package from "./Package.js";
import Portfolio from "./Portfolio.js";
import Vendor from "./Vendor.js";
import VendorKYC from "./VendorKYC.js";
import Negotiation from "./Negotiation.js";
import NegotiationOffer from "./NegotiationOffer.js";
import Payment from "./payment.model.js";
import Ticket from "./Ticket.js";
import TicketMessage from "./TicketMessage.js";
import VendorAvailability from "./VendorAvailability.js";
import VendorSettings from "./VendorSettings.js";
import PortfolioMedia from "./PortfolioMedia.js";
import PoolEvent from "./PoolEvents.js";
import PoolEventTicket from "./PoolEventTicket.js";
import PoolBookedTicket from "./PoolBookedTicket.js";

/* =======================
   USER ↔ PROFILES
======================= */

User.hasOne(CustomerProfile, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

CustomerProfile.belongsTo(User, {
  foreignKey: "userId",
});

User.hasOne(VendorProfile, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

VendorProfile.belongsTo(User, {
  foreignKey: "userId",
});

/* =======================
   CUSTOMER → EVENTS
======================= */

CustomerProfile.hasMany(Event, {
  foreignKey: "customer_id",
  onDelete: "CASCADE",
});

Event.belongsTo(CustomerProfile, {
  foreignKey: "customer_id",
});

/* =======================
   EVENT → SERVICES
======================= */

Event.hasMany(EventService, {
  foreignKey: "event_id",
  as: "services",
  onDelete: "CASCADE",
});

EventService.belongsTo(Event, {
  foreignKey: "event_id",
});

/* =======================
   EVENT → GUESTS
======================= */

Event.hasMany(Guest, {
  foreignKey: "event_id",
  as: "guests",
  onDelete: "CASCADE",
});

Guest.belongsTo(Event, {
  foreignKey: "event_id",
});

/* =======================
   BIDS
======================= */

User.hasMany(Bid, { foreignKey: "vendor_id" });

Bid.belongsTo(User, {
  foreignKey: "vendor_id",
  as: "vendor",
});

Event.hasMany(Bid, {
  foreignKey: "event_id",
  as: "bids",
  onDelete: "CASCADE",
});

Bid.belongsTo(Event, {
  foreignKey: "event_id",
});

/* =======================
   PACKAGES
======================= */

VendorProfile.hasMany(Package, {
  foreignKey: "vendor_id",
  as: "packages",
});

Package.belongsTo(VendorProfile, {
  foreignKey: "vendor_id",
  as: "vendor",
});

/* =======================
   PORTFOLIO
======================= */

VendorProfile.hasMany(Portfolio, {
  foreignKey: "userId",
  sourceKey: "userId",
  as: "portfolios",
});

Portfolio.belongsTo(VendorProfile, {
  foreignKey: "userId",
  targetKey: "userId",
  as: "vendorProfile",
});

/* =======================
   PORTFOLIO MEDIA
======================= */

Portfolio.hasMany(PortfolioMedia, {
  foreignKey: "portfolioId",
  as: "media",
  onDelete: "CASCADE",
});

PortfolioMedia.belongsTo(Portfolio, {
  foreignKey: "portfolioId",
  as: "portfolio",
});
/* =======================
   VENDOR
======================= */

User.hasOne(Vendor, {
  foreignKey: "userId",
});

Vendor.belongsTo(User, {
  foreignKey: "userId",
});

Vendor.hasOne(VendorKYC, {
  foreignKey: "vendorId",
});

VendorKYC.belongsTo(Vendor, {
  foreignKey: "vendorId",
});

/* =======================
   NEGOTIATION
======================= */

Bid.hasOne(Negotiation, {
  foreignKey: "bid_id",
});

Negotiation.belongsTo(Bid, {
  foreignKey: "bid_id",
});

Negotiation.hasMany(NegotiationOffer, {
  foreignKey: "negotiation_id",
  as: "offers",
});

NegotiationOffer.belongsTo(Negotiation, {
  foreignKey: "negotiation_id",
});

/* =======================
   PAYMENTS
======================= */

Event.hasMany(Payment, {
  foreignKey: "eventId",
  as: "payments",
});

Payment.belongsTo(Event, {
  foreignKey: "eventId",
});

Vendor.hasMany(Payment, {
  foreignKey: "vendorId",
  as: "payments",
});

Payment.belongsTo(Vendor, {
  foreignKey: "vendorId",
});

CustomerProfile.hasMany(Payment, {
  foreignKey: "customerId",
  as: "payments",
});

Payment.belongsTo(CustomerProfile, {
  foreignKey: "customerId",
});

/* =======================
   SUPPORT TICKETS
======================= */

Vendor.hasMany(Ticket, {
  foreignKey: "vendorId",
  as: "tickets",
});

Ticket.belongsTo(Vendor, {
  foreignKey: "vendorId",
});

Ticket.hasMany(TicketMessage, {
  foreignKey: "ticketId",
  as: "messages",
  onDelete: "CASCADE",
});

TicketMessage.belongsTo(Ticket, {
  foreignKey: "ticketId",
});

PoolEvent.hasMany(PoolEventTicket, {
  foreignKey: "event_id",
});

PoolEventTicket.belongsTo(PoolEvent, {
  foreignKey: "event_id",
});

PoolBookedTicket.belongsTo(PoolEvent, {
  foreignKey: "event_id",
  as: "event",
});

PoolEvent.hasMany(PoolBookedTicket, {
  foreignKey: "event_id",
  as: "tickets",
});
/* =======================
   EXPORTS
======================= */

export {
  User,
  CustomerProfile,
  VendorProfile,
  Event,
  EventService,
  Guest,
  Bid,
  Package,
  Portfolio,
  Vendor,
  VendorKYC,
  Negotiation,
  NegotiationOffer,
  Payment,
  Ticket,
  TicketMessage,
  VendorAvailability,
  VendorSettings,
  PortfolioMedia,
  PoolEvent,
  PoolEventTicket
};
