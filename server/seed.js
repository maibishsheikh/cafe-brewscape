const mongoose = require("mongoose");
require("dotenv").config();

const Owner = require("./models/Owner");
const Table = require("./models/Table");
const MenuItem = require("./models/MenuItem");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear existing data
  await Owner.deleteMany({});
  await Table.deleteMany({});
  await MenuItem.deleteMany({});

  // Create owner account
  await Owner.create({ username: "admin", password: "admin123" });
  console.log("Owner created: admin / admin123");

  // Create tables
  const tables = [
    { number: 1, capacity: 2 },
    { number: 2, capacity: 2 },
    { number: 3, capacity: 4 },
    { number: 4, capacity: 4 },
    { number: 5, capacity: 6 },
    { number: 6, capacity: 6 },
    { number: 7, capacity: 8 },
    { number: 8, capacity: 8 },
  ];
  await Table.insertMany(tables);
  console.log(`${tables.length} tables created`);

  // Create menu items
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
  console.log(`${menuItems.length} menu items created`);

  console.log("\nSeed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
