import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [department, setDepartment] = useState("");
  const [grievances, setGrievances] = useState([]);

  // Fetch grievances from localStorage
  useEffect(() => {
    const storedGrievances = JSON.parse(localStorage.getItem("grievances")) || [];
    // Ensure each grievance has a `votes` property
    const initializedGrievances = storedGrievances.map((grievance) => ({
      ...grievance,
      votes: grievance.votes || 0, // Default to 0 if not present
    }));
    setGrievances(initializedGrievances);
  }, []);

  // Handle department selection
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  // Handle voting
  const voteGrievance = (id) => {
    const updatedGrievances = grievances.map((grievance) =>
      grievance.id === id
        ? { ...grievance, votes: (grievance.votes || 0) + 1 } // Ensure votes exists
        : grievance
    );

    setGrievances(updatedGrievances);
    localStorage.setItem("grievances", JSON.stringify(updatedGrievances));
  };

  // Filter grievances by selected department
  const filteredGrievances = grievances.filter((g) => g.department === department);

  return (
    <div id="dashboard-container">
      <h1 id="dashboard-header">Grievance Dashboard</h1>
      <p id="dashboard-introduction">
        Welcome to the Grievance Dashboard! Here, you can view and address student grievances categorized by department and priority. Use the dropdown menu to filter grievances by department, <br />
        and vote on issues that matter the most to you.
      </p>

      <div id="dashboard-department-selector">
        <label id="dashboard-department-label" htmlFor="dashboard-department-select">
          Select Department:
        </label>
        <select
          id="dashboard-department-select"
          onChange={handleDepartmentChange}
          value={department}
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
      </div>

      <div id="dashboard-grievance-list">
        {["high", "medium", "low"].map((priority) => {
          const priorityGrievances = filteredGrievances
            .filter((g) => g.priority === priority)
            .sort((a, b) => b.votes - a.votes); // Sort by votes (highest first)

          return priorityGrievances.length > 0 ? (
            <div key={priority}>
              <h2 className="dashboard-priority-heading">
                {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
              </h2>
              {priorityGrievances.map((grievance) => (
                <div key={grievance.id} className="dashboard-grievance-card">
                  <p><strong>{grievance.subject}</strong></p>
                  <p>{grievance.details}</p>
                  <p>
                    <span className="dashboard-grievance-priority">
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>{" "}
                    - Votes: {grievance.votes}
                  </p>
                  <button className="dashboard-vote-button" onClick={() => voteGrievance(grievance.id)}>
                    Vote
                  </button>
                </div>
              ))}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default Dashboard;
