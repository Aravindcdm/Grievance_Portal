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
  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = [g.subject, g.details, g.department]
        .some(field => field.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDepartment = departmentFilter === "All" || g.department === departmentFilter;
    const matchesStatus = statusFilter === "All" ||
        (statusFilter === "Solved" && g.solved) ||
        (statusFilter === "Unsolved" && !g.solved);
    const matchesPriority = priorityFilter === "All" || g.priority === priorityFilter;

    return matchesSearch && matchesDepartment && matchesStatus && matchesPriority;
});

return (
    <div id="grievance-table-container">
        <div id="grievance-filters">
            <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search grievances..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <select onChange={(e) => setDepartmentFilter(e.target.value)} value={departmentFilter}>
                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
            </select>

            <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                <option value="All">Status</option>
                <option value="Solved">Solved</option>
                <option value="Unsolved">Unsolved</option>
            </select>

            <select onChange={(e) => setPriorityFilter(e.target.value)} value={priorityFilter}>
                <option value="All">Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
        </div>

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
                {filteredGrievances.length > 0 ? (
                    filteredGrievances.map(grievance => {
                        if (!grievance._id) {
                            console.error("⚠️ Grievance missing _id:", grievance);
                            return null; // skip rendering this broken entry
                        }

                        return (
                          <GrievanceRow 
                          key={grievance._id}
                          grievance={grievance}
                          updateReply={updateReply}
                          toggleSolved={toggleSolved}
                          deleteGrievance={deleteGrievance}
                        />
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="8">No grievances found</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);
};
export default GrievanceTable;
