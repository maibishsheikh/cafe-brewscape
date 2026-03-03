const express = require("express");
const router = express.Router();
const Table = require("../models/Table");
const Booking = require("../models/Booking");

// GET /api/tables — list all tables
router.get("/", async (req, res) => {
  try {
    const tables = await Table.find().sort({ number: 1 });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tables/availability?date=YYYY-MM-DD
router.get("/availability", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const tables = await Table.find().sort({ number: 1 });
    const bookings = await Booking.find({ date, status: "confirmed" });

    const timeSlots = [
      "10:00 - 11:00",
      "11:00 - 12:00",
      "12:00 - 13:00",
      "13:00 - 14:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
      "17:00 - 18:00",
      "18:00 - 19:00",
      "19:00 - 20:00",
      "20:00 - 21:00",
    ];

    const availability = tables.map((table) => {
      const tableBookings = bookings.filter(
        (b) => b.table.toString() === table._id.toString()
      );
      const slots = timeSlots.map((slot) => ({
        time: slot,
        available: !tableBookings.some((b) => b.timeSlot === slot),
      }));
      return {
        _id: table._id,
        number: table.number,
        capacity: table.capacity,
        slots,
      };
    });

    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
