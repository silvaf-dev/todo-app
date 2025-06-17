// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home.jsx";
import ChartPage from "./pages/ChartPage";
import "./App.css";

export default function App() {
  return (
    <Router>
      <nav className="nav-links">
        <Link to="/">Todo List</Link>
        <Link to="/chart">Charts</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chart" element={<ChartPage />} />
      </Routes>
    </Router>
  );
}