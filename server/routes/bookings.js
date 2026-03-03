const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

// POST /api/bookings — customer creates a booking
router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, table, date, timeSlot, guests } = req.body;

    // Check if slot is already booked
    const existing = await Booking.findOne({
      table,
      date,
      timeSlot,
      status: "confirmed",
    });
    if (existing) {
      return res.status(400).json({ error: "This time slot is already booked" });
    }

    const booking = new Booking({
      customerName,
      customerPhone,
      table,
      date,
      timeSlot,
      guests,
    });
    const saved = await booking.save();
    await saved.populate("table");
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/bookings — owner views all bookings (protected)
router.get("/", auth, async (req, res) => {
  try {
    const { date, status } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate("table")
      .sort({ date: -1, createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/bookings/:id/cancel — cancel a booking (owner)
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    ).populate("table");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
