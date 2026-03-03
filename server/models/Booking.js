const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    date: { type: String, required: true },       // YYYY-MM-DD
    timeSlot: { type: String, required: true },    // e.g. "10:00 - 11:00"
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
