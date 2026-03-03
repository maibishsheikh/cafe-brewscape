import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const isOwner = location.pathname.startsWith("/owner");

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">☕</span>
        <span className="brand-text">Brewscape</span>
      </Link>
      {!isOwner && (
        <div className="navbar-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
          <Link to="/menu" className={location.pathname === "/menu" ? "active" : ""}>
            Menu
          </Link>
          <Link to="/book" className={location.pathname === "/book" ? "active" : ""}>
            Book Table
          </Link>
          <Link to="/order" className={location.pathname === "/order" ? "active" : ""}>
            Order
          </Link>
          <Link to="/owner/login" className={`owner-login-link ${location.pathname === "/owner/login" ? "active" : ""}`}>
            🔐 Owner Login
          </Link>
        </div>
      )}
      {isOwner && (
        <div className="navbar-links">
          <Link to="/owner" className={location.pathname === "/owner" ? "active" : ""}>
            Dashboard
          </Link>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/owner/login";
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
