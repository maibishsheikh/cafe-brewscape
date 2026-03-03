import { useEffect, useState } from "react";
import API from "../api";
import "./Menu.css";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "coffee", label: "Coffee" },
  { key: "tea", label: "Tea" },
  { key: "smoothie", label: "Smoothies" },
  { key: "pastry", label: "Pastries" },
  { key: "sandwich", label: "Sandwiches" },
  { key: "dessert", label: "Desserts" },
  { key: "snack", label: "Snacks" },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const params = activeCategory !== "all" ? { category: activeCategory } : {};
        const { data } = await API.get("/menu", { params });
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [activeCategory]);

  return (
    <div className="menu-page">
      <div className="page-header">
        <h1>Our Menu</h1>
        <p>Handcrafted drinks & bites made with love</p>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`tab ${activeCategory === cat.key ? "active" : ""}`}
            onClick={() => { setActiveCategory(cat.key); setLoading(true); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="loading-text">Loading menu...</p>
      ) : (
        <div className="menu-grid">
          {items.map((item) => (
            <div key={item._id} className="menu-card">
              <span className="menu-card-emoji">{item.image || "🍽️"}</span>
              <div className="menu-card-info">
                <h3>{item.name}</h3>
                <p className="menu-desc">{item.description}</p>
                <span className="menu-price">₹{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
