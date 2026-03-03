const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");

// GET /api/menu — list all available menu items
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { available: true };
    if (category) filter.category = category;

    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
