import { useEffect, useState } from "react";
import API from "../api";
import "./Order.css";

export default function Order() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

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

  useEffect(() => {
    const fetch = async () => {
      try {
        const params = activeCategory !== "all" ? { category: activeCategory } : {};
        const { data } = await API.get("/menu", { params });
        setMenuItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [activeCategory]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem === item._id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        { menuItem: item._id, name: item.name, price: item.price, quantity: 1 },
      ];
    });
  };

  const updateQty = (menuItemId, delta) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.menuItem === menuItemId
            ? { ...c, quantity: c.quantity + delta }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const total = cart.reduce((s, c) => s + c.price * c.quantity, 0);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return setError("Add items to your cart first");
    setSubmitting(true);
    setError(null);
    try {
      await API.post("/orders", { ...form, items: cart });
      setSuccess("Order placed! We'll start preparing it right away 🎉");
      setCart([]);
      setForm({ customerName: "", customerPhone: "", notes: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="order-page">
      <div className="page-header">
        <h1>Order Food</h1>
        <p>Add items to your cart and place your order</p>
      </div>

      {success && (
        <div className="alert alert-success">
          {success}
          <button onClick={() => setSuccess(null)} className="alert-close">×</button>
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      <div className="order-layout">
        <div className="order-menu-section">
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
            <p className="loading-text">Loading...</p>
          ) : (
            <div className="order-items-grid">
              {menuItems.map((item) => {
                const inCart = cart.find((c) => c.menuItem === item._id);
                return (
                  <div key={item._id} className="order-item-card">
                    <span className="item-emoji">{item.image || "🍽️"}</span>
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <span className="item-price">₹{item.price}</span>
                    </div>
                    {inCart ? (
                      <div className="qty-controls">
                        <button onClick={() => updateQty(item._id, -1)}>−</button>
                        <span>{inCart.quantity}</span>
                        <button onClick={() => updateQty(item._id, 1)}>+</button>
                      </div>
                    ) : (
                      <button className="add-btn" onClick={() => addToCart(item)}>
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cart-section">
          <h3>Your Cart</h3>
          {cart.length === 0 ? (
            <p className="cart-empty">No items yet</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((c) => (
                  <div key={c.menuItem} className="cart-item">
                    <div>
                      <span className="cart-item-name">{c.name}</span>
                      <span className="cart-item-price">₹{c.price} × {c.quantity}</span>
                    </div>
                    <span className="cart-item-total">₹{c.price * c.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </>
          )}

          <form className="order-form" onSubmit={handleOrder}>
            <input
              type="text"
              placeholder="Your name"
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
            <input
              type="tel"
              placeholder="Phone number"
              required
              value={form.customerPhone}
              onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
            />
            <textarea
              placeholder="Special instructions (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
            />
            <button type="submit" className="btn btn-primary" disabled={submitting || cart.length === 0}>
              {submitting ? "Placing Order..." : `Place Order — ₹${total}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
