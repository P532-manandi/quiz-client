import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; 

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      <Link to="/create" className="nav-link">Create Quiz</Link>
      <Link to="/take" className="nav-link">Take Quiz</Link>
    </nav>
  );
}
