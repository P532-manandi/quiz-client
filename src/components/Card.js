import React from "react";
import "./Card.css";

export function Card({ onClick, children }) {
  return (
    <div onClick={onClick} className="card">
      {children}
    </div>
  );
}
