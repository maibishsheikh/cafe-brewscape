const express = require("express");
const jwt = require("jsonwebtoken");
const Owner = require("../models/Owner");
const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const owner = await Owner.findOne({ username });
    if (!owner) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await owner.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token, username: owner.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/verify
router.get("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, id: decoded.id });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
