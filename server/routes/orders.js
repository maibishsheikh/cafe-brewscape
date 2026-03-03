const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth");

// POST /api/orders — customer places an order
router.post("/", async (req, res) => {
  try {
    const { customerName, customerPhone, items, notes } = req.body;
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = new Order({
      customerName,
      customerPhone,
      items,
      totalAmount,
      notes,
    });
    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/orders — owner views all orders (protected)
router.get("/", auth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/orders/:id/status — owner updates order status (protected)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
