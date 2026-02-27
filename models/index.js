import User from "./User.js";
import CustomerProfile from "./customerProfile.js";
import VendorProfile from "./VendorProfile.js";
import Event from "./event.js";
import EventService from "./eventService.js";
import Guest from "./guest.js";
import Bid from "./bid.js";
// import VendorProfile from "./VendorProfile.js";
import Package from "./Package.js";
import Portfolio from "./Portfolio.js";
import Vendor from "./Vendor.js";
import VendorKYC from "./VendorKYC.js";

// import User from "./User.js";
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
  Package,
  Portfolio,
  EventService
};



Event.hasMany(Guest, {
  foreignKey: "event_id",
  as: "guests",
  onDelete: "CASCADE",
});

Guest.belongsTo(Event, {
  foreignKey: "event_id",
});



User.hasMany(Bid, { foreignKey: "vendor_id" });
Bid.belongsTo(User, { foreignKey: "vendor_id", as: "vendor" });

Event.hasMany(Bid, {
  foreignKey: "event_id",
  onDelete: "CASCADE",
});

Bid.belongsTo(Event, {
  foreignKey: "event_id",
});


/**
 * VendorProfile ↔ Packages
 */
VendorProfile.hasMany(Package, {
  foreignKey: "vendor_id",
  as: "packages"
});

Package.belongsTo(VendorProfile, {
  foreignKey: "vendor_id",
  as: "vendor"
});

/**
 * VendorProfile ↔ Portfolio (via userId)
 */
VendorProfile.hasMany(Portfolio, {
  foreignKey: "userId",
  sourceKey: "userId",
  as: "portfolios"
});

Portfolio.belongsTo(VendorProfile, {
  foreignKey: "userId",
  targetKey: "userId",
  as: "vendorProfile"
});


Vendor.hasOne(VendorKYC, { foreignKey: "vendorId" });
VendorKYC.belongsTo(Vendor, { foreignKey: "vendorId" });

User.hasOne(Vendor, { foreignKey: "userId" });
Vendor.belongsTo(User, { foreignKey: "userId" });