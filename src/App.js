import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import TakeQuiz from "./pages/TakeQuiz";

export default function App() {
  const [showNavbar, setShowNavbar] = useState(true);

  return (
    <Routes>
      <Route path="/" element={<Layout showNavbar={showNavbar} />}>
        <Route index element={<Home />} />
        <Route path="/create" element={<CreateQuiz />} />
        <Route
          path="/take"
          element={<TakeQuiz setShowNavbar={setShowNavbar} />}
        />
      </Route>
    </Routes>
  );
}
