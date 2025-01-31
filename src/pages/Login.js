import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userError, setUserError] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const navigate = useNavigate();

  // Flip the card between user and admin login
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle user login
  const handleUserLogin = (e) => {
    e.preventDefault();
    if (!userEmail.endsWith("@bitsathy.ac.in")) {
      setUserError("Please enter a valid bitsathy email id.");
    } else {
      setUserError("");
      navigate("/"); // Redirect to homepage after successful login
    }
  };

  // Handle admin login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername !== "admin" || adminPassword !== "bit") {
      setAdminError("Invalid admin credentials.");
    } else {
      setAdminError("");
      navigate("/adminpage"); // Redirect to admin page
; // Redirect to admin page after successful login
    }
  };

  return (
    <div id="login-page-container">
      <div id="login-card-container">
        <div id="login-card" className={isFlipped ? "flipped" : ""}>
          {/* User Login */}
          <div className="login-card-section" id="login-user-form">
            <h2>User Login</h2>
            <form onSubmit={handleUserLogin}>
              <input
                type="email"
                className="login-input"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <span className="login-error">{userError}</span>
              <button type="submit" className="login-button">Login</button>
            </form>
            <div id="login-flip-button" onClick={flipCard}>
              Login as Admin
            </div>
          </div>

          {/* Admin Login */}
          <div className="login-card-section" id="login-admin-form">
            <h2>Admin Login</h2>
            <form onSubmit={handleAdminLogin}>
              <input
                type="text"
                className="login-input"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Username"
                required
              />
              <input
                type="password"
                className="login-input"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <span className="login-error">{adminError}</span>
              <button type="submit" className="login-button">Login</button>
            </form>
            <div id="login-flip-button" onClick={flipCard}>
              Back to User Login
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
