import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar({ currentPage, onNavigate }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const go = (page) => () => {
    onNavigate(page);
    setOpen(false); // close menu after click
  };

  return (
    <nav className="navbar">

      {/* LEFT */}
      <div className="nav-left">
        <h3 className="logo" onClick={go("home")}>
          E-Learning
        </h3>
      </div>

      {/* HAMBURGER */}
      <div className="hamburger" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* CENTER */}
      <div className={`nav-center ${open ? "active" : ""}`}>
        <button className={currentPage === "home" ? "active" : ""} onClick={go("home")}>Home</button>
        <button className={currentPage === "dashboard" ? "active" : ""} onClick={go("dashboard")}>Dashboard</button>
        <button className={currentPage === "quiz" ? "active" : ""} onClick={go("quiz")}>Quiz</button>
        <button className={currentPage === "essay" ? "active" : ""} onClick={go("essay")}>Essay</button>
        <button className={currentPage === "speaking" ? "active" : ""} onClick={go("speaking")}>Speaking</button>
        <button className={currentPage === "listening" ? "active" : ""} onClick={go("listening")}>Listening</button>
        <button className={currentPage === "profile" ? "active" : ""} onClick={go("profile")}>Profile</button>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <span className="user-name">{user?.name || "User"}</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}