import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./Dashboard.css";

export default function Dashboard() {
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify auth
    API.get("/auth/verify").catch(() => {
      localStorage.removeItem("token");
      navigate("/owner/login");
    });
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tab === "bookings") {
          const { data } = await API.get("/bookings");
          setBookings(data);
        } else {
          const { data } = await API.get("/orders");
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const cancelBooking = async (id) => {
    try {
      await API.patch(`/bookings/${id}/cancel`);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await API.patch(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status) => {
    const map = {
      confirmed: "#16a34a",
      cancelled: "#dc2626",
      pending: "#f59e0b",
      preparing: "#3b82f6",
      ready: "#16a34a",
      completed: "#6b7280",
    };
    return map[status] || "#6b7280";
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Owner Dashboard</h1>
        <p>Manage bookings and orders</p>
      </div>

      <div className="dash-tabs">
        <button
          className={`dash-tab ${tab === "bookings" ? "active" : ""}`}
          onClick={() => setTab("bookings")}
        >
          📅 Table Bookings
        </button>
        <button
          className={`dash-tab ${tab === "orders" ? "active" : ""}`}
          onClick={() => setTab("orders")}
        >
          🛒 Orders
        </button>
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : tab === "bookings" ? (
        <div className="dash-list">
          {bookings.length === 0 ? (
            <p className="empty-msg">No bookings yet</p>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="dash-card">
                <div className="dash-card-top">
                  <div>
                    <h4>{b.customerName}</h4>
                    <p className="dash-meta">📞 {b.customerPhone}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: statusColor(b.status) }}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="dash-card-details">
                  <span>🪑 Table {b.table?.number || "?"}</span>
                  <span>📆 {b.date}</span>
                  <span>🕐 {b.timeSlot}</span>
                  <span>👥 {b.guests} guests</span>
                </div>
                {b.status === "confirmed" && (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="dash-list">
          {orders.length === 0 ? (
            <p className="empty-msg">No orders yet</p>
          ) : (
            orders.map((o) => (
              <div key={o._id} className="dash-card">
                <div className="dash-card-top">
                  <div>
                    <h4>{o.customerName}</h4>
                    <p className="dash-meta">📞 {o.customerPhone}</p>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: statusColor(o.status) }}
                  >
                    {o.status}
                  </span>
                </div>
                <div className="order-items-list">
                  {o.items.map((item, idx) => (
                    <span key={idx} className="order-item-tag">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>
                <div className="dash-card-details">
                  <span>💰 ₹{o.totalAmount}</span>
                  {o.notes && <span>📝 {o.notes}</span>}
                  <span>
                    🕐 {new Date(o.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="status-actions">
                  {["pending", "preparing", "ready", "completed"].map((s) => (
                    <button
                      key={s}
                      className={`status-btn ${o.status === s ? "current" : ""}`}
                      onClick={() => updateOrderStatus(o._id, s)}
                      disabled={o.status === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
