import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "./Dashboard.css";

const Dashboard = () => {
  const [department, setDepartment] = useState("");
  const [grievances, setGrievances] = useState([]);
  const navigate = useNavigate();

  // Fetch grievances from the backend (MongoDB)
  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/grievances");
        // Ensure each grievance has a `votes` property
        const initializedGrievances = response.data.map((grievance) => ({
          ...grievance,
          votes: grievance.votes || 0, // Default to 0 if not present
        }));
        setGrievances(initializedGrievances);
      } catch (error) {
        console.error("Error fetching grievances:", error);
      }
    };

    fetchGrievances();
  }, []);

  // Handle department selection
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  // Handle voting
  const voteGrievance = async (id) => {
    try {
      // Send PUT request to update the votes
      const response = await axios.put(`http://localhost:5000/api/grievances/vote/${id}`);
      
      // Check if the response is valid and update the votes accordingly
      const updatedVotes = response.data.votes;

      setGrievances((prevGrievances) =>
        prevGrievances.map((grievance) =>
          grievance._id === id ? { ...grievance, votes: updatedVotes } : grievance
        )
      );
    } catch (error) {
      console.error("Error voting grievance:", error);
      if (error.response) {
        console.error("Error response from server:", error.response.data);
      }
    }
  };

  // Filter grievances by selected department
  const filteredGrievances = grievances.filter((g) => g.department === department);

  return (
    <div id="dashboard-container">
      <button className="back" onClick={() => navigate("/")}> &#8678; Back</button>
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
                <div key={grievance._id} className="dashboard-grievance-card">
                  <p><strong>{grievance.subject}</strong></p>
                  <p>{grievance.details}</p>
                  <p>
                    <span className="dashboard-grievance-priority">
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </span>{" "}- Votes: {grievance.votes}
                  </p>
                  <button className="dashboard-vote-button" onClick={() => voteGrievance(grievance._id)}>
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
