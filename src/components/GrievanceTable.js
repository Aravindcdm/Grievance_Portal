import React, { useState } from "react";
import GrievanceRow from "./GrievanceRow";
import "../styles/GrievanceTable.css";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const GrievanceTable = ({ grievances, updateGrievances }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const departments = ["All", ...new Set(grievances.map((g) => g.department))];

  // ✅ Toggle the solved status of a grievance
  const toggleSolved = async (id, currentStatus) => {
    console.log("🟡 Trying to update grievance with ID:", id);

    try {
      const response = await axios.put(`http://localhost:5000/api/grievances/${id}`, {
        solved: !currentStatus,
      });

      console.log("✅ Updated grievance:", response.data);

      const updatedGrievances = grievances.map((grievance) =>
        grievance._id === id ? { ...grievance, solved: !currentStatus } : grievance
      );

      updateGrievances(updatedGrievances);
    } catch (error) {
      console.error("❌ Error updating grievance:", error.response?.data || error.message);
    }
  };

  // ✅ Update the reply for a grievance
  const updateReply = async (id, newReply) => {
    try {
      await axios.put(`http://localhost:5000/api/grievances/${id}`, { reply: newReply });
      const updatedGrievances = grievances.map((grievance) =>
        grievance._id === id ? { ...grievance, reply: newReply } : grievance
      );
      updateGrievances(updatedGrievances);
    } catch (error) {
      console.error("❌ Error updating reply:", error);
    }
  };

  // ✅ Delete a grievance
  const deleteGrievance = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/grievances/${id}`);
      const updatedGrievances = grievances.filter((grievance) => grievance._id !== id);
      updateGrievances(updatedGrievances);
    } catch (error) {
      console.error("❌ Error deleting grievance:", error);
    }
  };

  return (
    <div id="grievance-table-container">
      <table id="grievance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Details</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Reply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map((grievance) => (
            <GrievanceRow
              key={grievance._id}
              grievance={grievance}
              updateReply={updateReply}
              toggleSolved={toggleSolved}
              deleteGrievance={deleteGrievance}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GrievanceTable;
