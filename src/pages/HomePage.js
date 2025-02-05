import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "./HomePage.css";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Homepage = () => {
  const [grievances, setGrievances] = useState([]);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/grievances");
        setGrievances(response.data);

        const newMessage = response.data.some(
          (grievance) => grievance.reply && grievance.reply !== "" && !grievance.read
        );
        setHasNewMessage(newMessage);
      } catch (error) {
        console.error("Error fetching grievances:", error);
      }
    };

    fetchGrievances();
    const interval = setInterval(fetchGrievances, 3000); // Fetch every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const deleteGrievance = async (index) => {
    try {
      const grievanceId = grievances[index]._id; // Get the grievance's unique ID
      await axios.delete(`http://localhost:5000/api/grievances/${grievanceId}`);
      
      // After deleting, remove it from the local state
      setGrievances(grievances.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting grievance:", error);
    }
  };

  const handleMessageClick = (index, grievance) => {
    const updatedGrievances = [...grievances];
    updatedGrievances[index] = { ...updatedGrievances[index], read: true };
    setGrievances(updatedGrievances);

    setMessage(grievance.reply || "No reply yet.");
    setShowPopup(true);
    setHasNewMessage(false);
  };

  return (
    <div>
      <div className="homepage-container">
        <button className="logout-btn" onClick={() => navigate("/login")}>Log Out</button>

        <div className="homepage-content">
          <div className="introduction">
            <h1>Welcome, Student! 🎓</h1>
            <p>Your voice matters! Submit your grievances, track their status, and get responses from the administration.</p>
          </div>

          <div className="button-container">
            <button className="navigation-btn" onClick={() => navigate("/grievanceform")}>Submit New Grievance</button>
            <button className="navigation-btn" onClick={() => navigate("/dashboard")}>Grievance Dashboard</button>
          </div>

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
                      <button className="icon-button" onClick={() => deleteGrievance(index)} style={{ backgroundColor: 'white' }}>
                        🗑️
                      </button>
                      <button className="icon-button message" onClick={() => handleMessageClick(index, grievance)}>
                        💬 {grievance.reply && !grievance.read && <span className="notification">!</span>}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div id="messageIcon" onClick={() => setShowPopup(!showPopup)}>
          <i className="fas fa-envelope"></i>
          {hasNewMessage && <span className="new-message-alert">New!</span>}
        </div>

        {showPopup && (
          <div className="message-popup">
            <button className="close-popup-btn" onClick={() => setShowPopup(false)}>↓</button>
            <p>{message}</p>
          </div>
        )}
      </div>

      {/* Footer placed outside homepage-container */}
      <footer className="homepage-footer">
        <div className="footer-main">
          <p>© {new Date().getFullYear()} Grievance Management System. All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="https://www.linkedin.com/in/aravindcdm" target="blank">Contact Us</a>
          </div>
        </div>

        {/* Additional Information */}
        <div className="footer-additional-info">
          <p>Developed by ARAVIND</p>
          <p>For any inquiries, reach out at: <a href="https://www.linkedin.com/in/aravindcdm" target="blank">Aravind Chidambaram R</a></p>
        </div>

        {/* Social Media Icons */}
        <div className="footer-social">
          <a href="#" className="social-icon"><FaFacebookF /></a>
          <a href="#" className="social-icon"><FaTwitter /></a>
          <a href="#" className="social-icon"><FaLinkedinIn /></a>
          <a href="#" className="social-icon"><FaInstagram /></a>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
