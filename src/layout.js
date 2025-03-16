import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function Layout({ showNavbar }) {
  return (
    <div>
      {showNavbar && <Navbar />} 
      <main>
        <Outlet /> 
      </main>
    </div>
  );
}
