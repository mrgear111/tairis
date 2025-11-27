import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/auth" className="nav-link auth-btn">
              Login / Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
