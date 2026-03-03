const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tables", require("./routes/tables"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/menu", require("./routes/menu"));
app.use("/api/orders", require("./routes/orders"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Cafe API is running" });
});

// One-time seed endpoint (remove after seeding)
app.get("/api/seed", async (req, res) => {
  try {
    const Owner = require("./models/Owner");
    const Table = require("./models/Table");
    const MenuItem = require("./models/MenuItem");

    await Owner.deleteMany({});
    await Table.deleteMany({});
    await MenuItem.deleteMany({});

    await Owner.create({ username: "admin", password: "admin123" });

    const tables = [
      { number: 1, capacity: 2 }, { number: 2, capacity: 2 },
      { number: 3, capacity: 4 }, { number: 4, capacity: 4 },
      { number: 5, capacity: 6 }, { number: 6, capacity: 6 },
      { number: 7, capacity: 8 }, { number: 8, capacity: 8 },
    ];
    await Table.insertMany(tables);

    const menuItems = [
      { name: "Espresso", description: "Rich and bold single shot", price: 120, category: "coffee", image: "☕" },
      { name: "Cappuccino", description: "Espresso with steamed milk foam", price: 180, category: "coffee", image: "☕" },
      { name: "Latte", description: "Smooth espresso with creamy milk", price: 200, category: "coffee", image: "☕" },
      { name: "Cold Brew", description: "Slow-steeped, smooth & refreshing", price: 220, category: "coffee", image: "🧊" },
      { name: "Mocha", description: "Chocolate meets espresso perfection", price: 240, category: "coffee", image: "☕" },
      { name: "Matcha Latte", description: "Japanese green tea with oat milk", price: 250, category: "tea", image: "🍵" },
      { name: "Chai Latte", description: "Spiced Indian tea with steamed milk", price: 180, category: "tea", image: "🍵" },
      { name: "Iced Peach Tea", description: "Refreshing peach-infused iced tea", price: 160, category: "tea", image: "🍑" },
      { name: "Berry Blast Smoothie", description: "Mixed berries, banana & yogurt", price: 280, category: "smoothie", image: "🫐" },
      { name: "Mango Tango Smoothie", description: "Fresh mango with coconut milk", price: 260, category: "smoothie", image: "🥭" },
      { name: "Croissant", description: "Buttery, flaky French pastry", price: 150, category: "pastry", image: "🥐" },
      { name: "Blueberry Muffin", description: "Soft muffin loaded with blueberries", price: 140, category: "pastry", image: "🧁" },
      { name: "Cinnamon Roll", description: "Warm, gooey cinnamon swirl", price: 170, category: "pastry", image: "🍥" },
      { name: "Grilled Panini", description: "Cheese, pesto & sun-dried tomato", price: 320, category: "sandwich", image: "🥪" },
      { name: "Club Sandwich", description: "Triple-decker classic with fries", price: 350, category: "sandwich", image: "🥪" },
      { name: "Avocado Toast", description: "Sourdough, smashed avo & poached egg", price: 280, category: "sandwich", image: "🥑" },
      { name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 300, category: "dessert", image: "🍰" },
      { name: "Chocolate Brownie", description: "Warm, fudgy with vanilla ice cream", price: 220, category: "dessert", image: "🍫" },
      { name: "Cheesecake Slice", description: "New York style baked cheesecake", price: 280, category: "dessert", image: "🍰" },
      { name: "Nachos", description: "Loaded nachos with cheese & salsa", price: 250, category: "snack", image: "🧀" },
      { name: "Garlic Bread", description: "Crispy garlic butter bread", price: 150, category: "snack", image: "🍞" },
      { name: "Fries Basket", description: "Crispy golden fries with dip", price: 180, category: "snack", image: "🍟" },
    ];
    await MenuItem.insertMany(menuItems);

    res.json({ message: "Database seeded successfully!", owner: "admin/admin123", tables: tables.length, menuItems: menuItems.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
