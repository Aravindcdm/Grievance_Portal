import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const Homepage = () => {
  const [grievances, setGrievances] = useState([]);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedGrievances = JSON.parse(localStorage.getItem("grievances")) || [];
    setGrievances(storedGrievances);
  }, []);

  const deleteGrievance = (index) => {
    const updatedGrievances = grievances.filter((_, i) => i !== index);
    setGrievances(updatedGrievances);
    localStorage.setItem("grievances", JSON.stringify(updatedGrievances));
  };

  return (
    <div className="homepage-container">
      <button className="logout-btn" onClick={() => navigate("/login")}>Log Out</button>

      <div className="homepage-content">
        <h1 className="homepage-title">Welcome, Student!</h1>

        <button className="navigation-btn" onClick={() => navigate("/grievanceform")}>Submit New Grievance</button>
        <button className="navigation-btn" onClick={() => navigate("/dashboard")}>Grievance Dashboard</button>

        <h2 className="homepage-grievance-title">Your Submitted Grievances</h2>
        <div className="grievance-list">
          {grievances.length === 0 ? (
            <p className="no-grievances-message">You have not submitted any grievances yet.</p>
          ) : (
            grievances.map((grievance, index) => (
              <div className="grievance-item" key={index}>
                <div className="grievance-details">
                  <p><strong>Subject:</strong> {grievance.subject}</p>
                  <p><strong>Details:</strong> {grievance.details}</p>
                  <p><strong>Department:</strong> {grievance.department || "Anonymous"}</p>
                  <p><strong>Priority:</strong> {grievance.priority}</p>
                </div>
                <div className="grievance-actions">
                  <button className={`status-btn ${grievance.solved ? "solved" : "unsolved"}`}>
                    {grievance.solved ? "Solved" : "Unsolved"}
                  </button>
                  <div className="grievance-icons">
                    <button className="icon-button" onClick={() => deleteGrievance(index)}>🗑️</button>
                    <button
                      className="icon-button"
                      onClick={() => {
                        setMessage(grievance.reply || "No reply yet.");
                        setShowPopup(true);
                      }}
                    >
                      💬 {grievance.reply && <span className="notification">!</span>}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Icon (Fixed at Bottom Right) */}
      <div id="messageIcon" onClick={() => setShowPopup(!showPopup)}>
        <i className="fas fa-envelope"></i>
      </div>

      {/* Message Pop-up */}
      {showPopup && (
        <div className="message-popup">
          <button className="close-popup-btn" onClick={() => setShowPopup(false)}>↓</button>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Homepage;
