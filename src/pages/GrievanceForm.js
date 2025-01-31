import React, { useState } from "react";
import "./GrievanceForm.css"; // Importing the separate CSS file

const GrievanceForm = () => {
  const [anonymous, setAnonymous] = useState(false);
  const [grievance, setGrievance] = useState({
    fullName: "",
    department: "",
    subject: "",
    details: "",
    priority: "",
  });

  const handleChange = (e) => {
    setGrievance({ ...grievance, [e.target.name]: e.target.value });
  };

  const handleAnonymousChange = () => {
    setAnonymous(!anonymous);
    setGrievance((prevState) => ({
      ...prevState,
      fullName: anonymous ? "" : "Anonymous",
      department: anonymous ? "" : "N/A",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGrievance = {
      id: Date.now(),
      anonymous,
      fullName: anonymous ? "Anonymous" : grievance.fullName,
      department: anonymous ? "N/A" : grievance.department,
      subject: grievance.subject,
      details: grievance.details,
      priority: grievance.priority,
      solved: false,
    };

    const storedGrievances = JSON.parse(localStorage.getItem("grievances")) || [];
    storedGrievances.push(newGrievance);
    localStorage.setItem("grievances", JSON.stringify(storedGrievances));

    alert("Grievance submitted successfully!");
    window.location.href = "/"; // Redirect to dashboard after submission
  };

  return (
    <div className="grievance-form-container">
      <h1 className="grievance-form-title">Grievance Form</h1>
      <form className="grievance-form" onSubmit={handleSubmit}>
        <label className="grievance-checkbox-label">
          <input type="checkbox" checked={anonymous} onChange={handleAnonymousChange} />
          <span>Submit as Anonymous</span>
        </label>

        <label htmlFor="fullName" className="grievance-label">Full Name</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          className="grievance-input"
          placeholder="Enter your full name"
          value={grievance.fullName}
          onChange={handleChange}
          disabled={anonymous}
        />

        <label htmlFor="department" className="grievance-label">Department</label>
        <select
          id="department"
          name="department"
          className="grievance-select"
          value={grievance.department}
          onChange={handleChange}
          disabled={anonymous}
        >
          <option value="">--Select Department--</option>
          <option value="ECE">ECE</option>
          <option value="IT">IT</option>
          <option value="CSE">CSE</option>
          <option value="AIDS">AIDS</option>
          <option value="AIML">AIML</option>
          <option value="MECH">MECH</option>
          <option value="CIVIL">CIVIL</option>
          <option value="EEE">EEE</option>
          <option value="AGRI">AGRI</option>
        </select>

        <label htmlFor="subject" className="grievance-label">Subject of Grievance</label>
        <select
          id="subject"
          name="subject"
          className="grievance-select"
          value={grievance.subject}
          onChange={handleChange}
        >
          <option value="">--Select Subject--</option>
          <option value="Academics">Academics</option>
          <option value="Food">Food</option>
          <option value="Hostel">Hostel</option>
          <option value="Management">Management</option>
          <option value="Others">Others</option>
        </select>

        <label htmlFor="details" className="grievance-label">Details of the Grievance</label>
        <textarea
          id="details"
          name="details"
          className="grievance-textarea"
          rows="5"
          placeholder="Describe your grievance in detail"
          value={grievance.details}
          onChange={handleChange}
        ></textarea>

        <label htmlFor="priority" className="grievance-label">Priority</label>
        <select
          id="priority"
          name="priority"
          className="grievance-select"
          value={grievance.priority}
          onChange={handleChange}
        >
          <option value="">--Select Priority--</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <button type="submit" className="grievance-submit-button">Submit Grievance</button>
      </form>
    </div>
  );
};

export default GrievanceForm;
