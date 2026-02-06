import User from "./User.js";
import CustomerProfile from "./customerProfile.js";
import VendorProfile from "./VendorProfile.js";
import Event from "./event.js";
import EventService from "./eventService.js";

/* =======================
   ASSOCIATIONS
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
   🔥 NAMED EXPORTS (THIS FIXES ERROR)
======================= */

export {
  User,
  CustomerProfile,
  VendorProfile,
  Event,
  EventService
};
