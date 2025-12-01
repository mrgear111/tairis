import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload(); // Force refresh to update navbar state
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">Tairis</Link>
        </div>

        <button className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/nearby-doctors" className="nav-link">
              Nearby Doctors
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/get-started" className="nav-link">
              AI Help
            </Link>
          </li>
          <li className="nav-item">
            {token ? (
              <button onClick={handleLogout} className="nav-link auth-btn" style={{ border: "none", cursor: "pointer" }}>
                Logout ({user.user_metadata?.full_name?.split(' ')[0] || "User"})
              </button>
            ) : (
              <Link to="/auth" className="nav-link auth-btn">
                Login / Sign Up
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
