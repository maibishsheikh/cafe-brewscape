import { useEffect, useState } from "react";
import API from "../api";
import "./BookTable.css";

export default function BookTable() {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", guests: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      setSelectedTable(null);
      setSelectedSlot(null);
      try {
        const { data } = await API.get(`/tables/availability?date=${date}`);
        setAvailability(data);
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, [date]);

  const handleBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await API.post("/bookings", {
        ...form,
        table: selectedTable._id,
        date,
        timeSlot: selectedSlot,
      });
      setSuccess(
        `Table ${selectedTable.number} booked for ${selectedSlot} on ${date}!`
      );
      setSelectedTable(null);
      setSelectedSlot(null);
      setForm({ customerName: "", customerPhone: "", guests: 1 });
      // Refresh availability
      const { data } = await API.get(`/tables/availability?date=${date}`);
      setAvailability(data);
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-page">
      <div className="page-header">
        <h1>Book a Table</h1>
        <p>Pick a date, choose your table & time slot</p>
      </div>

      <div className="date-picker-wrap">
        <label>Select Date</label>
        <input
          type="date"
          value={date}
          min={today}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {success && (
        <div className="alert alert-success">
          ✅ {success}
          <button onClick={() => setSuccess(null)} className="alert-close">×</button>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          ❌ {error}
          <button onClick={() => setError(null)} className="alert-close">×</button>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading availability...</p>
      ) : (
        <div className="tables-list">
          {availability.map((table) => (
            <div key={table._id} className="table-card">
              <div className="table-header">
                <h3>Table {table.number}</h3>
                <span className="table-capacity">{table.capacity} seats</span>
              </div>
              <div className="slots-grid">
                {table.slots.map((slot) => (
                  <button
                    key={slot.time}
                    className={`slot-btn ${!slot.available ? "booked" : ""} ${
                      selectedTable?._id === table._id && selectedSlot === slot.time
                        ? "selected"
                        : ""
                    }`}
                    disabled={!slot.available}
                    onClick={() => {
                      setSelectedTable(table);
                      setSelectedSlot(slot.time);
                      setSuccess(null);
                    }}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTable && selectedSlot && (
        <form className="booking-form" onSubmit={handleBook}>
          <h3>
            Confirm Booking — Table {selectedTable.number} at {selectedSlot}
          </h3>
          <div className="form-row">
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
            <input
              type="number"
              placeholder="Guests"
              min={1}
              max={selectedTable.capacity}
              required
              value={form.guests}
              onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      )}
    </div>
  );
}
